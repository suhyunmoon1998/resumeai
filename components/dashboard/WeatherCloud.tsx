"use client";

import { useEffect, useState } from "react";
import { CurrentWeather, fetchCurrentWeather, getPosition, WeatherKind } from "@/lib/weather";

const MESSAGES: Record<WeatherKind, string> = {
  sun: "Sunny out there — perfect day to hand out your card!",
  cloud: "A bit cloudy — cozy day to polish your resume ✍️",
  rain: "It's raining — grab an umbrella for your interview!",
  snow: "Snow day — stay warm out there!",
};

/**
 * Cloudy the assistant: greets you with a look and a tip matching the
 * real weather at your location. Falls back to the plain cloud when
 * location is denied or the weather fetch fails.
 */
export default function WeatherCloud({ firstName }: { firstName: string }) {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pos = await getPosition();
        const w = await fetchCurrentWeather(pos.coords.latitude, pos.coords.longitude);
        if (!cancelled) setWeather(w);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const kind = weather?.kind ?? "cloud";
  const message = weather
    ? MESSAGES[kind]
    : failed
      ? "Hi! I'm Cloudy, your resume buddy ☁️"
      : "Checking the sky for you…";

  return (
    <div className="glass mb-8 flex items-center gap-4 rounded-3xl px-5 py-4">
      <div className="wx-scene relative shrink-0" aria-hidden>
        {/* weather effects behind/around the cloud */}
        {weather?.kind === "sun" && <span className="wx-sun" />}
        {weather?.kind === "rain" && (
          <span className="wx-drops">
            <i /><i /><i /><i /><i />
          </span>
        )}
        {weather?.kind === "snow" && (
          <span className="wx-flakes">
            <i>❄</i><i>❅</i><i>❄</i><i>❆</i>
          </span>
        )}

        <svg width="96" height="66" viewBox="0 0 160 110" className="animate-float">
          <ellipse cx="80" cy="72" rx="58" ry="32" fill="#fff" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="52" cy="52" r="26" fill="#fff" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="86" cy="40" r="32" fill="#fff" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="116" cy="56" r="22" fill="#fff" stroke="#CBD5E1" strokeWidth="2.5" />
          <ellipse cx="80" cy="72" rx="55" ry="29" fill="#fff" />
          <circle cx="52" cy="52" r="23" fill="#fff" />
          <circle cx="86" cy="40" r="29" fill="#fff" />
          <circle cx="116" cy="56" r="19" fill="#fff" />

          {kind === "sun" ? (
            // sunglasses
            <>
              <rect x="56" y="52" width="22" height="13" rx="6" fill="#1F2937" />
              <rect x="84" y="52" width="22" height="13" rx="6" fill="#1F2937" />
              <path d="M78 58 h6" stroke="#1F2937" strokeWidth="3" />
              <path d="M70 78 q10 8 20 0" stroke="#334155" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="66" cy="58" r="4.5" fill="#334155" />
              <circle cx="94" cy="58" r="4.5" fill="#334155" />
              <path
                d={kind === "rain" ? "M72 78 q8 -6 16 0" : "M72 75 q8 6 16 0"}
                stroke="#334155"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="55" cy="68" r="5" fill="#FDA4AF" opacity="0.6" />
              <circle cx="105" cy="68" r="5" fill="#FDA4AF" opacity="0.6" />
            </>
          )}

          {kind === "snow" && (
            // cozy scarf
            <>
              <path d="M50 88 q30 14 60 0 l-3 10 q-27 12 -54 0 z" fill="#EF4444" opacity="0.9" />
              <rect x="70" y="92" width="10" height="16" rx="4" fill="#EF4444" opacity="0.9" />
            </>
          )}
          {kind === "rain" && (
            // tiny umbrella over the cloud
            <g transform="translate(112,8) rotate(18)">
              <path d="M0 14 a16 16 0 0 1 32 0 z" fill="#F59E0B" />
              <path d="M16 14 v20 q0 5 5 5" stroke="#92400E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>

      <div className="min-w-0">
        <p className="font-caveat text-2xl leading-tight text-gray-800 dark:text-gray-200">
          Hey {firstName}!{" "}
          {weather && (
            <span className="whitespace-nowrap text-lg text-gray-500 dark:text-gray-400">
              {weather.tempC}°C now
            </span>
          )}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}
