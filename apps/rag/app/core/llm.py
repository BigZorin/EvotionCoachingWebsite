import json
import logging
import threading
from collections.abc import Generator

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

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
        stream_options={"include_usage": True},
    )
    usage_data = None
    for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
        # Final chunk contains usage stats when stream_options.include_usage=True
        if hasattr(chunk, "usage") and chunk.usage:
            usage_data = chunk.usage

    # Track usage after stream completes
    if usage_data:
        try:
            from app.core.usage_tracker import log_llm_usage
            log_llm_usage(
                model=settings.groq_model,
                input_tokens=getattr(usage_data, "prompt_tokens", 0) or 0,
                output_tokens=getattr(usage_data, "completion_tokens", 0) or 0,
                total_tokens=getattr(usage_data, "total_tokens", 0) or 0,
            )
        except Exception as e:
            logger.debug(f"Stream usage tracking failed: {e}")


# ============================================================
# OpenRouter (Secondary cloud fallback - OpenAI-compatible)
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
                    yield token
            except (json.JSONDecodeError, IndexError, KeyError):
                continue

    # Track usage after stream completes
    if usage_data:
        try:
            from app.core.usage_tracker import log_llm_usage
            log_llm_usage(
                model=settings.openrouter_model,
                input_tokens=usage_data.get("prompt_tokens", 0),
                output_tokens=usage_data.get("completion_tokens", 0),
                total_tokens=usage_data.get("total_tokens", 0),
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
    """Generate a response. Groq → OpenRouter fallback chain (no local Ollama — too slow on CPU)."""
    errors = []

    # 1. Try Groq (primary)
    if settings.llm_provider == "groq" and settings.groq_api_key:
        try:
            return _groq_generate(prompt, system, temperature)
        except Exception as e:
            errors.append(f"Groq: {e}")
            logger.warning(f"Groq failed: {e}")

    # 2. Try OpenRouter (secondary cloud)
    if settings.openrouter_api_key:
        try:
            return _openrouter_generate(prompt, system, temperature)
        except Exception as e:
            errors.append(f"OpenRouter: {e}")
            logger.warning(f"OpenRouter failed: {e}")

    # No Ollama fallback for generation — too slow on CPU VPS
    logger.error(f"All cloud LLM providers failed: {'; '.join(errors)}")
    raise RuntimeError(
        "Alle LLM-providers zijn tijdelijk niet beschikbaar (rate limit of storing). "
        "Probeer het over een minuut opnieuw."
    )


def generate_stream(
    prompt: str, system: str | None = None, temperature: float = 0.7,
    provider_info: dict | None = None,
) -> Generator[str, None, None]:
    """Stream a response. Groq → OpenRouter fallback chain (no local Ollama — too slow on CPU).

    If *provider_info* dict is passed, it will be updated with the key
    ``"name"`` set to the provider that actually handled the request.
    """
    errors = []

    # 1. Try Groq (primary)
    if settings.llm_provider == "groq" and settings.groq_api_key:
        try:
            if provider_info is not None:
                provider_info["name"] = f"groq ({settings.groq_model})"
            yield from _groq_generate_stream(prompt, system, temperature)
            return
        except Exception as e:
            errors.append(f"Groq: {e}")
            logger.warning(f"Groq streaming failed: {e}")

    # 2. Try OpenRouter (secondary cloud)
    if settings.openrouter_api_key:
        try:
            if provider_info is not None:
                provider_info["name"] = f"openrouter ({settings.openrouter_model})"
            yield from _openrouter_generate_stream(prompt, system, temperature)
            return
        except Exception as e:
            errors.append(f"OpenRouter: {e}")
            logger.warning(f"OpenRouter streaming failed: {e}")

    # No Ollama fallback for generation — too slow on CPU VPS
    logger.error(f"All cloud LLM providers failed (stream): {'; '.join(errors)}")
    raise RuntimeError(
        "Alle LLM-providers zijn tijdelijk niet beschikbaar (rate limit of storing). "
        "Probeer het over een minuut opnieuw."
    )


def get_active_provider() -> str:
    """Return which provider is currently active."""
    if settings.llm_provider == "groq" and settings.groq_api_key:
        return f"groq ({settings.groq_model})"
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
