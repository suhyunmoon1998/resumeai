"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = [
  "#3E2D00", "#2563EB", "#EF4444", "#16A34A", "#EA580C",
  "#7C3AED", "#0D9488", "#FDD835", "#000", "#FFF9C4",
];

const STICKY_BG = "#FFF9C4";
const MAX_HISTORY = 20;

export default function DrawCanvas({
  onChange,
}: {
  onChange: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(4);
  const [eraser, setEraser] = useState(false);
  const drawing = useRef(false);
  const history = useRef<string[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = STICKY_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory();
    emit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    history.current.push(canvas.toDataURL());
    if (history.current.length > MAX_HISTORY) history.current.shift();
  };

  const emit = () => {
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  };

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.strokeStyle = eraser ? STICKY_BG : color;
    ctx.lineWidth = eraser ? size * 4 : size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    pushHistory();
    emit();
  };

  const undo = () => {
    if (history.current.length < 2) return;
    history.current.pop();
    const prev = history.current[history.current.length - 1];
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      emit();
    };
    img.src = prev;
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = STICKY_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory();
    emit();
  };

  return (
    <div className="space-y-3">
      <div className="sticky-note-frame overflow-hidden rounded-xl">
        <canvas
          ref={canvasRef}
          width={1050}
          height={600}
          className="w-full touch-none"
          style={{ background: "transparent" }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          aria-label="Drawing canvas for your card background"
        />
      </div>

      <div
        className="flex flex-wrap items-center gap-2 rounded-xl px-3 py-2"
        style={{ background: "#FDD835" }}
      >
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => {
              setColor(c);
              setEraser(false);
            }}
            aria-label={`Pen color ${c}`}
            className={`h-7 w-7 rounded-full border-2 transition ${
              color === c && !eraser ? "scale-110 border-gray-900" : "border-white/60"
            }`}
            style={{ background: c }}
          />
        ))}
        <div className="mx-1 h-6 w-px bg-black/20" aria-hidden />
        <button
          onClick={() => setEraser(!eraser)}
          aria-label="Eraser"
          className={`rounded-lg px-2.5 py-1 text-sm font-bold transition ${
            eraser ? "bg-gray-900 text-white" : "bg-white/70 text-gray-800"
          }`}
        >
          🧽
        </button>
        <input
          type="range"
          min={2}
          max={16}
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value, 10))}
          aria-label="Pen size"
          className="w-20"
        />
        <button
          onClick={undo}
          aria-label="Undo last stroke"
          className="rounded-lg bg-white/70 px-2.5 py-1 text-sm font-bold text-gray-800"
        >
          ↩
        </button>
        <button
          onClick={clear}
          aria-label="Clear canvas"
          className="rounded-lg bg-white/70 px-2.5 py-1 text-sm font-bold text-gray-800"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
