import { InterviewQuestion, Role } from "@/types";

export const BASE_QS: InterviewQuestion[] = [
  { key: "name", short: "What's your\nfull name?", speak: "What's your full name?" },
  { key: "title", short: "What's your\njob title?", speak: "What's your current job title, or the role you're targeting?" },
  { key: "contact", short: "Email &\nphone?", speak: "What's your email address and phone number?" },
  { key: "summary", short: "Tell me about\nyourself.", speak: "Tell me about yourself — your experience level and what you specialise in." },
  { key: "exp1", short: "Most recent\njob?", speak: "Describe your most recent job — company, role, duration, and key responsibilities." },
  { key: "exp2", short: "Previous\nexperience?", speak: "Any previous work experience? If not, say no." },
  { key: "edu", short: "Education\nbackground?", speak: "Your educational background — school, degree, and graduation year?" },
  { key: "skills", short: "Skills &\ntools?", speak: "What skills, tools, or certifications do you have?" },
  { key: "langs", short: "Languages\nyou speak?", speak: "What languages do you speak and at what level?" },
  { key: "links", short: "Links &\nportfolio?", speak: "Do you have a LinkedIn, GitHub, or portfolio link to include?" },
  { key: "metric", short: "A result you're\nproud of?", speak: "Share a specific result you're proud of — a number, percentage, or impact." },
];

export const ROLES: Role[] = [
  {
    id: "dev", emoji: "🧑‍💻", name: "Developer", color: "#2563EB", bg: "#EFF6FF", desc: "Software, web, mobile, data",
    extras: [
      { key: "github", short: "GitHub or\nportfolio?", speak: "Do you have a GitHub profile or portfolio? What are you most proud of?" },
      { key: "projects", short: "Side projects?", speak: "Any personal or open source projects you'd like to highlight?" },
      { key: "awards", short: "Hackathons or\nawards?", speak: "Won any hackathons, competitions, or tech awards?" },
    ],
  },
  {
    id: "designer", emoji: "🎨", name: "Designer", color: "#7C3AED", bg: "#FAF5FF", desc: "UX, UI, graphic, product",
    extras: [
      { key: "portfolio", short: "Portfolio\nlink?", speak: "Do you have a portfolio or Behance profile?" },
      { key: "tools", short: "Design tools?", speak: "Which design tools do you use? Figma, Sketch, Adobe, or others?" },
      { key: "awards", short: "Design awards?", speak: "Won any design awards or been featured in shows?" },
    ],
  },
  {
    id: "marketer", emoji: "📣", name: "Marketer", color: "#EA580C", bg: "#FFF7ED", desc: "Growth, brand, content, ads",
    extras: [
      { key: "campaigns", short: "Best campaign?", speak: "Tell me about your most successful marketing campaign." },
      { key: "channels", short: "Channels &\ntools?", speak: "Which marketing channels and tools do you specialise in?" },
      { key: "awards", short: "Awards or\nrecognition?", speak: "Any marketing awards or notable recognition?" },
    ],
  },
  {
    id: "student", emoji: "🎓", name: "Student", color: "#0D9488", bg: "#F0FDFA", desc: "Grad, undergrad, intern seeker",
    extras: [
      { key: "clubs", short: "Clubs or\nactivities?", speak: "Any university clubs, student organisations, or extracurriculars?" },
      { key: "competitions", short: "Competitions\nor awards?", speak: "Participated in competitions, olympiads, or case challenges?" },
      { key: "projects", short: "Academic\nprojects?", speak: "Any notable academic projects, thesis, or research?" },
    ],
  },
  {
    id: "executive", emoji: "💼", name: "Executive", color: "#1E3A8A", bg: "#EFF6FF", desc: "Manager, VP, director, C-suite",
    extras: [
      { key: "leadership", short: "Leadership\nhighlight?", speak: "What's your most significant leadership achievement?" },
      { key: "boards", short: "Boards or\nadvisory?", speak: "Do you sit on any boards or advisory councils?" },
      { key: "speaking", short: "Speaking or\npublications?", speak: "Given keynotes or published thought leadership?" },
    ],
  },
  {
    id: "creative", emoji: "✍️", name: "Creative", color: "#DB2777", bg: "#FDF2F8", desc: "Writer, journalist, filmmaker, artist",
    extras: [
      { key: "portfolio", short: "Portfolio or\npublications?", speak: "Where can people find your work?" },
      { key: "awards", short: "Awards or\nrecognition?", speak: "Won any creative awards or grants?" },
      { key: "collab", short: "Notable\ncollaborations?", speak: "Collaborated with any notable brands or publications?" },
    ],
  },
  {
    id: "scientist", emoji: "🔬", name: "Researcher", color: "#059669", bg: "#ECFDF5", desc: "Academic, scientist, data analyst",
    extras: [
      { key: "publications", short: "Papers or\npublications?", speak: "Any published research papers or conference presentations?" },
      { key: "grants", short: "Grants or\nfellowships?", speak: "Received any research grants or fellowships?" },
      { key: "projects", short: "Research\nprojects?", speak: "Most significant research projects or studies?" },
    ],
  },
  {
    id: "athlete", emoji: "🏆", name: "Athlete", color: "#B45309", bg: "#FFFBEB", desc: "Sports, esports, competition",
    extras: [
      { key: "competitions", short: "Competitions\n& results?", speak: "What competitions and what were your results?" },
      { key: "awards", short: "Trophies or\nawards?", speak: "Biggest wins, trophies, or competitive achievements?" },
      { key: "training", short: "Training or\ncoaching?", speak: "Your training background or coaching experience?" },
    ],
  },
  {
    id: "other", emoji: "🌟", name: "Other", color: "#6B7280", bg: "#F9FAFB", desc: "Everything else",
    extras: [
      { key: "awards", short: "Awards or\nachievements?", speak: "Any awards, recognition, or notable achievements?" },
      { key: "projects", short: "Notable\nprojects?", speak: "Projects or initiatives outside your main work?" },
      { key: "volunteer", short: "Volunteering?", speak: "Any volunteering or community involvement?" },
    ],
  },
];

export function questionsForRole(roleId: string): InterviewQuestion[] {
  const role = ROLES.find((r) => r.id === roleId);
  return [...BASE_QS, ...(role?.extras ?? [])];
}
