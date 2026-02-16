"""
Audio/Video processor — transcribes media files using Groq Whisper API.

Supports: .mp4, .mp3, .wav, .m4a, .webm, .ogg, .flac
Pipeline: extract audio (ffmpeg) → split into chunks if >25MB → transcribe (Groq Whisper) → TextBlocks
"""

import logging
import subprocess
import tempfile
from pathlib import Path

from app.config import settings
from app.ingestion.processors.base import BaseProcessor, TextBlock

logger = logging.getLogger(__name__)

# Groq Whisper has a 25MB file size limit
MAX_AUDIO_SIZE_MB = 25
WHISPER_MODEL = "whisper-large-v3-turbo"


class AudioProcessor(BaseProcessor):
    def supported_extensions(self) -> list[str]:
        return [".mp4", ".mp3", ".wav", ".m4a", ".webm", ".ogg", ".flac"]

    def extract(self, file_path: Path) -> list[TextBlock]:
        if not settings.groq_api_key:
            return [TextBlock(
                content="[Transcription unavailable — no Groq API key configured]",
                metadata={"file_type": "audio", "error": "no_api_key"},
            )]

        audio_path = self._extract_audio(file_path)

        try:
            audio_size_mb = audio_path.stat().st_size / (1024 * 1024)

            if audio_size_mb > MAX_AUDIO_SIZE_MB:
                segments = self._split_audio(audio_path)
            else:
                segments = [audio_path]

            blocks = []
            full_transcript = []

            for i, segment_path in enumerate(segments):
                try:
                    text = self._transcribe(segment_path)
                    if text.strip():
                        full_transcript.append(text.strip())
                        blocks.append(TextBlock(
                            content=text.strip(),
                            metadata={
                                "file_type": "audio",
                                "source_format": file_path.suffix.lower(),
                                "segment": i + 1,
                                "total_segments": len(segments),
                            },
                        ))
                except Exception as e:
                    logger.error(f"Transcription failed for segment {i + 1}: {e}")
                    blocks.append(TextBlock(
                        content=f"[Transcription failed for segment {i + 1}: {e}]",
                        metadata={"file_type": "audio", "error": str(e)},
                    ))
                finally:
                    if segment_path != audio_path:
                        segment_path.unlink(missing_ok=True)

            if not blocks:
                blocks.append(TextBlock(
                    content="[No speech detected in audio/video file]",
                    metadata={"file_type": "audio"},
                ))

            return blocks

        finally:
            if audio_path != file_path:
                audio_path.unlink(missing_ok=True)

    def _extract_audio(self, file_path: Path) -> Path:
        """Extract audio track as MP3 using ffmpeg. Returns original path if already audio."""
        if file_path.suffix.lower() in (".mp3", ".wav", ".flac", ".ogg"):
            return file_path

        tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
        tmp.close()
        output = Path(tmp.name)
        cmd = [
            "ffmpeg", "-i", str(file_path),
            "-vn",                    # no video
            "-acodec", "libmp3lame",  # MP3 codec
            "-ab", "64k",             # 64kbps (keeps files small)
            "-ar", "16000",           # 16kHz sample rate (optimal for Whisper)
            "-ac", "1",               # mono
            "-y",                     # overwrite
            str(output),
        ]

        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=300
            )
            if result.returncode != 0:
                raise RuntimeError(f"ffmpeg failed: {result.stderr[:500]}")
            logger.info(f"Extracted audio: {output.stat().st_size / 1024:.0f}KB")
            return output
        except FileNotFoundError:
            raise RuntimeError("ffmpeg not installed — required for audio/video processing")

    def _split_audio(self, audio_path: Path, segment_minutes: int = 10) -> list[Path]:
        """Split audio into segments for files exceeding Groq's 25MB limit."""
        segments = []
        duration = self._get_duration(audio_path)
        segment_seconds = segment_minutes * 60
        num_segments = max(1, int(duration / segment_seconds) + 1)

        logger.info(f"Splitting {duration:.0f}s audio into {num_segments} segments of {segment_minutes}min")

        for i in range(num_segments):
            start = i * segment_seconds
            tmp = tempfile.NamedTemporaryFile(suffix=f"_seg{i}.mp3", delete=False)
            tmp.close()
            output = Path(tmp.name)
            cmd = [
                "ffmpeg", "-i", str(audio_path),
                "-ss", str(start),
                "-t", str(segment_seconds),
                "-acodec", "libmp3lame",
                "-ab", "64k",
                "-ar", "16000",
                "-ac", "1",
                "-y",
                str(output),
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            if result.returncode == 0 and output.exists() and output.stat().st_size > 1000:
                segments.append(output)
            else:
                output.unlink(missing_ok=True)

        return segments if segments else [audio_path]

    def _get_duration(self, audio_path: Path) -> float:
        """Get audio duration in seconds using ffprobe."""
        cmd = [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(audio_path),
        ]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return float(result.stdout.strip())
        except Exception:
            return 600.0  # default 10 minutes if detection fails

    def _transcribe(self, audio_path: Path) -> str:
        """Transcribe audio file using Groq Whisper API."""
        from groq import Groq

        client = Groq(api_key=settings.groq_api_key)

        # Get audio duration for usage tracking
        audio_duration = self._get_duration(audio_path)

        with open(audio_path, "rb") as f:
            transcription = client.audio.transcriptions.create(
                file=(audio_path.name, f),
                model=WHISPER_MODEL,
                response_format="verbose_json",
            )

        # Track Whisper usage
        try:
            from app.core.usage_tracker import log_whisper_usage
            log_whisper_usage(WHISPER_MODEL, audio_duration)
        except Exception as e:
            logger.debug(f"Usage tracking failed: {e}")

        # verbose_json returns segments with timestamps
        if hasattr(transcription, "segments") and transcription.segments:
            parts = []
            for seg in transcription.segments:
                start = self._format_time(seg.get("start", seg.start if hasattr(seg, "start") else 0))
                text = seg.get("text", seg.text if hasattr(seg, "text") else "").strip()
                if text:
                    parts.append(f"[{start}] {text}")
            return "\n".join(parts)

        # Fallback to plain text
        return transcription.text if hasattr(transcription, "text") else str(transcription)

    @staticmethod
    def _format_time(seconds: float) -> str:
        """Format seconds as MM:SS."""
        m, s = divmod(int(seconds), 60)
        h, m = divmod(m, 60)
        if h > 0:
            return f"{h}:{m:02d}:{s:02d}"
        return f"{m}:{s:02d}"
