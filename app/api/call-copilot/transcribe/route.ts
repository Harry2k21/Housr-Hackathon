import { NextRequest, NextResponse } from "next/server";
import { transcribeCall } from "@/lib/eleven";
import fs from "fs";
import path from "path";

// Sample call ID to file mapping
const CALL_FILE_MAP = {
  1: "manchester-inquiry.mp3",
  2: "london-budget.mp3", 
  3: "birmingham-safety.mp3"
} as const;

// Mock transcripts as fallback when real audio files don't exist
const FALLBACK_TRANSCRIPTS = {
  1: {
    text: "Hi, I'm looking for a room near Manchester University. My budget is around £160 per week, and I need to move in by September. I'm a bit worried about safety in the area - are there any security measures? Also, I want to make sure all bills are included because I don't want any surprises.",
    language_code: "en",
    language_probability: 0.95
  },
  2: {
    text: "Main London mein room dhund raha hun, budget around £150 per week. I need something close to university, maybe Fallowfield area. Bills should be included ya separate? When can I move in?",
    language_code: "hi-en", 
    language_probability: 0.88
  },
  3: {
    text: "I'm concerned about safety in the area around Birmingham. Are there security measures in place? I need a room for around £170 per week, preferably close to campus. What about transport links?",
    language_code: "en",
    language_probability: 0.96
  }
} as const;

export async function POST(request: NextRequest) {
  try {
    const { callId } = await request.json();
    
    if (!callId || !CALL_FILE_MAP[callId as keyof typeof CALL_FILE_MAP]) {
      return NextResponse.json(
        { error: "Invalid call ID" },
        { status: 400 }
      );
    }

    const filename = CALL_FILE_MAP[callId as keyof typeof CALL_FILE_MAP];
    const audioPath = path.join(process.cwd(), "public", "sample-calls", filename);
    
    console.log("Processing transcription request:", {
      callId,
      filename,
      audioPath: audioPath
    });

    let transcriptionResult;

    try {
      // Try to read the actual audio file
      if (fs.existsSync(audioPath)) {
        const audioBuffer = fs.readFileSync(audioPath);
        console.log("Audio file found, sending to ElevenLabs:", {
          fileSize: Math.round(audioBuffer.length / 1024) + "KB"
        });
        
        // Use real ElevenLabs transcription
        transcriptionResult = await transcribeCall(audioBuffer);
      } else {
        throw new Error("Audio file not found");
      }
    } catch (error) {
      console.warn("ElevenLabs transcription failed, using fallback:", error);
      
      // Use fallback transcript
      transcriptionResult = FALLBACK_TRANSCRIPTS[callId as keyof typeof FALLBACK_TRANSCRIPTS];
    }

    // Extract key information from transcript (keeping existing logic)
    const extractedInfo = extractKeyInformation(transcriptionResult.text);

    return NextResponse.json({
      transcript: transcriptionResult.text,
      language: transcriptionResult.language_code,
      confidence: transcriptionResult.language_probability,
      extracted_info: extractedInfo
    });

  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}

// Extract key info from transcript (existing logic kept mostly as-is)
function extractKeyInformation(transcript: string) {
  const text = transcript.toLowerCase();
  
  // Budget extraction
  let budget = "Not specified";
  const budgetMatch = text.match(/(?:£|around|about)?\s*(\d+)\s*(?:per week|week|pw|\/week)/i);
  if (budgetMatch) {
    budget = `£${budgetMatch[1]}/week`;
  }

  // Location extraction  
  let location = "Not specified";
  const locations = ["manchester", "london", "birmingham", "fallowfield", "city centre", "campus"];
  for (const loc of locations) {
    if (text.includes(loc)) {
      location = loc.charAt(0).toUpperCase() + loc.slice(1) + " area";
      break;
    }
  }

  // Move-in date extraction
  let moveInDate = "Not specified";
  if (text.includes("september")) moveInDate = "September";
  else if (text.includes("move in")) moveInDate = "ASAP";

  // Concerns extraction
  const concerns = [];
  if (text.includes("safety") || text.includes("security")) concerns.push("Safety/security");
  if (text.includes("bills")) concerns.push("Bills included");
  if (text.includes("transport") || text.includes("bus") || text.includes("tram")) concerns.push("Transport links");
  if (concerns.length === 0) concerns.push("General inquiry");

  return {
    budget,
    location,
    move_in_date: moveInDate,
    key_concerns: concerns
  };
}