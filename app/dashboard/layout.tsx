import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Mic, BarChart3, LogOut, LayoutDashboard, Zap, UserCircle } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F0F7F4]">
      {/* Brand Sidebar */}
      <aside className="w-72 bg-[#063324] text-white flex flex-col fixed h-full z-20 m-4 rounded-[2rem] shadow-2xl">
        <div className="p-8 pb-4">
          <Link href="/" className="text-3xl font-bold tracking-tight flex items-center gap-2 mb-1">
             <div className="bg-white text-[#063324] p-1 rounded-md">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-8H3v8zm6-11V7l6-3 6 3v3h-2v10h-2v-6h-4v6H9v-10H7v-3h2z"/></svg>
             </div>
             housr
          </Link>
          <p className="text-[#D2E6DE]/60 text-xs uppercase tracking-widest pl-1">Intelligence Hub</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          
          <div className="text-xs font-bold text-[#D2E6DE]/40 uppercase px-4 py-2 mt-6">AI Tools</div>
          
          <NavItem href="/dashboard/call-copilot" icon={<Zap size={20} />} label="Call Copilot" />
          <NavItem href="/dashboard/call-hub" icon={<Phone size={20} />} label="Call Intelligence" />
          <NavItem href="/dashboard/reply-engine" icon={<MessageSquare size={20} />} label="Match Engine" />
          <NavItem href="/dashboard/voice-coach" icon={<Mic size={20} />} label="Voice Coach" />
          <NavItem href="/dashboard/student-summary" icon={<UserCircle size={20} />} label="Student Summary" />
          
        </nav>

        <div className="p-6">
           <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl">
              <UserButton />
              <div className="text-sm font-medium text-[#D2E6DE]">Admin User</div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

const NavItem = ({ href, icon, label }: any) => (
  <Link href={href} className="group flex items-center gap-4 px-6 py-4 text-[#D2E6DE] hover:bg-white/10 hover:text-white rounded-2xl transition-all duration-300">
    <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
    <span className="font-semibold">{label}</span>
  </Link>
);
