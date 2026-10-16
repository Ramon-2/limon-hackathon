import { PLACES } from './data.js';
import { GOOGLE_MAPS_API_KEY, USE_GOOGLE_ROUTES } from './config.js';

/* Travel time between stops, based on when you'd actually leave.
   1. Google Routes API traffic predictions for that exact departure (when USE_GOOGLE_ROUTES is on),
      cached per leg + half-hour slot.
   2. Otherwise Limon's estimate: distance, road speed, and an Orange County time-of-day traffic curve. */

// Time to park and walk in (drive) or lock up (bike), added on top of the trip itself.
const PARKING_MIN = 10;

export function miles([lat1, lon1], [lat2, lon2]) {
  const R = 3958.8, r = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// How much slower than free-flow driving is at this moment. weekday: 0=Sun..6=Sat, min: minutes after midnight.
export function trafficAt(weekday, min) {
  const h = min / 60, weekend = weekday === 0 || weekday === 6;
  if (h < 6 || h >= 22) return { f: 0.9, label: 'late, roads are clear' };
  if (weekend) {
    if (h >= 11 && h < 18) return { f: 1.3, label: 'weekend crowds' };
    return { f: 1.05, label: 'light traffic' };
  }
  if (h >= 7 && h < 9) return { f: 1.6, label: 'morning rush' };
  if (h >= 6.5 && h < 9.5) return { f: 1.35, label: 'morning rush' };
  if (h >= 16 && h < 18.5) return { f: 1.75, label: 'evening rush hour' };
  if (h >= 15 && h < 19) return { f: 1.45, label: 'evening rush hour' };
  if (h >= 11.5 && h < 13.5) return { f: 1.15, label: 'lunch traffic' };
  return { f: 1.05, label: 'light traffic' };
}

/* ---------- cache of Google results (per browser) ---------- */
const CACHE_KEY = 'limon.legs.v2'; // { min, f } where f = traffic duration / no-traffic duration
let cache;
function getCache() {
  if (!cache) { try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)) ?? {}; } catch { cache = {}; } }
  return cache;
}
function saveCache() { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { /* ignore */ } }
// Drive times depend on the half-hour you leave; walk/bike times don't.
const slotKey = (mode, a, b, date, min) => (mode === 'drive' ? `drive:${a}>${b}@${date}T${Math.floor(min / 30) * 30}` : `${mode}:${a}>${b}`);
const EXTRA = { drive: PARKING_MIN, bike: 5, walk: 0 };

export const MODES = { drive: '🚗 Drive', walk: '🚶 Walk', bike: '🚲 Bike' };

/* leg(a, b, date?, departMin?, mode) → { min, mode: 'walk'|'bike'|'drive', label, source: 'google'|'limon' }
   Without a date/time it returns a typical (no-traffic) estimate, used for "nearby" questions.
   Driving legs under half a mile become walks: nobody re-parks for one block. */
export function leg(a, b, date, departMin, mode = 'drive') {
  const pa = PLACES[a], pb = PLACES[b];
  const road = miles(pa.ll, pb.ll) * 1.3;
  const m = mode === 'drive' && road < 0.5 ? 'walk' : mode;
  const timed = date != null && departMin != null;
  const g = timed || m !== 'drive' ? getCache()[slotKey(m, a, b, date, departMin)] : null;
  const t = m === 'drive' && timed ? trafficAt(new Date(date + 'T12:00:00').getDay(), departMin) : { f: 1, label: '' };
  const out = (travel, label, source) => ({ min: travel + EXTRA[m], travel, extra: EXTRA[m], mode: m, label, source });
  if (g != null) return out(g.min, m === 'drive' ? googleLabel(g.f) : '', 'google');
  if (m === 'walk') return out(Math.max(1, Math.round(road * 20)), '', 'limon'); // ~3 mph
  if (m === 'bike') return out(Math.max(2, Math.round(road * 6)), '', 'limon'); // ~10 mph
  const mph = road < 3 ? 22 : road < 8 ? 30 : 42; // surface streets → mixed → freeway
  return out(Math.round((road / mph) * 60 * t.f), t.label, 'limon');
}

