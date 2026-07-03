import { ResumeData } from "@/types";

export function buildVcard(data: ResumeData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${data.name}`,
    `N:${data.name};;;`,
  ];
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.contact?.email) lines.push(`EMAIL;TYPE=INTERNET:${data.contact.email}`);
  if (data.contact?.phone) lines.push(`TEL;TYPE=CELL:${data.contact.phone}`);
  if (data.links) lines.push(`URL:${data.links}`);
  if (data.skills?.length) lines.push(`NOTE:Skills: ${data.skills.join(", ")}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function downloadVcard(data: ResumeData) {
  const blob = new Blob([buildVcard(data)], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(data.name || "contact").replace(/\s+/g, "_")}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
