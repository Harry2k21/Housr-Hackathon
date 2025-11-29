"use client";
import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Send } from 'lucide-react';

export default function ReplyEngine() {
  const [inquiry, setInquiry] = useState("");
  const [response, setResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResponse(`Subject: Great news! We found the perfect Housr for you 🏡\n\nHi there,\n\nThanks for reaching out! Based on your request for a "quiet 1-bedroom near the University," I've found a perfect match.\n\n📍 The Quad, Oxford Road\n- 5 min walk to campus\n- 24/7 On-site Gym (Included)\n- Rent: £185pw (All bills included)\n\nThis unit is available for a September start. Would you like to book a virtual tour?\n\nBest,\nThe Housr Team`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#063324] mb-2">Housing Match AI</h1>
        <p className="text-gray-500">Generate perfect email replies based on live inventory.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
        {/* Input */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-[#063324] flex items-center gap-2">
            <Send size={18} className="text-[#063324]"/> Student Inquiry
          </h2>
          <textarea 
            className="flex-1 w-full bg-[#F0F7F4] border-0 rounded-3xl p-6 resize-none outline-none focus:ring-2 focus:ring-[#063324]/20 text-gray-700 placeholder-gray-400"
            placeholder="Paste email or chat message here..."
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
          />
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleGenerate}
              disabled={!inquiry || isGenerating}
              className="flex items-center gap-2 bg-[#063324] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-[#063324]/20"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Generate Match
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 bg-[#063324] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col">
           {/* Decorative blurred blob */}
          <div className="absolute top-0 right-0 p-40 bg-[#D2E6DE] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6 z-10">
            <h2 className="font-bold text-lg flex items-center gap-2 text-[#D2E6DE]">
              <Sparkles size={18} /> AI Suggested Reply
            </h2>
            {response && (
              <button className="text-xs text-[#D2E6DE]/70 hover:text-white flex items-center gap-1 font-semibold uppercase tracking-wider">
                <Copy size={14} /> Copy
              </button>
            )}
          </div>

          <div className="flex-1 bg-white/5 rounded-3xl p-8 border border-white/10 font-mono text-sm leading-relaxed whitespace-pre-wrap backdrop-blur-sm">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-white/50 gap-4">
                <div className="w-8 h-8 border-4 border-[#D2E6DE] border-t-transparent rounded-full animate-spin"></div>
                <p>Scanning 44,000 properties...</p>
              </div>
            ) : response ? (
              response
            ) : (
              <span className="text-white/30 italic">AI output will appear here.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
