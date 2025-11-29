"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Send, 
  Music2, 
  CheckCircle2, 
  Settings2, 
  MessageCircle, 
  Mail,
  MapPin,
  BedDouble,
  PoundSterling
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type StudentProfile = {
  firstName: string;
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
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=400&auto=format&fit=crop",
    notes: "Big shared kitchen, popular with first-years.",
  },
  {
    code: "HSR-204",
    title: "Calm Studio Close to Campus",
    area: "City Centre",
    weeklyRent: 230,
    distanceToCampus: "8 min walk",
    roomType: "Studio",
    vibeTags: ["quiet", "modern", "close-to-campus"],
    url: "https://housr.co/p/204",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=400&auto=format&fit=crop",
    notes: "Great for stretching budget, cosy vibe.",
  },
];

const TONES = ["Friendly", "Professional", "Hype", "Concise"];
const PLATFORMS = ["Email", "WhatsApp"];

// --- Helper Functions ---

function normaliseList(raw: string): string[] {
  return raw.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean);
}

function scoreProperty(profile: StudentProfile, property: Property): number {
  let score = 0;
  // Budget
  if (profile.budgetMin <= property.weeklyRent && property.weeklyRent <= profile.budgetMax) score += 4;
  else score -= Math.abs(property.weeklyRent - ((profile.budgetMin + profile.budgetMax) / 2)) / 50;
  
  // Area
  const areaLower = property.area.toLowerCase();
  if (profile.preferredAreas.some(a => areaLower.includes(a))) score += 3;
  
  // Vibe
  const propTags = new Set(property.vibeTags.map(t => t.toLowerCase()));
  const overlap = profile.vibeKeywords.filter(v => propTags.has(v)).length;
  score += overlap * 1.5;

  return score;
}

