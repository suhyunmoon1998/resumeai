import EventMode from "@/components/card/EventMode";
import { ResumeData } from "@/types";

export default function DemoEventModePage() {
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

  return (
    <EventMode
      data={demoData}
      shareSlug="demo-sarah"
      shareUrl="https://voiceresume.app/card/demo-sarah"
      onClose={() => (window.location.href = "/")}
    />
  );
}
