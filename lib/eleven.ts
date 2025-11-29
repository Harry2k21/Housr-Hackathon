import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Initialize ElevenLabs client only when needed
export const eleven = process.env.ELEVENLABS_API_KEY 
  ? new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    })
  : null;

// Default voice ID for Housr voice replies
// You can find voice IDs in your ElevenLabs dashboard
export const ELEVENLABS_DEFAULT_VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default to Rachel voice

/**
 * Transcribe audio using ElevenLabs Scribe v1
 */
export async function transcribeCall(
  audioBuffer: Buffer, 
  opts?: { languageCode?: string }
): Promise<{
  text: string;
  language_code: string;
  language_probability: number;
  words?: any[];
}> {
  // Fail at runtime if API key is missing
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
  }

  try {
    // Use node-fetch compatible FormData for server-side
    const { FormData } = await import('formdata-node');
    const { Blob } = await import('buffer');
    
    const formData = new FormData();
    
    // Convert Buffer to Blob for FormData (Node.js compatible)
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model_id', 'scribe_v1');
    
    if (opts?.languageCode) {
      formData.append('language_code', opts.languageCode);
    }
    
    // Add useful options for better transcription
    formData.append('timestamps_granularity', 'word');
    formData.append('tag_audio_events', 'true');

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
      body: formData as any,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs STT Error:', response.status, errorText);
      throw new Error(`STT failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('STT completed successfully:', {
      language: result.language_code,
      confidence: result.language_probability,
      textLength: result.text?.length || 0
    });

    return result;
  } catch (error) {
    console.error('STT Error:', error);
    throw error;
  }
}

/**
 * Generate voice reply using ElevenLabs TTS
 */
export async function generateVoiceReply(
  text: string,
  voiceId: string = ELEVENLABS_DEFAULT_VOICE_ID
): Promise<Buffer> {
  // Fail at runtime if API key is missing
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
  }

  try {
    console.log('Generating voice reply:', {
      textLength: text.length,
      voiceId: voiceId
    });

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_flash_v2_5', // Fast, good quality model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.2, // Slightly expressive
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS Error:', response.status, errorText);
      throw new Error(`TTS failed: ${response.status} ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    
    console.log('TTS completed successfully:', {
      audioSizeKB: Math.round(audioBuffer.length / 1024)
    });

    return audioBuffer;
  } catch (error) {
    console.error('TTS Error:', error);
    throw error;
  }
}