"use client";

import { useState } from "react";
import EventMode from "@/components/card/EventMode";
import { ResumeData } from "@/types";

export default function DemoEventModePage() {
  const [showEventMode, setShowEventMode] = useState(true);

  const demoData: ResumeData = {
    name: "Sarah Johnson",
    title: "Product Designer",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary:
      "Passionate designer creating beautiful and functional user experiences. 5+ years in digital product design.",
    experience: [],
    education: [],
    skills: [],
  };

  if (!showEventMode) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <button
          onClick={() => setShowEventMode(true)}
          className="rounded-lg bg-blue-500 px-6 py-3 text-white font-semibold hover:bg-blue-600"
        >
          Show Event Mode
        </button>
      </div>
    );
  }

  return (
    <EventMode
      data={demoData}
      shareSlug="demo-sarah"
      shareUrl="https://voiceresume.app/card/demo-sarah"
      onClose={() => setShowEventMode(false)}
    />
  );
}
