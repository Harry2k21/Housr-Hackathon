"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, Play, Pause, CheckCircle, AlertTriangle, Mail, Volume2, Download, RotateCcw, ArrowLeft, RefreshCw } from 'lucide-react';

// Sample call data
const SAMPLE_CALLS = [
  {
    id: 1,
    title: "Student Inquiry - Manchester Area",
    duration: "3:45",
    language: "English",
    preview: "Hi, I'm looking for a room near Manchester University...",
    audio_url: "/sample-calls/manchester-inquiry.mp3"
  },
  {
    id: 2,
    title: "Budget Concern - London",
    duration: "5:12", 
    language: "Hindi/English",
    preview: "Main London mein room dhund raha hun, budget around £150 per week...",
    audio_url: "/sample-calls/london-budget.mp3"
  },
  {
    id: 3,
    title: "Safety Questions - Birmingham",
    duration: "4:28",
    language: "English",
    preview: "I'm concerned about safety in the area, are there security measures...",
    audio_url: "/sample-calls/birmingham-safety.mp3"
  }
];

const MOCK_PROPERTIES = [
  {
    name: "The Quad Manchester",
    price: "£165/week",
    distance: "5 min walk to campus",
    features: ["All bills included", "24/7 security", "Study rooms"],
    reason: "Matches budget and location preference"
  },
  {
    name: "Student Village Central",
    price: "£158/week", 
    distance: "10 min to University",
    features: ["Gym included", "Social spaces", "Maintenance team"],
    reason: "Great value with excellent facilities"
  }
];

