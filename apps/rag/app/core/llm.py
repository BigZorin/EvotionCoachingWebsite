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
        max_tokens=4096,
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
        max_tokens=4096,
        stream=True,
        stream_options={"include_usage": True},
    )
    usage_data = None
    for chunk in stream:
        if chunk.usage:
            usage_data = chunk.usage
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content

    # Track usage after stream completes
    if usage_data:
        try:
            from app.core.usage_tracker import log_llm_usage
            log_llm_usage(
                model=settings.groq_model,
                input_tokens=usage_data.prompt_tokens or 0,
                output_tokens=usage_data.completion_tokens or 0,
                total_tokens=usage_data.total_tokens or 0,
            )
        except Exception as e:
            logger.debug(f"Usage tracking failed: {e}")


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
            "max_tokens": 4096,
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
            "max_tokens": 4096,
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
                delta = chunk.get("choices", [{}])[0].get("delta", {})
                token = delta.get("content")
                if token:
                    yield token
            except (json.JSONDecodeError, IndexError, KeyError):
                continue


# ============================================================
# Ollama (Local fallback - last resort)
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


def _ollama_generate(prompt: str, system: str | None = None, temperature: float = 0.7) -> str:
    client = _get_ollama_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    response = client.chat(
        model=settings.ollama_generation_model,
        messages=messages,
        options={"temperature": temperature},
    )
    return response["message"]["content"]


def _ollama_generate_stream(
    prompt: str, system: str | None = None, temperature: float = 0.7
) -> Generator[str, None, None]:
    client = _get_ollama_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    stream = client.chat(
        model=settings.ollama_generation_model,
        messages=messages,
        options={"temperature": temperature},
        stream=True,
    )
    for chunk in stream:
        token = chunk["message"]["content"]
        if token:
            yield token


# ============================================================
# Public API — Fallback chain: Groq → OpenRouter → Ollama
# ============================================================

def generate(prompt: str, system: str | None = None, temperature: float = 0.7) -> str:
    """Generate a response. Groq → OpenRouter → Ollama fallback chain."""
    # 1. Try Groq (primary)
    if settings.llm_provider == "groq" and settings.groq_api_key:
        try:
            return _groq_generate(prompt, system, temperature)
        except Exception as e:
            logger.warning(f"Groq failed: {e}")

    # 2. Try OpenRouter (secondary cloud)
    if settings.openrouter_api_key:
        try:
            return _openrouter_generate(prompt, system, temperature)
        except Exception as e:
            logger.warning(f"OpenRouter failed: {e}")

    # 3. Try Ollama (local last resort)
    try:
        return _ollama_generate(prompt, system, temperature)
    except Exception as e:
        logger.error(
            f"All LLM providers failed. "
            f"Groq: configured={bool(settings.groq_api_key)}, "
            f"OpenRouter: configured={bool(settings.openrouter_api_key)}, "
            f"Ollama: {e}"
        )
        raise RuntimeError(
            "All LLM providers are unavailable. Groq, OpenRouter and Ollama all failed. "
            "Please check that at least one provider is running."
        ) from e


def generate_stream(
    prompt: str, system: str | None = None, temperature: float = 0.7
) -> Generator[str, None, None]:
    """Stream a response. Groq → OpenRouter → Ollama fallback chain."""
    # 1. Try Groq (primary)
    if settings.llm_provider == "groq" and settings.groq_api_key:
        try:
            yield from _groq_generate_stream(prompt, system, temperature)
            return
        except Exception as e:
            logger.warning(f"Groq streaming failed: {e}")

    # 2. Try OpenRouter (secondary cloud)
    if settings.openrouter_api_key:
        try:
            yield from _openrouter_generate_stream(prompt, system, temperature)
            return
        except Exception as e:
            logger.warning(f"OpenRouter streaming failed: {e}")

    # 3. Try Ollama (local last resort)
    try:
        yield from _ollama_generate_stream(prompt, system, temperature)
    except Exception as e:
        logger.error(
            f"All LLM providers failed (stream). "
            f"Groq: configured={bool(settings.groq_api_key)}, "
            f"OpenRouter: configured={bool(settings.openrouter_api_key)}, "
            f"Ollama: {e}"
        )
        raise RuntimeError(
            "All LLM providers are unavailable. Groq, OpenRouter and Ollama all failed. "
            "Please check that at least one provider is running."
        ) from e


def get_active_provider() -> str:
    """Return which provider is currently active."""
    if settings.llm_provider == "groq" and settings.groq_api_key:
        return f"groq ({settings.groq_model})"
    if settings.openrouter_api_key:
        return f"openrouter ({settings.openrouter_model})"
    return f"ollama ({settings.ollama_generation_model})"


# ============================================================
# Health checks (no inference cost)
# ============================================================

def check_ollama_generation() -> bool:
    """Check if Ollama generation model is available without running inference."""
    try:
        client = _get_ollama_client()
        response = client.list()
        available = [m.model for m in response.models]
        return settings.ollama_generation_model in available
    except Exception:
        return False


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
