"use client";

export type CloudState = "idle" | "thinking" | "talking" | "listening" | "done";

export default function CloudAnimation({ state }: { state: CloudState }) {
  return (
    <div
      className={`cloud-outer state-${state}`}
      role="img"
      aria-label={`Interviewer is ${state}`}
    >
      <div className="relative">
        <svg width="160" height="110" viewBox="0 0 160 110" aria-hidden>
          <ellipse cx="80" cy="72" rx="58" ry="32" fill="#fff" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="52" cy="52" r="26" fill="#fff" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="86" cy="40" r="32" fill="#fff" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="116" cy="56" r="22" fill="#fff" stroke="#CBD5E1" strokeWidth="2.5" />
          {/* mask the internal strokes */}
          <ellipse cx="80" cy="72" rx="55" ry="29" fill="#fff" />
          <circle cx="52" cy="52" r="23" fill="#fff" />
          <circle cx="86" cy="40" r="29" fill="#fff" />
          <circle cx="116" cy="56" r="19" fill="#fff" />
          {/* face */}
          {state === "done" ? (
            <>
              <path d="M60 58 q5 -7 10 0" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M90 58 q5 -7 10 0" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M66 74 q14 12 28 0" stroke="#334155" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="66" cy="58" r="4.5" fill="#334155" />
              <circle cx="94" cy="58" r="4.5" fill="#334155" />
              <path
                d={state === "talking" ? "M70 74 q10 10 20 0" : "M72 75 q8 6 16 0"}
                stroke="#334155"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="55" cy="68" r="5" fill="#FDA4AF" opacity="0.6" />
              <circle cx="105" cy="68" r="5" fill="#FDA4AF" opacity="0.6" />
            </>
          )}
        </svg>

        {state === "thinking" && (
          <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden>
            <span className="thinking-dot h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="thinking-dot h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="thinking-dot h-2.5 w-2.5 rounded-full bg-amber-400" />
          </div>
        )}

        {state === "talking" && (
          <div className="absolute -bottom-6 left-1/2 flex h-6 -translate-x-1/2 items-end gap-1" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="wave-bar w-1.5 rounded-full bg-amber-400" style={{ height: "100%" }} />
            ))}
          </div>
        )}

        {state === "listening" && (
          <div className="absolute inset-0 flex items-center justify-center pt-4 text-2xl" aria-hidden>
            🎤
          </div>
        )}
      </div>
    </div>
  );
}