export const legText = (l, departMin, fmtTime) =>
  l.mode === 'walk' ? `~${l.travel} min walk` : l.mode === 'bike' ? `~${l.travel} min bike ride + ${l.extra} to lock up`
    : `~${l.travel} min drive${departMin != null ? ` leaving ${fmtTime(departMin)}` : ''}${l.label ? ` (${l.label})` : ''} + ${l.extra} to park`;
export const legIcon = (l) => ({ walk: '🚶', bike: '🚲', drive: '🚗' }[l.mode]);
export const legMode = (itin, stop) => stop.legMode ?? itin.intake?.travel ?? 'drive';

/* ---------- Google Routes API: predicted traffic for a future departure ---------- */
export const usingGoogleRoutes = () => !!(GOOGLE_MAPS_API_KEY && USE_GOOGLE_ROUTES);
let routesBroken = false; // stop calling after an auth/config error, fall back quietly

// Local wall-clock time in Orange County → RFC 3339 timestamp with the right PST/PDT offset.
function laTimestamp(date, min) {
  const off = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', timeZoneName: 'shortOffset' })
    .formatToParts(new Date(date + 'T12:00:00Z')).find((p) => p.type === 'timeZoneName').value; // "GMT-8"
  const h = Math.abs(parseInt(off.replace('GMT', ''), 10) || 0), sign = off.includes('+') ? '+' : '-';
  const p2 = (n) => String(n).padStart(2, '0');
  return `${date}T${p2(Math.floor(min / 60) % 24)}:${p2(min % 60)}:00${sign}${p2(h)}:00`;
}

const TRAVEL_MODE = { drive: 'DRIVE', walk: 'WALK', bike: 'BICYCLE' };
// Label from Google's own prediction: how much slower than an empty road.
const googleLabel = (f) => (f >= 1.4 ? 'heavy traffic' : f >= 1.15 ? 'some traffic' : 'light traffic');
async function googleMinutes(pa, pb, date, min, mode) {
  const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY, 'X-Goog-FieldMask': 'routes.duration,routes.staticDuration' },
    body: JSON.stringify({
      origin: { location: { latLng: { latitude: pa.ll[0], longitude: pa.ll[1] } } },
      destination: { location: { latLng: { latitude: pb.ll[0], longitude: pb.ll[1] } } },
      travelMode: TRAVEL_MODE[mode],
      // traffic only applies to driving; Google rejects a routing preference for walk/bike
      ...(mode === 'drive' && { routingPreference: 'TRAFFIC_AWARE', departureTime: laTimestamp(date, min) }),
    }),
  });
  if (!res.ok) { if ([400, 401, 403].includes(res.status)) routesBroken = true; throw new Error('routes ' + res.status); }
  const r = (await res.json()).routes?.[0];
  const sec = parseInt(r?.duration ?? '', 10), still = parseInt(r?.staticDuration ?? '', 10) || sec;
  if (!sec) throw new Error('no route');
  return { min: Math.round(sec / 60), f: Math.round((sec / still) * 100) / 100 };
}

/* Fetch Google times for every leg in an itinerary that isn't cached yet (drive: traffic at departure).
   Resolves true if anything new arrived (so the caller can re-render). */
const inflight = new Set();
export async function fetchLegs(itin, toMin) {
  if (!usingGoogleRoutes() || routesBroken) return false;
  const jobs = [];
  for (const d of itin.days ?? []) {
    const stops = d.stops.filter((s) => PLACES[s.place]).sort((x, y) => toMin(x.time) - toMin(y.time));
    stops.slice(0, -1).forEach((s, i) => {
      const next = stops[i + 1], depart = toMin(s.time) + Number(s.duration);
      const mode = leg(s.place, next.place, null, null, legMode(itin, s)).mode;
      const key = slotKey(mode, s.place, next.place, d.date, depart);
      if (getCache()[key] != null || inflight.has(key)) return;
      if (mode === 'drive' && new Date(laTimestamp(d.date, depart)) < Date.now()) return; // traffic is only predicted for the future
      inflight.add(key);
      jobs.push(googleMinutes(PLACES[s.place], PLACES[next.place], d.date, depart, mode)
        .then((m) => { getCache()[key] = m; return true; })
        .catch(() => false)
        .finally(() => inflight.delete(key)));
    });
  }
  const got = (await Promise.all(jobs)).some(Boolean);
  if (got) saveCache();
  return got;
}
