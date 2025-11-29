import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Mic, ArrowRight } from 'lucide-react';

export default function DashboardOverview() {
  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-[#063324] mb-2">Welcome to Housr Intelligence Hub</h1>
        <p className="text-gray-500 text-lg">Your AI-powered admin panel for managing student housing operations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          href="/dashboard/call-hub"
          icon={<Phone size={24} />}
          title="Call Intelligence Hub"
          description="Analyze customer calls for sentiment and trends."
          color="bg-blue-50 text-blue-600"
        />

        <FeatureCard
          href="/dashboard/reply-engine"
          icon={<MessageSquare size={24} />}
          title="Housing Match AI"
          description="Generate AI-powered email replies for student inquiries."
          color="bg-green-50 text-green-600"
        />

        <FeatureCard
          href="/dashboard/voice-coach"
          icon={<Mic size={24} />}
          title="HR Voice Coach"
          description="Real-time voice training for HR staff."
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Quick Stats */}
      <div className="mt-12 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-[#063324] mb-6">Today's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#063324] mb-1">127</div>
            <div className="text-sm text-gray-500">Calls Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#063324] mb-1">89</div>
            <div className="text-sm text-gray-500">AI Replies Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#063324] mb-1">24</div>
            <div className="text-sm text-gray-500">Voice Training Sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ href, icon, title, description, color }: any) => (
  <Link href={href}>
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-[#063324]">{title}</h3>
      <p className="text-gray-500 mb-6 flex-1">{description}</p>
      <div className="flex items-center gap-2 text-[#063324] font-semibold group-hover:gap-4 transition-all">
        View Details <ArrowRight size={18} />
      </div>
    </div>
  </Link>
);
