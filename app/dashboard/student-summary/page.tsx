"use client";

import React, { useState } from "react";
import { Sparkles, Copy, RefreshCw, Send, Music2 } from "lucide-react";

type StudentProfile = {
  firstName: string;
  university?: string;
  course?: string;
  budgetMin: number;
  budgetMax: number;
  preferredAreas: string[];
  moveInDate: string;
  vibeKeywords: string[];
  notes: string;
};

type Property = {
  code: string;
  title: string;
  area: string;
  weeklyRent: number;
  distanceToCampus: string;
  roomType: string;
  vibeTags: string[];
  url: string;
  notes?: string;
};

const PROPERTIES: Property[] = [
  {
    code: "HSR-101",
    title: "Bright Ensuite in Social Flatshare",
    area: "Fallowfield",
    weeklyRent: 185,
    distanceToCampus: "15–20 minutes by bus to main campus",
    roomType: "Ensuite room in 5-bed flat",
    vibeTags: ["social", "lively", "student", "budget-friendly"],
    url: "https://example.com/property/hsr-101",
    notes: "Big shared kitchen, popular with first-years.",
  },
  {
    code: "HSR-204",
    title: "Calm Studio Close to Campus",
    area: "City Centre",
    weeklyRent: 230,
    distanceToCampus: "8–10 minute walk to campus",
    roomType: "Private studio",
    vibeTags: ["quiet", "modern", "close-to-campus"],
    url: "https://example.com/property/hsr-204",
    notes: "Good for focused study, smaller building.",
  },
  {
    code: "HSR-309",
    title: "Modern Ensuite in Premium Building",
    area: "Ancoats",
    weeklyRent: 255,
    distanceToCampus: "20 minutes walk or 8 minutes by tram",
    roomType: "Ensuite room in 6-bed flat",
    vibeTags: ["social", "modern", "premium"],
    url: "https://example.com/property/hsr-309",
    notes: "Lots of shared spaces, rooftop terrace.",
  },
  {
    code: "HSR-410",
    title: "Value Room in Friendly House",
    area: "Rusholme",
    weeklyRent: 165,
    distanceToCampus: "18 minutes by bus",
    roomType: "Standard room with shared bathroom",
    vibeTags: ["budget-friendly", "chilled", "homely"],
    url: "https://example.com/property/hsr-410",
    notes: "Great for stretching budget, cosy vibe.",
  },
];

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;
const ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";

function toTitleCase(value: string): string {
  return value.replace(/\b\w/g, (c: string) => c.toUpperCase());
}

function normaliseList(raw: string): string[] {
  return raw
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
}

function friendlyAreaPhrase(preferredAreas: string[]): string {
  if (!preferredAreas.length) return "the main student areas";
  if (preferredAreas.length === 1) return toTitleCase(preferredAreas[0]);
  if (preferredAreas.length === 2) {
    return `${toTitleCase(preferredAreas[0])} and ${toTitleCase(
      preferredAreas[1]
    )}`;
  }
  const allButLast = preferredAreas.slice(0, -1).map((a) => toTitleCase(a));
  const last = toTitleCase(preferredAreas[preferredAreas.length - 1]);
  return `${allButLast.join(", ")} and ${last}`;
}

function friendlyVibePhrase(vibes: string[]): string {
  if (!vibes.length) return "that feels like a good fit for you";
  if (vibes.length === 1) return `with a ${vibes[0]} vibe`;
  const allButLast = vibes.slice(0, -1);
  const last = vibes[vibes.length - 1];
  return `with a ${allButLast.join(", ")} and ${last} vibe`;
}

