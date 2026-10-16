import { CITIES, REGION, PLACES, PACKAGES, TIERS, pkgById, tierById, orderPrice, TAKE_RATE, CREATORS, SAMPLES, VIBES, INSIDER, CATEGORIES, cityName, creatorById } from './data.js';
import { validate, verdict, toMin, fmtTime, openIntervals, fmtHours, schedule, fmt24 } from './validate.js';
import { searchPlaces, usingGoogle } from './places.js';
import { leg, legText, legIcon, legMode, MODES, fetchLegs, miles } from './traffic.js';
import { creatorMatch, rankCreators, suggestPlaces, suggestQuestions } from './match.js';

const app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const k = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n);
const first = (c) => c.name.split(' ')[0];
const gmaps = (p) => p.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + cityName(p.city) + ' CA')}`;
const daysAgo = (iso) => Math.round((Date.now() - new Date(iso + 'T12:00:00')) / 864e5);

/* ---------- storage ---------- */
// Orders and quiz answers live in this browser only (demo). Every access is guarded for private mode.
const KEY = 'limon.orders.v2', PREFS_KEY = 'limon.prefs.v1';
let memOrders = null, memPrefs;
function loadOrders() {
  if (memOrders) return memOrders;
  try { memOrders = JSON.parse(localStorage.getItem(KEY)); } catch { /* private mode */ }
  if (!Array.isArray(memOrders)) memOrders = seedOrders();
  memOrders.forEach((o) => Object.assign(PLACES, o.places)); // Google places picked for an order travel with it
  return memOrders;
}
function saveOrders() { try { localStorage.setItem(KEY, JSON.stringify(memOrders)); } catch { /* ignore */ } }
const orderById = (id) => loadOrders().find((o) => o.id === id);
function getPrefs() {
  if (memPrefs === undefined) { try { memPrefs = JSON.parse(localStorage.getItem(PREFS_KEY)); } catch { memPrefs = null; } }
  return memPrefs;
}
function setPrefs(p) { memPrefs = p; try { p ? localStorage.setItem(PREFS_KEY, JSON.stringify(p)) : localStorage.removeItem(PREFS_KEY); } catch { /* ignore */ } }
function seedOrders() {
  return [{
    id: 'ord-demo1', creator: 'marisol', pkg: 'day', mode: 'together', status: 'requested', createdAt: Date.now() - 864e5,
    traveler: 'Sam (demo)', intake: { start: '2026-11-03', group: 2, budget: 70, pace: 'balanced', travel: 'drive', vibes: ['Food', 'Art'], must: 'Best tacos in town', avoid: 'Long lines', notes: 'First time in OC, staying near the train station.' },
    days: null, feedback: {}, rounds: 0,
    messages: [{ from: 'traveler', text: 'So excited! We’re big on street food and murals. Saw your taco reel and had to book.', at: Date.now() - 864e5 }],
  }];
}

/* ---------- maps ---------- */
let maps = [];
function makeMap(el, center, zoom) {
  const m = L.map(el, { scrollWheelZoom: false }).setView(center, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 18 }).addTo(m);
  maps.push(m);
  return m;
}
const pinIcon = (emoji, color, size = 40) => L.divIcon({ className: 'pin', html: `<div style="--c:${color};--s:${size}px">${emoji}</div>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
const numIcon = (n) => L.divIcon({ className: 'pin num', html: `<div style="--s:28px">${n}</div>`, iconSize: [28, 28], iconAnchor: [14, 14] });

