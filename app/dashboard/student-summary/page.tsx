"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Copy,
  RefreshCw,
  Send,
  Music2,
  User,
  GraduationCap,
  PoundSterling,
  MapPin,
  Calendar,
  Heart,
  Settings2,
  Mail,
  MessageCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

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
  tone: string;
  platform: string;
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
  image?: string;
  notes?: string;
};

// --- Mock Data ---

const PROPERTIES: Property[] = [
  {
    code: "HSR-101",
    title: "Bright Ensuite in Social Flatshare",
    area: "Fallowfield",
    weeklyRent: 185,
    distanceToCampus: "15–20 min bus",
    roomType: "Ensuite • 5-bed",
    vibeTags: ["social", "lively", "student", "budget-friendly"],
    url: "https://housr.co/p/101",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=400&auto=format&fit=crop",
    notes: "Big shared kitchen, popular with first-years.",
  },
  {
    code: "HSR-204",
    title: "Calm Studio Close to Campus",
    area: "City Centre",
    weeklyRent: 230,
    distanceToCampus: "8 min walk",
    roomType: "Private Studio",
    vibeTags: ["quiet", "modern", "close-to-campus"],
    url: "https://housr.co/p/204",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop",
    notes: "Good for focused study, smaller building.",
  },
  {
    code: "HSR-309",
    title: "Modern Ensuite in Premium Building",
    area: "Ancoats",
    weeklyRent: 255,
    distanceToCampus: "8 min tram",
    roomType: "Ensuite • Premium",
    vibeTags: ["social", "modern", "premium"],
    url: "https://housr.co/p/309",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400&auto=format&fit=crop",
    notes: "Lots of shared spaces, rooftop terrace.",
  },
  {
    code: "HSR-410",
    title: "Value Room in Friendly House",
    area: "Rusholme",
    weeklyRent: 165,
    distanceToCampus: "18 min bus",
    roomType: "Standard Room",
    vibeTags: ["budget-friendly", "chilled", "homely"],
    url: "https://housr.co/p/410",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=400&auto=format&fit=crop",
    notes: "Great for stretching budget, cosy vibe.",
  },
];

const TONES = ["Friendly", "Professional", "Hype", "Concise"];
const PLATFORMS = ["Email", "WhatsApp"];
const VIBE_PRESETS = ["Social", "Quiet", "Modern", "Budget", "Gym", "Ensuite"];

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;
const ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";

// --- Logic ---

function normaliseList(raw: string): string[] {
  return raw
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
}

function scoreProperty(profile: StudentProfile, property: Property): number {
  let score = 0;
  if (
    profile.budgetMin <= property.weeklyRent &&
    property.weeklyRent <= profile.budgetMax
  ) {
    score += 4;
  } else {
    const mid = (profile.budgetMin + profile.budgetMax) / 2;
    score -= Math.abs(property.weeklyRent - mid) / 50;
  }

  const areaLower = property.area.toLowerCase();
  if (profile.preferredAreas.some((a) => areaLower.includes(a))) score += 3;

  const propTags = new Set(property.vibeTags.map((t) => t.toLowerCase()));
  const overlap = profile.vibeKeywords.filter((v) => propTags.has(v)).length;
  score += overlap * 1.5;

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
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults).map((s) => s.prop);
}