function scoreProperty(profile: StudentProfile, property: Property): number {
  let score = 0;

  // Budget
  if (
    profile.budgetMin <= property.weeklyRent &&
    property.weeklyRent <= profile.budgetMax
  ) {
    score += 4;
  } else {
    const mid = (profile.budgetMin + profile.budgetMax) / 2;
    const diff = Math.abs(property.weeklyRent - mid);
    score -= diff / 50;
  }

  // Area
  if (profile.preferredAreas.length) {
    const areaLower = property.area.toLowerCase();
    if (profile.preferredAreas.includes(areaLower)) {
      score += 3;
    } else {
      for (const area of profile.preferredAreas) {
        if (areaLower.includes(area) || area.includes(areaLower)) {
          score += 1.5;
          break;
        }
      }
    }
  }

  // Vibe overlap
  const propTags = new Set(property.vibeTags.map((t) => t.toLowerCase()));
  const requested = new Set(profile.vibeKeywords);
  let overlapCount = 0;
  requested.forEach((v) => {
    if (propTags.has(v)) overlapCount += 1;
  });
  score += overlapCount * 1.5;

  return score;
}

function recommendProperties(
  profile: StudentProfile,
  maxResults = 3
): Property[] {
  const scored = PROPERTIES.map((prop) => ({
    prop,
    score: scoreProperty(profile, prop),
  }));

  scored.sort((a, b) => {
    if (b.score === a.score) {
      return a.prop.weeklyRent - b.prop.weeklyRent;
    }
    return b.score - a.score;
  });

  return scored.slice(0, maxResults).map((s) => s.prop);
}

function buildPropertyReason(
  profile: StudentProfile,
  property: Property
): string {
  const reasons: string[] = [];

  if (
    profile.budgetMin <= property.weeklyRent &&
    property.weeklyRent <= profile.budgetMax
  ) {
    reasons.push(
      `It sits comfortably in your budget at around £${property.weeklyRent} per week.`
    );
  } else if (property.weeklyRent < profile.budgetMin) {
    reasons.push(
      `It&apos;s actually a bit under your stated budget at about £${property.weeklyRent} per week, which gives you some extra breathing room.`
    );
  } else {
    reasons.push(
      `It&apos;s slightly above the top of your range at about £${property.weeklyRent} per week, but I wanted to include it because it ticks a lot of your boxes.`
    );
  }

  if (profile.preferredAreas.length) {
    const areaLower = property.area.toLowerCase();
    if (profile.preferredAreas.includes(areaLower)) {
      reasons.push(
        `It&apos;s in ${property.area}, which you mentioned as one of your preferred areas.`
      );
    } else {
      reasons.push(
        `It&apos;s in ${property.area}, which is similar to the areas you mentioned.`
      );
    }
  }

  const overlap: string[] = [];
  const propTags = property.vibeTags.map((t) => t.toLowerCase());
  profile.vibeKeywords.forEach((v) => {
    if (propTags.includes(v)) overlap.push(v);
  });

  if (overlap.length) {
    const vibeText = overlap.join(", ");
    reasons.push(
      `The building has a ${vibeText} feel, which matches what you described.`
    );
  } else {
    reasons.push(
      "From what we see, the building vibe should be a good match for how you like to live and study."
    );
  }

  if (property.distanceToCampus) {
    reasons.push(property.distanceToCampus + ".");
  }

  if (property.notes) {
    reasons.push(property.notes);
  }

  return reasons.join(" ");
}

function buildEmail(profile: StudentProfile, properties: Property[]): string {
  const areaPhrase = friendlyAreaPhrase(profile.preferredAreas);
  const vibePhrase = friendlyVibePhrase(profile.vibeKeywords);
  const subject = `Subject: Your Housr housing matches in ${areaPhrase}`;

  const lines: string[] = [];

  const intro =
    `Hi ${profile.firstName || "there"},\n\n` +
    `Thanks again for chatting with us about housing! Based on what you told me – ` +
    `a budget of roughly £${profile.budgetMin}–£${profile.budgetMax} per week, looking around ${areaPhrase} ` +
    `from about ${profile.moveInDate}, and a place ${vibePhrase} – ` +
    `I've pulled together a few options that I think could work well for you.\n`;

  lines.push(intro);

  if (profile.notes) {
    lines.push(`\nQuick recap from the call: ${profile.notes}\n`);
  }

  lines.push("\nHere are your matches:\n");

  properties.forEach((property, index) => {
    const reason = buildPropertyReason(profile, property);
    const block =
      `\n${index + 1}) ${property.title} – ${property.area} – approx. £${
        property.weeklyRent
      }/week\n` +
      `   Type: ${property.roomType}\n` +
      `   Link: ${property.url}\n` +
      `   Why it fits: ${reason}\n`;
    lines.push(block);
  });

  const closing =
    "\nNext steps:\n" +
    "- If any of these stand out, reply with your favourite 1–2 and I can check real-time availability.\n" +
    "- If none feel quite right, tell me what's missing (location, budget, vibe) and I can tweak the search.\n\n" +
    "We do get new rooms and studios coming up all the time, so we can keep an eye out for you.\n\n" +
    "Best,\nThe Housr Team";

  lines.push(closing);

  return `${subject}\n\n${lines.join("")}`;
}