/* ---------- router ---------- */
const routes = [
  [/^#?\/?$/, home],
  [/^#\/c\/([\w-]+)$/, profile],
  [/^#\/c\/([\w-]+)\/book$/, book],
  [/^#\/order\/([\w-]+)$/, orderPage],
  [/^#\/i\/([\w-]+)$/, itineraryPage],
  [/^#\/studio$/, studio],
  [/^#\/studio\/([\w-]+)$/, builder],
];
function render() {
  maps.forEach((m) => { try { m.stop(); m.off(); m.remove(); } catch { /* map mid-animation */ } }); maps = [];
  const [hash, query] = location.hash.split('?');
  const params = new URLSearchParams(query);
  for (const [re, fn] of routes) {
    const m = hash.match(re);
    if (m) { setNav(hash); fn(...m.slice(1), params); window.scrollTo(0, 0); return; }
  }
  app.innerHTML = `<div class="wrap center"><h1>This page took a wrong turn.</h1><p>Happens to the best of us. <a href="#/">Head back home</a></p></div>`;
}
function setNav(hash) {
  const studio = hash.startsWith('#/studio'), home = /^#?\/?$/.test(hash);
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === 'studio' ? studio : home));
}
window.addEventListener('hashchange', render);

/* ---------- match quiz (one question at a time) ---------- */
const PACE_OPTS = [
  ['relaxed', 'Slow and easy', 'Long lunches, three or four stops, no rushing.'],
  ['balanced', 'A good mix', 'Five or six stops with room to wander.'],
  ['active', 'See it all', 'Up early, packed day, sleep on the drive home.'],
];
const BUDGET_OPTS = [[40, '~$40', 'Cheap eats and free views'], [80, '~$80', 'A nice lunch and a ticket or two'], [150, '$150+', 'Treat yourselves']];

function openQuiz(onDone) {
  const ans = { vibes: [...(getPrefs()?.vibes ?? [])], pace: getPrefs()?.pace ?? 'balanced', budget: getPrefs()?.budget ?? 80 };
  let step = 0;
  const el = document.createElement('div');
  el.className = 'quiz-backdrop';
  document.body.appendChild(el);
  const close = () => el.remove();
  el.onclick = (e) => { if (e.target === el) close(); };

  const draw = () => {
    const trail = [0, 1, 2].map((i) => `<span class="${i <= step ? 'on' : ''}"></span>`).join('');
    const body = [
      () => `<h2>What makes a great day for you?</h2><p class="muted">Pick as many as you like.</p>
        <div class="chips left">${VIBES.map((v) => `<button type="button" class="chip ${ans.vibes.includes(v) ? 'on' : ''}" data-v="${v}">${v}</button>`).join('')}</div>`,
      () => `<h2>How do you like to move?</h2>
        <div class="opts">${PACE_OPTS.map(([id, t, d]) => `<button type="button" class="opt ${ans.pace === id ? 'on' : ''}" data-p="${id}"><b>${t}</b><span class="muted small">${d}</span></button>`).join('')}</div>`,
      () => `<h2>What's the budget, per person, for the day?</h2>
        <div class="opts">${BUDGET_OPTS.map(([n, t, d]) => `<button type="button" class="opt ${ans.budget === n ? 'on' : ''}" data-b="${n}"><b>${t}</b><span class="muted small">${d}</span></button>`).join('')}</div>`,
    ][step]();
    el.innerHTML = `<div class="quiz" role="dialog" aria-label="Find your match">
      <div class="quiz-top"><div class="trail">${trail}</div><button class="x" aria-label="Close">✕</button></div>
      ${body}
      <div class="quiz-nav">${step ? '<button class="ghost" data-nav="back">Back</button>' : '<span></span>'}
      <button class="primary" data-nav="next" ${step === 0 && !ans.vibes.length ? 'disabled' : ''}>${step === 2 ? 'Show my matches' : 'Next'}</button></div>
    </div>`;
    el.querySelector('.x').onclick = close;
    el.querySelectorAll('[data-v]').forEach((b) => (b.onclick = () => { const v = b.dataset.v; ans.vibes = ans.vibes.includes(v) ? ans.vibes.filter((x) => x !== v) : [...ans.vibes, v]; draw(); }));
    el.querySelectorAll('[data-p]').forEach((b) => (b.onclick = () => { ans.pace = b.dataset.p; draw(); }));
    el.querySelectorAll('[data-b]').forEach((b) => (b.onclick = () => { ans.budget = +b.dataset.b; draw(); }));
    el.querySelector('[data-nav=back]')?.addEventListener('click', () => { step--; draw(); });
    el.querySelector('[data-nav=next]').onclick = () => { if (step < 2) { step++; draw(); } else { setPrefs(ans); close(); onDone(); } };
  };
  draw();
}

/* ---------- home: map of locals in Orange County ---------- */
// The demo is locked to OC: the map can't pan or zoom out past the county.
const OC_BOUNDS = L.latLngBounds([33.38, -118.13], [33.96, -117.40]);
// Mouse users get a hover card and click through; touch users tap a face for the same card, pinned to the map's bottom edge.
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

const facePin = (c, cls = '') => L.divIcon({
  className: `fpin ${cls}`,
  html: `<div class="fpin-in" style="--c:${c.color}"><img src="${c.photo}" alt=""><span class="fpin-em">${c.avatar}</span></div>`,
  iconSize: [52, 52], iconAnchor: [26, 26],
});

// The card a face opens on the map: who they are, their travel taste, and what the old list showed.
function peek(c, m, mi) {
  const dist = mi != null ? ` · ${mi < 1 ? 'under 1' : mi.toFixed(1)} mi away` : '';
  return `<div class="peek-card">
    <img class="avatar" src="${c.photo}" alt="" style="--c:${c.color}">
    <div class="peek-body">
      <div class="peek-top"><b>${esc(c.name)}</b>${m ? `<span class="match">${m.score}% match</span>` : ''}</div>
      <div class="muted small">${cityName(c.city)}${dist} · ★ ${c.rating} (${c.reviews})</div>
      <p class="peek-taste">${esc(c.taste)}</p>
      ${m?.good[0] ? `<div class="why small">✓ ${esc(m.good[0])}</div>` : ''}
      <div class="peek-foot"><span class="small">from <b>$${PACKAGES[0].price}</b></span>${canHover
        ? `<span class="peek-go">View profile →</span>`
        : `<a class="btn primary peek-cta" href="#/c/${c.id}">See ${esc(first(c))}'s days</a>`}</div>
    </div>
  </div>`;
}

function home(params) {
  const interest = params.get('interest') || '';
  const prefs = getPrefs();
  const filtered = CREATORS.filter((c) => !interest || c.categories.includes(interest));
  const list = prefs ? rankCreators(prefs, filtered) : filtered.map((c) => ({ c }));
  const matchOf = Object.fromEntries(list.map(({ c, m }) => [c.id, m]));
  const chipHref = (i) => (i ? `#/?interest=${encodeURIComponent(i)}` : '#/');

  app.innerHTML = `
  <section class="lhero">
    <span class="eyebrow">Day trips planned by locals · Orange County</span>
    <h1>Hire a local to plan your day.</h1>
    <ol class="how3">
      <li><b>1</b>Pick a local on the map</li>
      <li><b>2</b>Tell them what you're into</li>
      <li><b>3</b>Get your day, stop by stop</li>
    </ol>
  </section>
  <section class="lmap">
    <div class="lmap-map">
      <div id="map"></div>
      <div class="map-ui">
        <div class="chips map-chips">${['', ...CATEGORIES].map((i) => `<a class="chip ${i === interest ? 'on' : ''}" href="${chipHref(i)}">${i || 'All'}</a>`).join('')}</div>
        <div class="map-bar">
          <div class="map-panel">
            <span class="results-head">${filtered.length} local${filtered.length === 1 ? '' : 's'} in <b>${REGION.name}</b>${interest ? ` · ${esc(interest)} · <a href="#/">clear</a>` : ''}</span>
            ${prefs
              ? `<span>Matched to <b>${esc(prefs.vibes.join(', '))}</b> · <button class="link" id="quizBtn">Retake</button> · <button class="link" id="clearPrefs">Clear</button></span>`
              : `<span><span class="hide-sm">Not sure who to pick? </span><button class="link" id="quizBtn">Find your match in 3 questions</button></span>`}
          </div>
          <button type="button" class="nearme" id="nearMe">📍 <span class="hide-sm">Locals </span>near me</button>
        </div>
      </div>
      <div class="map-note" id="mapNote" ${filtered.length ? 'hidden' : ''}>No locals for ${esc(interest)} yet. <a href="#/">See everyone</a></div>
      <div class="map-card" id="mapCard" hidden></div>
    </div>
  </section>
  <section class="why-local slim">
    <h2>Why a local beats a search bar</h2>
    <div class="wl-grid">
      <div><span class="wl-ic">📅</span><h3>They were there last week</h3><p>Reviews lag by months. Your local knows the truck moved and the line is shorter on Tuesdays.</p></div>
      <div><span class="wl-ic">🤫</span><h3>The stuff nobody writes down</h3><p>What to order, where to park, which window takes cash. Every stop comes with insider details.</p></div>
      <div><span class="wl-ic">💬</span><h3>Someone to text on the day</h3><p>Running late or rained out? Your local has a plan B, and actually answers.</p></div>
    </div>
  </section>`;

  document.getElementById('quizBtn').onclick = () => openQuiz(render);
  document.getElementById('clearPrefs')?.addEventListener('click', () => { setPrefs(null); render(); });

  // Map, locked to the county
  const map = makeMap('map', REGION.center, REGION.zoom);
  map.zoomControl.setPosition('bottomright');
  map.setMaxBounds(OC_BOUNDS.pad(0.05));
  map.options.maxBoundsViscosity = 1;
  map.setMinZoom(10);

  // One face per local. Hover (or keyboard focus) enlarges it and shows their card; click opens the profile.
  let me = null;
  const best = prefs && list[0]?.c.id;
  const markers = {};
  const cardEl = document.getElementById('mapCard');
  let shown = null;
  const showCard = (c) => {
    if (shown) markers[shown].getElement()?.classList.remove('open');
    shown = c?.id ?? null;
    cardEl.hidden = !c;
    if (!c) return;
    cardEl.innerHTML = peek(c, matchOf[c.id], me ? miles(me, c.ll) : null);
    markers[c.id].getElement()?.classList.add('open');
  };
  map.on('click', () => showCard(null));
  CREATORS.forEach((c) => {
    const dim = !filtered.includes(c);
    const content = () => peek(c, matchOf[c.id], me ? miles(me, c.ll) : null);
    const mk = L.marker(c.ll, { icon: facePin(c, dim ? 'dim' : c.id === best ? 'top' : ''), riseOnHover: true, zIndexOffset: dim ? -500 : 0 }).addTo(map);
    const el = mk.getElement();
    el.setAttribute('aria-label', `${c.name}: ${c.taste}`);
    if (canHover) {
      mk.bindTooltip(content, { className: 'peek', direction: 'top', offset: [0, -32], opacity: 1 });
      const go = () => (location.hash = `#/c/${c.id}`);
      mk.on('click', go);
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    } else {
      mk.on('click', () => showCard(c));
    }
    // Faces in the top part of the map open their card below, so the filter bar doesn't cover it
    mk.on('tooltipopen', ({ tooltip }) => {
      const below = map.latLngToContainerPoint(c.ll).y < 330;
      Object.assign(tooltip.options, below ? { direction: 'bottom', offset: [0, 32] } : { direction: 'top', offset: [0, -32] });
      tooltip.update();
    });
    mk.on('tooltipopen', () => el.classList.add('open'));
    mk.on('tooltipclose', () => el.classList.remove('open'));
    markers[c.id] = mk;
  });
  map.options.zoomSnap = 0.5; // half steps let the faces spread out instead of bunching up
  const fit = { paddingTopLeft: [50, 110], paddingBottomRight: [50, 40], maxZoom: 12, animate: false };
  if (filtered.length > 1) map.fitBounds(filtered.map((c) => c.ll), fit);
  else if (filtered.length === 1) map.setView(filtered[0].ll, 12, { animate: false });

  // "Locals near me": inside OC, show the traveler's dot, add distances to every card and open the closest
  const note = (t) => { const n = document.getElementById('mapNote'); if (n) { n.textContent = t; n.hidden = !t; } };
  document.getElementById('nearMe').onclick = (e) => {
    const btn = e.currentTarget;
    if (!navigator.geolocation) return note('Location isn’t available in this browser.');
    btn.disabled = true; note('Finding you…');
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      if (!document.getElementById('map')) return; // navigated away meanwhile
      btn.disabled = false;
      const here = [coords.latitude, coords.longitude];
      if (!OC_BOUNDS.contains(here)) return note('This demo covers Orange County only. Showing every local here.');
      me = here;
      L.marker(me, { icon: L.divIcon({ className: 'me-dot', iconSize: [18, 18], iconAnchor: [9, 9] }), interactive: false, zIndexOffset: -100 }).addTo(map);
      map.setView(me, 11);
      const closest = [...list].sort((a, b) => miles(me, a.c.ll) - miles(me, b.c.ll))[0];
      if (!closest) return note('');
      const mi = miles(me, closest.c.ll);
      if (!canHover) { note(''); return showCard(closest.c); } // the card itself shows the distance
      note(`Closest local: ${first(closest.c)}, ${mi < 1 ? 'under 1' : mi.toFixed(1)} mi away`);
      markers[closest.c.id].openTooltip();
    }, () => { btn.disabled = false; note('Couldn’t get your location. Showing all of Orange County.'); },
    { timeout: 8000, maximumAge: 600000 });
  };
}

/* ---------- creator profile ---------- */
// Style web: the home-page categories around dotted-trail rings, filled in Mango.
// Names with "&" break onto two lines so "History & museums" doesn't run off the side.
function styleWeb(c) {
  const C = [200, 160], R = 110, n = CATEGORIES.length;
  const pt = (i, r) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)].map((v) => +v.toFixed(1)); };
  const score = (cat) => c.categoryScores[cat] ?? 0;
  const best = Math.max(...CATEGORIES.map(score));
  const vals = CATEGORIES.map((cat, i) => pt(i, (R * score(cat)) / 100));
  const rings = [0.25, 0.5, 0.75, 1].map((k) => `<circle class="web-ring${k === 1 ? ' outer' : ''}" cx="${C[0]}" cy="${C[1]}" r="${R * k}"/>`).join('');
  const labels = CATEGORIES.map((cat, i) => {
    const [x, y] = pt(i, R + 18), cos = Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / n);
    const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';
    const lines = cat.includes(' & ') ? [cat.split(' & ')[0] + ' &', cat.split(' & ')[1]] : [cat];
    return `<text class="web-label${score(cat) === best ? ' best' : ''}" x="${x}" y="${y}" text-anchor="${anchor}">${lines.map((l, j) => `<tspan x="${x}" dy="${j ? 16 : -(lines.length - 1) * 8}">${esc(l)}</tspan>`).join('')}</text>`;
  }).join('');
  return `<svg class="web" viewBox="0 0 400 312" role="img" aria-label="${esc(first(c))}'s style: ${CATEGORIES.map((cat) => `${cat} ${score(cat)}`).join(', ')}">
    ${rings}
    <polygon class="web-shape" points="${vals.map((v) => v.join(',')).join(' ')}"/>
    ${vals.map(([x, y]) => `<circle class="web-dot" cx="${x}" cy="${y}" r="4.5"/>`).join('')}
    ${labels}
  </svg>`;
}

