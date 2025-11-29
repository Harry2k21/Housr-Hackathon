# ElevenLabs Integration Setup

This guide explains how to set up real ElevenLabs integration for the Call Copilot feature.

## Prerequisites

1. **ElevenLabs Account**: Sign up at [elevenlabs.io](https://elevenlabs.io)
2. **API Key**: Get your API key from ElevenLabs dashboard
3. **Voice ID**: Choose a voice from your ElevenLabs library

## Environment Configuration

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the ElevenLabs configuration:
   ```env
   ELEVENLABS_API_KEY=your_actual_api_key_here
   ELEVENLABS_DEFAULT_VOICE_ID=your_preferred_voice_id
   ```

## Sample Audio Files

For real transcription, add actual MP3 files to `public/sample-calls/`:

- `manchester-inquiry.mp3` - Student asking about Manchester University area room
- `london-budget.mp3` - Hindi/English mixed budget inquiry for London  
- `birmingham-safety.mp3` - Safety-focused inquiry about Birmingham area

**File Requirements:**
- Format: MP3 or WAV
- Quality: 16kHz+ sample rate recommended
- Duration: 2-5 minutes typical
- Content: Clear speech with student housing inquiries

## How It Works

### Speech-to-Text (Scribe v1)
- Upload/select sample call → real MP3 file sent to ElevenLabs
- Returns real transcript + detected language
- Extracts key info: budget, location, move-in date, concerns

### Text-to-Speech 
- Generate email reply → create voice note with ElevenLabs TTS
- Uses configurable voice ID and model
- Returns downloadable MP3 audio

### Fallback Behavior
- If real audio files don't exist → uses mock transcripts
- If ElevenLabs quota exceeded → shows friendly error
- If API key missing → fails loudly with helpful message

## Testing

1. **With Real Files**: Add MP3s to `public/sample-calls/` and set API key
2. **Mock Mode**: Leave audio files empty, uses fallback transcripts
3. **Voice Generation**: Always uses real ElevenLabs (requires API key)

## Error Handling

The integration includes comprehensive error handling:

- **STT Failures**: "Transcription failed, please try another call"
- **TTS Failures**: Disables voice button with error tooltip
- **Quota Issues**: Shows specific quota exceeded message
- **Network Issues**: Generic "please check connection" message

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Upload real sample audio files
3. Monitor ElevenLabs usage/quota
4. Consider implementing rate limiting for voice generation