import QRCode from "qrcode";
import { BackgroundPattern, BackgroundStyle, CardBackground, ResumeData } from "@/types";
import { getCardStyle } from "@/lib/templates";

export const CARD_W = 1050;
export const CARD_H = 600;

export function drawSchoolBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  primary: string,
  secondary: string,
  style: BackgroundStyle,
  watermark?: string,
  pattern?: BackgroundPattern
) {
  // Base fill
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 40);
  ctx.fill();

  if (style === "minimal") {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "rgba(255,255,255,0.1)");
    g.addColorStop(1, "rgba(0,0,0,0.15)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 40);
    ctx.fill();
    return;
  }

  if (style === "watermark" && watermark) {
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.round(w * 0.13)}px Arial`;
    ctx.textAlign = "center";
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 10);
    for (let r = -1; r <= 2; r++)
      for (let c = -1; c <= 1; c++)
        ctx.fillText(watermark.toUpperCase(), c * w * 0.7, r * h * 0.55);
    ctx.restore();
  }

  if (style === "pattern" && pattern) {
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = secondary;
    ctx.fillStyle = secondary;
    ctx.lineWidth = 1.5;
    if (pattern === "dots") {
      const sp = 28;
      for (let x = 0; x < w; x += sp)
        for (let y = 0; y < h; y += sp) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
    }
    if (pattern === "lines") {
      for (let y = 0; y < h; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }
    if (pattern === "diagonal") {
      for (let i = -h; i < w + h; i += 32) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke();
      }
    }
    if (pattern === "crosshatch") {
      for (let x = 0; x < w; x += 28) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 28) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }
    if (pattern === "grid") {
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }
    ctx.restore();
  }
}

function drawPresetBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bg: string,
  deco: string
) {
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 40);
  ctx.fill();

  // Decorative circles
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 40);
  ctx.clip();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = deco;
  ctx.beginPath();
  ctx.arc(w * 0.92, h * 0.1, 160, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.05, h * 0.95, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.07;
  ctx.beginPath();
  ctx.arc(w * 0.75, h * 0.9, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

async function drawImageBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dataUrl: string
) {
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 40);
      ctx.clip();
      ctx.drawImage(img, 0, 0, w, h);
      ctx.restore();
      resolve();
    };
    img.onerror = () => reject(new Error("Failed to load drawn background"));
    img.src = dataUrl;
  });
}

export async function buildCardImage(
  data: ResumeData,
  background: CardBackground,
  shareUrl: string
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d")!;
  const w = CARD_W;
  const h = CARD_H;

  let textColor = "#fff";

  if (background.type === "school" && background.colors) {
    drawSchoolBackground(
      ctx, w, h,
      background.colors.primary,
      background.colors.secondary,
      background.bgStyle ?? "minimal",
      background.watermark,
      background.pattern
    );
  } else if (background.type === "drawn" && background.dataUrl) {
    ctx.fillStyle = "#FFF9C4";
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 40);
    ctx.fill();
    await drawImageBackground(ctx, w, h, background.dataUrl);
    textColor = "#3E2D00";
  } else {
    const style = getCardStyle(background.styleId ?? "c1");
    drawPresetBackground(ctx, w, h, background.color ?? style.bg, style.deco);
    textColor = style.tx;
  }

  // ----- Left side: text -----
  const pad = 70;
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";

  ctx.font = "italic bold 62px Georgia, serif";
  ctx.fillText(data.name || "", pad, 150, w - 420);

  ctx.font = "500 30px Inter, Arial, sans-serif";
  ctx.globalAlpha = 0.9;
  ctx.fillText(data.title || "", pad, 205, w - 420);
  ctx.globalAlpha = 1;

  ctx.font = "24px Inter, Arial, sans-serif";
  let y = 280;
  const line = (icon: string, text?: string) => {
    if (!text) return;
    ctx.globalAlpha = 0.85;
    ctx.fillText(`${icon}  ${text}`, pad, y, w - 460);
    ctx.globalAlpha = 1;
    y += 44;
  };
  line("✉", data.contact?.email);
  line("✆", data.contact?.phone);
  line("🔗", data.links);

  // Skills chips
  if (data.skills?.length) {
    y += 16;
    ctx.font = "600 20px Inter, Arial, sans-serif";
    let x = pad;
    for (const skill of data.skills.slice(0, 5)) {
      const tw = ctx.measureText(skill).width;
      const chipW = tw + 36;
      if (x + chipW > w - 400) break;
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = textColor;
      ctx.beginPath();
      ctx.roundRect(x, y - 26, chipW, 40, 20);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = textColor;
      ctx.fillText(skill, x + 18, y + 2);
      x += chipW + 12;
    }
  }

  // ----- Right side: QR in white rounded box -----
  const qrBox = 220;
  const qrX = w - qrBox - 70;
  const qrY = (h - qrBox) / 2 - 20;
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.roundRect(qrX, qrY, qrBox, qrBox, 24);
  ctx.fill();
  ctx.restore();

  const qrCanvas = document.createElement("canvas");
  await QRCode.toCanvas(qrCanvas, shareUrl, { width: qrBox - 36, margin: 0 });
  ctx.drawImage(qrCanvas, qrX + 18, qrY + 18);

  ctx.fillStyle = textColor;
  ctx.font = "600 20px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.85;
  ctx.fillText("Scan to connect", qrX + qrBox / 2, qrY + qrBox + 44);
  ctx.globalAlpha = 1;

  // ----- Bottom watermark -----
  ctx.font = "18px Inter, Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.globalAlpha = 0.5;
  ctx.fillText("VoiceResume", w - 40, h - 28);
  ctx.globalAlpha = 1;

  // ----- Stickers on top of everything -----
  if (background.stickers?.length) {
    for (const s of background.stickers) {
      ctx.save();
      ctx.translate(s.x * w, s.y * h);
      ctx.rotate((s.rot * Math.PI) / 180);
      ctx.font = `${Math.round(s.size * w)}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.emoji, 0, 0);
      ctx.restore();
    }
  }

  return canvas;
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  a.click();
}
