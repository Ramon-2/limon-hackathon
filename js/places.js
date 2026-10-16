import { PLACES, cityName } from './data.js';
import { GOOGLE_MAPS_API_KEY } from './config.js';

/* Place search for the itinerary builder.
   With a Google key: live Google Places (New) autocomplete, biased to the creator's area,
   and full details (hours per day, business status, price, rating) for Limon's check.
   Without a key: searches the demo catalog so the prototype still works end to end. */

export const usingGoogle = () => !!GOOGLE_MAPS_API_KEY;

let gReady;
function loadGoogle() {
  if (gReady) return gReady;
  gReady = new Promise((resolve, reject) => {
    window.__limonGmaps = () => resolve();
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&v=weekly&loading=async&callback=__limonGmaps`;
    s.async = true;
    s.onerror = () => { gReady = null; reject(new Error('Google Maps failed to load')); };
    document.head.appendChild(s);
  }).then(() => google.maps.importLibrary('places'));
  return gReady;
}

let session = null;
export const newSession = () => { session = null; };

// Returns [{ id?, main, secondary, resolve(): Promise<placeId> }]
export async function searchPlaces(query, near) {
  const q = query.trim();
  if (q.length < 2) return [];
  if (!usingGoogle()) {
    const norm = (x) => x.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const t = norm(q);
    return Object.entries(PLACES)
      .filter(([, p]) => !p.source && norm(`${p.name} ${p.type} ${cityName(p.city)}`).includes(t))
      .slice(0, 6)
      .map(([id, p]) => ({ main: p.name, secondary: `${p.type} · ${cityName(p.city)}`, resolve: async () => id }));
  }
  const { AutocompleteSuggestion, AutocompleteSessionToken } = await loadGoogle();
  session ??= new AutocompleteSessionToken();
  const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input: q, sessionToken: session, includedRegionCodes: ['us'],
    locationBias: { center: { lat: near[0], lng: near[1] }, radius: 30000 },
  });
  return suggestions.filter((s) => s.placePrediction).slice(0, 6).map(({ placePrediction: pp }) => ({
    main: pp.mainText?.text ?? pp.text.text,
    secondary: pp.secondaryText?.text ?? '',
    resolve: async () => {
      const id = 'g:' + pp.placeId;
      if (!PLACES[id]) {
        const place = pp.toPlace();
        await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'addressComponents', 'location', 'regularOpeningHours', 'priceLevel', 'rating', 'userRatingCount', 'businessStatus', 'primaryTypeDisplayName', 'types', 'googleMapsURI'] });
        PLACES[id] = fromGoogle(place);
      }
      newSession(); // a session ends when a place is picked
      return id;
    },
  }));
}

/* ---------- Google place → Limon place ---------- */
const PRICE = { FREE: [0, 'Free'], INEXPENSIVE: [15, '$'], MODERATE: [30, '$$'], EXPENSIVE: [60, '$$$'], VERY_EXPENSIVE: [100, '$$$$'] };
const VIBE_TYPES = [
  ['Coffee', /cafe|coffee|tea_house/],
  ['Food', /restaurant|food|bakery|meal_|deli|ice_cream|dessert|market|bar_and_grill/],
  ['Art', /museum|art_gallery|art_studio|performing_arts|cultural/],
  ['Outdoors', /park|beach|hiking|trail|garden|zoo|marina|state_park|national_park|campground|lake/],
  ['Nightlife', /bar|night_club|pub|wine_bar|brewery|live_music|karaoke/],
  ['Shopping', /store|shopping|market|boutique|book_store/],
  ['Stories & history', /historical|monument|landmark|church|museum|cultural/],
  ['Kid-friendly', /zoo|aquarium|amusement|playground|park|children|ice_cream/],
];

export function fromGoogle(pl) {
  const types = pl.types ?? [];
  const city = pl.addressComponents?.find((c) => c.types.includes('locality'))?.longText ?? '';
  const [cost, priceLabel] = PRICE[pl.priceLevel] ?? [null, ''];
  // periods → minutes per weekday; overnight closes run past 1440
  let hoursByDay = null;
  const periods = pl.regularOpeningHours?.periods;
  if (periods?.length) {
    hoursByDay = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    for (const { open, close } of periods) {
      const o = open.hour * 60 + open.minute;
      if (!close) { for (let d = 0; d < 7; d++) hoursByDay[d] = [[0, 1440]]; break; } // open 24/7
      const c = ((close.day - open.day + 7) % 7) * 1440 + close.hour * 60 + close.minute;
      hoursByDay[open.day].push([o, c > o ? c : c + 7 * 1440]);
    }
  }
  return {
    source: 'google', name: pl.displayName, city, address: pl.formattedAddress,
    type: pl.primaryTypeDisplayName || 'Place',
    ll: [pl.location.lat(), pl.location.lng()],
    hoursByDay, closedDays: hoursByDay ? Object.keys(hoursByDay).filter((d) => !hoursByDay[d].length).map(Number) : [],
    cost: cost ?? 0, costUnknown: cost == null, priceLabel,
    rating: pl.rating, ratingCount: pl.userRatingCount, mapsUrl: pl.googleMapsURI,
    permanentlyClosed: pl.businessStatus === 'CLOSED_PERMANENTLY',
    tempClosed: pl.businessStatus === 'CLOSED_TEMPORARILY',
    vibes: VIBE_TYPES.filter(([, re]) => types.some((t) => re.test(t))).map(([v]) => v),
  };
}
