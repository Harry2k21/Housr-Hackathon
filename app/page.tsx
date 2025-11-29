"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, Heart, MapPin, Star, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <Link href="/dashboard">
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
const PhoneMockup = ({ type = "dark" }: { type?: "dark" | "light" }) => (
  <div className={`relative w-[280px] h-[580px] border-[8px] ${type === 'dark' ? 'border-gray-900 bg-gray-900' : 'border-white bg-white'} rounded-[3rem] shadow-2xl overflow-hidden`}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-20"></div>
    <div className="w-full h-full bg-white overflow-hidden relative">
        {/* Mock UI Header */}
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
    </div>
  </div>
);

const Hero = () => (
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
        </div>

        <div className="flex items-center gap-4 pt-8 opacity-80">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-10" />
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
                                ? "bg-white text-[#063324] shadow-md" 
                                : "bg-[#063324]/5 text-[#063324] hover:bg-[#063324]/10"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Feature Content */}
                <div className="bg-[#063324]/5 rounded-[3rem] p-8 md:p-16 flex flex-col items-center">
                    <div className="relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/20 blur-[60px] rounded-full"></div>
                        <PhoneMockup type="light" />
                        
                        {/* Floating Tooltips */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute top-32 -left-24 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-[200px] text-left"
                        >
                            <div className="bg-green-100 p-2 rounded-full text-green-700"><CheckCircle2 size={20}/></div>
                            <div>
                                <div className="text-xs text-gray-500">Filters</div>
                                <div className="font-bold text-[#063324] text-sm">Bills Included</div>
                            </div>
                        </motion.div>

                         <motion.div 
                            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute bottom-40 -right-24 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-[200px] text-left"
                        >
                            <div className="bg-pink-100 p-2 rounded-full text-pink-600"><Heart size={20}/></div>
                            <div>
                                <div className="text-xs text-gray-500">Saved</div>
                                <div className="font-bold text-[#063324] text-sm">Shortlist</div>
                            </div>
                        </motion.div>
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
                        <p className="text-gray-600 leading-relaxed text-lg">"{t.text}"</p>
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
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-[#063324] selection:text-white">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <Testimonials />
      <Footer />
    </main>
  );
}