function profile(id, params) {
  const c = creatorById(id);
  if (!c) return (app.innerHTML = `<div class="wrap">Creator not found.</div>`);
  const fromIG = params.get('ref') === 'ig';
  const samples = SAMPLES.filter((s) => s.creator === id);
  const prefs = getPrefs();
  const m = prefs && creatorMatch(prefs, c);
  const socials = Object.entries(c.socials).map(([net, h]) => `<a class="social" href="https://${net}.com/${esc(h)}" target="_blank" rel="noopener">${net}</a>`).join('');
  const lib = Object.entries(c.library).filter(([pid]) => !PLACES[pid].permanentlyClosed);
  const fresh = lib.filter(([, [d]]) => daysAgo(d) <= 60).length;
  const name = esc(first(c));
  const city = esc(cityName(c.city));

  app.innerHTML = `<div class="wrap">
    ${fromIG ? `<div class="banner">Hey, you came from Instagram 👋 This is where ${name} plans days for people like you.</div>` : ''}
    ${c.thisWeek.length ? `<section class="news" aria-label="This week in ${city}">
      <span class="news-tag"><i></i>This week in ${city}</span>
      <div class="news-items">${c.thisWeek.map(([d, t]) => `<p><b>${esc(d)}</b>${esc(t)}</p>`).join('')}</div>
      <span class="news-src">Straight from ${name}</span>
    </section>` : ''}

    <div class="prof-top">
      <section class="prof-head">
        <div class="prof-pic">
          <img class="avatar xl" src="${c.photo}" alt="" style="--c:${c.color}">
          ${m ? `<div class="mbadge" tabindex="0" aria-describedby="mwhy"><b>${m.score}%</b> match
            <div class="mpop" role="tooltip" id="mwhy"><b>Why ${name} fits you</b>
              <ul class="fit-list">${m.good.map((g) => `<li class="good">${esc(g)}</li>`).join('')}${m.miss.map((g) => `<li class="miss">${esc(g)}</li>`).join('')}</ul>
              <button class="link small" id="quizBtn">Retake the quiz</button></div></div>`
            : `<button class="mbadge ask" id="quizBtn">Find your match</button>`}
        </div>
        <div>
          <h1>${esc(c.name)}</h1>
          <div class="muted">@${esc(c.handle)} · ${k(c.followers)} followers · Lives in <b>${city}</b> · ★ ${c.rating} (${c.reviews} days planned)</div>
          <p class="bio">${esc(c.bio)}</p>
          <div class="tags">${[...c.interests, ...c.styles].map((i) => `<span>${i}</span>`).join('')}</div>
          <div class="socials">${socials}<button class="ghost small" id="copylink">Copy link-in-bio URL</button></div>
        </div>
      </section>

      <section class="prof-style">
        <h2>${name}'s style</h2>
        ${styleWeb(c)}
        <p class="muted small">Plans <b>${c.pace}</b> days · usually ~$${c.spend}/person · ${lib.length} places in ${name}'s personal library</p>
      </section>

      <aside class="bookcard" id="bookcard">
        <h2>Get your day planned</h2>
        <div class="pick two-opt">${PACKAGES.map((p, i) => `
          <label class="opt"><input type="radio" name="bpkg" value="${p.id}" ${i ? '' : 'checked'}/>
            <span class="opt-top"><b>${p.name}</b><span class="price">$${p.price}</span></span><small>${p.blurb}</small></label>`).join('')}</div>
        <div class="pick">${TIERS.map((t, i) => `
          <label class="opt"><input type="radio" name="btier" value="${t.id}" ${i ? '' : 'checked'}/>
            <span class="opt-top"><b>${t.name}</b><span class="price">${t.add ? `+$${t.add}` : 'Included'}</span></span><small>${esc(t.blurb.replace('your local', first(c)))}</small></label>`).join('')}</div>
        <a class="primary btn bookgo" id="bookGo" href="#/c/${c.id}/book">Book ${name}</a>
        <p class="muted small center" id="bookNote"></p>
      </aside>
    </div>
    <button class="primary book-sticky" id="bookJump">Book ${name} · from $${PACKAGES[0].price}</button>

    <h2>${name}'s three favorite places</h2>
    <div class="grid3">${c.top3.map((pid, i) => { const p = PLACES[pid], own = c.library[pid]; return `
      <div class="place"><div class="pnum">${i + 1}</div><b>${esc(p.name)}</b>
      <div class="muted small">${p.type} · ${cityName(p.city)}${p.localOwned ? ' · <span class="lo">local-owned</span>' : ''}</div>
      ${own ? `<div class="note small">${esc(own[1])}</div><div class="muted small">Last visited ${daysAgo(own[0])} days ago</div>` : ''}
      ${c.perks[pid] ? `<div class="perk small">🎁 ${esc(c.perks[pid])}</div>` : ''}</div>`; }).join('')}</div>

    <div class="two">
      <div>
        <h2>Free sample days</h2>
        ${samples.map((s) => { const v = verdict(validate(s)); return `
          <a class="sample" href="#/i/${s.id}"><b>${esc(s.title)}</b>
          <span class="muted small">${s.days[0].stops.length} stops · ${badge(v)}</span></a>`; }).join('') || '<div class="muted">No samples yet. Stay tuned.</div>'}
      </div>
      <div>
        <h2>How ${name} plans your day</h2>
        <ol class="process">
          <li><b>You share your vibe.</b> What you're into, your pace, your budget, and what to skip.</li>
          <li><b>${name} asks a question or two.</b> The stuff a form can't catch, like “are you okay with spicy?”</li>
          <li><b>A draft from places ${name} has actually been.</b> Picked from a personal library, plus spots other locals vouch for.</li>
          <li><b>You react stop by stop.</b> Love it, or ask for a swap. (Pick “Plan it together” at checkout.)</li>
          <li><b>Limon checks it.</b> Hours, closures, drive times and budget, before it ever reaches you.</li>
          <li><b>You go.</b> Every plan includes at least one adjustment if anything feels off.</li>
        </ol>
      </div>
    </div>

    <h2>From travelers who went</h2>
    <div class="reviews">${c.reviewList.map((r) => `
      <div class="review"><div class="review-top"><b>${esc(r.name)}</b><span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span></div>
      <div class="muted small">${esc(r.trip)} · ${esc(r.when)} ${r.went ? '<span class="badge pass">✓ Took the trip</span>' : '<span class="badge review">Hasn’t gone yet</span>'}</div>
      <p>${esc(r.text)}</p></div>`).join('')}</div>

    <h2>Why travelers trust ${name}</h2>
    <div class="trust">
      <div><b>${c.reviews}</b><span>days planned</span></div>
      <div><b>${c.stats.went}%</b><span>of travelers actually went</span></div>
      <div><b>${c.stats.onTime}%</b><span>delivered on time</span></div>
      <div><b>~${c.stats.replyHrs} hr</b><span>to reply</span></div>
      <div><b>${fresh} of ${lib.length}</b><span>places visited in the last 60 days</span></div>
      <div><b>${Object.keys(c.perks).length}</b><span>local businesses with perks for ${name}'s travelers</span></div>
    </div>

    <h2>${name}'s map</h2><div id="pmap" class="map"></div>
  </div>`;

  // Booking card: the price and link follow the package and tier picked
  const card = document.getElementById('bookcard');
  const syncBook = () => {
    const p = pkgById(card.querySelector('[name=bpkg]:checked').value), t = tierById(card.querySelector('[name=btier]:checked').value);
    const go = document.getElementById('bookGo');
    go.href = `#/c/${c.id}/book?pkg=${p.id}&tier=${t.id}`;
    go.textContent = `Book ${first(c)} · $${p.price + t.add}`;
    document.getElementById('bookNote').textContent = `Delivered in ${p.turnaround}. Nothing is charged in this demo.`;
  };
  card.addEventListener('change', syncBook); syncBook();
  // Phones get a floating Book button, hidden while the booking card itself is on screen
  const jump = document.getElementById('bookJump');
  jump.onclick = () => card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  new IntersectionObserver(([e]) => jump.classList.toggle('away', e.isIntersecting)).observe(card);

  document.getElementById('copylink').onclick = (e) => {
    const url = location.href.split('#')[0] + `#/c/${c.id}?ref=ig`;
    navigator.clipboard?.writeText(url).catch(() => {});
    e.target.textContent = 'Copied ✓';
  };
  document.getElementById('quizBtn').onclick = () => openQuiz(render);
  const map = makeMap('pmap', c.ll, 12);
  const live = c.places.filter((p) => !PLACES[p].permanentlyClosed);
  live.forEach((pid) => {
    const p = PLACES[pid];
    L.marker(p.ll, { icon: pinIcon(c.top3.includes(pid) ? '★' : '•', c.color, c.top3.includes(pid) ? 30 : 22) }).addTo(map).bindPopup(`<b>${esc(p.name)}</b><br>${p.type}`);
  });
  map.fitBounds(live.map((p) => PLACES[p].ll), { padding: [30, 30], maxZoom: 15, animate: false });
}

