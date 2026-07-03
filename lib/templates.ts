import { ResumeTemplate } from "@/types";

export const TEMPLATES: ResumeTemplate[] = [
  { id: "ats_clean", name: "ATS Clean", desc: "Single-col, zero-risk ATS. Corporate & finance.", tag: "⭐ ATS #1", tagBg: "#F0FDF4", tagTx: "#15803D", bg: "#1E3A5F", layout: "single", accent: "#1E3A5F" },
  { id: "ats_teal", name: "ATS Teal", desc: "Single-col teal. Tech & healthcare ready.", tag: "⭐ ATS Safe", tagBg: "#F0FDFA", tagTx: "#0F766E", bg: "#0F766E", layout: "single", accent: "#0F766E" },
  { id: "ats_slate", name: "ATS Slate", desc: "Single-col slate. Consulting & legal.", tag: "⭐ ATS Safe", tagBg: "#F8FAFC", tagTx: "#475569", bg: "#334155", layout: "single", accent: "#334155" },
  { id: "skills_first", name: "Skills First", desc: "Skills at top. Beats ATS keyword scan.", tag: "🔥 Trending", tagBg: "#FFF7ED", tagTx: "#C2410C", bg: "#EA580C", layout: "skills", accent: "#EA580C" },
  { id: "skills_purple", name: "Skills Purple", desc: "Skills-first purple. Devs & designers.", tag: "🔥 Trending", tagBg: "#FAF5FF", tagTx: "#7C3AED", bg: "#7C3AED", layout: "skills", accent: "#7C3AED" },
  { id: "sidebar_navy", name: "Sidebar Navy", desc: "Two-col navy sidebar. Creative & design.", tag: "Creative", tagBg: "#EFF6FF", tagTx: "#1E40AF", bg: "#1E3A8A", layout: "sidebar", accent: "#1E3A8A" },
  { id: "sidebar_mint", name: "Sidebar Mint", desc: "Two-col mint. Media, PR & marketing.", tag: "Creative", tagBg: "#F0FDFA", tagTx: "#0F766E", bg: "#0D9488", layout: "sidebar", accent: "#0D9488" },
  { id: "classic", name: "Classic", desc: "Timeless black & white. Works everywhere.", tag: "Classic", tagBg: "#F9FAFB", tagTx: "#374151", bg: "#111111", layout: "single", accent: "#111111" },
  { id: "executive", name: "Executive", desc: "Deep navy. C-suite & directors.", tag: "Executive", tagBg: "#EFF6FF", tagTx: "#1E40AF", bg: "#1E3A8A", layout: "single", accent: "#1E3A8A" },
  { id: "fresh", name: "Fresh", desc: "Bright & approachable. Grads & career changers.", tag: "Entry-level", tagBg: "#F0FDFA", tagTx: "#0F766E", bg: "#059669", layout: "single", accent: "#059669" },
];

export interface CardStyle {
  id: string;
  name: string;
  bg: string;
  tx: string;
  deco: string;
}

export const CARD_STYLES: CardStyle[] = [
  { id: "c1", name: "Classic Black", bg: "#111111", tx: "#fff", deco: "#ffffff" },
  { id: "c2", name: "Navy", bg: "#1E3A8A", tx: "#fff", deco: "#3B82F6" },
  { id: "c3", name: "Forest", bg: "#14532D", tx: "#fff", deco: "#22C55E" },
  { id: "c4", name: "Parchment", bg: "#FDF6E3", tx: "#2C1810", deco: "#C4A882" },
  { id: "c5", name: "Amethyst", bg: "#2E1065", tx: "#fff", deco: "#A855F7" },
  { id: "c6", name: "Terracotta", bg: "#C2410C", tx: "#fff", deco: "#FB923C" },
];

export function getTemplate(id: string): ResumeTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export function getCardStyle(id: string): CardStyle {
  return CARD_STYLES.find((c) => c.id === id) ?? CARD_STYLES[0];
}