function buildReply(profile: StudentProfile, properties: Property[]): string {
  const isWhatsApp = profile.platform === "WhatsApp";
  const firstName = profile.firstName || "there";
  const areaPhrase =
    profile.preferredAreas.length > 0
      ? profile.preferredAreas.join(", ")
      : "student areas";

  // Tone logic
  let greeting = `Hi ${firstName},`;
  let signoff = "Best,\nThe Housr Team";

  if (profile.tone === "Hype") {
    greeting = `Hey ${firstName}! 👋`;
    signoff = "Cheers,\nHousr Team 🚀";
  } else if (profile.tone === "Professional") {
    greeting = `Dear ${firstName},`;
    signoff = "Kind regards,\nHousr Lettings";
  } else if (profile.tone === "Concise") {
    greeting = `${firstName},`;
    signoff = "Thanks, Housr.";
  }

  if (properties.length === 0) {
    return `${greeting}\n\nThanks for reaching out. We're currently looking for properties that match your specific criteria around ${areaPhrase}. I'll be in touch as soon as something comes up!\n\n${signoff}`;
  }

  const matches = properties
    .map((p, i) => {
      if (isWhatsApp) {
        return `🏠 *${p.title}* (${p.area})\n💰 £${p.weeklyRent}/wk | ${p.distanceToCampus}\n🔗 ${p.url}`;
      }
      return `${i + 1}. **${p.title}** in ${p.area}\n   - Rent: £${
        p.weeklyRent
      }/week (Bills inc.)\n   - Vibe: ${p.vibeTags.join(
        ", "
      )}\n   - Distance: ${p.distanceToCampus}\n   - Link: ${p.url}`;
    })
    .join("\n\n");

  // Intro Text
  let intro = `Thanks for chatting with us! Based on your budget of £${profile.budgetMin}-£${profile.budgetMax} and interest in ${areaPhrase}, here are some great options:`;
  if (profile.tone === "Concise") {
    intro = `Here are the matches for your budget (£${profile.budgetMin}-£${profile.budgetMax}) in ${areaPhrase}:`;
  } else if (profile.tone === "Hype") {
    intro = `Great news! I've found some amazing spots in ${areaPhrase} that fit your budget perfectly. Check these out:`;
  }

  // Notes integration
  if (profile.notes && !isWhatsApp && profile.tone !== "Concise") {
    intro = `Thanks for chatting earlier! Noted your requirements: "${profile.notes}".\n\n${intro}`;
  }

  if (isWhatsApp) {
    return `${greeting} Found matches for you! 👇\n\n${matches}\n\nWant to view any? 🔑`;
  }

  return `Subject: Your Housing Matches 🏡\n\n${greeting}\n\n${intro}\n\n${matches}\n\nLet me know if you'd like to book a viewing for any of these!\n\n${signoff}`;
}

function buildVoiceScript(
  profile: StudentProfile,
  properties: Property[]
): string {
  const firstName = profile.firstName || "there";
  const areaPhrase =
    profile.preferredAreas.join(" or ") || "the main student areas";

  let script = `Hey ${firstName}, it's the Housr team here. `;
  script += `Just following up on our chat. I've had a look for places around ${areaPhrase} within your budget. `;

  if (properties.length > 0) {
    script += `I've sent over ${properties.length} options that look really good. `;
    const p = properties[0];
    script += `The first one, the ${p.title}, is in ${p.area} and is only ${p.distanceToCampus}. `;
    script += `Have a look at the links I sent, and let me know if you want to see any of them. Speak soon!`;
  } else {
    script += `I'm still digging for the perfect spot, but I'll keep you posted as soon as new inventory drops. Speak soon!`;
  }

  return script;
}

// --- Component ---

