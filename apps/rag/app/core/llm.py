import json
import logging
import threading
import time
from collections.abc import Generator

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# --- Circuit breaker: skip providers that recently failed ---
_circuit_breaker: dict[str, dict] = {}  # provider -> {"failures": int, "last_failure": float}
_CB_THRESHOLD = 3       # consecutive failures before tripping
_CB_COOLDOWN = 60.0     # seconds to skip a tripped provider


def _cb_is_open(provider: str) -> bool:
    """Return True if provider should be skipped (circuit open)."""
    state = _circuit_breaker.get(provider)
    if not state or state["failures"] < _CB_THRESHOLD:
        return False
    # Check if cooldown has passed
    if time.monotonic() - state["last_failure"] > _CB_COOLDOWN:
        state["failures"] = 0  # half-open: allow retry
        return False
    return True


def _cb_record_failure(provider: str):
    state = _circuit_breaker.setdefault(provider, {"failures": 0, "last_failure": 0})
    state["failures"] += 1
    state["last_failure"] = time.monotonic()


def _cb_record_success(provider: str):
    _circuit_breaker.pop(provider, None)

# ============================================================
# Groq (Primary - fast cloud inference)
# ============================================================

_groq_client = None
_groq_lock = threading.Lock()


def _get_groq_client():
    global _groq_client
    if _groq_client is None:
        with _groq_lock:
            if _groq_client is None:
                from groq import Groq
                _groq_client = Groq(api_key=settings.groq_api_key, timeout=60.0)
    return _groq_client


def _groq_generate(prompt: str, system: str | None = None, temperature: float = 0.7) -> str:
    client = _get_groq_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=messages,
        temperature=temperature,
        max_tokens=2048,
    )

    # Track usage
    try:
        from app.core.usage_tracker import log_llm_usage
        usage = response.usage
        if usage:
            log_llm_usage(
                model=settings.groq_model,
                input_tokens=usage.prompt_tokens or 0,
                output_tokens=usage.completion_tokens or 0,
                total_tokens=usage.total_tokens or 0,
                provider="groq",
            )
    except Exception as e:
        logger.debug(f"Usage tracking failed: {e}")

    return response.choices[0].message.content


def _groq_generate_stream(
    prompt: str, system: str | None = None, temperature: float = 0.7
) -> Generator[str, None, None]:
    client = _get_groq_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    stream = client.chat.completions.create(
        model=settings.groq_model,
        messages=messages,
        temperature=temperature,
        max_tokens=2048,
        stream=True,
    )
    output_parts = []
    for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            token = chunk.choices[0].delta.content
            output_parts.append(token)
            yield token

    # Estimate and track usage after stream completes (~4 chars per token)
    try:
        from app.core.usage_tracker import log_llm_usage
        input_chars = len(prompt) + (len(system) if system else 0)
        output_chars = sum(len(t) for t in output_parts)
        log_llm_usage(
            model=settings.groq_model,
            input_tokens=input_chars // 4,
            output_tokens=output_chars // 4,
            total_tokens=(input_chars + output_chars) // 4,
            provider="groq",
        )
    except Exception as e:
        logger.debug(f"Stream usage tracking failed: {e}")


# ============================================================
# Cerebras (Secondary cloud fallback - fast & free, OpenAI-compatible)
# ============================================================

_cerebras_client = None
_cerebras_lock = threading.Lock()


def _get_cerebras_client() -> httpx.Client:
    global _cerebras_client
    if _cerebras_client is None:
        with _cerebras_lock:
            if _cerebras_client is None:
                _cerebras_client = httpx.Client(
                    base_url="https://api.cerebras.ai/v1",
                    headers={
                        "Authorization": f"Bearer {settings.cerebras_api_key}",
                        "Content-Type": "application/json",
                    },
                    timeout=float(settings.cerebras_timeout),
                )
    return _cerebras_client


