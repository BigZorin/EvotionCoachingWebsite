"""
YouTube transcript processor — extracts transcripts from YouTube videos.

Supports: youtube.com and youtu.be URLs
Pipeline: parse video ID → fetch transcript (free API) → TextBlocks with timestamps
"""

import logging
import re
from pathlib import Path
from urllib.parse import urlparse, parse_qs

from app.ingestion.processors.base import BaseProcessor, TextBlock

logger = logging.getLogger(__name__)


def extract_video_id(url: str) -> str | None:
    """Extract YouTube video ID from various URL formats."""
    parsed = urlparse(url)
    hostname = parsed.hostname or ""

    if "youtu.be" in hostname:
        # https://youtu.be/VIDEO_ID
        return parsed.path.lstrip("/").split("/")[0] or None

    if "youtube.com" in hostname:
        if parsed.path == "/watch":
            # https://www.youtube.com/watch?v=VIDEO_ID
            params = parse_qs(parsed.query)
            return params.get("v", [None])[0]
        if parsed.path.startswith("/embed/"):
            # https://www.youtube.com/embed/VIDEO_ID
            return parsed.path.split("/")[2] if len(parsed.path.split("/")) > 2 else None
        if parsed.path.startswith("/shorts/"):
            # https://www.youtube.com/shorts/VIDEO_ID
            return parsed.path.split("/")[2] if len(parsed.path.split("/")) > 2 else None

    return None


def format_timestamp(seconds: float) -> str:
    """Format seconds as HH:MM:SS or MM:SS."""
    total = int(seconds)
    h, remainder = divmod(total, 3600)
    m, s = divmod(remainder, 60)
    if h > 0:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"


class YouTubeProcessor(BaseProcessor):
    """Processor for YouTube video transcripts."""

    def supported_extensions(self) -> list[str]:
        return []

    def extract(self, file_path: Path) -> list[TextBlock]:
        raise NotImplementedError("YouTubeProcessor works with URLs, not files. Use process_url().")

    def process_url(self, url: str) -> list[TextBlock]:
        """Fetch transcript from a YouTube video URL."""
        video_id = extract_video_id(url)
        if not video_id:
            return [TextBlock(
                content=f"[Could not extract video ID from URL: {url}]",
                metadata={"file_type": "youtube", "error": "invalid_url"},
            )]

        logger.info(f"Fetching YouTube transcript for video: {video_id}")

        try:
            from youtube_transcript_api import YouTubeTranscriptApi

            # Try Dutch first, then English, then any available
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

            transcript = None
            language = "unknown"

            # Priority: manual Dutch → manual English → generated Dutch → generated English → any
            for lang_codes in [["nl"], ["en"], ["nl"], ["en"]]:
                try:
                    if lang_codes == ["nl"] and transcript is None:
                        transcript = transcript_list.find_manually_created_transcript(lang_codes)
                    elif lang_codes == ["en"] and transcript is None:
                        transcript = transcript_list.find_manually_created_transcript(lang_codes)
                except Exception:
                    pass

                try:
                    if transcript is None:
                        transcript = transcript_list.find_generated_transcript(lang_codes)
                except Exception:
                    pass

            # Fallback: any available transcript
            if transcript is None:
                for t in transcript_list:
                    transcript = t
                    break

            if transcript is None:
                return [TextBlock(
                    content=f"[No transcript available for video {video_id}]",
                    metadata={"file_type": "youtube", "video_id": video_id, "error": "no_transcript"},
                )]

            language = transcript.language
            entries = transcript.fetch()

            # Build timestamped text
            lines = []
            for entry in entries:
                ts = format_timestamp(entry.start)
                text = entry.text.strip()
                if text:
                    lines.append(f"[{ts}] {text}")

            full_text = "\n".join(lines)

            if not full_text:
                return [TextBlock(
                    content=f"[Empty transcript for video {video_id}]",
                    metadata={"file_type": "youtube", "video_id": video_id, "error": "empty_transcript"},
                )]

            # Get video title from metadata if possible
            video_url = f"https://www.youtube.com/watch?v={video_id}"

            blocks = [TextBlock(
                content=full_text,
                metadata={
                    "file_type": "youtube",
                    "video_id": video_id,
                    "source_url": video_url,
                    "language": language,
                    "segments": len(entries),
                },
            )]

            logger.info(f"Extracted transcript: {len(entries)} segments, {len(full_text)} chars, language={language}")
            return blocks

        except ImportError:
            return [TextBlock(
                content="[YouTube transcript extraction unavailable — youtube-transcript-api not installed]",
                metadata={"file_type": "youtube", "error": "missing_dependency"},
            )]
        except Exception as e:
            logger.error(f"YouTube transcript extraction failed for {video_id}: {e}")
            return [TextBlock(
                content=f"[Transcript extraction failed: {e}]",
                metadata={"file_type": "youtube", "video_id": video_id, "error": str(e)},
            )]
