import os
import requests
from pathlib import Path
from typing import Literal, List, Dict, Any, Optional
from datetime import datetime
import json

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from elevenlabs.client import ElevenLabs

BASE_DIR = Path(__file__).resolve().parent
# Load secrets from the preferred backend/.env file first, then fall back to the
# legacy backend/venv/.env if it exists.
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / "venv/.env")
# Support legacy key name ELEVENLABS_API_KEY by mapping it to ELEVEN_API_KEY.
if not os.getenv("ELEVEN_API_KEY") and os.getenv("ELEVENLABS_API_KEY"):
    os.environ["ELEVEN_API_KEY"] = os.environ["ELEVENLABS_API_KEY"]

app = FastAPI(title="Realty Voice Backend", version="0.1.0")

allowed_origins = os.getenv("CORS_ALLOW_ORIGINS", "*")
origins = [o.strip() for o in allowed_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OutputFormat = Literal[
    "mp3_44100_64",
    "mp3_44100_96",
    "mp3_44100_128",
    "mp3_44100_192",
    "pcm_16000",
    "pcm_22050",
    "pcm_24000",
    "pcm_44100",
    "ulaw_8000",
]

CONTENT_TYPES = {
    "mp3_44100_64": "audio/mpeg",
    "mp3_44100_96": "audio/mpeg",
    "mp3_44100_128": "audio/mpeg",
    "mp3_44100_192": "audio/mpeg",
    "pcm_16000": "audio/wav",
    "pcm_22050": "audio/wav",
    "pcm_24000": "audio/wav",
    "pcm_44100": "audio/wav",
    "ulaw_8000": "audio/basic",
}

DEFAULT_VOICE_ID = os.getenv("ELEVEN_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")
# Prefer an env override; otherwise fall back to a current ElevenLabs model.
DEFAULT_MODEL = os.getenv("ELEVEN_MODEL_ID", "eleven_turbo_v2_5")
DEFAULT_OUTPUT_FORMAT: OutputFormat = "mp3_44100_128"
DEFAULT_AGENT_ID = os.getenv("ELEVEN_AGENT_ID", None)

# Initialize ElevenLabs client
eleven_client = None


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to convert to speech")
    voice_id: str = Field(
        DEFAULT_VOICE_ID,
        description="Voice id or name configured in ElevenLabs",
    )
    model: Optional[str] = Field(
        None,
        description="ElevenLabs model id to use; defaults to ELEVEN_MODEL_ID or eleven_turbo_v2",
    )
    agent_id: Optional[str] = Field(
        DEFAULT_AGENT_ID,
        description="ElevenLabs agent id to use when generating speech",
    )
    output_format: OutputFormat = Field(
        DEFAULT_OUTPUT_FORMAT, description="Audio format to return"
    )
    stream: bool = Field(
        default=True, description="Stream audio chunks instead of returning one blob"
    )


class SessionLog(BaseModel):
    session_id: str = Field(..., description="Client session identifier")
    conversation: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    created_at: datetime = Field(default_factory=datetime.utcnow)


def _configure_api_key() -> str:
    global eleven_client
    api_key = os.getenv("ELEVEN_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="ELEVEN_API_KEY is not configured. Add it to backend/.env",
        )
    if eleven_client is None:
        eleven_client = ElevenLabs(api_key=api_key)
    return api_key


@app.get("/health")
def healthcheck():
    return {
        "status": "ok",
        "has_elevenlabs_key": bool(os.getenv("ELEVEN_API_KEY")),
    }


@app.post("/tts")
def text_to_speech(request: TTSRequest):
    _configure_api_key()

    try:
        # Use the new ElevenLabs client API
        audio_generator = eleven_client.generate(
            text=request.text,
            voice=request.agent_id or request.voice_id,
            model=request.model or DEFAULT_MODEL,
            stream=request.stream,
            output_format=request.output_format,
        )

        content_type = CONTENT_TYPES.get(
            request.output_format, "application/octet-stream"
        )
        
        if request.stream:
            return StreamingResponse(audio_generator, media_type=content_type)
        else:
            # For non-streaming, collect all audio bytes
            audio_bytes = b"".join(audio_generator)
            return StreamingResponse(iter([audio_bytes]), media_type=content_type)
            
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"ElevenLabs error: {exc}") from exc


@app.post("/session-log")
def log_session(log: SessionLog):
    """Append session data to backend/session_logs.json for quick inspection."""
    log_path = BASE_DIR / "session_logs.json"
    try:
        existing: List[Dict[str, Any]] = []
        if log_path.exists():
            existing = json.loads(log_path.read_text() or "[]")
        existing.append(log.model_dump())
        log_path.write_text(json.dumps(existing, indent=2))
        return {"status": "ok", "stored": True}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to store log: {exc}") from exc