def _cerebras_generate(prompt: str, system: str | None = None, temperature: float = 0.7) -> str:
    client = _get_cerebras_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    response = client.post(
        "/chat/completions",
        json={
            "model": settings.cerebras_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 2048,
        },
    )
    response.raise_for_status()
    data = response.json()

    # Track usage
    usage = data.get("usage")
    if usage:
        try:
            from app.core.usage_tracker import log_llm_usage
            log_llm_usage(
                model=settings.cerebras_model,
                input_tokens=usage.get("prompt_tokens", 0),
                output_tokens=usage.get("completion_tokens", 0),
                total_tokens=usage.get("total_tokens", 0),
                provider="cerebras",
            )
        except Exception as e:
            logger.debug(f"Usage tracking failed: {e}")

    return data["choices"][0]["message"]["content"]


def _cerebras_generate_stream(
    prompt: str, system: str | None = None, temperature: float = 0.7
) -> Generator[str, None, None]:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    usage_data = None
    output_parts = []
    with httpx.stream(
        "POST",
        "https://api.cerebras.ai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.cerebras_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": settings.cerebras_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 2048,
            "stream": True,
        },
        timeout=float(settings.cerebras_timeout),
    ) as response:
        response.raise_for_status()
        for line in response.iter_lines():
            if not line or not line.startswith("data: "):
                continue
            payload = line[6:]  # strip "data: "
            if payload.strip() == "[DONE]":
                break
            try:
                chunk = json.loads(payload)
                if "usage" in chunk:
                    usage_data = chunk["usage"]
                delta = chunk.get("choices", [{}])[0].get("delta", {})
                token = delta.get("content")
                if token:
                    output_parts.append(token)
                    yield token
            except (json.JSONDecodeError, IndexError, KeyError):
                continue

    # Track usage after stream completes
    try:
        from app.core.usage_tracker import log_llm_usage
        if usage_data:
            log_llm_usage(
                model=settings.cerebras_model,
                input_tokens=usage_data.get("prompt_tokens", 0),
                output_tokens=usage_data.get("completion_tokens", 0),
                total_tokens=usage_data.get("total_tokens", 0),
                provider="cerebras",
            )
        elif output_parts:
            input_chars = len(prompt) + (len(system) if system else 0)
            output_chars = sum(len(t) for t in output_parts)
            log_llm_usage(
                model=settings.cerebras_model,
                input_tokens=input_chars // 4,
                output_tokens=output_chars // 4,
                total_tokens=(input_chars + output_chars) // 4,
                provider="cerebras",
            )
    except Exception as e:
        logger.debug(f"Stream usage tracking failed: {e}")


# ============================================================
# OpenRouter (Tertiary cloud fallback - OpenAI-compatible)
# ============================================================

_openrouter_client = None
_openrouter_lock = threading.Lock()


def _get_openrouter_client() -> httpx.Client:
    global _openrouter_client
    if _openrouter_client is None:
        with _openrouter_lock:
            if _openrouter_client is None:
                _openrouter_client = httpx.Client(
                    base_url="https://openrouter.ai/api/v1",
                    headers={
                        "Authorization": f"Bearer {settings.openrouter_api_key}",
                        "Content-Type": "application/json",
                    },
                    timeout=float(settings.openrouter_timeout),
                )
    return _openrouter_client


def _openrouter_generate(prompt: str, system: str | None = None, temperature: float = 0.7) -> str:
    client = _get_openrouter_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    response = client.post(
        "/chat/completions",
        json={
            "model": settings.openrouter_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 2048,
        },
    )
    response.raise_for_status()
    data = response.json()

    # Track usage
    usage = data.get("usage")
    if usage:
        try:
            from app.core.usage_tracker import log_llm_usage
            log_llm_usage(
                model=settings.openrouter_model,
                input_tokens=usage.get("prompt_tokens", 0),
                output_tokens=usage.get("completion_tokens", 0),
                total_tokens=usage.get("total_tokens", 0),
                provider="openrouter",
            )
        except Exception as e:
            logger.debug(f"Usage tracking failed: {e}")

    return data["choices"][0]["message"]["content"]