function buildVoiceScript(
  profile: StudentProfile,
  properties: Property[]
): string {
  const firstName = profile.firstName || "there";
  const areaPhrase = friendlyAreaPhrase(profile.preferredAreas);
  const vibePhrase = friendlyVibePhrase(profile.vibeKeywords);
  const snippets: string[] = [];

  snippets.push(`Hey ${firstName}, it's the Housr team.`);
  snippets.push("Thanks again for jumping on the call about housing.");
  snippets.push(
    `I've had a look based on your budget of around £${profile.budgetMin} to £${profile.budgetMax} per week, ` +
      `looking in ${areaPhrase} from about ${profile.moveInDate}, ${vibePhrase}.`
  );

  if (properties.length) {
    snippets.push(
      `I've picked out ${properties.length} places that I think could work for you.`
    );
    properties.forEach((property, index) => {
      snippets.push(
        `Option ${index + 1} is ${property.title} in ${
          property.area
        }, at around £${property.weeklyRent} a week. ` +
          `It's a ${property.roomType.toLowerCase()}, and it's ${
            property.distanceToCampus
          }.`
      );
    });
  }

  snippets.push(
    "Have a look at the links in the email, and just reply with your favourite one or two so I can check live availability and the best rates for your dates."
  );
  snippets.push(
    "If none of these feel quite right, tell me what you want to change – things like location, budget or vibe – and I can send over a fresh set of options."
  );
  snippets.push("Speak soon!");

  return snippets.join(" ");
}

