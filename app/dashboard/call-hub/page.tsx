"use client";
import React from 'react';
import Link from 'next/link';
import { FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const mockCalls = [
  { id: 101, agent: "Sarah J.", customer: "Student (Leeds)", duration: "4:12", sentiment: "Positive", score: 92, status: "Analyzed" },
  { id: 102, agent: "Mike T.", customer: "Parent (London)", duration: "12:05", sentiment: "Negative", score: 45, status: "Attention Needed" },
  { id: 103, agent: "Sarah J.", customer: "Landlord (Bristol)", duration: "6:30", sentiment: "Neutral", score: 78, status: "Analyzed" },
];

export default function CallIntelligence() {
  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-[#063324] border border-[#063324] rounded-full hover:bg-[#063324] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-[#063324] mb-2">Call Intelligence Hub</h1>
        <p className="text-gray-500">AI-driven analysis of support & sales interactions.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Avg Sentiment Score</h3>
          <p className="text-3xl font-bold text-[#063324] mt-2">84.2<span className="text-sm text-gray-400 ml-2">/ 100</span></p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Critical Alerts</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">3<span className="text-sm text-gray-400 font-normal ml-2">Requires Review</span></p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Keyword Trend</h3>
          <p className="text-lg font-semibold text-[#063324] mt-3">&quot;Maintenance&quot; ↑ 12%</p>
        </div>
      </div>

      {/* Call List */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#F0F7F4] flex justify-between items-center">
          <h3 className="font-semibold text-[#063324]">Recent Transcripts</h3>
          <button className="text-sm text-[#063324] font-medium hover:opacity-70">View All History</button>
        </div>
        <div className="divide-y divide-gray-100">
          {mockCalls.map((call) => (
            <div key={call.id} className="p-6 flex items-center justify-between hover:bg-[#F0F7F4]/50 transition">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${call.sentiment === 'Negative' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {call.sentiment === 'Negative' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-[#063324]">{call.customer}</h4>
                  <p className="text-sm text-gray-500">Agent: {call.agent} • Duration: {call.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block text-xs font-semibold text-gray-400 uppercase">AI Score</span>
                  <span className={`font-bold ${call.score < 60 ? 'text-red-500' : 'text-[#063324]'}`}>{call.score}%</span>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#063324] text-white rounded-full text-sm hover:opacity-90 transition shadow-lg shadow-[#063324]/20">
                  <FileText size={16} /> View Transcript
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