const badge = (v) => ({
  pass: '<span class="badge pass">✓ Checked by Limon</span>',
  review: '<span class="badge review">⚠ Worth a second look</span>',
  fail: '<span class="badge fail">✕ Needs a fix</span>',
}[v]);

/* ---------- commission flow ---------- */
function book(id, params) {
  const c = creatorById(id);
  let pkg = PACKAGES.find((p) => p.id === params.get('pkg')) ?? PACKAGES[0];
  let tier = tierById(params.get('tier'));
  const prefs = getPrefs();
  const picked = prefs?.vibes ?? Object.entries(c.fingerprint).filter(([, n]) => n >= 75).map(([v]) => v);
  const pace = prefs?.pace ?? 'balanced', name = esc(first(c));

  app.innerHTML = `<div class="wrap narrow">
    <a href="#/c/${c.id}" class="back">← ${esc(c.name)}</a>
    <h1>Plan a day with ${name}</h1>
    <form id="bookf" class="form">
      <fieldset><legend>1 · Pick your plan</legend>
        <div class="pkgs row">${PACKAGES.map((p) => `
          <label class="pkg radio"><input type="radio" name="pkg" value="${p.id}" ${p.id === pkg.id ? 'checked' : ''}/>
          <div class="pkg-top"><b>${p.name}</b><span class="price">$${p.price}</span></div><div class="muted small">${p.blurb}</div></label>`).join('')}</div>
        <div class="pkgs row tiers">${TIERS.map((t) => `
          <label class="pkg radio"><input type="radio" name="tier" value="${t.id}" ${t.id === tier.id ? 'checked' : ''}/>
          <div class="pkg-top"><b>${t.name}</b><span class="price">${t.add ? `+$${t.add}` : 'Included'}</span></div><div class="muted small">${esc(t.blurb.replace('your local', first(c)))}</div></label>`).join('')}</div>
      </fieldset>
      <fieldset><legend>2 · How do you want to plan?</legend>
        <div class="pkgs row two-up">
          <label class="pkg radio"><input type="radio" name="mode" value="together" checked/>
            <div class="pkg-top"><b>Plan it together</b><span class="muted small">Recommended</span></div>
            <div class="muted small">${name} asks a few questions and sends a draft. You react stop by stop before anything's final.</div></label>
          <label class="pkg radio"><input type="radio" name="mode" value="solo"/>
            <div class="pkg-top"><b>Surprise me</b></div>
            <div class="muted small">Hand it over. ${name} plans it start to finish and you open it ready to go.</div></label>
        </div>
      </fieldset>
      <fieldset><legend>3 · Tell ${name} about you</legend>
        <div class="row">
          <label>Your name<input name="traveler" required placeholder="First name" /></label>
          <label>Start date<input type="date" name="start" required value="2026-11-07" /></label>
          <label>Group size<input type="number" name="group" min="1" max="20" value="2" /></label>
        </div>
        <div class="row">
          <label>Budget per person / day ($)<input type="number" name="budget" min="0" value="${prefs?.budget ?? 80}" /></label>
          <label>Pace<select name="pace">${PACE_OPTS.map(([v, t]) => `<option value="${v}" ${v === pace ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        </div>
        <label>Getting around</label>
        <div class="chips">${Object.entries({ drive: '🚗 Driving', walk: '🚶 Walking', bike: '🚲 Biking' }).map(([v, t], i) => `<label class="chip check"><input type="radio" name="travel" value="${v}" ${i === 0 ? 'checked' : ''}/>${t}</label>`).join('')}</div>
        <label>What are you into?</label>
        <div class="chips">${VIBES.map((v) => `<label class="chip check"><input type="checkbox" name="vibes" value="${v}" ${picked.includes(v) ? 'checked' : ''}/>${v}</label>`).join('')}</div>
        <label>What would make the day?<input name="must" placeholder="The best tacos in town, a sunset spot…" /></label>
        <label>What should we skip?<input name="avoid" placeholder="Long lines, steep hikes, chains…" /></label>
        <label>Anything else ${name} should know?<textarea name="notes" rows="3" placeholder="Where you're staying, dietary needs, mobility, occasion…"></textarea></label>
      </fieldset>
      <fieldset><legend>4 · Checkout</legend>
        <div class="summary" id="summary"></div>
        <p class="muted small">Demo checkout. Nothing is charged. In production this goes to Stripe Connect with payment held until delivery.</p>
        <button class="primary">Send to ${name}</button>
      </fieldset>
    </form>
  </div>`;

  const f = document.getElementById('bookf');
  const sum = () => {
    pkg = PACKAGES.find((p) => p.id === f.pkg.value);
    tier = tierById(f.tier.value);
    const total = pkg.price + tier.add;
    const fee = Math.round(total * TAKE_RATE * 100) / 100;
    document.getElementById('summary').innerHTML = `
      <div><span>${pkg.name} by ${esc(c.name)}</span><span>$${total.toFixed(2)}</span></div>
      <div class="muted small"><span>${tier.name}: ${esc(tier.blurb.replace('your local', first(c)))}</span><span>${tier.add ? `+$${tier.add.toFixed(2)}` : 'Included'}</span></div>
      <div class="muted small"><span>Creator earns</span><span>$${(total - fee).toFixed(2)}</span></div>
      <div class="muted small"><span>Platform fee (${TAKE_RATE * 100}%)</span><span>$${fee.toFixed(2)}</span></div>`;
  };
  f.addEventListener('change', sum); sum();
  f.onsubmit = (e) => {
    e.preventDefault();
    const d = new FormData(f);
    const order = {
      id: 'ord-' + Math.random().toString(36).slice(2, 8), creator: c.id, pkg: pkg.id, tier: tier.id, mode: d.get('mode'), status: 'requested', createdAt: Date.now(),
      traveler: d.get('traveler'),
      intake: { start: d.get('start'), group: +d.get('group'), budget: +d.get('budget'), pace: d.get('pace'), travel: d.get('travel'), vibes: d.getAll('vibes'), must: d.get('must'), avoid: d.get('avoid'), notes: d.get('notes') },
      days: null, feedback: {}, rounds: 0, messages: [],
    };
    loadOrders().unshift(order); saveOrders();
    location.hash = `#/order/${order.id}`;
  };
}

/* ---------- messages (shared by traveler + creator views) ---------- */
function mountThread(el, o, me, quick = []) {
  const c = creatorById(o.creator);
  const who = (m) => (m.from === 'creator' ? first(c) : m.from === 'system' ? 'Limon' : o.traveler);
  const draw = () => {
    el.innerHTML = `<div class="thread">
      ${o.messages.map((m) => `<div class="msg ${m.from === me ? 'me' : ''} ${m.from}"><span class="who">${esc(who(m))}</span>${esc(m.text)}</div>`).join('') || `<div class="muted small">No messages yet.</div>`}
    </div>
    ${quick.length ? `<div class="quick"><span class="muted small">Quick questions</span>${quick.map((q, i) => `<button class="chip" data-q="${i}">${esc(q)}</button>`).join('')}</div>` : ''}
    <form class="compose"><input name="t" placeholder="Write a message…" autocomplete="off" /><button class="ghost">Send</button></form>`;
    const send = (text) => { if (!text.trim()) return; o.messages.push({ from: me, text: text.trim(), at: Date.now() }); saveOrders(); draw(); };
    el.querySelector('form').onsubmit = (e) => { e.preventDefault(); send(e.target.t.value); };
    el.querySelectorAll('[data-q]').forEach((b) => (b.onclick = () => { send(quick[+b.dataset.q]); quick.splice(+b.dataset.q, 1); draw(); }));
    const t = el.querySelector('.thread'); t.scrollTop = t.scrollHeight;
  };
  draw();
}
const sysMsg = (o, text) => o.messages.push({ from: 'system', text, at: Date.now() });

