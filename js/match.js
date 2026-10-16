import { PLACES, CREATORS, VIBES, vouchers } from './data.js';
import { travelMinutes } from './validate.js';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PACES = ['relaxed', 'balanced', 'active'];
const first = (c) => c.name.split(' ')[0];

/* ---------- Traveler ↔ creator match ----------
   prefs: { vibes: [], pace, budget }. Returns { score 0–100, good: [], miss: [] }.
   Weights: style 65%, pace 20%, budget 15%. Reasons are written for the traveler. */
export function creatorMatch(prefs, c) {
  const vibes = prefs.vibes?.length ? prefs.vibes : VIBES;
  const fit = vibes.map((v) => [v, c.fingerprint[v] ?? 40]).sort((a, b) => b[1] - a[1]);
  const style = fit.reduce((s, [, n]) => s + n, 0) / fit.length;
  const paceGap = Math.abs(PACES.indexOf(prefs.pace ?? 'balanced') - PACES.indexOf(c.pace));
  const pace = [100, 55, 15][paceGap];
  const budget = !prefs.budget || prefs.budget >= c.spend ? 100 : Math.max(0, 100 - ((c.spend - prefs.budget) / c.spend) * 160);
  const score = Math.round(style * 0.65 + pace * 0.2 + budget * 0.15);

  const good = [], miss = [];
  const strong = fit.filter(([, n]) => n >= 75).map(([v]) => v);
  const weak = fit.filter(([, n]) => n < 45).map(([v]) => v);
  if (strong.length) good.push(`${strong.slice(0, 2).join(' and ')} ${strong.length > 1 ? 'are' : 'is'} ${first(c)}'s specialty`);
  if (paceGap === 0) good.push(`Plans at your ${c.pace} pace`);
  else miss.push(`Usually plans ${c.pace} days. Ask for ${prefs.pace} and ${first(c)} can adjust`);
  if (prefs.budget && prefs.budget >= c.spend) good.push(`Days usually run ~$${c.spend}/person, inside your $${prefs.budget}`);
  else if (prefs.budget) miss.push(`Days usually run ~$${c.spend}/person, above your $${prefs.budget}`);
  if (weak.length) miss.push(`Not ${first(c)}'s specialty: ${weak.join(', ')}`);
  if (c.stats.went >= 90) good.push(`${c.stats.went}% of travelers actually took the trip`);
  return { score, good, miss };
}

export const rankCreators = (prefs, list = CREATORS) =>
  list.map((c) => ({ c, m: creatorMatch(prefs, c) })).sort((a, b) => b.m.score - a.m.score);

/* ---------- Place suggestions for a request ----------
   Candidates: the creator's own library + places other locals vouch for within ~20 min.
   Each gets a score and plain-language reasons; closed-that-day places sink with a flag. */
export function suggestPlaces(order, creator, dayIndex = 0) {
  const { intake } = order;
  const date = order.days?.[dayIndex]?.date ?? intake.start;
  const weekday = new Date(date + 'T12:00:00').getDay();
  const GENERIC = new Set(['best', 'town', 'good', 'great', 'nice', 'spot', 'spots', 'place', 'places', 'some', 'really', 'with', 'that', 'this', 'from', 'around', 'local', 'locals']);
  const words = (s) => (s || '').toLowerCase().split(/[^a-zà-ỹ]+/).filter((w) => w.length >= 4 && !GENERIC.has(w));
  const must = words(intake.must), avoid = (intake.avoid || '').toLowerCase();
  const inPlan = new Set((order.days ?? []).flatMap((d) => d.stops.map((s) => s.place)));
  const nearby = Object.keys(PLACES).filter((pid) => !PLACES[pid].source && !creator.places.includes(pid) && creator.places.some((own) => travelMinutes(own, pid) <= 20));

  return [...creator.places, ...nearby].filter((pid) => !PLACES[pid].permanentlyClosed).map((pid) => {
    const p = PLACES[pid], own = creator.library?.[pid];
    const why = [], warn = [];
    let score = 0;

    const hits = (p.vibes ?? []).filter((v) => intake.vibes.includes(v));
    if (hits.length) { score += 30 + 10 * hits.length; why.push(`Into ${hits.join(' + ')}`); }
    const text = `${p.name} ${p.type}`.toLowerCase();
    const mustHit = must.find((w) => text.includes(w) || text.includes(w.replace(/s$/, '')));
    if (mustHit) { score += 35; why.push(`Matches “${intake.must}”`); }
    if (p.cost * 2 <= intake.budget) { score += 10; why.push(p.cost === 0 ? 'Free' : `~$${p.cost}/person`); }
    else if (p.cost > intake.budget * 0.6) { score -= 10; warn.push(`~$${p.cost}/person eats most of the budget`); }
    if (own) {
      score += 15;
      const days = Math.round((Date.now() - new Date(own[0] + 'T12:00:00')) / 864e5);
      if (days <= 45) { score += 5; why.push(`You were here ${days <= 1 ? 'recently' : days + ' days ago'}`); }
      else warn.push(`Last scouted ${Math.round(days / 30)} months ago. Worth a re-check`);
    } else {
      const v = vouchers(pid).map(first);
      why.push(`Vouched for by ${v.join(', ')}`);
    }
    if (p.localOwned) { score += 8; why.push('Local-owned'); }
    if (p.busy && /line|crowd|wait|busy/.test(avoid)) { score -= 20; warn.push('Can get long lines at peak times'); }
    if (/chain/.test(avoid) && !p.localOwned && p.cost > 0) score -= 5;
    const closed = p.closedDays.includes(weekday);
    if (closed) { score -= 60; warn.unshift(`Closed ${DAY_NAMES[weekday]}s`); }

    return { pid, p, own: !!own, tip: own?.[1] ?? '', score, why, warn, closed, mustHit: !!mustHit, inPlan: inPlan.has(pid) };
  }).sort((a, b) => b.score - a.score);
}

/* ---------- Clarifying questions the creator can send in one tap ---------- */
export function suggestQuestions(order, creator) {
  const qs = [];
  const sugg = suggestPlaces(order, creator);
  const blocked = sugg.find((s) => s.mustHit && s.closed);
  if (blocked) {
    const day = DAY_NAMES[new Date((order.days?.[0]?.date ?? order.intake.start) + 'T12:00:00').getDay()];
    qs.push(`My pick for “${order.intake.must}” is ${blocked.p.name}, but it's closed ${day}s. Could you do another day, or want my runner-up?`);
  }
  if (!/diet|allerg|vegan|vegetarian/i.test(order.intake.notes)) qs.push('Any food allergies or dietary stuff I should plan around?');
  qs.push('Will you have a car, or should I keep everything walkable?');
  if (order.intake.group > 2) qs.push(`Anyone in the group of ${order.intake.group} I should plan around (kids, mobility, early nights)?`);
  qs.push('Is this for anything special? Birthday, anniversary, first time here?');
  return qs.slice(0, 4);
}