function recommendProperties(profile: StudentProfile, maxResults = 2): Property[] {
  const scored = PROPERTIES.map(prop => ({ prop, score: scoreProperty(profile, prop) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults).map(s => s.prop);
}

function generateContent(profile: StudentProfile, properties: Property[]): string {
  const isWhatsApp = profile.platform === "WhatsApp";
  const firstName = profile.firstName || "there";
  
  // Tone modifiers
  let greeting = `Hi ${firstName},`;
  let signoff = "Best,\nThe Housr Team";
  
  if (profile.tone === "Hype") {
    greeting = `Hey ${firstName}! 👋`;
    signoff = "Cheers,\nHousr Team 🚀";
  } else if (profile.tone === "Professional") {
    greeting = `Dear ${firstName},`;
    signoff = "Kind regards,\nHousr Lettings";
  }

  if (properties.length === 0) {
    return `${greeting}\n\nThanks for reaching out. We're currently looking for properties that match your specific criteria around ${profile.preferredAreas.join(", ")}. I'll be in touch as soon as something comes up!\n\n${signoff}`;
  }

  const matches = properties.map((p, i) => {
    if (isWhatsApp) {
      return `🏠 *${p.title}* (${p.area})\n💰 £${p.weeklyRent}/wk | ${p.distanceToCampus}\n🔗 ${p.url}`;
    }
    return `${i + 1}. **${p.title}** in ${p.area}\n   - Rent: £${p.weeklyRent}/week (Bills inc.)\n   - Vibe: ${p.vibeTags.join(", ")}\n   - Distance: ${p.distanceToCampus}\n   - Link: ${p.url}`;
  }).join("\n\n");

  if (isWhatsApp) {
    return `${greeting} Found some spots for you! 👇\n\n${matches}\n\nLet me know if you want to view any! 🔑`;
  }

  return `Subject: Your Housing Matches 🏡\n\n${greeting}\n\nThanks for sharing your preferences! Based on your budget of £${profile.budgetMin}-£${profile.budgetMax} and interest in ${profile.preferredAreas.join(", ") || "student areas"}, I've found these perfect matches:\n\n${matches}\n\nWould you like to book a viewing for any of these?\n\n${signoff}`;
}

export default function ReplyEngine() {
  // Form State
  const [firstName, setFirstName] = useState("");
  const [budgetMin, setBudgetMin] = useState("170");
  const [budgetMax, setBudgetMax] = useState("220");
  const [areas, setAreas] = useState("Fallowfield, City Centre");
  const [moveInDate, setMoveInDate] = useState("");
  const [vibe, setVibe] = useState("social, modern");
  const [notes, setNotes] = useState("");
  
  // Settings State
  const [tone, setTone] = useState("Friendly");
  const [platform, setPlatform] = useState("Email");

  // Output State
  const [response, setResponse] = useState("");
  const [matchedProperties, setMatchedProperties] = useState<Property[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);

  // ElevenLabs Config
  const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const ELEVENLABS_VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;
  const ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";

  const handleGenerate = () => {
    if (!budgetMin || !budgetMax) return;
    
    setIsGenerating(true);
    setResponse("");
    setMatchedProperties([]);
    setVoiceUrl(null);

    const profile: StudentProfile = {
      firstName: firstName.trim(),
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      preferredAreas: normaliseList(areas),
      moveInDate,
      vibeKeywords: normaliseList(vibe),
      notes,
      tone,
      platform
    };

    // Simulate AI processing
    setTimeout(() => {
      const matches = recommendProperties(profile);
      const text = generateContent(profile, matches);
      setMatchedProperties(matches);
      setResponse(text);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateVoice = async () => {
    if (!response) return;

    const apiKey = ELEVENLABS_API_KEY;
    const voiceId = ELEVENLABS_VOICE_ID;

    if (!apiKey || !voiceId) {
      alert("ElevenLabs is not configured. Please check your environment variables.");
      return;
    }

    // Clean up text for speech (remove emojis, links, subjects)
    let textToSpeak = response
      .replace(/Subject:.*?\n/g, "") // Remove subject line
      .replace(/https?:\/\/\S+/g, "check the link") // Replace URLs
      .replace(/[*_#]/g, "") // Remove markdown
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, ""); // Remove emojis

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
            text: textToSpeak,
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

      if (!res.ok) throw new Error("Failed to generate voice");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVoiceUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate voice note.");
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#063324] mb-2">Housing Match AI</h1>
          <p className="text-gray-500">Generate personalized property recommendations in seconds.</p>
        </div>
        <div className="flex gap-2">
           {/* Settings / Status Pills */}
           <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-xs font-bold text-gray-500 flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Live Inventory: 44,000+ Units
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-200px)] min-h-[700px]">
        
        {/* --- LEFT COLUMN: Controls & Inputs --- */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto no-scrollbar pr-2">
          
          {/* Settings Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-[#063324] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings2 size={16} /> Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Platform</label>
                <div className="flex bg-[#F0F7F4] p-1 rounded-xl">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        platform === p ? "bg-white text-[#063324] shadow-sm" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {p === "Email" ? <Mail size={14}/> : <MessageCircle size={14}/>} {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Tone</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#F0F7F4] text-sm font-medium text-[#063324] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#063324]/10 border-r-8 border-transparent cursor-pointer"
                >
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Input Form */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-[#063324] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Send size={16} /> Student Requirements
            </h3>
            
            <div className="space-y-4 flex-1">
              <div>
                <label className="text-xs text-gray-500 font-medium ml-1 mb-1 block">Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#F0F7F4] rounded-xl px-4 py-3 text-sm text-[#063324] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#063324]/10 transition-all"
                  placeholder="Student Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium ml-1 mb-1 block">Min Budget (£/pw)</label>
                  <input 
                    type="number" 
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full bg-[#F0F7F4] rounded-xl px-4 py-3 text-sm text-[#063324] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#063324]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium ml-1 mb-1 block">Max Budget (£/pw)</label>
                  <input 
                    type="number" 
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-[#F0F7F4] rounded-xl px-4 py-3 text-sm text-[#063324] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#063324]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium ml-1 mb-1 block">Preferred Areas</label>
                <input 
                  type="text" 
                  value={areas}
                  onChange={(e) => setAreas(e.target.value)}
                  className="w-full bg-[#F0F7F4] rounded-xl px-4 py-3 text-sm text-[#063324] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#063324]/10 transition-all"
                  placeholder="e.g. Fallowfield, City Centre"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium ml-1 mb-1 block">Vibe / Requirements</label>
                <textarea 
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  className="w-full bg-[#F0F7F4] rounded-xl px-4 py-3 text-sm text-[#063324] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#063324]/10 transition-all resize-none h-24"
                  placeholder="e.g. quiet, gym, ensuite, near bus stop"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-6 w-full bg-[#063324] hover:bg-[#0A4532] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#063324]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={20}/> : <Sparkles size={20}/>}
              {isGenerating ? "Scanning Portfolio..." : "Generate Matches"}
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Results --- */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Matched Properties Preview (Horizontal Scroll) */}
          <AnimatePresence>
            {matchedProperties.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 overflow-x-auto pb-2 no-scrollbar"
              >
                {matchedProperties.map((prop) => (
                  <div key={prop.code} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm min-w-[240px] flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0 relative">
                        <Image src={prop.image || ""} width={64} height={64} className="w-full h-full object-cover" alt={prop.title} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#063324] line-clamp-1">{prop.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin size={10}/> {prop.area}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#063324] mt-1">
                            <PoundSterling size={10}/>{prop.weeklyRent}/pw
                        </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Output Editor */}
          <div className="flex-1 bg-[#063324] rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col shadow-2xl">
            {/* Background Blob */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#D2E6DE] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                    {isGenerating ? <RefreshCw className="animate-spin text-[#D2E6DE]" size={20}/> : <Sparkles className="text-[#D2E6DE]" size={20}/>}
                </div>
                <div>
                    <h2 className="font-bold text-white">AI Draft</h2>
                    <p className="text-xs text-white/50">{platform} • {tone} Tone</p>
                </div>
              </div>
              
              {response && (
                <div className="flex gap-2">
                    <button 
                        onClick={handleGenerateVoice}
                        disabled={isGeneratingVoice}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#D2E6DE] transition-colors disabled:opacity-50 relative"
                        title="Generate Voice Note"
                    >
                        {isGeneratingVoice ? <RefreshCw className="animate-spin" size={18} /> : <Music2 size={18} />}
                    </button>
                    <button 
                        onClick={handleCopy}
                        className="px-4 py-2 rounded-lg bg-[#D2E6DE] hover:bg-white text-[#063324] text-xs font-bold transition-all flex items-center gap-2"
                    >
                        {copied ? <CheckCircle2 size={14}/> : <Copy size={14}/>}
                        {copied ? "Copied" : "Copy Text"}
                    </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
                {isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/30 gap-4">
                        <div className="w-12 h-12 border-4 border-[#D2E6DE]/20 border-t-[#D2E6DE] rounded-full animate-spin"></div>
                        <p className="animate-pulse font-medium">Analysing 44,000 properties...</p>
                    </div>
                ) : response ? (
                    <>
                        <textarea 
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            className="flex-1 w-full bg-black/20 rounded-2xl border border-white/10 p-6 text-white/90 text-sm leading-relaxed font-mono outline-none focus:ring-2 focus:ring-[#D2E6DE]/30 resize-none mb-4"
                        />
                        {voiceUrl && (
                            <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
                                <div className="w-10 h-10 rounded-full bg-[#D2E6DE] flex items-center justify-center shrink-0">
                                    <Music2 size={20} className="text-[#063324]"/>
                                </div>
                                <audio controls src={voiceUrl} className="flex-1 h-8" />
                                <a 
                                    href={voiceUrl} 
                                    download="housr-voice-note.mp3"
                                    className="text-xs font-bold text-[#D2E6DE] hover:text-white hover:underline"
                                >
                                    Download
                                </a>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/10 rounded-2xl">
                        <Sparkles size={48} className="mb-4 opacity-50"/>
                        <p>Configure requirements and generate a match.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