/* ---------- traveler order page ---------- */
function orderPage(id) {
  const o = orderById(id);
  if (!o) return (app.innerHTML = `<div class="wrap">Order not found.</div>`);
  if (o.status === 'delivered') return (location.hash = `#/i/${o.id}`);
  const c = creatorById(o.creator), pkg = pkgById(o.pkg), name = esc(first(c));
  const steps = o.mode === 'together' ? ['Sent', 'Questions & draft', 'Your review', 'Delivered'] : ['Sent', 'Being planned', 'Delivered'];
  const at = o.mode === 'together' ? { requested: 0, drafting: 1, review: 2, approved: 2 }[o.status] : { requested: 0, drafting: 1 }[o.status];
  const head = {
    requested: [`You're on ${name}'s list.`, `${name} usually sends a ${pkg.name} plan within <b>${pkg.turnaround}</b>. You've got a free Saturday coming. Let's use it.`],
    drafting: [`${name} is planning your day.`, o.mode === 'together' ? `Keep an eye on your messages. ${name} might have a question or two before sending the draft.` : `Sit tight. You'll get your plan the moment it's ready.`],
    review: [`${name} sent you a draft.`, `React to each stop. Love it, or ask for a swap. Nothing's final until you say so.`],
    approved: [`You approved the plan.`, `${name} is putting on the finishing touches. Your itinerary lands here next.`],
  }[o.status];

  app.innerHTML = `<div class="wrap narrow">
    <div class="center">
      <img class="avatar xl" src="${c.photo}" alt="" style="--c:${c.color}">
      <h1>${head[0]}</h1><p>${head[1]}</p>
      <ol class="steps">${steps.map((s, i) => `<li class="${i < at ? 'done' : i === at ? 'now' : ''}">${s}</li>`).join('')}</ol>
    </div>
    ${o.status === 'review' ? `<section class="draft"><h2>Your draft</h2><div id="draft"></div>
      <div class="row gap"><button class="primary" id="approve">Looks perfect</button><button class="ghost" id="sendfb">Send my feedback</button></div>
      <p class="muted small" id="fbnote"></p></section>` : ''}
    <h2>Messages with ${name}</h2>
    <div id="thread"></div>
    <p class="muted small center">Demo tip: switch to <a href="#/studio/${o.id}">${name}'s studio</a> to answer as the creator.</p>
  </div>`;
  mountThread(document.getElementById('thread'), o, 'traveler');

  if (o.status === 'review') {
    const drawDraft = () => {
      document.getElementById('draft').innerHTML = o.days.map((d, di) => `
        <h3>Day ${di + 1} · ${new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
        ${[...d.stops].sort((a, b) => toMin(a.time) - toMin(b.time)).map((s, si, arr) => {
          const key = `${di}:${s.place}`, fb = o.feedback[key] ?? {}, p = PLACES[s.place];
          const next = arr[si + 1], dep = toMin(s.time) + Number(s.duration), l = next && leg(s.place, next.place, d.date, dep, legMode(o, s));
          return `<div class="dstop" data-k="${key}">
            <div class="dstop-main"><span class="t">${fmtTime(toMin(s.time))}</span><div><b>${esc(p.name)}</b> <span class="muted small">${p.type}</span>${s.note ? `<div class="note small">${esc(s.note)}</div>` : ''}</div></div>
            <div class="react"><button class="chip ${fb.r === 'love' ? 'on' : ''}" data-r="love">❤️ Love it</button><button class="chip ${fb.r === 'swap' ? 'on' : ''}" data-r="swap">🔄 Swap this</button></div>
            ${fb.r === 'swap' ? `<input class="fbc" placeholder="What would you rather do instead?" value="${esc(fb.c ?? '')}" />` : ''}
          </div>${l ? `<div class="legline plain">${legIcon(l)} ${esc(legText(l, dep, fmtTime))}</div>` : ''}`;
        }).join('')}`).join('');
      document.querySelectorAll('.dstop').forEach((row) => {
        const key = row.dataset.k;
        row.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => { o.feedback[key] = { ...o.feedback[key], r: b.dataset.r }; saveOrders(); drawDraft(); }));
        row.querySelector('.fbc')?.addEventListener('input', (e) => { o.feedback[key].c = e.target.value; saveOrders(); });
      });
    };
    drawDraft();
    document.getElementById('approve').onclick = () => {
      o.status = 'approved'; sysMsg(o, `${o.traveler} approved the draft.`); saveOrders(); render();
    };
    document.getElementById('sendfb').onclick = () => {
      const fb = Object.values(o.feedback), swaps = fb.filter((x) => x.r === 'swap').length, loves = fb.filter((x) => x.r === 'love').length;
      if (!fb.length) return (document.getElementById('fbnote').textContent = 'React to at least one stop first.');
      o.status = 'drafting'; o.rounds++;
      sysMsg(o, `${o.traveler} reacted to the draft: ❤️ ${loves} · 🔄 ${swaps}.`); saveOrders(); render();
    };
  }
}

/* ---------- itinerary view (samples + delivered orders) ---------- */
function itineraryPage(id) {
  const sample = SAMPLES.find((s) => s.id === id);
  const order = sample ? null : orderById(id);
  const it = sample ?? (order?.days && { ...order, title: `${pkgById(order.pkg).name} for ${order.traveler}` });
  if (!it) return (app.innerHTML = `<div class="wrap">Itinerary not ready yet.</div>`);
  const c = creatorById(it.creator);
  const issues = validate(it);
  const v = verdict(issues);
  const together = order?.mode === 'together';

  app.innerHTML = `<div class="wrap">
    <a href="#/c/${c.id}" class="back">← ${esc(c.name)}</a>
    <div class="it-card"><div class="it-card-inner">
      <span class="eyebrow">${sample ? 'Free sample day' : 'Your day trip itinerary'}</span>
      <h1>${esc(it.title)}</h1>
      <div class="muted">Planned by @${esc(c.handle)}${together ? ` with you${order.rounds ? ` · ${order.rounds} round${order.rounds > 1 ? 's' : ''} of feedback` : ''}` : ''} · ${it.days.reduce((n, d) => n + d.stops.length, 0)} stops · ${it.intake.group} people · $${it.intake.budget}/person/day</div>
      <div class="verify">${badge(v)}<span class="muted small">Hours, closures, drive times and budget, all checked</span></div>
    </div></div>
    ${localTally(it, c)}
    <div class="two">
      <div><div id="days">${it.days.map((d, di) => dayTimeline(d, di, issues, it)).join('')}</div>
        ${sample ? `<a class="primary btn" href="#/c/${c.id}/book">Get a day like this, planned for you</a>` : ''}
        ${order ? `<div class="went" id="went">${order.went ? `<b>Thanks for telling ${esc(first(c))} 💛</b><div class="muted small">“Took the trip” reviews are how travelers know who to trust.</div>`
          : `<b>Back from your day?</b><div class="muted small">Let ${esc(first(c))} know you went. It powers the “took the trip” numbers other travelers rely on.</div><button class="primary" id="wentBtn">We went!</button>`}</div>` : ''}
        ${order ? `<section class="dayof"><h2>Day-of help from ${esc(first(c))}</h2>
          <p class="muted">Running late? Somewhere closed? Rained out? Text ${esc(first(c))}. A search bar can't adjust your day. A local can.</p>
          <div id="dayof"></div></section>` : ''}
      </div>
      <div class="sticky"><div id="imap" class="map tall"></div><div id="ichecks">${issueList(issues)}</div></div>
    </div>
  </div>`;
  document.getElementById('wentBtn')?.addEventListener('click', () => { order.went = true; saveOrders(); render(); });
  if (order) mountThread(document.getElementById('dayof'), order, 'traveler', ['We’re running late. What should we skip?', 'Somewhere’s closed. What’s plan B?', 'Anything good nearby right now?']);
  // Google travel times arrive after first paint: refresh just the legs and checks, not the map.
  fetchLegs(it, toMin).then((got) => {
    const days = document.getElementById('days');
    if (!got || !days || !location.hash.startsWith(`#/i/${id}`)) return;
    const fresh = validate(it);
    days.innerHTML = it.days.map((d, di) => dayTimeline(d, di, fresh, it)).join('');
    document.getElementById('ichecks').innerHTML = issueList(fresh);
  });

  const map = makeMap('imap', c.ll, 12);
  const pts = [];
  it.days.forEach((d) => [...d.stops].sort((a, b) => toMin(a.time) - toMin(b.time)).forEach((s, i) => {
    const p = PLACES[s.place]; pts.push(p.ll);
    L.marker(p.ll, { icon: numIcon(i + 1) }).addTo(map).bindPopup(`<b>${esc(p.name)}</b><br>${fmtTime(toMin(s.time))}`);
  }));
  if (pts.length) { L.polyline(pts, { color: '#333333', weight: 4, dashArray: '8 10', lineCap: 'round' }).addTo(map); map.fitBounds(pts, { padding: [30, 30], maxZoom: 15, animate: false }); }
}