export default function StudentSummaryPage() {
  // Form State
  const [firstName, setFirstName] = useState("");
  const [studentUniversity, setStudentUniversity] = useState("");
  const [studentCourse, setStudentCourse] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [areas, setAreas] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [vibe, setVibe] = useState("");
  const [notes, setNotes] = useState("");

  // Configuration State
  const [tone, setTone] = useState("Friendly");
  const [platform, setPlatform] = useState("Email");

  // Output State
  const [response, setResponse] = useState("");
  const [matchedProperties, setMatchedProperties] = useState<Property[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // --- Handlers ---

  const handleVibeClick = (v: string) => {
    const current = vibe.split(",").map((s) => s.trim());
    if (!current.includes(v.toLowerCase())) {
      setVibe(current.filter(Boolean).concat(v.toLowerCase()).join(", "));
    }
  };

  const buildProfile = (): StudentProfile | null => {
    if (!budgetMin || !budgetMax) {
      alert("Please enter a budget range.");
      return null;
    }
    return {
      firstName: firstName.trim(),
      university: studentUniversity.trim(),
      course: studentCourse.trim(),
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      preferredAreas: normaliseList(areas),
      moveInDate: moveInDate.trim(),
      vibeKeywords: normaliseList(vibe),
      notes: notes.trim(),
      tone,
      platform,
    };
  };

  const handleGenerate = () => {
    const profile = buildProfile();
    if (!profile) return;

    setIsGenerating(true);
    setVoiceUrl(null);
    setResponse("");
    setMatchedProperties([]);

    // Mock AI Delay
    setTimeout(() => {
      const matches = recommendProperties(profile);
      const text = buildReply(profile, matches);
      setMatchedProperties(matches);
      setResponse(text);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopy = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateVoice = async () => {
    let script = response;
    // Use a simpler script if the generated text is long (like an email)
    if (platform === "Email" && response.length > 200) {
      const profile = buildProfile();
      if (profile) {
        script = buildVoiceScript(profile, matchedProperties);
      }
    } else {
      // Cleanup for text-to-speech
      script = script
        .replace(/Subject:.*?\n/g, "")
        .replace(/https?:\/\/\S+/g, "check the link")
        .replace(/[*_#]/g, "");
    }

    const apiKey = ELEVENLABS_API_KEY;
    const voiceId = ELEVENLABS_VOICE_ID;

    if (!apiKey || !voiceId) {
      alert("ElevenLabs API key missing.");
      return;
    }

    try {
      setIsGeneratingVoice(true);
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
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.0,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!res.ok) throw new Error("Voice generation failed");
      const blob = await res.blob();
      setVoiceUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert("Failed to generate voice.");
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#063324] flex items-center gap-3">
            <span className="bg-[#063324] text-white p-2 rounded-lg">
              <User size={24} />
            </span>
            Student Summary
          </h1>
          <p className="text-gray-500 mt-1 ml-1">
            Manage student profiles and generate personalized outreach.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-500 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Active
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] min-h-[700px]">
        {/* --- LEFT: Input Form --- */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Configuration Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-[#063324] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Settings2 size={14} /> Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase">
                  Tone
                </label>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#F0F7F4] text-sm font-bold text-[#063324] rounded-xl px-4 py-3 outline-none appearance-none cursor-pointer hover:bg-[#E6F2ED] transition-colors"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#063324]">
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="currentColor"
                    >
                      <path d="M1 1L5 5L9 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase">
                  Platform
                </label>
                <div className="flex bg-[#F0F7F4] p-1 rounded-xl">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        platform === p
                          ? "bg-white text-[#063324] shadow-sm"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {p === "Email" ? (
                        <Mail size={14} />
                      ) : (
                        <MessageCircle size={14} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Student Form */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col flex-1">
            <h3 className="text-xs font-bold text-[#063324] uppercase tracking-widest mb-6 flex items-center gap-2">
              <FileText size={14} /> Profile Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="First Name"
                  icon={<User size={14} />}
                  value={firstName}
                  onChange={setFirstName}
                  placeholder="e.g. Alex"
                />
                <InputGroup
                  label="University"
                  icon={<GraduationCap size={14} />}
                  value={studentUniversity}
                  onChange={setStudentUniversity}
                  placeholder="e.g. Manchester"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Min Budget (£)"
                  icon={<PoundSterling size={14} />}
                  value={budgetMin}
                  onChange={setBudgetMin}
                  placeholder="150"
                  type="number"
                />
                <InputGroup
                  label="Max Budget (£)"
                  icon={<PoundSterling size={14} />}
                  value={budgetMax}
                  onChange={setBudgetMax}
                  placeholder="200"
                  type="number"
                />
              </div>

              <InputGroup
                label="Preferred Areas"
                icon={<MapPin size={14} />}
                value={areas}
                onChange={setAreas}
                placeholder="Fallowfield, City Centre..."
              />

              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase ml-1">
                  Vibe & Requirements
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {VIBE_PRESETS.map((v) => (
                    <button
                      key={v}
                      onClick={() => handleVibeClick(v)}
                      className="px-3 py-1 rounded-full bg-[#F0F7F4] text-[#063324] text-xs font-semibold hover:bg-[#D2E6DE] transition-colors border border-transparent hover:border-[#063324]/10"
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-gray-400">
                    <Heart size={14} />
                  </div>
                  <input
                    type="text"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="w-full bg-[#F0F7F4] rounded-xl pl-10 pr-4 py-3 text-sm text-[#063324] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#063324]/10 transition-all font-medium"
                    placeholder="Type custom vibes..."
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase ml-1">
                  Internal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#F0F7F4] rounded-xl px-4 py-3 text-sm text-[#063324] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#063324]/10 transition-all font-medium resize-none h-24"
                  placeholder="Paste specific requests or call notes here..."
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-6 w-full bg-[#063324] hover:bg-[#0A4532] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#063324]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <Sparkles size={20} />
              )}
              {isGenerating ? "Generating..." : "Generate Summary & Reply"}
            </button>
          </div>
        </div>

        {/* --- RIGHT: Results --- */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Matched Properties Visuals */}
          <AnimatePresence>
            {matchedProperties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar"
              >
                {matchedProperties.map((prop) => (
                  <div
                    key={prop.code}
                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm min-w-[240px] flex gap-3 items-center group hover:shadow-md transition-all"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0 relative">
                      <Image
                        src={prop.image || ""}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={prop.title}
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#063324] line-clamp-1 mb-1">
                        {prop.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                        <MapPin size={10} /> {prop.area}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-extrabold text-[#063324] bg-[#F0F7F4] px-2 py-0.5 rounded-full w-fit">
                        <PoundSterling size={10} />
                        {prop.weeklyRent}/pw
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Output Editor */}
          <div className="flex-1 bg-[#063324] rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col shadow-2xl border border-white/10">
            {/* Background decorative elements */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#D2E6DE] rounded-full blur-[120px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#063324] to-transparent pointer-events-none z-10" />

            <div className="flex justify-between items-center mb-6 relative z-20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/5">
                  {isGenerating ? (
                    <RefreshCw
                      className="animate-spin text-[#D2E6DE]"
                      size={20}
                    />
                  ) : (
                    <Sparkles className="text-[#D2E6DE]" size={20} />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">
                    AI Response
                  </h2>
                  <p className="text-xs text-white/40 font-medium">
                    {platform} Mode • {tone}
                  </p>
                </div>
              </div>

              {response && (
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateVoice}
                    disabled={isGeneratingVoice}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#D2E6DE] transition-all disabled:opacity-50 border border-white/10 flex items-center gap-2 font-semibold text-xs"
                  >
                    {isGeneratingVoice ? (
                      <RefreshCw className="animate-spin" size={14} />
                    ) : (
                      <Music2 size={14} />
                    )}
                    Voice Note
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-xl bg-[#D2E6DE] hover:bg-white text-[#063324] text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#000]/20"
                  >
                    {copied ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copied ? "Copied" : "Copy Text"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative z-10 flex flex-col min-h-0">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-white/30 gap-4">
                  <div className="w-12 h-12 border-4 border-[#D2E6DE]/20 border-t-[#D2E6DE] rounded-full animate-spin" />
                  <p className="animate-pulse font-medium tracking-wide text-sm">
                    Analysing student data...
                  </p>
                </div>
              ) : response ? (
                <>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="flex-1 w-full bg-black/20 rounded-2xl border border-white/10 p-6 text-white/90 text-sm leading-relaxed font-mono outline-none focus:ring-2 focus:ring-[#D2E6DE]/30 resize-none mb-4 custom-scrollbar"
                    spellCheck={false}
                  />
                  <AnimatePresence>
                    {voiceUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-md border border-white/10"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#D2E6DE] flex items-center justify-center shrink-0 shadow-lg">
                          <Music2 size={24} className="text-[#063324]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[#D2E6DE] font-bold mb-1 uppercase tracking-wider">
                            Voice Preview
                          </p>
                          <audio controls src={voiceUrl} className="w-full h-8" />
                        </div>
                        <a
                          href={voiceUrl}
                          download="housr-student-summary.mp3"
                          className="h-10 px-4 flex items-center justify-center rounded-lg bg-white text-[#063324] text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm"
                        >
                          Download
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/10 rounded-2xl">
                  <Sparkles size={48} className="mb-4 opacity-50" />
                  <p className="font-medium">Enter details to generate summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function InputGroup({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  value: string | number;
  onChange: (val: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#F0F7F4] rounded-xl pl-10 pr-4 py-3 text-sm text-[#063324] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#063324]/10 transition-all font-medium hover:bg-[#E6F2ED]"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
