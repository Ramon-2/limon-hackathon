import { PLACES } from './data.js';
import { leg, legText, legMode } from './traffic.js';

// Automated quality layer: checks the "checkable facts" so humans only judge style.
// Returns [{ level: 'error'|'warn'|'info', day, stop, msg }].

const PACE_LIMIT = { relaxed: 4, balanced: 6, active: 8 };
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export const fmtTime = (min) => {
  const h = Math.floor(min / 60) % 24, m = min % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};

// Typical drive time with no traffic, for "is this nearby?" questions. Timed legs use leg() in traffic.js.
export const travelMinutes = (a, b) => leg(a, b).min;

// Open intervals (minutes from midnight) for a weekday. Google places carry real per-day hours
// (split shifts, overnight closes); demo places use one daily range plus closed days.
// Returns null when hours are unknown.
export function openIntervals(p, weekday) {
  if (p.hoursByDay) return p.hoursByDay[weekday] ?? [];
  if (!p.hours) return null;
  if (p.closedDays.includes(weekday)) return [];
  let [o, c] = p.hours.map(toMin);
  if (c <= o) c += 24 * 60; // past midnight
  return [[o, c]];
}
export const fmtHours = (iv) => iv.map(([o, c]) => (o === 0 && c >= 1440 ? 'Open 24 hours' : `${fmtTime(o)}–${fmtTime(c % 1440)}`)).join(', ');

export function validate(itin) {
  const issues = [];
  const { budget = Infinity, pace = 'balanced' } = itin.intake ?? {};

  itin.days.forEach((day, di) => {
    const weekday = new Date(day.date + 'T12:00:00').getDay();
    const stops = [...day.stops].sort((a, b) => toMin(a.time) - toMin(b.time));
    let spend = 0;

    stops.forEach((s, si) => {
      const p = PLACES[s.place];
      if (!s.place) return issues.push({ level: 'error', day: di, msg: `The ${fmtTime(toMin(s.time))} stop still needs a place.` });
      if (!p) return issues.push({ level: 'error', day: di, stop: s.place, msg: `Couldn't load details for one stop. Search for it again.` });
      const start = toMin(s.time), end = start + Number(s.duration);
      spend += p.cost;

      if (p.permanentlyClosed) issues.push({ level: 'error', day: di, stop: s.place, msg: `${p.name} has closed for good. Time for a new pick.` });
      else if (p.tempClosed) issues.push({ level: 'error', day: di, stop: s.place, msg: `Google lists ${p.name} as temporarily closed.` });
      else {
        const iv = openIntervals(p, weekday);
        if (iv === null) issues.push({ level: 'info', day: di, stop: s.place, msg: `${p.name} has no hours listed. Worth confirming before you send.` });
        else if (!iv.length) issues.push({ level: 'error', day: di, stop: s.place, msg: `Heads up: ${p.name} is closed on ${DAY_NAMES[weekday]}s.` });
        else if (!iv.some(([o, c]) => start >= o && end <= c)) issues.push({ level: 'error', day: di, stop: s.place, msg: `${p.name} is open ${fmtHours(iv)} on ${DAY_NAMES[weekday]}s, but this visit runs ${fmtTime(start)}–${fmtTime(end)}.` });
      }

      const next = stops[si + 1];
      if (next && PLACES[next.place]) {
        const gap = toMin(next.time) - end;
        const mode = legMode(itin, s), l = leg(s.place, next.place, day.date, end, mode), need = l.min;
        const how = legText(l, end, fmtTime);
        if (gap < 0) issues.push({ level: 'error', day: di, stop: next.place, msg: `${PLACES[next.place].name} starts before ${p.name} wraps up.` });
        else if (gap < need) issues.push({ level: 'warn', day: di, stop: next.place, msg: `Only ${gap} min to get from ${p.name} to ${PLACES[next.place].name}. That's a ${how.replace('~', '')}.` });
        if (l.mode === 'walk' && need > 30) issues.push({ level: 'info', day: di, stop: next.place, msg: `${PLACES[next.place].name} is a ${need}-min walk. Maybe bike or drive this leg?` });
        if (l.mode === 'bike' && need > 45) issues.push({ level: 'info', day: di, stop: next.place, msg: `${PLACES[next.place].name} is a ${need}-min ride. Maybe drive this leg?` });
        else if (gap > 180) issues.push({ level: 'info', day: di, stop: next.place, msg: `${Math.round(gap / 60)} free hours before ${PLACES[next.place].name}. Got a nearby suggestion?` });
      }
    });

    if (spend > budget) issues.push({ level: 'warn', day: di, msg: `Day ${di + 1} runs about $${spend}/person, over the $${budget} budget.` });
    if (stops.length > (PACE_LIMIT[pace] ?? 6)) issues.push({ level: 'info', day: di, msg: `${stops.length} stops is a lot for a ${pace} pace.` });
  });

  return issues;
}

export const verdict = (issues) =>
  issues.some((i) => i.level === 'error') ? 'fail' : issues.some((i) => i.level === 'warn') ? 'review' : 'pass';

export const fmt24 = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const roundUp5 = (m) => Math.ceil(m / 5) * 5;

/* Auto-schedule a day: each stop starts when you'd actually get there.
   arrival = previous stop's end + travel (incl. parking/lock-up), rounded up to 5 min;
   if the place opens later that day, wait for opening. The first stop, and any stop the
   creator pinned (a reservation), keep their time. Writes stop.time; returns per-stop info. */
export function schedule(itin, day) {
  const d = itin.days[day], weekday = new Date(d.date + 'T12:00:00').getDay();
  const info = [];
  d.stops.forEach((s, i) => {
    if (i === 0 || s.pinTime) { info.push({ arrival: toMin(s.time), waited: 0 }); return; }
    const prev = d.stops[i - 1], prevEnd = toMin(prev.time) + Number(prev.duration);
    let arrival = prevEnd + 15; // no place picked yet: leave a sensible gap
    if (PLACES[prev.place] && PLACES[s.place]) arrival = prevEnd + leg(prev.place, s.place, d.date, prevEnd, legMode(itin, prev)).min;
    arrival = roundUp5(arrival);
    let start = arrival;
    const iv = PLACES[s.place] ? openIntervals(PLACES[s.place], weekday) : null;
    if (iv?.length && !iv.some(([o, c]) => arrival >= o && arrival < c)) {
      const next = iv.map(([o]) => o).filter((o) => o > arrival).sort((a, b) => a - b)[0];
      if (next != null) start = next; // opens later today: wait for the doors
    }
    s.time = fmt24(Math.min(start, 24 * 60 - 5));
    info.push({ arrival, waited: start - arrival });
  });
  return info;
}
