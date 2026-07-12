/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

// 'unsafe-inline' scripts are required by Next's inline bootstrap and the
// theme-init snippet in app/layout.tsx; everything external is still blocked.
// 'unsafe-eval' + ws: are dev-server only (HMR).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // OSM tiles feed the company map; Open-Meteo (weather) and Overpass
  // (nearby companies) are fetched directly from the browser.
  "img-src 'self' data: blob: https://*.supabase.co https://*.googleusercontent.com https://*.tile.openstreetmap.org",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.open-meteo.com https://overpass-api.de${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Microphone stays enabled for this origin — the voice interview needs it.
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