def _openrouter_generate_stream(
    prompt: str, system: str | None = None, temperature: float = 0.7
) -> Generator[str, None, None]:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    usage_data = None
    output_parts = []
    with httpx.stream(
        "POST",
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.openrouter_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": settings.openrouter_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 2048,
            "stream": True,
        },
        timeout=float(settings.openrouter_timeout),
    ) as response:
        response.raise_for_status()
        for line in response.iter_lines():
            if not line or not line.startswith("data: "):
                continue
            payload = line[6:]  # strip "data: "
            if payload.strip() == "[DONE]":
                break
            try:
                chunk = json.loads(payload)
                # Capture usage from final chunk if present
                if "usage" in chunk:
                    usage_data = chunk["usage"]
                delta = chunk.get("choices", [{}])[0].get("delta", {})
                token = delta.get("content")
                if token:
                    output_parts.append(token)
                    yield token
            except (json.JSONDecodeError, IndexError, KeyError):
                continue

    # Track usage after stream completes (use API data if available, otherwise estimate)
    try:
        from app.core.usage_tracker import log_llm_usage
        if usage_data:
            log_llm_usage(
                model=settings.openrouter_model,
                input_tokens=usage_data.get("prompt_tokens", 0),
                output_tokens=usage_data.get("completion_tokens", 0),
                total_tokens=usage_data.get("total_tokens", 0),
                provider="openrouter",
            )
        elif output_parts:
            input_chars = len(prompt) + (len(system) if system else 0)
            output_chars = sum(len(t) for t in output_parts)
            log_llm_usage(
                model=settings.openrouter_model,
                input_tokens=input_chars // 4,
                output_tokens=output_chars // 4,
                total_tokens=(input_chars + output_chars) // 4,
                provider="openrouter",
            )
    except Exception as e:
        logger.debug(f"Stream usage tracking failed: {e}")


# ============================================================
# Ollama client (embeddings + model listing only — NOT used for generation)
# ============================================================

_ollama_client = None
_ollama_lock = threading.Lock()


def _get_ollama_client():
    global _ollama_client
    if _ollama_client is None:
        with _ollama_lock:
            if _ollama_client is None:
                from ollama import Client as OllamaClient
                _ollama_client = OllamaClient(host=settings.ollama_base_url, timeout=120.0)
    return _ollama_client


# ============================================================
# Public API — Fallback chain: Groq → OpenRouter
# ============================================================

def generate(prompt: str, system: str | None = None, temperature: float = 0.7) -> str:
    """Generate a response. Groq → Cerebras → OpenRouter fallback chain with circuit breaker."""
    errors = []

    # 1. Try Groq (primary)
    if settings.llm_provider == "groq" and settings.groq_api_key and not _cb_is_open("groq"):
        try:
            result = _groq_generate(prompt, system, temperature)
            _cb_record_success("groq")
            return result
        except Exception as e:
            _cb_record_failure("groq")
            errors.append(f"Groq: {e}")
            logger.warning(f"Groq failed: {e}")
    elif _cb_is_open("groq"):
        errors.append("Groq: circuit breaker open (skipped)")

    # 2. Try Cerebras (secondary — fast & free)
    if settings.cerebras_api_key and not _cb_is_open("cerebras"):
        try:
            result = _cerebras_generate(prompt, system, temperature)
            _cb_record_success("cerebras")
            return result
        except Exception as e:
            _cb_record_failure("cerebras")
            errors.append(f"Cerebras: {e}")
            logger.warning(f"Cerebras failed: {e}")
    elif _cb_is_open("cerebras"):
        errors.append("Cerebras: circuit breaker open (skipped)")

    # 3. Try OpenRouter (tertiary cloud)
    if settings.openrouter_api_key and not _cb_is_open("openrouter"):
        try:
            result = _openrouter_generate(prompt, system, temperature)
            _cb_record_success("openrouter")
            return result
        except Exception as e:
            _cb_record_failure("openrouter")
            errors.append(f"OpenRouter: {e}")
            logger.warning(f"OpenRouter failed: {e}")
    elif _cb_is_open("openrouter"):
        errors.append("OpenRouter: circuit breaker open (skipped)")

    logger.error(f"All cloud LLM providers failed: {'; '.join(errors)}")
    raise RuntimeError(
        "Alle LLM-providers zijn tijdelijk niet beschikbaar (rate limit of storing). "
        "Probeer het over een minuut opnieuw."
    )


