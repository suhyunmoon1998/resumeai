"use client";

export default function MicButton({
  recording,
  disabled,
  onClick,
}: {
  recording: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={recording ? "Stop recording" : "Start recording your answer"}
        className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl transition disabled:opacity-40 ${
          recording
            ? "mic-ripple animate-micPulse bg-red-500 text-white shadow-lg"
            : "g-bg glow-btn text-white"
        }`}
      >
        {recording ? "■" : "🎙"}
      </button>
      <span aria-live="polite" className="text-xs font-medium text-gray-400">
        {recording ? "Listening… tap to stop" : "Tap to answer"}
      </span>
    </div>
  );
}
