"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, Square, TrendingUp, Heart, Zap, ArrowLeft } from 'lucide-react';

export default function VoiceCoach() {
  const [isRecording, setIsRecording] = useState(false);
  const [metrics, setMetrics] = useState({ empathy: 50, pace: 50, clarity: 50 });

  // Simulate real-time analysis updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setMetrics({
          empathy: Math.min(100, Math.max(0, metrics.empathy + (Math.random() * 20 - 10))),
          pace: Math.min(100, Math.max(0, metrics.pace + (Math.random() * 20 - 10))),
          clarity: Math.min(100, Math.max(0, metrics.clarity + (Math.random() * 10 - 5))),
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isRecording, metrics]);

  return (
    <div className="max-w-4xl mx-auto text-center">
      <header className="mb-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-[#063324] border border-[#063324] rounded-full hover:bg-[#063324] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-[#063324] mb-2">HR Voice Training Coach</h1>
        <p className="text-gray-500">Real-time feedback on tone, empathy, and clarity during roleplay.</p>
      </header>

      {/* Main Recording Interface */}
      <div className="bg-white rounded-[3rem] shadow-xl p-12 border border-gray-100 relative overflow-hidden">
        {/* Animated Audio Wave Simulation */}
        <div className="h-32 flex items-center justify-center gap-1 mb-8">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className={`w-3 bg-[#063324] rounded-full transition-all duration-150 ${isRecording ? 'animate-pulse' : 'h-2 bg-gray-200'}`}
              style={{ 
                height: isRecording ? `${Math.random() * 100}%` : '8px', 
                opacity: isRecording ? 1 : 0.3 
              }}
            />
          ))}
        </div>

        <div className="flex justify-center mb-12">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 ${
              isRecording 
              ? 'bg-red-500 shadow-red-200' 
              : 'bg-[#063324] shadow-[#063324]/20'
            }`}
          >
            {isRecording ? (
              <Square className="text-white fill-current" size={32} />
            ) : (
              <Mic className="text-white" size={32} />
            )}
          </button>
        </div>

        {/* Real-time Metrics Dashboard */}
        <div className="grid grid-cols-3 gap-8">
          <MetricCard 
            icon={<Heart className="text-pink-500" />} 
            label="Empathy Score" 
            value={metrics.empathy} 
            color="bg-pink-500" 
          />
          <MetricCard 
            icon={<Zap className="text-yellow-500" />} 
            label="Speaking Pace" 
            value={metrics.pace} 
            color="bg-yellow-500" 
            hint="Target: 140wpm" 
          />
          <MetricCard 
            icon={<TrendingUp className="text-blue-500" />} 
            label="Clarity" 
            value={metrics.clarity} 
            color="bg-blue-500" 
          />
        </div>

        {isRecording && (
          <div className="mt-8 p-4 bg-[#F0F7F4] rounded-2xl border border-[#063324]/10 inline-block animate-fade-in">
            <p className="text-sm font-semibold text-[#063324]">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping" />
              AI Listening: &quot;Great handling of the objection regarding deposit returns...&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Component for Metrics
const MetricCard = ({ icon, label, value, color, hint }: any) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center gap-2 mb-2 text-gray-600 font-medium">
      {icon}
      {label}
    </div>
    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${value}%` }}
      />
    </div>
    <div className="mt-2 text-2xl font-bold text-[#063324]">{Math.round(value)}</div>
    {hint && <span className="text-xs text-gray-400">{hint}</span>}
  </div>
);