def generate_stream(
    prompt: str, system: str | None = None, temperature: float = 0.7,
    provider_info: dict | None = None,
) -> Generator[str, None, None]:
    """Stream a response. Groq → Cerebras → OpenRouter fallback chain with circuit breaker.

    If *provider_info* dict is passed, it will be updated with the key
    ``"name"`` set to the provider that actually handled the request.
    """
    errors = []

    # 1. Try Groq (primary)
    if settings.llm_provider == "groq" and settings.groq_api_key and not _cb_is_open("groq"):
        try:
            if provider_info is not None:
                provider_info["name"] = f"groq ({settings.groq_model})"
            yield from _groq_generate_stream(prompt, system, temperature)
            _cb_record_success("groq")
            return
        except Exception as e:
            _cb_record_failure("groq")
            errors.append(f"Groq: {e}")
            logger.warning(f"Groq streaming failed: {e}")

    # 2. Try Cerebras (secondary — fast & free)
    if settings.cerebras_api_key and not _cb_is_open("cerebras"):
        try:
            if provider_info is not None:
                provider_info["name"] = f"cerebras ({settings.cerebras_model})"
            yield from _cerebras_generate_stream(prompt, system, temperature)
            _cb_record_success("cerebras")
            return
        except Exception as e:
            _cb_record_failure("cerebras")
            errors.append(f"Cerebras: {e}")
            logger.warning(f"Cerebras streaming failed: {e}")

    # 3. Try OpenRouter (tertiary cloud)
    if settings.openrouter_api_key and not _cb_is_open("openrouter"):
        try:
            if provider_info is not None:
                provider_info["name"] = f"openrouter ({settings.openrouter_model})"
            yield from _openrouter_generate_stream(prompt, system, temperature)
            _cb_record_success("openrouter")
            return
        except Exception as e:
            _cb_record_failure("openrouter")
            errors.append(f"OpenRouter: {e}")
            logger.warning(f"OpenRouter streaming failed: {e}")

    logger.error(f"All cloud LLM providers failed (stream): {'; '.join(errors)}")
    raise RuntimeError(
        "Alle LLM-providers zijn tijdelijk niet beschikbaar (rate limit of storing). "
        "Probeer het over een minuut opnieuw."
    )


def get_active_provider() -> str:
    """Return which provider is currently active (primary)."""
    if settings.llm_provider == "groq" and settings.groq_api_key:
        return f"groq ({settings.groq_model})"
    if settings.cerebras_api_key:
        return f"cerebras ({settings.cerebras_model})"
    if settings.openrouter_api_key:
        return f"openrouter ({settings.openrouter_model})"
    return "none (no cloud LLM configured)"


# ============================================================
# Health checks (no inference cost)
# ============================================================

def check_groq() -> bool:
    """Check Groq availability without consuming a chat request."""
    if not settings.groq_api_key:
        return False
    try:
        client = _get_groq_client()
        client.models.list()
        return True
    except Exception:
        return False


def check_cerebras() -> bool:
    """Check Cerebras availability without consuming a chat request."""
    if not settings.cerebras_api_key:
        return False
    try:
        r = httpx.get(
            "https://api.cerebras.ai/v1/models",
            headers={"Authorization": f"Bearer {settings.cerebras_api_key}"},
            timeout=10.0,
        )
        return r.status_code == 200
    except Exception:
        return False


def check_openrouter() -> bool:
    """Check OpenRouter availability without consuming a chat request."""
    if not settings.openrouter_api_key:
        return False
    try:
        r = httpx.get(
            "https://openrouter.ai/api/v1/models",
            headers={"Authorization": f"Bearer {settings.openrouter_api_key}"},
            timeout=10.0,
        )
        return r.status_code == 200
    except Exception:
        return False


def list_available_models() -> list[str]:
    models = []
    if settings.groq_api_key:
        models.append(f"groq:{settings.groq_model}")
    if settings.cerebras_api_key:
        models.append(f"cerebras:{settings.cerebras_model}")
    if settings.openrouter_api_key:
        models.append(f"openrouter:{settings.openrouter_model}")
    try:
        client = _get_ollama_client()
        response = client.list()
        for m in response.models:
            models.append(f"ollama:{m.model}")
    except Exception:
        pass
    return models
