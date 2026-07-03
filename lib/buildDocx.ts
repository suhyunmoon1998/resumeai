import {
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { ResumeData, ResumeTemplate } from "@/types";

const hex = (c: string) => c.replace("#", "").toUpperCase();

function headerBlock(data: ResumeData, accent: string): Table {
  const contact = [data.contact?.email, data.contact?.phone, data.contact?.location]
    .filter(Boolean)
    .join("  ·  ");
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.SOLID, color: hex(accent), fill: hex(accent) },
            margins: { top: 240, bottom: 240, left: 240, right: 240 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: data.name || "", bold: true, size: 56, color: "FFFFFF" }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: data.title || "", size: 26, color: "FFFFFF" }),
                ],
              }),
              ...(contact
                ? [
                    new Paragraph({
                      children: [new TextRun({ text: contact, size: 20, color: "FFFFFF" })],
                    }),
                  ]
                : []),
              ...(data.links
                ? [
                    new Paragraph({
                      children: [new TextRun({ text: data.links, size: 20, color: "FFFFFF" })],
                    }),
                  ]
                : []),
            ],
          }),
        ],
      }),
    ],
  });
}

function noBorders() {
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return {
    top: none, bottom: none, left: none, right: none,
    insideHorizontal: none, insideVertical: none,
  };
}

function sectionHeader(text: string, accent: string): Paragraph {
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: hex(accent) },
    },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, size: 24, color: hex(accent) }),
    ],
  });
}

function body(text: string, opts: { bold?: boolean; italic?: boolean; size?: number } = {}) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        italics: opts.italic,
        size: opts.size ?? 21,
        color: "333333",
      }),
    ],
  });
}

function bullet(text: string) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 21, color: "333333" })],
  });
}

function summarySection(data: ResumeData, accent: string): Paragraph[] {
  if (!data.summary) return [];
  return [sectionHeader("Summary", accent), body(data.summary)];
}

function skillsSection(data: ResumeData, accent: string): Paragraph[] {
  if (!data.skills?.length) return [];
  return [sectionHeader("Skills", accent), body(data.skills.join("  ·  "))];
}

function experienceSection(data: ResumeData, accent: string): Paragraph[] {
  if (!data.experience?.length) return [];
  const out: Paragraph[] = [sectionHeader("Experience", accent)];
  for (const exp of data.experience) {
    out.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: exp.role || "", bold: true, size: 23, color: "111111" }),
          new TextRun({ text: exp.company ? `  —  ${exp.company}` : "", size: 22, color: "444444" }),
          new TextRun({ text: exp.period ? `   (${exp.period})` : "", italics: true, size: 20, color: "666666" }),
        ],
      })
    );
    for (const b of exp.bullets ?? []) if (b) out.push(bullet(b));
  }
  return out;
}

function educationSection(data: ResumeData, accent: string): Paragraph[] {
  if (!data.education?.length) return [];
  const out: Paragraph[] = [sectionHeader("Education", accent)];
  for (const edu of data.education) {
    out.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: edu.school || "", bold: true, size: 22, color: "111111" }),
          new TextRun({ text: edu.degree ? `  —  ${edu.degree}` : "", size: 21, color: "444444" }),
          new TextRun({ text: edu.year ? `   ${edu.year}` : "", italics: true, size: 20, color: "666666" }),
        ],
      })
    );
  }
  return out;
}

function languagesSection(data: ResumeData, accent: string): Paragraph[] {
  if (!data.languages?.length) return [];
  return [sectionHeader("Languages", accent), body(data.languages.join("  ·  "))];
}

function metricSection(data: ResumeData, accent: string): Paragraph[] {
  if (!data.metric) return [];
  return [sectionHeader("Key Achievement", accent), body(data.metric, { italic: true })];
}

function singleLayout(data: ResumeData, accent: string): (Paragraph | Table)[] {
  return [
    headerBlock(data, accent),
    ...summarySection(data, accent),
    ...experienceSection(data, accent),
    ...educationSection(data, accent),
    ...skillsSection(data, accent),
    ...languagesSection(data, accent),
    ...metricSection(data, accent),
  ];
}

function skillsFirstLayout(data: ResumeData, accent: string): (Paragraph | Table)[] {
  return [
    headerBlock(data, accent),
    ...skillsSection(data, accent),
    ...summarySection(data, accent),
    ...experienceSection(data, accent),
    ...educationSection(data, accent),
    ...languagesSection(data, accent),
    ...metricSection(data, accent),
  ];
}

function sidebarLayout(data: ResumeData, accent: string): (Paragraph | Table)[] {
  const sidebar: Paragraph[] = [
    ...skillsSection(data, accent),
    ...languagesSection(data, accent),
    ...educationSection(data, accent),
    ...(data.links ? [sectionHeader("Links", accent), body(data.links)] : []),
  ];
  const main: Paragraph[] = [
    ...summarySection(data, accent),
    ...experienceSection(data, accent),
    ...metricSection(data, accent),
  ];
  return [
    headerBlock(data, accent),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders(),
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 32, type: WidthType.PERCENTAGE },
              margins: { right: 240 },
              children: sidebar.length ? sidebar : [new Paragraph("")],
            }),
            new TableCell({
              width: { size: 68, type: WidthType.PERCENTAGE },
              margins: { left: 240 },
              children: main.length ? main : [new Paragraph("")],
            }),
          ],
        }),
      ],
    }),
  ];
}

export async function buildDocx(
  data: ResumeData,
  template: ResumeTemplate
): Promise<Blob> {
  const accent = template.accent;
  let children: (Paragraph | Table)[];
  if (template.layout === "skills") children = skillsFirstLayout(data, accent);
  else if (template.layout === "sidebar") children = sidebarLayout(data, accent);
  else children = singleLayout(data, accent);

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Calibri" } } },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export async function downloadDocx(data: ResumeData, template: ResumeTemplate) {
  const blob = await buildDocx(data, template);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(data.name || "resume").replace(/\s+/g, "_")}_${template.id}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
