export interface School {
  id: string;
  name: string;
  short_name: string;
  type: "university" | "college" | "company" | "organization";
  country: string;
  colors: { primary: string; secondary: string; text: string };
  logo_url?: string;
  domain?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  school_id?: string;
  school?: School;
  graduation_year?: number;
  is_graduated?: boolean;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: { email: string; phone: string; location: string };
  summary: string;
  experience: { company: string; role: string; period: string; bullets: string[] }[];
  education: { school: string; degree: string; year: string }[];
  skills: string[];
  languages: string[];
  links?: string;
  metric?: string;
}

export interface SavedResume {
  id: string;
  user_id: string;
  title: string;
  role_type: string;
  template_id: string;
  data: ResumeData;
  raw_answers?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  desc: string;
  tag: string;
  tagBg: string;
  tagTx: string;
  bg: string;
  layout: "single" | "skills" | "sidebar";
  accent: string;
}

export type BackgroundPattern = "dots" | "lines" | "diagonal" | "crosshatch" | "grid";
export type BackgroundStyle = "minimal" | "watermark" | "pattern";

export interface CardSticker {
  emoji: string;
  /** position as a fraction of card width/height (0–1) */
  x: number;
  y: number;
  /** size as a fraction of card width */
  size: number;
  /** rotation in degrees */
  rot: number;
}

export interface CardBackground {
  type: "preset" | "school" | "drawn" | "minimal" | "pattern";
  styleId?: string;
  schoolId?: string;
  colors?: { primary: string; secondary: string };
  watermark?: string;
  pattern?: BackgroundPattern;
  bgStyle?: BackgroundStyle;
  dataUrl?: string;
  color?: string;
  stickers?: CardSticker[];
}

export interface SavedCard {
  id: string;
  user_id: string;
  resume_id?: string;
  style_id: string;
  background_type: CardBackground["type"];
  background_data?: CardBackground;
  card_image_url?: string;
  vcf_url?: string;
  share_slug: string;
  view_count: number;
  created_at: string;
}

export interface InterviewQuestion {
  key: string;
  short: string;
  speak: string;
}

export interface Role {
  id: string;
  emoji: string;
  name: string;
  color: string;
  bg: string;
  desc: string;
  extras: InterviewQuestion[];
}
