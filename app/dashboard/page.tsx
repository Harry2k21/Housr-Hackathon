"use client";

import Link from "next/link";
import { Sparkles, Mic2, ListTree, Users } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#063324] mb-2">
          Housr AI Hub
        </h1>
        <p className="text-gray-500 text-sm">
          Jump into the tools your team uses every day – reply engine, voice
          coach, student summary, and lead timeline.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Reply engine */}
        <Link
          href="/dashboard/reply-engine"
          className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#063324]/20 transition flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-2xl bg-[#063324] text-white flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-[#063324]">
                Reply engine (email + voice)
              </h2>
              <p className="text-xs text-gray-500">
                Turn messy inquiries into on-brand housing recommendation emails.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Paste student messages, generate replies, and create WhatsApp-ready
            voice notes.
          </p>
        </Link>

        {/* Voice coach */}
        <Link
          href="/dashboard/voice-coach"
          className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#063324]/20 transition flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-2xl bg-[#F0F7F4] text-[#063324] flex items-center justify-center">
              <Mic2 size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-[#063324]">Voice coach</h2>
              <p className="text-xs text-gray-500">
                Practice scripts and tone of voice for calls and WhatsApp chats.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Use this to train new staff on how Housr sounds before they speak to
            real students.
          </p>
        </Link>

        {/* Lead timeline – placed after Voice coach (i.e. below it in order) */}
        <Link
          href="/dashboard/lead-timeline"
          className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#063324]/20 transition flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-2xl bg-[#E3EFE9] text-[#063324] flex items-center justify-center">
              <ListTree size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-[#063324]">
                Lead timeline (interaction history)
              </h2>
              <p className="text-xs text-gray-500">
                See a simple chronological log of everything that’s happened
                with a student.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Great for handovers and when leads bounce between team members. Add
            notes for calls, viewings, and decisions.
          </p>
        </Link>

        {/* Student summary page */}
        <Link
          href="/dashboard/student-summary"
          className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#063324]/20 transition flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-2xl bg-[#F5F1FF] text-[#063324] flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-[#063324]">
                Student summary & reply
              </h2>
              <p className="text-xs text-gray-500">
                Compact profile card + AI reply builder + voice note in one
                place.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Fill in budget, areas and vibe, then generate emails that are
            personalised but consistent.
          </p>
        </Link>
      </div>
    </div>
  );
}
