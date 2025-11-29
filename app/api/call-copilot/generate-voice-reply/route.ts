import { NextRequest, NextResponse } from "next/server";
import { generateVoiceReply } from "@/lib/eleven";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid text parameter" },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 5000 characters." },
        { status: 400 }
      );
    }

    console.log("Generating voice reply:", {
      textLength: text.length,
      preview: text.substring(0, 100) + "..."
    });

    // Generate voice using ElevenLabs TTS
    const audioBuffer = await generateVoiceReply(text);

    // Return audio as MP3 stream
    return new NextResponse(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store, max-age=0",
        "Content-Length": audioBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("Voice generation error:", error);
    
    // Return specific error messages for debugging
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "ElevenLabs API key configuration error" },
          { status: 500 }
        );
      }
      if (error.message.includes("quota") || error.message.includes("429")) {
        return NextResponse.json(
          { error: "ElevenLabs quota exceeded" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Voice generation failed" },
      { status: 500 }
    );
  }
}