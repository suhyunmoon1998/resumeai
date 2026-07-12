export type WeatherKind = "sun" | "cloud" | "rain" | "snow";

export interface CurrentWeather {
  kind: WeatherKind;
  tempC: number;
}

/** Map WMO weather codes (Open-Meteo `weather_code`) to our four moods. */
function kindFromWmoCode(code: number): WeatherKind {
  if (code === 0 || code === 1) return "sun";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99)
  )
    return "rain";
  return "cloud";
}

/** Current weather from Open-Meteo — free, no API key, CORS-enabled. */
export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}` +
    `&longitude=${lon.toFixed(3)}&current=temperature_2m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();
  const code = Number(data?.current?.weather_code ?? 3);
  const tempC = Math.round(Number(data?.current?.temperature_2m ?? 0));
  return { kind: kindFromWmoCode(code), tempC };
}

/** Browser geolocation as a promise; rejects on denial/timeout. */
export function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 8000,
      maximumAge: 30 * 60_000, // a cached fix from the last 30 min is fine for weather
    });
  });
}