export default function CallCopilot() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const [generatedReply, setGeneratedReply] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const handleCallSelect = (call: any) => {
    setSelectedCall(call);
    setCurrentStep(2);
  };

  const handleTranscribe = async () => {
    if (!selectedCall) return;
    
    setIsTranscribing(true);
    
    try {
      const response = await fetch('/api/call-copilot/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ callId: selectedCall.id }),
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.status}`);
      }

      const data = await response.json();
      
      setTranscriptData({
        transcript: data.transcript,
        language: data.language,
        confidence: data.confidence,
        extracted_info: data.extracted_info
      });
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Transcription failed. Please try another call or check your internet connection.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleRiskCheck = () => {
    setTimeout(() => {
      setRiskAnalysis({
        risk_level: "Low",
        checks: {
          deposit_mentioned: true,
          bills_clarified: true,
          over_promises: false
        },
        flags: [],
        notes: "All key policies were properly explained. No compliance issues detected."
      });
      setCurrentStep(4);
    }, 1500);
  };

  const handleGenerateReply = async () => {
    if (!transcriptData) return;
    
    setIsGeneratingReply(true);
    
    try {
      // Generate email content (keeping existing logic)
      const emailContent = {
        subject: `Perfect rooms near ${transcriptData.extracted_info.location} - ${transcriptData.extracted_info.budget} range`,
        body: `Hi there!

Thanks for your call today - I'm excited to help you find your perfect student home near ${transcriptData.extracted_info.location}!

Based on what you mentioned (${transcriptData.extracted_info.budget} budget, ${transcriptData.extracted_info.move_in_date} move-in, focus on ${transcriptData.extracted_info.key_concerns.join(' and ')}), I've found two great options:

🏠 **The Quad Manchester** - £165/week
• 5-minute walk to campus
• All bills included (no surprises!)
• 24/7 security with key card access
• Study rooms and social spaces

🏠 **Student Village Central** - £158/week  
• 10 minutes to University
• Bills included + gym access
• On-site maintenance team
• Great community feel

Both properties have excellent safety records and transparent pricing. Would you like to book a viewing this week? I can arrange virtual or in-person tours.

Best regards,
The Housr Team

P.S. I've also attached a quick voice message with more details!`
      };

      // Generate voice note text
      const voiceNoteText = `Hi! Just wanted to personally follow up on our chat. I found those two perfect properties for you - The Quad is super close to campus with great security, and Student Village has amazing facilities. Both are in your budget with bills included. Let me know if you'd like to see them this week!`;

      setGeneratedReply({
        email: emailContent,
        voice_note_text: voiceNoteText,
        properties: MOCK_PROPERTIES,
        voice_url: null // Will be generated when user clicks play
      });
      
      setCurrentStep(4);
      
    } catch (error) {
      console.error('Reply generation error:', error);
      alert('Failed to generate reply. Please try again.');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleGenerateVoice = async () => {
    if (!generatedReply?.voice_note_text) return;
    
    setIsGeneratingVoice(true);
    setVoiceError(null);
    
    try {
      const response = await fetch('/api/call-copilot/generate-voice-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: generatedReply.voice_note_text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Voice generation failed' }));
        throw new Error(errorData.error || 'Voice generation failed');
      }

      // Convert response to blob and create object URL
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      // Update the reply with the voice URL
      setGeneratedReply((prev: any) => ({
        ...prev,
        voice_url: url
      }));

    } catch (error) {
      console.error('Voice generation error:', error);
      setVoiceError(error instanceof Error ? error.message : 'Voice generation failed');
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setSelectedCall(null);
    setTranscriptData(null);
    setRiskAnalysis(null);
    setGeneratedReply(null);
    setVoiceError(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#063324] mb-2">Call → Insight → Reply Copilot</h1>
            <p className="text-gray-500">Transform student calls into smart summaries and personalized replies</p>
          </div>
          {currentStep > 1 && (
            <button 
              onClick={resetWorkflow}
              className="flex items-center gap-2 px-4 py-2 text-[#063324] border border-[#063324] rounded-full hover:bg-[#063324] hover:text-white transition-colors"
            >
              <RotateCcw size={16} />
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          {[
            { step: 1, label: "Upload Call", icon: Upload },
            { step: 2, label: "Transcribe & Extract", icon: Play },
            { step: 3, label: "Risk Check", icon: AlertTriangle },
            { step: 4, label: "Generate Reply", icon: Mail }
          ].map(({ step, label, icon: Icon }, idx) => (
            <div key={step} className="flex items-center gap-4">
              <div className={`flex flex-col items-center gap-2 ${currentStep >= step ? 'text-[#063324]' : 'text-gray-300'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-[#063324] text-white' : 'bg-gray-100'
                }`}>
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
              {idx < 3 && (
                <div className={`w-16 h-0.5 ${currentStep > step ? 'bg-[#063324]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Upload/Select Call */}
      {currentStep === 1 && (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-[#063324] mb-6">Select a Sample Call</h2>
          <div className="grid gap-4">
            {SAMPLE_CALLS.map((call) => (
              <div 
                key={call.id}
                onClick={() => handleCallSelect(call)}
                className="border border-gray-200 rounded-2xl p-6 hover:border-[#063324] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#063324] group-hover:text-[#154D38] mb-2">{call.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">&quot;{call.preview}&quot;</p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>Duration: {call.duration}</span>
                      <span>Language: {call.language}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#063324] group-hover:bg-[#154D38] text-white flex items-center justify-center">
                    <Play size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Transcribe & Extract */}
      {currentStep === 2 && selectedCall && (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-[#063324] mb-6">Transcribe & Extract Information</h2>
          
          <div className="bg-[#F0F7F4] rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#063324] mb-2">Selected Call: {selectedCall.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Duration: {selectedCall.duration}</span>
              <span>Language: {selectedCall.language}</span>
            </div>
          </div>

          {!isTranscribing && !transcriptData && (
            <div className="text-center py-12">
              <button 
                onClick={handleTranscribe}
                className="flex items-center gap-2 bg-[#063324] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition mx-auto shadow-lg shadow-[#063324]/20"
              >
                <Play size={20} />
                Start Transcription
              </button>
            </div>
          )}

          {isTranscribing && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#063324] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Processing with ElevenLabs Speech-to-Text...</p>
            </div>
          )}

          {transcriptData && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#063324] mb-4">Transcript</h3>
                <div className="bg-gray-50 rounded-2xl p-6 border">
                  <p className="text-gray-700 leading-relaxed">{transcriptData.transcript}</p>
                  <div className="mt-4 flex gap-4 text-xs text-gray-500">
                    <span>Language: {transcriptData.language}</span>
                    <span>Confidence: {(transcriptData.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#063324] mb-4">Extracted Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Budget</h4>
                    <p className="text-blue-700">{transcriptData.extracted_info.budget}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Location</h4>
                    <p className="text-green-700">{transcriptData.extracted_info.location}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Move-in Date</h4>
                    <p className="text-purple-700">{transcriptData.extracted_info.move_in_date}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">Key Concerns</h4>
                    <div className="space-y-1">
                      {transcriptData.extracted_info.key_concerns.map((concern: string, idx: number) => (
                        <div key={idx} className="text-orange-700 text-sm">• {concern}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={handleRiskCheck}
                  className="flex items-center gap-2 bg-[#063324] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition mx-auto shadow-lg shadow-[#063324]/20"
                >
                  Next: Risk Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Risk Check */}
      {currentStep === 3 && riskAnalysis && (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-[#063324] mb-6">Policy & Promise Check</h2>
          
          <div className={`text-center mb-6 p-6 rounded-2xl ${
            riskAnalysis.risk_level === 'Low' ? 'bg-green-50' : 
            riskAnalysis.risk_level === 'Medium' ? 'bg-yellow-50' : 'bg-red-50'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              riskAnalysis.risk_level === 'Low' ? 'bg-green-100 text-green-600' : 
              riskAnalysis.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
            }`}>
              {riskAnalysis.risk_level === 'Low' ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
            </div>
            <h3 className={`text-2xl font-bold ${
              riskAnalysis.risk_level === 'Low' ? 'text-green-800' : 
              riskAnalysis.risk_level === 'Medium' ? 'text-yellow-800' : 'text-red-800'
            }`}>
              {riskAnalysis.risk_level} Risk
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              riskAnalysis.checks.deposit_mentioned ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <CheckCircle className={riskAnalysis.checks.deposit_mentioned ? 'text-green-600' : 'text-red-600'} size={20} />
              <span className={`font-semibold ${riskAnalysis.checks.deposit_mentioned ? 'text-green-800' : 'text-red-800'}`}>
                Deposit {riskAnalysis.checks.deposit_mentioned ? 'Mentioned' : 'Not Mentioned'}
              </span>
            </div>
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              riskAnalysis.checks.bills_clarified ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <CheckCircle className={riskAnalysis.checks.bills_clarified ? 'text-green-600' : 'text-red-600'} size={20} />
              <span className={`font-semibold ${riskAnalysis.checks.bills_clarified ? 'text-green-800' : 'text-red-800'}`}>
                Bills {riskAnalysis.checks.bills_clarified ? 'Clarified' : 'Not Clarified'}
              </span>
            </div>
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              !riskAnalysis.checks.over_promises ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <CheckCircle className={!riskAnalysis.checks.over_promises ? 'text-green-600' : 'text-red-600'} size={20} />
              <span className={`font-semibold ${!riskAnalysis.checks.over_promises ? 'text-green-800' : 'text-red-800'}`}>
                No Over-promises
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700">{riskAnalysis.notes}</p>
          </div>

          <div className="text-center">
            <button 
              onClick={handleGenerateReply}
              className="flex items-center gap-2 bg-[#063324] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition mx-auto shadow-lg shadow-[#063324]/20"
            >
              Generate Reply
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Generate Reply */}
      {currentStep === 4 && generatedReply && (
        <div className="space-y-6">
          {/* Email Reply */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-[#063324] mb-6">Generated Email Reply</h2>
            
            <div className="bg-gray-50 rounded-2xl p-6 border">
              <div className="mb-4">
                <strong className="text-[#063324]">Subject:</strong> {generatedReply.email.subject}
              </div>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {generatedReply.email.body}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#063324] text-white rounded-full hover:opacity-90 transition">
                <Mail size={16} />
                Send Email
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition">
                <Download size={16} />
                Copy Text
              </button>
            </div>
          </div>

          {/* Voice Note */}
          <div className="bg-[#063324] text-white rounded-[2rem] p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">AI Voice Note (ElevenLabs)</h2>
            
            <div className="bg-white/10 rounded-2xl p-6 mb-6">
              <p className="text-white/90 leading-relaxed">&quot;{generatedReply.voice_note_text}&quot;</p>
            </div>

            {voiceError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
                <p className="text-red-200 text-sm">{voiceError}</p>
              </div>
            )}

            {!generatedReply.voice_url ? (
              <div className="text-center">
                <button 
                  onClick={handleGenerateVoice}
                  disabled={isGeneratingVoice}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
                >
                  {isGeneratingVoice ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      Generating Voice...
                    </>
                  ) : (
                    <>
                      <Volume2 size={20} />
                      Generate Voice Note
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <audio 
                  controls 
                  src={generatedReply.voice_url}
                  className="w-full bg-white/10 rounded-xl"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  Your browser does not support the audio element.
                </audio>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span>✅ Generated with ElevenLabs TTS</span>
                  <button 
                    onClick={handleGenerateVoice}
                    className="text-white/90 hover:text-white underline"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Properties */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-[#063324] mb-6">Recommended Properties</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {generatedReply.properties.map((property: any, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-[#063324] text-lg">{property.name}</h3>
                    <span className="text-2xl font-bold text-[#063324]">{property.price}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{property.distance}</p>
                  <div className="space-y-2 mb-4">
                    {property.features.map((feature: string, fidx: number) => (
                      <div key={fidx} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#F0F7F4] rounded-xl p-3">
                    <p className="text-sm text-[#063324] font-medium">Why this fits: {property.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}