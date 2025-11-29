"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, Heart, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { ChevronDown, Search, Heart, MapPin, Star, ArrowRight, CheckCircle2, Play, Calendar, FileText, Users, Gift, Coffee, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

// --- Brand Colors ---
// Dark Green: bg-[#063324]
// Mint: bg-[#D2E6DE]
// Button Green: bg-[#154D38]

const Navbar = () => (
  <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
    <nav className="bg-[#D2E6DE]/90 backdrop-blur-md rounded-full px-6 py-3 flex items-center justify-between w-full max-w-6xl shadow-sm border border-white/20">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-1 text-2xl font-bold text-[#063324] tracking-tighter">
          <div className="bg-[#063324] text-white p-1 rounded-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-8H3v8zm6-11V7l6-3 6 3v3h-2v10h-2v-6h-4v6H9v-10H7v-3h2z"/></svg>
          </div>
          housr
        </div>
        <div className="hidden md:flex items-center gap-6 font-semibold text-[#063324] text-sm">
          <div className="flex items-center gap-1 cursor-pointer">Features <ChevronDown size={14}/></div>
          <a href="#" className="hover:opacity-70">About</a>
          <a href="#" className="hover:opacity-70">Colleges</a>
          <a href="#" className="hover:opacity-70">Properties</a>
          <a href="#" className="hover:opacity-70">Perks</a>
          <a href="#" className="hover:opacity-70">Parents</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login">
             {/* Hidden Admin Entry */}
            <span className="text-xs font-bold text-[#063324]/50 hover:text-[#063324] uppercase tracking-widest mr-2">Admin</span>
        </Link>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#063324]/10 bg-white/50">
          <span className="text-lg">🇺🇸</span>
          <span className="text-xs font-bold text-[#063324]">US</span>
          <ChevronDown size={12} className="text-[#063324]"/>
        </div>
        <button className="bg-white text-[#063324] px-6 py-2.5 rounded-full font-bold text-sm shadow-sm hover:scale-105 transition-transform">
          Download app
        </button>
      </div>
    </nav>
  </div>
);

// CSS-Only Phone Mockup to match the screenshot vibes
const PhoneMockup = ({ type = "dark", children }: { type?: "dark" | "light", children?: React.ReactNode }) => (
  <div className={`relative w-[280px] h-[580px] border-[8px] ${type === 'dark' ? 'border-gray-900 bg-gray-900' : 'border-white bg-white'} rounded-[3rem] shadow-2xl overflow-hidden`}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-20"></div>
    <div className="w-full h-full bg-white overflow-hidden relative font-sans">
        {children || (
            /* Default Find Properties Content */
            <>
                <div className="px-4 pt-10 pb-4 flex gap-2">
                    <div className="flex-1 bg-gray-100 h-10 rounded-full flex items-center px-3 gap-2 text-gray-400 text-sm">
                        <Search size={16}/> Lincoln...
                    </div>
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                        <Heart size={18} className="text-gray-400"/>
                    </div>
                </div>
                {/* Mock Cards */}
                <div className="px-4 space-y-4">
                    <div className="bg-white shadow-lg rounded-2xl p-2">
                        <div className="h-32 bg-cover bg-center rounded-xl bg-[url('https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1000')]"></div>
                        <div className="mt-2 px-1">
                            <div className="flex justify-between font-bold text-gray-800"><span>$630/mth</span> <span className="flex items-center gap-1 text-xs font-normal bg-green-100 text-green-700 px-2 rounded-full">Bills Inc.</span></div>
                            <div className="text-xs text-gray-500 mt-1">4 Bed • 2 Bath</div>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-2xl p-2">
                        <div className="h-32 bg-cover bg-center rounded-xl bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000')]"></div>
                        <div className="mt-2 px-1">
                            <div className="flex justify-between font-bold text-gray-800"><span>$515/mth</span></div>
                            <div className="text-xs text-gray-500 mt-1">2 Bed • 1 Bath</div>
                        </div>
                    </div>
                </div>
                {/* Floating Map Button */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#063324] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg z-10">
                    <MapPin size={14}/> Map View
                </div>
            </>
        )}
    </div>
  </div>
);

type ChatBubble = { role: "bot" | "user"; text: string };

const TTSConcierge = ({ autoStart = false }: { autoStart?: boolean }) => {
  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001").replace(/\/$/, "");
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playback, setPlayback] = useState<HTMLAudioElement | null>(null);
  const [messages, setMessages] = useState<ChatBubble[]>([
    { role: "bot", text: "Welcome to Housr! Tell me what you need and I'll speak back with next steps." },
  ]);
  const [askedCount, setAskedCount] = useState(0);
  const [questionLimit, setQuestionLimit] = useState(5);
  const [finished, setFinished] = useState(false);
  const [recommendations, setRecommendations] = useState<{ title: string; price: string; summary: string }[]>([]);
  const [lastBotText, setLastBotText] = useState("Welcome to Housr! Tell me what you need and I'll speak back with next steps.");
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const processUserMessageRef = React.useRef<(text: string) => void>(() => {});
  const sessionId = React.useMemo(() => `session_${Date.now()}`, []);
  const agentId = process.env.NEXT_PUBLIC_ELEVEN_AGENT_ID || "agent_6301kb88z22ee3cr98333t8vyw7g";
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const followUps = [
    "When do you need to move in?",
    "What monthly budget works for you?",
    "Do you prefer studio, en-suite, or shared?",
    "Any must-haves like bills included or near campus?",
    "Want me to line up a virtual tour or in-person viewing?",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = false;
        recog.lang = "en-US";
        recog.onresult = (event: SpeechRecognitionEvent) => {
          const lastResultIndex = event.results.length - 1;
          const transcript = event.results[lastResultIndex][0].transcript;
          setInputValue("");
          processUserMessageRef.current(transcript);
        };
        recog.onend = () => {
          if (isListening) {
            recog.start();
          }
        };
        recognitionRef.current = recog;
      }
    }
  }, [isListening]);

  useEffect(() => {
    if (autoStart && !started) {
      beginJourney();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, started]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed,
          agent_id: agentId,
          stream: false,
          output_format: "mp3_44100_128",
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `TTS request failed with status ${res.status}`);
      }

      const buffer = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") || "audio/mpeg";
      const blob = new Blob([buffer], { type: contentType });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      if (playback) {
        playback.pause();
        playback.currentTime = 0;
      }
      const audio = new Audio(url);
      setPlayback(audio);
      await audio.play();
    } catch (err: any) {
      let errorMessage = err?.message || "Unable to generate speech";
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        errorMessage = `Cannot connect to backend at ${backendUrl}. Make sure the backend server is running.`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const beginJourney = () => {
    if (started) return;
    setStarted(true);
    setFinished(false);
    const limit = Math.floor(Math.random() * 4) + 5; // 5-8 questions
    setQuestionLimit(limit);
    const prompt = "Tell me about the city, timing, budget, and anything you care about.";
    setMessages((prev) => [...prev, { role: "bot", text: prompt }]);
    setAskedCount(1);
    speak(prompt);
    setLastBotText(prompt);
  };

  const nextFollowUp = () => followUps[Math.floor(Math.random() * followUps.length)];

  const buildSmartReply = (userText: string) => {
    const lower = userText.toLowerCase();
    const cityMatch = lower.match(/(?:in|at)\s+([a-z\s]+)/i);
    const budgetMatch = userText.match(/([£$]\s?\d{3,4})/);
    const wantsStudio = lower.includes("studio");
    const wantsShared = lower.includes("shared");
    const wantsEnsuite = lower.includes("en-suite") || lower.includes("ensuite");

    const snippets = [];
    if (cityMatch) snippets.push(`Noted city preference: ${cityMatch[1].trim()}.`);
    if (budgetMatch) snippets.push(`Targeting options around ${budgetMatch[1]}.`);
    if (wantsStudio) snippets.push("Studio-friendly picks added.");
    if (wantsShared) snippets.push("Including calm shared houses.");
    if (wantsEnsuite) snippets.push("Prioritizing en-suite rooms.");

    const follow = nextFollowUp();
    const base = snippets.length ? snippets.join(" ") : "Got it. I'll tailor options.";
    return `${base} ${follow}`;
  };

  const processUserMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    if (finished) return;

    const totalAsked = askedCount;
    if (totalAsked >= questionLimit) {
      finalizeConversation(trimmed);
      return;
    }

    const reply = buildSmartReply(trimmed);
    setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    setLastBotText(reply);
    setAskedCount((prev) => prev + 1);
    speak(reply);
  };
  processUserMessageRef.current = processUserMessage;

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const current = inputValue;
    setInputValue("");
    processUserMessage(current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const finalizeConversation = (lastAnswer: string) => {
    const closing = "Thanks. I have enough to suggest some places. Want me to call a representative for you?";
    const recs = [
      { title: "City Centre En-Suite", price: "$820/mo", summary: "Bills included, 8 min walk to campus, quiet block." },
      { title: "Shared House Near Uni", price: "$690/mo", summary: "3-bed shared, garden space, utilities capped." },
      { title: "Modern Studio", price: "$940/mo", summary: "Gym onsite, furnished, flexible lease start." },
    ];
    setRecommendations(recs);
    setMessages((prev) => [...prev, { role: "bot", text: closing }]);
    setLastBotText(closing);
    speak(closing);
    setFinished(true);
    logSession(recs, lastAnswer);
  };

  const logSession = async (recs: { title: string; price: string; summary: string }[], lastAnswer: string) => {
    try {
      await fetch(`${backendUrl}/session-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          conversation: messages.concat([
            { role: "user", text: lastAnswer },
            { role: "bot", text: "Session ended with recommendations." },
          ]),
          recommendations: recs,
        }),
      });
    } catch (err) {
      console.error("Failed to log session", err);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    setIsListening(false);
    recognitionRef.current.stop();
  };

  return (
    <section id="journey-chat" className="relative bg-gradient-to-b from-white via-[#F2F8F5] to-[#D2E6DE] py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-white/40 blur-[120px] rounded-full -top-10 -left-10" />
        <div className="absolute w-96 h-96 bg-[#D2E6DE]/60 blur-[140px] rounded-full bottom-0 right-0" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-[#063324]/70 font-semibold mb-3">Housr voice concierge</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#063324] leading-tight">Begin your journey</h2>
            <p className="text-[#063324]/70 mt-3 text-lg max-w-xl">
              Tap start, speak, and the bot will respond with follow-ups in real time—no preset questionnaire, just a flowing chat.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur border border-[#063324]/10 rounded-2xl px-4 py-3 text-sm text-[#063324] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#063324] text-white flex items-center justify-center font-bold">AI</div>
            <div>
              <div className="font-semibold">Live voice</div>
              <div className="text-xs text-[#063324]/70">Powered by ElevenLabs</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#063324]/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#063324] text-white flex items-center justify-center font-bold">🎧</div>
                <div>
                  <div className="text-sm font-semibold text-[#063324]/70 uppercase tracking-[0.2em]">Voice chat</div>
                  <div className="text-xl font-bold text-[#063324]">Talk to the bot</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isLoading ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                {isLoading ? "Speaking..." : started ? (isListening ? "Mic live" : "Waiting for you") : "Ready"}
              </div>
            </div>

              <div className="bg-gradient-to-r from-[#063324] to-[#0c4c37] text-white rounded-2xl p-5 flex flex-wrap gap-3 items-center justify-between shadow-lg shadow-[#063324]/20">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-white/70">Status</div>
                  <div className="font-semibold">{started ? (isListening ? "Listening..." : "Say something or type") : "Tap start to begin"}</div>
                </div>
                <div className="flex gap-3">
                {!started && (
                  <button
                    onClick={beginJourney}
                    className="px-4 py-2 rounded-full bg-white text-[#063324] font-bold hover:scale-105 transition"
                  >
                    Begin journey
                  </button>
                )}
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={!started}
                  className={`px-4 py-2 rounded-full font-bold border border-white/50 ${isListening ? "bg-white/20 text-white" : "bg-white text-[#063324]"}`}
                >
                  {isListening ? "Stop listening" : "Speak"}
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="space-y-4 max-h-[360px] overflow-y-auto pr-2 bg-[#F8FBF9] border border-[#063324]/10 rounded-2xl p-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#063324] text-white rounded-br-none"
                        : "bg-white text-[#063324] border border-[#063324]/10 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!started || isLoading}
                  placeholder={started ? "Type or dictate your answer" : "Tap start first"}
                  className="flex-1 px-4 py-3 rounded-2xl border border-[#063324]/15 bg-white focus:outline-none focus:ring-2 focus:ring-[#063324]/30 disabled:bg-gray-100 disabled:text-gray-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!started || isLoading}
                  className="px-4 py-3 rounded-2xl bg-[#063324] text-white font-semibold hover:translate-y-[-1px] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>

            {finished && recommendations.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-sm font-semibold text-[#063324]/70 uppercase tracking-[0.2em]">Recommendations</div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {recommendations.map((rec) => (
                    <div key={rec.title} className="border border-[#063324]/10 rounded-2xl p-3 bg-white shadow-sm">
                      <div className="font-bold text-[#063324]">{rec.title}</div>
                      <div className="text-sm text-[#063324]/70">{rec.summary}</div>
                      <div className="text-sm font-semibold text-[#063324] mt-1">{rec.price}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-[#063324] text-white py-3 rounded-2xl font-bold hover:translate-y-[-1px] transition-transform">
                  Call a representative
                </button>
              </div>
            )}

            {error && (
              <div className="text-red-600 bg-red-50 border border-red-100 rounded-2xl p-3 text-sm">
                {error}
              </div>
            )}

            {audioUrl && (
              <div className="flex items-center gap-3 bg-[#063324]/5 border border-[#063324]/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-full bg-[#063324] text-white flex items-center justify-center font-bold">▶</div>
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#063324]/10 space-y-3">
              <div className="text-sm font-semibold text-[#063324]/70 uppercase tracking-[0.2em]">Helpful prompts</div>
              <div className="text-sm text-[#063324]/80 space-y-2">
                <p>“I need an en-suite near campus, budget $800.”</p>
                <p>“Moving in next month, quiet area, bills included.”</p>
                <p>“Studio preferred, but open to shared if close to uni.”</p>
              </div>
            </div>

            <div className="bg-[#063324] text-white rounded-3xl p-6 shadow-md border border-[#063324]/20 space-y-3">
              <div className="text-sm uppercase tracking-[0.2em] font-semibold text-white/70">How it works</div>
              <ul className="space-y-2 text-base leading-relaxed text-white/90">
                <li>1. Tap “Begin journey”, then press “Speak”.</li>
                <li>2. Your voice is transcribed, sent, and echoed back with a follow-up.</li>
                <li>3. Audio is generated via ElevenLabs using your API key/model.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero = ({ onBeginJourney }: { onBeginJourney: () => void }) => (
  <header className="relative w-full min-h-screen pt-32 pb-20 bg-[#063324] text-white overflow-hidden flex flex-col items-center">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
      
      {/* Left Content */}
      <div className="space-y-8 z-10">
        <h1 className="text-6xl md:text-[5.5rem] font-bold leading-[1.1] tracking-tight">
          The home of <br/>
          student living.
        </h1>
        <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
          Find your next off-campus rental, find and fill a room, redeem student rewards and get more from student life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-[#D2E6DE] text-[#063324] px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors">
                Download the app
            </button>
            <button
              onClick={onBeginJourney}
              className="bg-white/15 backdrop-blur text-white px-8 py-4 rounded-full font-bold text-lg border border-white/30 hover:bg-white/25 transition-colors flex items-center gap-2"
            >
              Begin your journey
              <ArrowRight size={18} />
            </button>
        </div>

        <div className="flex items-center gap-4 pt-8 opacity-80">
            <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" width={120} height={40} className="h-10 w-auto" />
            <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" width={135} height={40} className="h-10 w-auto" />
        </div>
      </div>

      {/* Right Content - Phone Mockups */}
      <div className="relative h-[600px] w-full flex justify-center items-center">
        {/* Background Decorative Circle */}
        <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
        
        {/* Phones */}
        <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
            className="absolute z-10 -right-12 md:right-20 top-0 rotate-[-12deg]"
        >
            <PhoneMockup />
        </motion.div>
        <motion.div 
             initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute z-20 right-20 md:right-60 top-20 rotate-[6deg]"
        >
             <PhoneMockup type="light" />
        </motion.div>
      </div>
    </div>
  </header>
);

const FeaturesSection = () => {
    const [activeTab, setActiveTab] = useState("Find properties");

    // Dynamic Content Renderer
    const renderContent = () => {
        switch(activeTab) {
            case "Book viewings":
                return (
                    <PhoneMockup type="light">
                        <div className="bg-[#F0F7F4] h-full pt-12 px-4 font-sans">
                            <h3 className="text-xl font-bold text-[#063324] mb-4 flex items-center gap-2"><Calendar size={20}/> My Viewings</h3>
                            <div className="space-y-3">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-[#063324]">The Quad</span>
                                        <span className="text-xs bg-[#D2E6DE] text-[#063324] px-2 py-1 rounded-full font-bold">Upcoming</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <Clock size={14}/> Today, 2:00 PM
                                    </div>
                                    <button className="w-full py-2 rounded-xl bg-[#063324] text-white text-xs font-bold hover:bg-[#154D38] transition">Get Directions</button>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 opacity-60">
                                     <div className="flex justify-between mb-2">
                                        <span className="font-bold text-[#063324]">Oak House</span>
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold">Past</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock size={14}/> Yesterday
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h4 className="font-bold text-[#063324] mb-3 text-sm">Suggested Times</h4>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {["10:00 AM", "1:30 PM", "4:15 PM"].map(t => (
                                        <div key={t} className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap">{t}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </PhoneMockup>
                );
            case "Request lease":
                 return (
                    <PhoneMockup type="light">
                        <div className="bg-white h-full pt-12 px-6 flex flex-col relative font-sans">
                             <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-[#E8F5F1] rounded-full flex items-center justify-center mx-auto mb-4 text-[#063324]">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-[#063324]">Lease Ready</h3>
                                <p className="text-sm text-gray-400 mt-1">Review and sign your tenancy agreement for The Quad.</p>
                            </div>
                            
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={16}/></div>
                                    <div className="text-sm font-medium text-gray-600">Identity Verified</div>
                                </div>
                                 <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={16}/></div>
                                    <div className="text-sm font-medium text-gray-600">Guarantor Approved</div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-[#E8F5F1] rounded-xl border border-[#063324]/10 shadow-sm">
                                    <div className="bg-white p-2 rounded-full text-[#063324] animate-pulse"><FileText size={16}/></div>
                                    <div className="text-sm font-bold text-[#063324]">Sign Contract</div>
                                </div>
                            </div>

                            <button className="w-full bg-[#063324] text-white py-4 rounded-2xl font-bold text-lg mb-8 shadow-xl shadow-[#063324]/20 hover:scale-105 transition">
                                Tap to Sign
                            </button>
                        </div>
                    </PhoneMockup>
                 );
            case "Find or fill a room":
                return (
                     <PhoneMockup type="light">
                        <div className="bg-white h-full pt-10 font-sans">
                            <div className="px-4 mb-4 flex justify-between items-center">
                                <h3 className="font-bold text-[#063324] text-lg">Roommate Match</h3>
                                <div className="p-2 bg-gray-100 rounded-full"><Users size={16}/></div>
                            </div>
                            
                            {/* Card Stack Effect */}
                            <div className="relative px-4 pt-2">
                                <div className="absolute top-0 left-6 right-6 h-64 bg-gray-100 rounded-[2rem] transform scale-90 -translate-y-4"></div>
                                <div className="relative bg-white border border-gray-200 shadow-xl rounded-[2rem] overflow-hidden">
                                    <div className="h-48 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000')]">
                                        <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                            <div className="text-white">
                                                <h4 className="font-bold text-xl">Sarah, 21</h4>
                                                <p className="text-xs opacity-90">Psychology • Leeds Arts</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex gap-2 mb-3">
                                            <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-bold">Early Bird</span>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">Vegan</span>
                                        </div>
                                        <div className="flex gap-4 mt-2 justify-center">
                                            <button className="w-12 h-12 rounded-full border-2 border-red-200 text-red-400 flex items-center justify-center hover:bg-red-50 transition"><ArrowRight className="rotate-180" size={20}/></button>
                                            <button className="w-12 h-12 rounded-full bg-[#063324] text-white flex items-center justify-center shadow-lg hover:scale-110 transition"><Heart size={20}/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </PhoneMockup>
                );
            case "Redeem perks":
                return (
                     <PhoneMockup type="light">
                         <div className="bg-gray-50 h-full pt-12 px-4 overflow-y-auto no-scrollbar font-sans">
                            <h3 className="text-xl font-bold text-[#063324] mb-4 flex items-center gap-2"><Gift size={20}/> Student Perks</h3>
                            
                            <div className="grid grid-cols-2 gap-3 pb-20">
                                <div className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md transition">
                                    <div className="w-10 h-10 rounded-full bg-[#006241] text-white flex items-center justify-center"><Coffee size={18}/></div>
                                    <div className="text-xs font-bold text-gray-800">Starbucks</div>
                                    <div className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">20% OFF</div>
                                </div>
                                <div className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md transition">
                                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center"><span className="font-bold text-xs">UBER</span></div>
                                    <div className="text-xs font-bold text-gray-800">Uber Eats</div>
                                    <div className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Free Del</div>
                                </div>
                                <div className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md transition">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"><span className="font-bold text-xs">ASOS</span></div>
                                    <div className="text-xs font-bold text-gray-800">ASOS</div>
                                    <div className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">15% OFF</div>
                                </div>
                                <div className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md transition">
                                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center"><span className="font-bold text-xs">GYM</span></div>
                                    <div className="text-xs font-bold text-gray-800">PureGym</div>
                                    <div className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">£0 Join</div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-4 right-4 bg-[#063324] rounded-2xl p-4 text-white overflow-hidden shadow-lg">
                                <div className="relative z-10">
                                    <div className="text-xs opacity-70 mb-1">Your Points</div>
                                    <div className="text-3xl font-bold">2,450</div>
                                    <div className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded-lg">Level: Gold Student</div>
                                </div>
                                <Star className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24" fill="currentColor"/>
                            </div>
                         </div>
                     </PhoneMockup>
                );
            default: // Find properties
                return (
                     <PhoneMockup type="light">
                        {/* Default content handled inside component when children is null */}
                     </PhoneMockup>
                );
        }
    }
    
    return (
        <section className="bg-[#D2E6DE] py-24 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-5xl font-bold text-[#063324] mb-4">Housr features</h2>
                <p className="text-[#063324]/70 mb-12 text-lg">A great housing experience, plus plenty of extra benefits.</p>
                
                {/* Pill Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {["Find properties", "Book viewings", "Request lease", "Find or fill a room", "Redeem perks"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                                activeTab === tab 
                                ? "bg-white text-[#063324] shadow-md scale-105" 
                                : "bg-[#063324]/5 text-[#063324] hover:bg-[#063324]/10"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Feature Content */}
                <div className="bg-[#063324]/5 rounded-[3rem] p-8 md:p-16 flex flex-col items-center min-h-[700px] justify-center">
                    <div className="relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/20 blur-[60px] rounded-full"></div>
                        
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                        
                        {/* Only show tooltips for Find properties */}
                        {activeTab === "Find properties" && (
                            <>
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                                    className="absolute top-32 -left-24 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-[200px] text-left hidden md:flex"
                                >
                                    <div className="bg-green-100 p-2 rounded-full text-green-700"><CheckCircle2 size={20}/></div>
                                    <div>
                                        <div className="text-xs text-gray-500">Filters</div>
                                        <div className="font-bold text-[#063324] text-sm">Bills Included</div>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
                                    className="absolute bottom-40 -right-24 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-[200px] text-left hidden md:flex"
                                >
                                    <div className="bg-pink-100 p-2 rounded-full text-pink-600"><Heart size={20}/></div>
                                    <div>
                                        <div className="text-xs text-gray-500">Saved</div>
                                        <div className="font-bold text-[#063324] text-sm">Shortlist</div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => (
    <section className="bg-[#FAFAFA] py-24 px-6">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-[#063324] mb-16">What students say about us</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { name: "Aminata Koroma", color: "bg-orange-100 text-orange-600", emoji: "😊", text: "Very clear and easy to use. Shows houses that are cost efficient, close to uni and aesthetically pleasing." },
                    { name: "Brooke Wilson", color: "bg-blue-100 text-blue-600", emoji: "😍", text: "Staff are amazing. Made life really easy whilst being at uni! Would highly recommend. Stress free which is what we need." },
                    { name: "Alice Carter", color: "bg-green-100 text-green-600", emoji: "🤑", text: "Great company. Always happy to assist and deliver a brilliant service. Really good perks too!" },
                ].map((t, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between h-80">
                        <p className="text-gray-600 leading-relaxed text-lg">&ldquo;{t.text}&rdquo;</p>
                        <p className="text-gray-600 leading-relaxed text-lg">&quot;{t.text}&quot;</p>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-2xl`}>
                                {t.emoji}
                            </div>
                            <span className="font-bold text-[#063324]">{t.name}</span>
                        </div>
                    </div>
                ))}
            </div>
         </div>
    </section>
);

