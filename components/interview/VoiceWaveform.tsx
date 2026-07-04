"use client";

import { useEffect, useRef } from "react";

/** Live microphone frequency bars (Web Audio API), shown while recording. */
export default function VoiceWaveform({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let raf = 0;
    let cancelled = false;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const w = canvas.width;
        const h = canvas.height;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "#6366F1");
        grad.addColorStop(0.5, "#8B5CF6");
        grad.addColorStop(1, "#D946EF");

        const bars = 28;
        const step = Math.floor(data.length / bars);
        const draw = () => {
          analyser.getByteFrequencyData(data);
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = grad;
          const barW = w / bars - 3;
          for (let i = 0; i < bars; i++) {
            let sum = 0;
            for (let j = 0; j < step; j++) sum += data[i * step + j];
            const v = sum / step / 255;
            const barH = Math.max(3, v * h * 0.95);
            const bx = i * (barW + 3);
            const by = (h - barH) / 2;
            ctx.beginPath();
            ctx.roundRect(bx, by, barW, barH, barW / 2);
            ctx.fill();
          }
          raf = requestAnimationFrame(draw);
        };
        draw();
      } catch {
        /* mic permission denied — SpeechRecognition may still work; skip the visual */
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      audioCtx?.close().catch(() => {});
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={52}
      className="h-13 w-full max-w-[300px]"
      aria-hidden
    />
  );
}