function dayTimeline(d, di, issues, it) {
  const c = creatorById(it.creator);
  const stops = [...d.stops].sort((a, b) => toMin(a.time) - toMin(b.time));
  const date = new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  return `<h2>Day ${di + 1} <span class="muted">· ${date}</span></h2><ol class="timeline">
    ${stops.map((s, i) => {
      const p = PLACES[s.place];
      const flagged = issues.some((x) => x.day === di && x.stop === s.place && x.level !== 'info');
      const dep = toMin(s.time) + Number(s.duration);
      const l = stops[i + 1] ? leg(s.place, stops[i + 1].place, d.date, dep, legMode(it, s)) : null;
      return `<li class="${flagged ? 'flag' : ''}"><div class="t">${fmtTime(toMin(s.time))}</div><span class="n">${i + 1}</span>
        <div><b>${esc(p.name)}</b> <span class="muted small">${p.type} · ${s.duration} min${p.localOwned ? ' · <span class="lo">local-owned</span>' : ''}</span>
        ${s.note ? `<div class="note">${esc(s.note)}</div>` : ''}
        ${insiderBlock(s, c.perks?.[s.place])}
        <a class="small" href="${gmaps(p)}" target="_blank" rel="noopener">Open in Maps ↗</a>
        ${l ? `<div class="travel">↓ ${legIcon(l)} ${esc(legText(l, dep, fmtTime))}</div>` : ''}</div></li>`;
    }).join('')}</ol>`;
}

function issueList(issues) {
  if (!issues.length) return `<div class="checks ok">Every stop is open when you get there, the drives work, and it fits the budget.</div>`;
  return `<ul class="checks">${issues.map((i) => `<li class="${i.level}">${{ error: '✕', warn: '⚠', info: 'ℹ' }[i.level]} ${esc(i.msg)}</li>`).join('')}</ul>`;
}

/* ---------- creator studio ---------- */
const STATUS = { requested: 'New request', drafting: 'Drafting', review: 'Waiting on traveler', approved: 'Approved, ready to deliver', delivered: 'Delivered' };