const Footer = () => (
    <footer className="bg-[#063324] text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 mb-20">
            <div className="col-span-2">
                <div className="text-3xl font-bold flex items-center gap-2 mb-6">
                    <div className="bg-white text-[#063324] p-1 rounded-md">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-8H3v8zm6-11V7l6-3 6 3v3h-2v10h-2v-6h-4v6H9v-10H7v-3h2z"/></svg>
                    </div>
                    housr
                </div>
                <p className="text-gray-400 max-w-sm">The home of student living. Download our app to get started today.</p>
            </div>
            
            <div>
                <h4 className="font-bold mb-6">Features</h4>
                <ul className="space-y-4 text-gray-400">
                    <li><a href="#" className="hover:text-white">Find properties</a></li>
                    <li><a href="#" className="hover:text-white">Book viewings</a></li>
                    <li><a href="#" className="hover:text-white">Bill splitting</a></li>
                </ul>
            </div>
             <div>
                <h4 className="font-bold mb-6">Company</h4>
                <ul className="space-y-4 text-gray-400">
                    <li><a href="#" className="hover:text-white">About us</a></li>
                    <li><a href="#" className="hover:text-white">Careers</a></li>
                    <li><a href="#" className="hover:text-white">Blog</a></li>
                </ul>
            </div>
             <div>
                <h4 className="font-bold mb-6">Contact</h4>
                <ul className="space-y-4 text-gray-400">
                    <li><a href="#" className="hover:text-white">Support</a></li>
                    <li><a href="#" className="hover:text-white">+1 (402) 782-5353</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-gray-500 text-sm">
            <p>© 2024 Housr Living. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
    </footer>
);

export default function LandingPage() {
  const [journeyAutoStart, setJourneyAutoStart] = useState(false);

  const handleBeginJourney = () => {
    setJourneyAutoStart(true);
    requestAnimationFrame(() => {
      const target = document.getElementById("journey-chat");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-[#063324] selection:text-white">
      <Navbar />
      <Hero onBeginJourney={handleBeginJourney} />
      <TTSConcierge autoStart={journeyAutoStart} />
      <FeaturesSection />
      <Testimonials />
      <Footer />
    </main>
  );
}
