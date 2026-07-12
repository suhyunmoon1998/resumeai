"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { getPosition } from "@/lib/weather";

interface Company {
  id: number;
  name: string;
  lat: number;
  lon: number;
  kind?: string;
  distanceM: number;
}

const RADIUS_M = 2000;

function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Nearby named offices/companies from OpenStreetMap via Overpass (free, no key). */
async function fetchNearbyCompanies(lat: number, lon: number): Promise<Company[]> {
  const query = `
[out:json][timeout:20];
(
  node["office"]["name"](around:${RADIUS_M},${lat},${lon});
  way["office"]["name"](around:${RADIUS_M},${lat},${lon});
  node["company"]["name"](around:${RADIUS_M},${lat},${lon});
);
out center 80;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  const data = await res.json();
  const seen = new Set<string>();
  const out: Company[] = [];
  for (const el of data.elements ?? []) {
    const name: string | undefined = el.tags?.name;
    const elLat: number | undefined = el.lat ?? el.center?.lat;
    const elLon: number | undefined = el.lon ?? el.center?.lon;
    if (!name || elLat == null || elLon == null || seen.has(name)) continue;
    seen.add(name);
    out.push({
      id: el.id,
      name,
      lat: elLat,
      lon: elLon,
      kind: el.tags?.office,
      distanceM: Math.round(haversineM(lat, lon, elLat, elLon)),
    });
  }
  return out.sort((a, b) => a.distanceM - b.distanceM);
}

function jobLinks(name: string) {
  const q = encodeURIComponent(name);
  return {
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${q}`,
    indeed: `https://www.indeed.com/jobs?q=${q}`,
    google: `https://www.google.com/search?q=${encodeURIComponent(`${name} careers`)}`,
  };
}

type Status = "locating" | "loading" | "ready" | "denied" | "error";

/**
 * Map of nearby companies (OpenStreetMap data) with quick links to job
 * search — an MVP: OSM doesn't know who is hiring, so each company links
 * out to Wanted / Google job searches for its name.
 */
export default function CompanyMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [status, setStatus] = useState<Status>("locating");
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let lat: number, lon: number;
      try {
        const pos = await getPosition();
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch {
        if (!cancelled) setStatus("denied");
        return;
      }
      if (cancelled) return;
      setStatus("loading");

      // Leaflet touches `window` at import time — load it client-side only.
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current) return;

      const map = L.map(mapEl.current).setView([lat, lon], 15);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const meIcon = L.divIcon({ html: "📍", className: "map-emoji", iconSize: [28, 28] });
      L.marker([lat, lon], { icon: meIcon }).addTo(map).bindPopup("You are here");

      try {
        const found = await fetchNearbyCompanies(lat, lon);
        if (cancelled) return;
        const officeIcon = L.divIcon({ html: "🏢", className: "map-emoji", iconSize: [26, 26] });
        for (const c of found) {
          const links = jobLinks(c.name);
          L.marker([c.lat, c.lon], { icon: officeIcon })
            .addTo(map)
            .bindPopup(
              `<strong>${c.name.replace(/</g, "&lt;")}</strong><br>` +
                `${c.distanceM}m away<br>` +
                `<a href="${links.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · ` +
                `<a href="${links.indeed}" target="_blank" rel="noopener">Indeed</a> · ` +
                `<a href="${links.google}" target="_blank" rel="noopener">Careers</a>`
            );
        }
        setCompanies(found);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        ref={mapEl}
        className="h-[45dvh] w-full overflow-hidden rounded-3xl shadow-lg"
        aria-label="Map of companies near you"
      />

      {status === "locating" && (
        <p className="text-center text-sm text-gray-500">📍 Finding you… (allow location access)</p>
      )}
      {status === "loading" && (
        <p className="text-center text-sm text-gray-500">🏢 Looking for companies nearby…</p>
      )}
      {status === "denied" && (
        <p className="text-center text-sm text-gray-500">
          Location access is off — enable it in your browser settings to see companies near you.
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-gray-500">
          Couldn&apos;t load nearby companies right now — please try again in a minute.
        </p>
      )}
      {status === "ready" && companies.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No companies mapped within 2km — try again from a business district!
        </p>
      )}

      {companies.length > 0 && (
        <ul className="space-y-2">
          {companies.slice(0, 20).map((c) => {
            const links = jobLinks(c.name);
            return (
              <li key={c.id} className="glass flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-800 dark:text-gray-200">🏢 {c.name}</p>
                  <p className="text-xs text-gray-500">
                    {c.distanceM >= 1000 ? `${(c.distanceM / 1000).toFixed(1)}km` : `${c.distanceM}m`}
                    {c.kind ? ` · ${c.kind}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={links.indeed}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300"
                  >
                    Indeed
                  </a>
                  <a
                    href={links.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    Careers 🔍
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-center text-xs text-gray-400">
        Company locations from OpenStreetMap. Tap a company to search its openings.
      </p>
    </div>
  );
}