function studio(params) {
  const me = params.get('as') || 'marisol';
  const c = creatorById(me);
  const orders = loadOrders().filter((o) => o.creator === me);
  const earned = orders.filter((o) => o.status === 'delivered').reduce((s, o) => s + orderPrice(o) * (1 - TAKE_RATE), 0);

  app.innerHTML = `<div class="wrap">
    <div class="studio-head">
      <h1>Creator studio</h1>
      <div class="me"><button class="ghost small" id="reset">Reset demo</button><label class="muted" for="as">Signed in as</label><select id="as">${CREATORS.map((x) => `<option value="${x.id}" ${x.id === me ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></div>
    </div>
    <div class="stats">
      <div><b>${orders.filter((o) => o.status !== 'delivered').length}</b><span>open requests</span></div>
      <div><b>${orders.filter((o) => o.status === 'delivered').length}</b><span>delivered</span></div>
      <div><b>$${earned.toFixed(0)}</b><span>earned</span></div>
      <div class="linkbox"><span>Your link-in-bio</span><code>${esc(location.href.split('#')[0])}#/c/${c.id}?ref=ig</code></div>
    </div>
    <h2>Your requests</h2>
    ${orders.map((o) => { const p = pkgById(o.pkg); const last = o.messages.at(-1); return `
      <div class="req">
        <div><b>${esc(o.traveler)}</b> · ${p.name}, ${tierById(o.tier).name} ($${orderPrice(o)}) · ${o.intake.group} people · starts ${esc(o.intake.start)}
          <div class="pills"><span class="pill s-${o.status}">${STATUS[o.status]}</span><span class="pill">${o.mode === 'together' ? 'Plan it together' : 'Surprise me'}</span>${last && last.from === 'traveler' ? `<span class="pill new">${o.status === 'delivered' ? 'Day-of message' : 'New message'}</span>` : ''}</div>
          <div class="muted small">${esc([o.intake.vibes.join(', '), o.intake.must && 'Wants: ' + o.intake.must, o.intake.avoid && 'Skip: ' + o.intake.avoid].filter(Boolean).join(' · '))}</div></div>
        ${o.status === 'delivered' ? (last?.from === 'traveler' ? `<a class="primary btn" href="#/studio/${o.id}">Reply</a>` : `<a class="ghost btn" href="#/i/${o.id}">View delivered</a>`) : `<a class="primary btn" href="#/studio/${o.id}">${o.status === 'requested' ? 'Start planning' : 'Open'}</a>`}
      </div>`; }).join('') || `<div class="empty">No requests yet. Put your link in your bio and they'll come.</div>`}
  </div>`;
  document.getElementById('as').onchange = (e) => (location.hash = `#/studio?as=${e.target.value}`);
  document.getElementById('reset').onclick = () => { memOrders = seedOrders(); saveOrders(); render(); };
}

const DUR = { Café: 45, Coffee: 45, Museum: 120, Beach: 150, Park: 120, Hike: 120, 'Tide pools': 90, Zoo: 120 };

function builder(id) {
  const o = orderById(id);
  if (!o) return (app.innerHTML = `<div class="wrap">Order not found.</div>`);
  const c = creatorById(o.creator), pkg = pkgById(o.pkg), tn = esc(o.traveler.split(' ')[0]);
  if (!o.days) {
    o.days = Array.from({ length: pkg.days }, (_, i) => {
      const d = new Date(o.intake.start + 'T12:00:00'); d.setDate(d.getDate() + i);
      return { date: d.toISOString().slice(0, 10), stops: [] };
    });
  }
  if (o.status === 'requested') { o.status = 'drafting'; saveOrders(); }
  let day = 0;
  const openIns = new Set(); // which stops have their insider panel open, kept across redraws
  const fbs = Object.values(o.feedback ?? {});
  const together = o.mode === 'together';

  app.innerHTML = `<div class="wrap">
    <a href="#/studio?as=${c.id}" class="back">← Studio</a>
    <h1>Plan for ${esc(o.traveler)} <span class="muted">· ${pkg.name}</span></h1>
    <div class="pills"><span class="pill s-${o.status}">${STATUS[o.status]}</span><span class="pill">${together ? 'Plan it together: share a draft first' : 'Surprise me: deliver when ready'}</span><span class="pill">${tierById(o.tier).name}: ${esc(tierById(o.tier).blurb.replace('your local', 'you'))}</span></div>
    <div class="intake">
      <div><span>Group</span>${o.intake.group}</div><div><span>Budget</span>$${o.intake.budget}/person/day</div>
      <div><span>Pace</span>${esc(o.intake.pace)}</div><div><span>Into</span>${esc(o.intake.vibes.join(', ') || '—')}</div>
      <div><span>Getting around</span>${MODES[o.intake.travel ?? 'drive']}</div>
      <div><span>Wants</span>${esc(o.intake.must || '—')}</div><div><span>Skip</span>${esc(o.intake.avoid || '—')}</div>
      ${o.intake.notes ? `<div class="wide"><span>Notes</span>${esc(o.intake.notes)}</div>` : ''}
    </div>
    ${o.rounds && o.status === 'drafting' ? `<div class="banner">${tn} reacted to your draft: ❤️ ${fbs.filter((f) => f.r === 'love').length} · 🔄 ${fbs.filter((f) => f.r === 'swap').length}. Swap requests are marked on the stops below.</div>` : ''}
    <div class="two builder">
      <div>
        <div class="tabs" id="tabs"></div>
        <p class="muted small">${usingGoogle() ? 'Search any place on Google Maps. Hours, closures and prices come straight from Google.' : 'Demo mode: searching sample places. Add a Google Maps key in <code>js/config.js</code> to search every place on Google.'}
          Stops time themselves: travel plus parking, and they wait for opening time.</p>
        <ol id="stops" class="bstops"></ol>
        <div class="badd"><button class="add-stop" id="add">+ Add a stop</button><button class="link small" id="fill">or start from my sample day</button></div>
        <details class="ideas"><summary>Need ideas? Places that fit ${tn}'s request</summary>
          <p class="muted small">Ranked against ${tn}'s vibes, must-dos, budget and day. Closed days and long-line risks are flagged.</p>
          <div id="sugg" class="sugg"></div>
        </details>
      </div>
      <div>
        <h2>Limon's check</h2>
        <div id="checks"></div>
        <div id="actions"></div>
        <p class="muted small" id="why"></p>
        <h2>Messages with ${tn}</h2>
        <div id="thread"></div>
      </div>
    </div>
  </div>`;

  mountThread(document.getElementById('thread'), o, 'creator', suggestQuestions(o, c));

  const persist = () => saveOrders();
  let sched = [];
  // Re-time every day from its first stop: travel + parking, waiting for opening hours.
  const reflow = () => { o.days.forEach((d, di) => { const info = schedule(o, di); if (di === day) sched = info; }); persist(); };
  const DURS = [15, 30, 45, 60, 75, 90, 120, 150, 180, 240];
  const fmtDur = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ''}`);
  const weekdayOf = () => new Date(o.days[day].date + 'T12:00:00').getDay();
  const meta = (p) => {
    const iv = openIntervals(p, weekdayOf()), dn = new Date(o.days[day].date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
    return [p.type, cityName(p.city), p.rating && `★ ${p.rating} (${k(p.ratingCount ?? 0)})`, p.priceLabel,
      iv === null ? 'Hours not listed' : iv.length ? `${dn} ${fmtHours(iv)}` : `Closed ${dn}`].filter(Boolean).map(esc).join(' · ');
  };

  // Times live in the left column and the time inputs; refresh them without rebuilding the cards.
  const paintTimes = () => {
    o.days[day].stops.forEach((s, i) => {
      const li = document.querySelector(`.bstop[data-i="${i}"]`); if (!li) return;
      const st = toMin(s.time);
      li.querySelector('.bt b').textContent = fmtTime(st);
      li.querySelector('.bt span').textContent = `until ${fmtTime(st + Number(s.duration))}`;
      const t = li.querySelector('[data-f=time]'); if (t !== document.activeElement) t.value = s.time;
    });
  };
  // The trip between stops, on the trail: mode toggle + time, and any wait for opening.
  const paintLegs = () => {
    const d = o.days[day];
    d.stops.forEach((s, i) => {
      const el = document.querySelector(`[data-legfor="${i}"]`), next = d.stops[i + 1];
      if (!el) return;
      if (!next || !PLACES[s.place] || !PLACES[next.place]) { el.innerHTML = '<span class="muted small">Pick both places to see the trip</span>'; return; }
      const depart = toMin(s.time) + Number(s.duration), mode = legMode(o, s), l = leg(s.place, next.place, d.date, depart, mode);
      const waited = sched[i + 1]?.waited ?? 0;
      el.innerHTML = `<div class="seg" role="group" aria-label="How to get to the next stop">${Object.entries(MODES).map(([v, t]) => `<button type="button" data-mode="${v}" class="${v === mode ? 'on' : ''}" title="${t.slice(3)}">${t.slice(0, 2)}</button>`).join('')}</div>
        <span>${esc(legText(l, depart, fmtTime))}${l.source === 'google' ? ' <span class="src">Google</span>' : ''}${waited ? ` <span class="wait">then wait ${waited} min for opening</span>` : ''}</span>`;
      el.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => {
        if (b.dataset.mode === (o.intake.travel ?? 'drive')) delete s.legMode; else s.legMode = b.dataset.mode;
        retime(); refreshLegs();
      }));
    });
  };
  const retime = () => { reflow(); paintTimes(); paintLegs(); check(); };
  let legTimer;
  const refreshLegs = () => { clearTimeout(legTimer); legTimer = setTimeout(() => fetchLegs(o, toMin).then((got) => { if (got) { retime(); refreshLegs(); } }), 500); };

  const draw = () => {
    reflow();
    document.getElementById('tabs').innerHTML = o.days.map((d, i) => `<button class="${i === day ? 'on' : ''}" data-i="${i}">Day ${i + 1} · ${new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</button>`).join('');
    document.querySelectorAll('#tabs button').forEach((b) => (b.onclick = () => { day = +b.dataset.i; draw(); }));
    const sugg = suggestPlaces(o, c, day);
    const issues = validate(o), stops = o.days[day].stops;
    document.getElementById('stops').innerHTML = stops.map((s, i) => {
      const fb = o.feedback?.[`${day}:${s.place}`], p = PLACES[s.place];
      const flag = issues.some((x) => x.day === day && x.stop === s.place && x.level === 'error');
      const durs = DURS.includes(+s.duration) ? DURS : [...DURS, +s.duration].sort((a, b) => a - b);
      return `<li class="bstop ${flag ? 'flag' : ''}" data-i="${i}">
        <div class="bt"><b></b><span></span></div>
        <span class="n">${i + 1}</span>
        <div class="bcard">
          <div class="bcard-top">
            <div class="pp"><input class="pp-in" data-i="${i}" value="${esc(p?.name ?? '')}" placeholder="Search a place… “tacos”, “Bowers”" autocomplete="off" role="combobox" aria-expanded="false" aria-label="Place for stop ${i + 1}" />
              <ul class="pp-list" role="listbox" hidden></ul></div>
            <div class="bact">
              <button type="button" data-move="-1" ${i === 0 ? 'disabled' : ''} title="Move earlier" aria-label="Move earlier">↑</button>
              <button type="button" data-move="1" ${i === stops.length - 1 ? 'disabled' : ''} title="Move later" aria-label="Move later">↓</button>
              <button type="button" data-del title="Remove stop" aria-label="Remove stop">✕</button>
            </div>
          </div>
          ${p ? `<div class="pp-meta">${meta(p)}</div>` : '<div class="pp-meta">Search Google Maps for the place</div>'}
          <div class="bfields">
            <label>${i === 0 ? 'Start' : 'Arrive'}<input type="time" data-f="time" value="${s.time}" /></label>
            <label>Stay<select data-f="duration">${durs.map((m) => `<option value="${m}" ${m === +s.duration ? 'selected' : ''}>${fmtDur(m)}</option>`).join('')}</select></label>
            ${i === 0 ? '' : s.pinTime ? `<button type="button" class="timechip pinned" data-unpin title="This time is fixed (like a reservation). Click to let Limon time it.">📌 Fixed time · use auto</button>` : `<span class="timechip">Auto-timed</span>`}
          </div>
          <input class="tip" data-f="note" value="${esc(s.note)}" placeholder="Your one-line tip for ${tn}…" />
          ${fb?.r === 'love' ? `<div class="fb love">❤️ ${tn} loves this one</div>` : fb?.r === 'swap' ? `<div class="fb swap">🔄 ${tn} wants a swap${fb.c ? `: “${esc(fb.c)}”` : ''}</div>` : ''}
          ${p ? insiderEditor(s, i, c.perks?.[s.place], openIns.has(i)) : ''}
        </div>
      </li>${i < stops.length - 1 ? `<li class="bleg" data-legfor="${i}"></li>` : ''}`;
    }).join('') || `<li class="empty">No stops yet. Add one, or start from your sample day.</li>`;

    document.querySelectorAll('.bstop').forEach((li) => {
      const i = +li.dataset.i, st = stops[i];
      li.querySelector('[data-f=note]').oninput = (e) => { st.note = e.target.value; persist(); };
      li.querySelector('[data-f=duration]').onchange = (e) => { st.duration = +e.target.value; retime(); refreshLegs(); };
      li.querySelector('[data-f=time]').onchange = (e) => { if (!e.target.value) return; st.time = e.target.value; if (i > 0) st.pinTime = true; draw(); };
      li.querySelector('[data-unpin]')?.addEventListener('click', () => { delete st.pinTime; draw(); });
      li.querySelector('[data-del]').onclick = () => { const t0 = stops[0].time; stops.splice(i, 1); if (stops[0]) { stops[0].time = i === 0 ? t0 : stops[0].time; delete stops[0].pinTime; } openIns.clear(); draw(); };
      li.querySelectorAll('[data-move]').forEach((b) => (b.onclick = () => {
        const j = i + +b.dataset.move, t0 = stops[0].time;
        [stops[i], stops[j]] = [stops[j], stops[i]];
        stops[0].time = t0; delete stops[0].pinTime; // the day still starts when it started
        openIns.clear(); draw();
      }));
    });
    paintTimes(); paintLegs(); refreshLegs();
    document.querySelectorAll('details.ins').forEach((d) => d.addEventListener('toggle', () => { d.open ? openIns.add(+d.dataset.i) : openIns.delete(+d.dataset.i); }));
    document.querySelectorAll('[data-ins]').forEach((inp) => inp.oninput = () => {
      const st = o.days[day].stops[+inp.dataset.i], v = inp.value.trim();
      st.insider = { ...st.insider, [inp.dataset.ins]: v };
      if (!v) delete st.insider[inp.dataset.ins];
      persist();
      inp.closest('details').querySelector('.ins-count').textContent = `${Object.keys(st.insider).length}/${INSIDER.length}`;
    });
    document.querySelectorAll('.pp-in').forEach((inp) => mountPicker(inp, c.ll, async (id) => {
      const st = o.days[day].stops[+inp.dataset.i];
      st.place = id;
      if (PLACES[id].source === 'google') o.places = { ...o.places, [id]: PLACES[id] };
      draw();
    }, () => PLACES[o.days[day].stops[+inp.dataset.i].place]?.name ?? ''));

    document.getElementById('sugg').innerHTML = sugg.slice(0, 8).map((s) => `
      <div class="sg ${s.closed ? 'closed' : ''}">
        <div class="sg-top"><b>${esc(s.p.name)}</b></div>
        <div class="muted small">${s.p.type} · ${cityName(s.p.city)}</div>
        <div class="sg-why">${s.why.map((w) => `<span>✓ ${esc(w)}</span>`).join('')}${s.warn.map((w) => `<span class="w">⚠ ${esc(w)}</span>`).join('')}</div>
        ${s.tip ? `<div class="note small">${esc(s.tip)}</div>` : ''}
        <button class="ghost small" data-add="${s.pid}" ${s.inPlan ? 'disabled' : ''}>${s.inPlan ? 'In the plan' : '+ Add to day ' + (day + 1)}</button>
      </div>`).join('');
    document.querySelectorAll('[data-add]').forEach((b) => (b.onclick = () => {
      const s = sugg.find((x) => x.pid === b.dataset.add);
      o.days[day].stops.push({ place: s.pid, time: o.days[day].stops[0]?.time ?? '09:00', duration: DUR[s.p.type] ?? (s.p.vibes?.includes('Food') ? 60 : 90), note: s.tip });
      draw();
    }));
    check();
  };

  const check = () => {
    const issues = validate(o);
    const v = verdict(issues);
    const empty = o.days.some((d) => !d.stops.length);
    const blocked = v === 'fail' || empty;
    document.getElementById('checks').innerHTML = badge(v) + issueList(issues);
    const act = document.getElementById('actions');
    if (o.status === 'delivered') {
      act.innerHTML = `<a class="primary btn" href="#/i/${o.id}">View delivered itinerary</a><span class="muted small">Delivered ✓ Keep an eye on messages: ${tn} can text you on the day.</span>`;
    } else if (o.status === 'review') {
      act.innerHTML = `<button class="primary" disabled>Waiting on ${tn}'s feedback</button><a class="small" href="#/order/${o.id}">See what ${tn} sees →</a>`;
    } else if (together && o.status !== 'approved') {
      act.innerHTML = `<button class="primary" id="share" ${blocked ? 'disabled' : ''}>${o.rounds ? 'Share updated draft' : 'Share draft with ' + tn}</button>
        <button class="link small" id="deliver" ${blocked ? 'disabled' : ''}>Skip review and deliver now</button>`;
    } else {
      act.innerHTML = `<button class="primary" id="deliver" ${blocked ? 'disabled' : ''}>Deliver ${o.status === 'approved' ? 'final plan' : ''} to ${tn}</button>`;
    }
    document.getElementById('share')?.addEventListener('click', () => {
      o.status = 'review'; o.feedback = {}; sysMsg(o, `${first(c)} shared ${o.rounds ? 'an updated' : 'a'} draft for review.`); persist(); render();
    });
    document.getElementById('deliver')?.addEventListener('click', () => {
      o.status = 'delivered'; o.deliveredAt = Date.now(); sysMsg(o, `${first(c)} delivered the final plan.`); persist();
      location.hash = `#/i/${o.id}`;
    });
    document.getElementById('why').textContent = o.status === 'review' || o.status === 'delivered' ? '' : empty ? 'Every day needs at least one stop.' : v === 'fail' ? 'Fix the ✕ items first. We don’t want anyone showing up to a locked door.' : v === 'review' ? 'Good to send. Just give the ⚠ items a second look.' : together && o.status !== 'approved' ? `Looks good. Send it to ${tn} for a gut check.` : 'This one’s ready. Send it.';
  };

  document.getElementById('add').onclick = () => {
    const st = o.days[day].stops;
    st.push({ place: null, time: st[0]?.time ?? '09:00', duration: 60, note: '' });
    draw();
    [...document.querySelectorAll('.pp-in')].at(-1)?.focus();
  };
  document.getElementById('fill').onclick = () => {
    const s = SAMPLES.find((x) => x.creator === c.id);
    if (s) { o.days[day].stops = s.days[0].stops.map((x) => ({ ...x, insider: x.insider && { ...x.insider } })); openIns.clear(); draw(); }
  };
  draw();
}
/* ---------- the local layer: insider details per stop ---------- */
// Display order on the itinerary: story first (stories before facts), then the practical stuff.
const INSIDER_SHOW = ['story', 'order', 'secret', 'when', 'arrive', 'planB'];