export default function StudentSummaryPage() {
  const [inquiry, setInquiry] = useState("");
  const [response, setResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [voiceScriptPreview, setVoiceScriptPreview] = useState<string | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  // form state
  const [firstName, setFirstName] = useState("");
  const [studentUniversity, setStudentUniversity] = useState("");
  const [studentCourse, setStudentCourse] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [areas, setAreas] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [vibe, setVibe] = useState("");

  // summary state
  const [lastMatchCount, setLastMatchCount] = useState<number | null>(null);
  const [lastMatchDate, setLastMatchDate] = useState<string | null>(null);

  function buildProfileFromState(): StudentProfile | null {
    const min = Number(budgetMin);
    const max = Number(budgetMax || budgetMin);

    if (!min || !max || !areas || !moveInDate || !vibe) {
      alert(
        "For the Housing Match engine, please fill in budget, preferred areas, move-in date and vibe keywords."
      );
      return null;
    }

    const preferredAreas = normaliseList(areas);
    const vibeKeywords = normaliseList(vibe);

    return {
      firstName: firstName.trim() || "there",
      university: studentUniversity.trim() || undefined,
      course: studentCourse.trim() || undefined,
      budgetMin: min,
      budgetMax: max,
      preferredAreas,
      moveInDate: moveInDate.trim(),
      vibeKeywords,
      notes: inquiry.trim(),
    };
  }

  const handleGenerate = () => {
    const profile = buildProfileFromState();
    if (!profile) return;

    setIsGenerating(true);
    setVoiceUrl(null);
    setVoiceScriptPreview(null);
    setCopied(false);

    const properties = recommendProperties(profile);
    const emailText = buildEmail(profile, properties);

    setLastMatchCount(properties.length);
    const now = new Date();
    const formatted = now.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setLastMatchDate(formatted);

    setTimeout(() => {
      setResponse(emailText);
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
      alert("Could not copy to clipboard.");
    }
  };

  const handleGenerateVoice = async () => {
    let script = response.trim();

    if (!script) {
      const profile = buildProfileFromState();
      if (!profile) return;
      const properties = recommendProperties(profile);
      script = buildVoiceScript(profile, properties);
    }

    setVoiceScriptPreview(script);

    const apiKey = ELEVENLABS_API_KEY;
    const voiceId = ELEVENLABS_VOICE_ID;

    if (!apiKey || !voiceId) {
      alert(
        "ElevenLabs is not configured. Please set NEXT_PUBLIC_ELEVENLABS_API_KEY and NEXT_PUBLIC_ELEVENLABS_VOICE_ID."
      );
      return;
    }

    try {
      setIsGeneratingVoice(true);
      setVoiceUrl(null);

      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text: script,
            model_id: ELEVENLABS_MODEL_ID,
            voice_settings: {
              stability: 0.55,
              similarity_boost: 0.8,
              style: 0.2,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("ElevenLabs error:", errorText);
        alert("There was a problem generating the voice note.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVoiceUrl(url);
    } catch (err) {
      console.error(err);
      alert("There was a problem talking to ElevenLabs.");
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const vibeChips = normaliseList(vibe);
  const hasSummary =
    firstName ||
    studentUniversity ||
    studentCourse ||
    budgetMin ||
    budgetMax ||
    areas ||
    vibe ||
    inquiry;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#063324] mb-2">
          Student Summary & Reply
        </h1>
        <p className="text-gray-500">
          Quick context card, AI reply, and voice note in one place for staff.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
        {/* Input */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-[#063324] flex items-center gap-2">
            <Send size={18} className="text-[#063324]" /> Student Details &
            Inquiry
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <label className="block text-gray-500 mb-1">
                Student first name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#F0F7F4] border-0 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700"
                placeholder="e.g. Aisha"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">
                University (optional)
              </label>
              <input
                type="text"
                value={studentUniversity}
                onChange={(e) => setStudentUniversity(e.target.value)}
                className="w-full bg-[#F0F7F4] border-0 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700"
                placeholder="e.g. University of Manchester"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">
                Course (optional)
              </label>
              <input
                type="text"
                value={studentCourse}
                onChange={(e) => setStudentCourse(e.target.value)}
                className="w-full bg-[#F0F7F4] border-0 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 mb-1">
                  Budget min (£/week)
                </label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="w-full bg-[#F0F7F4] border-0 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700"
                  placeholder="e.g. 170"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">
                  Budget max (£/week)
                </label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full bg-[#F0F7F4] border-0 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700"
                  placeholder="e.g. 220"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-500 mb-1">
                Preferred areas (comma-separated)
              </label>
              <input
                type="text"
                value={areas}
                onChange={(e) => setAreas(e.target.value)}
                className="w-full bg-[#F0F7F4] border-0 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700"
                placeholder="Fallowfield, City Centre"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Move-in date</label>
              <input
                type="text"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full bg-[#F0F7F4] border-0 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700"
                placeholder="e.g. 1 September 2025"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-500 mb-1">
                Vibe keywords (comma-separated)
              </label>
              <input
                type="text"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-[#F0F7F4] border-0 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700"
                placeholder="social, modern, quiet, close to campus"
              />
            </div>
          </div>

          <textarea
            className="flex-1 w-full bg-[#F0F7F4] border-0 rounded-3xl p-6 resize-none outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700 placeholder-gray-400"
            placeholder="Paste email or chat message here. We'll use this as call notes in the reply."
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-[#063324] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-[#063324]/20"
            >
              {isGenerating ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <Sparkles size={20} />
              )}
              Generate Reply
            </button>
            <button
              onClick={handleGenerateVoice}
              disabled={isGeneratingVoice || isGenerating}
              className="flex items-center gap-2 bg-white text-[#063324] border border-[#063324]/20 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#F0F7F4] transition disabled:opacity-50"
            >
              {isGeneratingVoice ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <Music2 size={18} />
              )}
              Voice Note
            </button>
          </div>
        </div>

        {/* Output + Student Summary */}
        <div className="flex-1 bg-[#063324] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-40 bg-[#D2E6DE] rounded-full blur-[100px] opacity-10 pointer-events-none" />

          <div className="flex flex-col gap-4 mb-6 z-10 relative">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg flex items-center gap-2 text-[#D2E6DE]">
                <Sparkles size={18} /> AI Reply & Summary
              </h2>
              {response && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-[#D2E6DE]/70 hover:text-white flex items-center gap-1 font-semibold uppercase tracking-wider"
                >
                  <Copy size={14} />
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            {/* Student Summary card */}
            {hasSummary && (
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs flex flex-col gap-2 backdrop-blur-sm">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-[#D2E6DE]/70 mb-1">
                      Student summary
                    </p>
                    <p className="font-semibold text-sm">
                      {firstName || "Student"}{" "}
                      {studentUniversity && (
                        <span className="text-[#D2E6DE]/70 text-xs">
                          · {studentUniversity}
                        </span>
                      )}
                    </p>
                    {studentCourse && (
                      <p className="text-[11px] text-[#D2E6DE]/80">
                        {studentCourse}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {(budgetMin || budgetMax) && (
                      <p className="text-[11px] text-[#D2E6DE]/80">
                        Budget{" "}
                        <span className="font-semibold text-white">
                          £{budgetMin || "?"}–£{budgetMax || budgetMin || "?"}
                        </span>{" "}
                        /wk
                      </p>
                    )}
                    {areas && (
                      <p className="text-[11px] text-[#D2E6DE]/80">
                        Areas:{" "}
                        <span className="font-semibold text-white">
                          {areas}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {vibeChips.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vibeChips.map((chip) => (
                      <span
                        key={chip}
                        className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] uppercase tracking-wide"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2 text-[11px] text-[#D2E6DE]/80">
                  {lastMatchCount != null && lastMatchDate ? (
                    <span>
                      Last status: Sent{" "}
                      <span className="font-semibold text-white">
                        {lastMatchCount} match
                        {lastMatchCount === 1 ? "" : "es"}
                      </span>{" "}
                      on <span className="font-semibold">{lastMatchDate}</span>,
                      waiting reply.
                    </span>
                  ) : (
                    <span>Last status: No matches sent yet.</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Scrollable reply */}
          <div className="flex-1 bg-white/5 rounded-3xl p-8 border border-white/10 text-sm leading-relaxed whitespace-pre-wrap backdrop-blur-sm relative overflow-y-auto min-h-0">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-white/50 gap-4">
                <div className="w-8 h-8 border-4 border-[#D2E6DE] border-t-transparent rounded-full animate-spin" />
                <p>Scanning 44,000 properties...</p>
              </div>
            ) : response ? (
              response
            ) : (
              <span className="text-white/30 italic">
                AI reply will appear here.
              </span>
            )}
          </div>

          {voiceUrl && (
            <div className="mt-4 z-10 relative space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs text-[#D2E6DE]/80 mb-1">
                    Voice note ready – staff can download and send on WhatsApp
                    or email.
                  </p>
                  <audio
                    controls
                    src={voiceUrl}
                    className="w-full rounded-2xl bg-white/10"
                  />
                </div>
                <a
                  href={voiceUrl}
                  download="housr-student-summary-voice-note.mp3"
                  className="shrink-0 text-xs bg-white text-[#063324] px-3 py-1.5 rounded-full font-semibold border border-white/80 hover:bg-[#F0F7F4] transition"
                >
                  Download MP3
                </a>
              </div>

              {voiceScriptPreview && (
                <div className="text-xs text-[#D2E6DE]/80 bg-white/5 rounded-2xl p-3 border border-white/10 max-h-32 overflow-y-auto">
                  <p className="font-semibold mb-1">Spoken script</p>
                  <p className="whitespace-pre-wrap text-[11px] leading-relaxed">
                    {voiceScriptPreview}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

