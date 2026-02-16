import logging
from collections.abc import Generator

from app.config import settings

logger = logging.getLogger(__name__)

# ============================================================
# Groq (Primary - fast cloud inference)
# ============================================================

_groq_client = None


def _get_groq_client():
    global _groq_client
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
# Ollama (Fallback - local inference)
# ============================================================

_ollama_client = None


def _get_ollama_client():
    global _ollama_client
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
# Public API (auto-routes to Groq or Ollama)
# ============================================================

def generate(prompt: str, system: str | None = None, temperature: float = 0.7) -> str:
    """Generate a response. Uses Groq if available, falls back to Ollama."""
    if settings.llm_provider == "groq" and settings.groq_api_key:
        try:
            return _groq_generate(prompt, system, temperature)
        except Exception as e:
            logger.warning(f"Groq failed, falling back to Ollama: {e}")
            return _ollama_generate(prompt, system, temperature)
    return _ollama_generate(prompt, system, temperature)


def generate_stream(
    prompt: str, system: str | None = None, temperature: float = 0.7
) -> Generator[str, None, None]:
    """Stream a response. Uses Groq if available, falls back to Ollama."""
    if settings.llm_provider == "groq" and settings.groq_api_key:
        try:
            yield from _groq_generate_stream(prompt, system, temperature)
            return
        except Exception as e:
            logger.warning(f"Groq streaming failed, falling back to Ollama: {e}")
    yield from _ollama_generate_stream(prompt, system, temperature)


def get_active_provider() -> str:
    """Return which provider is currently active."""
    if settings.llm_provider == "groq" and settings.groq_api_key:
        return f"groq ({settings.groq_model})"
    return f"ollama ({settings.ollama_generation_model})"


def check_ollama_generation() -> bool:
    try:
        client = _get_ollama_client()
        client.chat(
            model=settings.ollama_generation_model,
            messages=[{"role": "user", "content": "hi"}],
            options={"num_predict": 1},
        )
        return True
    except Exception:
        return False


def check_groq() -> bool:
    if not settings.groq_api_key:
        return False
    try:
        client = _get_groq_client()
        client.chat.completions.create(
            model=settings.groq_model,
            messages=[{"role": "user", "content": "hi"}],
            max_tokens=1,
        )
        return True
    except Exception:
        return False


def list_available_models() -> list[str]:
    models = []
    if settings.groq_api_key:
        models.append(f"groq:{settings.groq_model}")
    try:
        client = _get_ollama_client()
        response = client.list()
        for model in response["models"]:
            models.append(f"ollama:{model['name']}")
    except Exception:
        pass
    return models