function insiderEditor(s, i, perk, open) {
  const n = Object.values(s.insider ?? {}).filter(Boolean).length;
  return `<details class="ins" data-i="${i}" ${open ? 'open' : ''}><summary>🤫 Insider details <span class="ins-count">${n}/${INSIDER.length}</span>${perk ? ' <span class="pill own">🎁 Your perk applies</span>' : ''}</summary>
    <p class="muted small">The stuff that never makes it into a review. This is why they booked you.</p>
    <div class="ins-grid">${INSIDER.map(([k, ic, label, ph]) => `<label>${ic} ${label}<input data-ins="${k}" data-i="${i}" value="${esc(s.insider?.[k] ?? '')}" placeholder="${esc(ph)}" /></label>`).join('')}</div>
    ${perk ? `<div class="perk small">🎁 Your perk here shows on the plan: “${esc(perk)}”</div>` : ''}
  </details>`;
}

function insiderBlock(s, perk) {
  const rows = INSIDER_SHOW.map((k) => INSIDER.find((x) => x[0] === k)).filter(([k]) => s.insider?.[k]);
  if (!rows.length && !perk) return '';
  return `<div class="insider">${rows.map(([k, ic, label]) => `<div class="ins-row ${k}"><span class="ic">${ic}</span><div><b>${label}</b> ${esc(s.insider[k])}</div></div>`).join('')}
    ${perk ? `<div class="ins-row perk"><span class="ic">🎁</span><div><b>Perk</b> ${esc(perk)}</div></div>` : ''}</div>`;
}

// "What a local added": the itinerary-level tally of things search can't give you.
function localTally(it, c) {
  const stops = it.days.flatMap((d) => d.stops).filter((s) => PLACES[s.place]);
  const tips = stops.reduce((n, s) => n + Object.values(s.insider ?? {}).filter(Boolean).length, 0);
  const stories = stops.filter((s) => s.insider?.story).length;
  const perks = stops.filter((s) => c.perks?.[s.place]).length;
  const fresh = stops.filter((s) => c.library?.[s.place] && daysAgo(c.library[s.place][0]) <= 30).length;
  if (!tips && !perks) return '';
  return `<section class="added"><h3>What ${esc(first(c))} added that you won't find on Yelp</h3>
    <div class="added-grid">
      <div><b>${tips}</b><span>insider tips</span></div>
      <div><b>${stories}</b><span>stories behind the places</span></div>
      <div><b>${perks}</b><span>local perks</span></div>
      <div><b>${fresh} of ${stops.length}</b><span>stops visited in the last month</span></div>
    </div></section>`;
}

/* ---------- place search field (Google Places, or demo catalog without a key) ---------- */
function mountPicker(inp, near, onPick, currentName) {
  const list = inp.parentElement.querySelector('.pp-list');
  let results = [], active = -1, timer, seq = 0;
  const show = (on) => { list.hidden = !on; inp.setAttribute('aria-expanded', on); };
  const paint = (note) => {
    list.innerHTML = results.map((r, i) => `<li role="option" class="${i === active ? 'on' : ''}" data-r="${i}"><b>${esc(r.main)}</b><span>${esc(r.secondary)}</span></li>`).join('')
      + (note ? `<li class="pp-note">${note}</li>` : '')
      + (usingGoogle() && results.length ? '<li class="pp-note">powered by Google</li>' : '');
    list.querySelectorAll('[data-r]').forEach((li) => li.onmousedown = (e) => { e.preventDefault(); pick(+li.dataset.r); });
    show(true);
  };
  const pick = async (i) => {
    const r = results[i]; if (!r) return;
    inp.value = r.main; show(false);
    try { onPick(await r.resolve()); } catch { paint('Couldn’t load that place. Try again.'); }
  };
  inp.addEventListener('input', () => {
    clearTimeout(timer);
    const q = inp.value, mine = ++seq;
    if (q.trim().length < 2) return show(false);
    timer = setTimeout(async () => {
      try { results = await searchPlaces(q, near); } catch { results = []; return mine === seq && paint('Search is unavailable right now.'); }
      if (mine !== seq) return; // a newer keystroke won
      active = results.length ? 0 : -1;
      paint(results.length ? '' : 'No matches. Try a different name.');
    }, 250);
  });
  inp.addEventListener('keydown', (e) => {
    if (list.hidden || !results.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); active = (active + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length; paint(); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(active); }
    else if (e.key === 'Escape') { show(false); inp.value = currentName(); }
  });
  inp.addEventListener('blur', () => setTimeout(() => { show(false); if (!inp.value.trim() || inp.value !== currentName()) inp.value = currentName(); }, 150));
}


render();
