"""
Web page processor — fetches URL content and extracts clean text.

Supports: any HTTP/HTTPS URL
Pipeline: fetch HTML → extract text with BeautifulSoup → TextBlocks
"""

import ipaddress
import logging
import re
import socket
import ssl
from pathlib import Path
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup

from app.ingestion.processors.base import BaseProcessor, TextBlock

logger = logging.getLogger(__name__)

# Tags to remove entirely (not just their text)
REMOVE_TAGS = {"script", "style", "nav", "footer", "header", "aside", "form", "noscript", "iframe"}

# Request settings
TIMEOUT = 30
MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB max
USER_AGENT = "EvotionRAG/1.0 (knowledge-base crawler)"

# Hostnames that are always blocked (SSRF protection)
_BLOCKED_HOSTNAMES = {"localhost", "0.0.0.0", "metadata.google.internal"}


def _is_private_ip(hostname: str) -> bool:
    """Check if a hostname resolves to a private/reserved IP address."""
    # Check literal IP first
    try:
        ip = ipaddress.ip_address(hostname)
        return ip.is_private or ip.is_loopback or ip.is_reserved or ip.is_link_local
    except ValueError:
        pass  # Not a literal IP, try DNS resolution

    # Resolve hostname and check the resulting IP
    try:
        resolved = socket.getaddrinfo(hostname, None, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for _, _, _, _, sockaddr in resolved:
            ip = ipaddress.ip_address(sockaddr[0])
            if ip.is_private or ip.is_loopback or ip.is_reserved or ip.is_link_local:
                return True
    except (socket.gaierror, OSError):
        pass

    return False


def is_valid_url(url: str) -> bool:
    """Check if string is a valid HTTP(S) URL that doesn't target internal resources."""
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            return False

        hostname = parsed.hostname or ""

        # Block known dangerous hostnames
        if hostname.lower() in _BLOCKED_HOSTNAMES:
            return False

        # Block private/internal IPs (SSRF protection)
        if _is_private_ip(hostname):
            logger.warning(f"SSRF blocked: {hostname} resolves to private/internal IP")
            return False

        return True
    except Exception:
        return False


def is_youtube_url(url: str) -> bool:
    """Check if URL is a YouTube video."""
    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    return any(h in hostname for h in ("youtube.com", "youtu.be"))


def fetch_url(url: str) -> tuple[str, str]:
    """Fetch URL content. Returns (html_content, final_url).

    Validates the final URL after redirects to prevent SSRF bypass via
    open-redirect chains (e.g. public URL → 302 → internal IP).
    """
    ssl_context = ssl.create_default_context()
    with httpx.Client(
        follow_redirects=True,
        timeout=TIMEOUT,
        headers={"User-Agent": USER_AGENT},
        verify=ssl_context,
    ) as client:
        response = client.get(url)
        response.raise_for_status()

        # SSRF: re-validate the final URL after redirects
        final_url = str(response.url)
        if final_url != url and not is_valid_url(final_url):
            raise ValueError(f"Redirect target blocked by SSRF protection: {final_url}")

        content_length = len(response.content)
        if content_length > MAX_CONTENT_LENGTH:
            raise ValueError(f"Content too large: {content_length / 1024 / 1024:.1f}MB (max {MAX_CONTENT_LENGTH / 1024 / 1024}MB)")

        content_type = response.headers.get("content-type", "")
        if "text/html" not in content_type and "text/plain" not in content_type:
            raise ValueError(f"Unsupported content type: {content_type}")

        return response.text, final_url


def extract_text_from_html(html: str, url: str) -> tuple[str, str]:
    """Extract clean text from HTML. Returns (text, title)."""
    soup = BeautifulSoup(html, "html.parser")

    # Get title
    title = ""
    title_tag = soup.find("title")
    if title_tag:
        title = title_tag.get_text(strip=True)

    # Try to find main content area
    main_content = (
        soup.find("main")
        or soup.find("article")
        or soup.find(attrs={"role": "main"})
        or soup.find(id=re.compile(r"content|main|article", re.I))
        or soup.find(class_=re.compile(r"content|main|article|post-body", re.I))
    )

    target = main_content or soup.body or soup

    # Remove unwanted tags
    for tag in target.find_all(REMOVE_TAGS):
        tag.decompose()

    # Extract text with some structure preservation
    lines = []
    for element in target.find_all(["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "td", "th", "blockquote", "pre", "code"]):
        text = element.get_text(strip=True)
        if not text:
            continue

        tag_name = element.name
        if tag_name in ("h1", "h2", "h3", "h4", "h5", "h6"):
            level = int(tag_name[1])
            prefix = "#" * level
            lines.append(f"\n{prefix} {text}\n")
        elif tag_name == "li":
            lines.append(f"- {text}")
        elif tag_name == "blockquote":
            lines.append(f"> {text}")
        elif tag_name in ("pre", "code"):
            lines.append(f"```\n{text}\n```")
        else:
            lines.append(text)

    full_text = "\n".join(lines)

    # Collapse excessive whitespace
    full_text = re.sub(r"\n{3,}", "\n\n", full_text).strip()

    return full_text, title


class WebProcessor(BaseProcessor):
    """Processor for web URLs — not file-based, used via process_url()."""

    def supported_extensions(self) -> list[str]:
        # Not file-based, but needed for interface compliance
        return []

    def extract(self, file_path: Path) -> list[TextBlock]:
        # Not used directly — use process_url() instead
        raise NotImplementedError("WebProcessor works with URLs, not files. Use process_url().")

    def process_url(self, url: str) -> list[TextBlock]:
        """Fetch and extract text from a web URL."""
        logger.info(f"Fetching URL: {url}")

        html, final_url = fetch_url(url)
        text, title = extract_text_from_html(html, final_url)

        if not text or len(text.strip()) < 50:
            return [TextBlock(
                content="[No meaningful text content found on this page]",
                metadata={"file_type": "web", "source_url": final_url, "error": "no_content"},
            )]

        parsed = urlparse(final_url)
        domain = parsed.hostname or "unknown"

        blocks = [TextBlock(
            content=text,
            metadata={
                "file_type": "web",
                "source_url": final_url,
                "domain": domain,
                "title": title or domain,
            },
        )]

        logger.info(f"Extracted {len(text)} chars from {final_url} (title: {title})")
        return blocks
