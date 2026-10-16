// Demo dataset. Creators are fictional; place hours/prices are placeholders.
// hours: [open, close] in 24h "HH:MM"; closedDays: 0=Sun..6=Sat.

export const CITIES = [
  { id: 'santa-ana', name: 'Santa Ana', center: [33.7455, -117.8677] },
  { id: 'orange', name: 'Orange', center: [33.7879, -117.8531] },
  { id: 'costa-mesa', name: 'Costa Mesa', center: [33.6411, -117.9187] },
  { id: 'laguna-beach', name: 'Laguna Beach', center: [33.5427, -117.7854] },
  { id: 'newport-beach', name: 'Newport Beach', center: [33.6189, -117.9298] },
  { id: 'westminster', name: 'Westminster', center: [33.7513, -117.9940] },
  { id: 'fullerton', name: 'Fullerton', center: [33.8704, -117.9243] },
  { id: 'anaheim', name: 'Anaheim', center: [33.8366, -117.9143] },
];

export const REGION = { name: 'Orange County, CA', center: [33.72, -117.88], zoom: 10 };

export const PLACES = {
  '4th-st-market': { name: '4th Street Market', city: 'santa-ana', type: 'Food hall', ll: [33.7486, -117.8664], hours: ['08:00', '21:00'], closedDays: [], cost: 18, localOwned: true },
  'bowers': { name: 'Bowers Museum', city: 'santa-ana', type: 'Museum', ll: [33.7637, -117.8706], hours: ['10:00', '16:00'], closedDays: [1], cost: 15 },
  'artists-village': { name: 'Santa Ana Artists Village', city: 'santa-ana', type: 'Art walk', ll: [33.7480, -117.8676], hours: ['12:00', '22:00'], closedDays: [], cost: 0, localOwned: true },
  'calle-cuatro': { name: 'Calle Cuatro Coffee', city: 'santa-ana', type: 'Café', ll: [33.7491, -117.8690], hours: ['07:00', '15:00'], closedDays: [], cost: 7, localOwned: true },
  'el-viejo-taco': { name: 'El Viejo Taco Stand', city: 'santa-ana', type: 'Tacos', ll: [33.7420, -117.8735], hours: ['17:00', '23:30'], closedDays: [2], cost: 12, localOwned: true },
  'old-taqueria': { name: 'La Esquina (old location)', city: 'santa-ana', type: 'Tacos', ll: [33.7450, -117.8700], hours: ['11:00', '21:00'], closedDays: [], cost: 12, permanentlyClosed: true },
  'tacos-el-guero': { name: 'Tacos El Güero', city: 'santa-ana', type: 'Tacos', ll: [33.7455, -117.8610], hours: ['10:00', '21:00'], closedDays: [1], cost: 10, localOwned: true },
  'santa-ana-zoo': { name: 'Santa Ana Zoo', city: 'santa-ana', type: 'Zoo', ll: [33.7438, -117.8414], hours: ['10:00', '16:00'], closedDays: [], cost: 12 },

  'orange-plaza': { name: 'Old Towne Orange Plaza', city: 'orange', type: 'Historic district', ll: [33.7877, -117.8531], hours: ['00:00', '23:59'], closedDays: [], cost: 0 },
  'circle-antiques': { name: 'Circle City Antiques', city: 'orange', type: 'Antiques', ll: [33.7884, -117.8524], hours: ['10:00', '18:00'], closedDays: [1], cost: 0, localOwned: true },
  'plaza-espresso': { name: 'Plaza Espresso Bar', city: 'orange', type: 'Café', ll: [33.7870, -117.8540], hours: ['06:30', '16:00'], closedDays: [], cost: 6, localOwned: true },
  'irvine-park': { name: 'Irvine Regional Park', city: 'orange', type: 'Park', ll: [33.8000, -117.7575], hours: ['06:00', '18:00'], closedDays: [], cost: 5 },
  'chapman-eats': { name: 'Glassell Street Supper Club', city: 'orange', type: 'Dinner', ll: [33.7860, -117.8530], hours: ['17:00', '22:00'], closedDays: [1, 2], cost: 45, localOwned: true },

  'the-lab': { name: 'The LAB Anti-Mall', city: 'costa-mesa', type: 'Shopping', ll: [33.6915, -117.9195], hours: ['10:00', '21:00'], closedDays: [], cost: 0 },
  'the-camp': { name: 'The CAMP', city: 'costa-mesa', type: 'Shopping', ll: [33.6929, -117.9183], hours: ['10:00', '21:00'], closedDays: [], cost: 0 },
  'mesa-brunch': { name: 'Mesa Verde Brunch House', city: 'costa-mesa', type: 'Brunch', ll: [33.6800, -117.9100], hours: ['08:00', '14:00'], closedDays: [], cost: 24, localOwned: true },

  'crystal-cove': { name: 'Crystal Cove State Park', city: 'newport-beach', type: 'Beach', ll: [33.5735, -117.8400], hours: ['06:00', '20:00'], closedDays: [], cost: 15 },
  'balboa-island': { name: 'Balboa Island', city: 'newport-beach', type: 'Neighborhood', ll: [33.6070, -117.8890], hours: ['00:00', '23:59'], closedDays: [], cost: 6 },
  'heisler-park': { name: 'Heisler Park tide pools', city: 'laguna-beach', type: 'Tide pools', ll: [33.5450, -117.7880], hours: ['05:00', '22:00'], closedDays: [], cost: 0 },
  'laguna-galleries': { name: 'Laguna gallery row', city: 'laguna-beach', type: 'Galleries', ll: [33.5440, -117.7840], hours: ['11:00', '18:00'], closedDays: [], cost: 0, localOwned: true },
  'top-of-world': { name: 'Top of the World trailhead', city: 'laguna-beach', type: 'Hike', ll: [33.5530, -117.7660], hours: ['07:00', '19:00'], closedDays: [], cost: 0 },

  'asian-garden': { name: 'Asian Garden Mall', city: 'westminster', type: 'Market', ll: [33.7537, -117.9910], hours: ['09:00', '19:00'], closedDays: [], cost: 15, localOwned: true },
  'pho-bolsa': { name: 'Phở Bolsa Corner', city: 'westminster', type: 'Phở', ll: [33.7590, -117.9880], hours: ['07:00', '20:00'], closedDays: [3], cost: 14, localOwned: true },
  'banh-mi-lan': { name: 'Bánh Mì Lan', city: 'westminster', type: 'Bánh mì', ll: [33.7520, -117.9950], hours: ['06:00', '17:00'], closedDays: [], cost: 8, localOwned: true },
  'night-market': { name: 'Little Saigon night market', city: 'westminster', type: 'Night market', ll: [33.7545, -117.9930], hours: ['18:00', '23:00'], closedDays: [0, 1, 2, 3, 4], cost: 20 },

  'dt-fullerton': { name: 'Downtown Fullerton', city: 'fullerton', type: 'Nightlife', ll: [33.8704, -117.9243], hours: ['16:00', '02:00'], closedDays: [], cost: 30 },
  'fullerton-arb': { name: 'Fullerton Arboretum', city: 'fullerton', type: 'Garden', ll: [33.8862, -117.8853], hours: ['08:00', '16:30'], closedDays: [], cost: 0 },
  'record-shop': { name: 'Hidden Track Records', city: 'fullerton', type: 'Record store', ll: [33.8710, -117.9250], hours: ['12:00', '20:00'], closedDays: [1], cost: 0, localOwned: true },
  'packing-district': { name: 'Anaheim Packing District', city: 'anaheim', type: 'Food hall', ll: [33.8371, -117.9168], hours: ['09:00', '22:00'], closedDays: [], cost: 20 },
  // Added for the extra sample days. Parks, beaches, museums and the depots are real public places;
  // the cafés, taco window, dessert and noodle shops are fictional. Hours are placeholders.
  'paleteria-rosa': { name: 'Paletería La Rosa', city: 'santa-ana', type: 'Paletas', ll: [33.7478, -117.8650], hours: ['11:00', '21:00'], closedDays: [], cost: 5, localOwned: true },
  'orange-depot': { name: 'Orange Santa Fe Depot', city: 'orange', type: 'Historic site', ll: [33.7884, -117.8566], hours: ['00:00', '23:59'], closedDays: [], cost: 0 },
  'plaza-paperbacks': { name: 'Plaza Paperbacks', city: 'orange', type: 'Bookstore', ll: [33.7882, -117.8535], hours: ['10:00', '19:00'], closedDays: [], cost: 0, localOwned: true },
  'soda-fountain': { name: 'Corner Soda Fountain', city: 'orange', type: 'Diner', ll: [33.7875, -117.8528], hours: ['07:00', '15:00'], closedDays: [], cost: 16, localOwned: true },
  'santiago-oaks': { name: 'Santiago Oaks Regional Park', city: 'orange', type: 'Hike', ll: [33.8234, -117.7742], hours: ['07:00', '18:00'], closedDays: [], cost: 5 },
  'thousand-steps': { name: 'Thousand Steps Beach', city: 'laguna-beach', type: 'Beach', ll: [33.4983, -117.7421], hours: ['06:00', '22:00'], closedDays: [], cost: 0 },
  'treasure-island': { name: 'Treasure Island Park', city: 'laguna-beach', type: 'Park', ll: [33.5143, -117.7574], hours: ['06:00', '22:00'], closedDays: [], cost: 0 },
  'aliso-wood': { name: 'Aliso and Wood Canyons', city: 'laguna-beach', type: 'Hike', ll: [33.5755, -117.7251], hours: ['07:00', '17:00'], closedDays: [], cost: 3 },
  'coast-acai': { name: 'Coast Hwy Açaí', city: 'laguna-beach', type: 'Café', ll: [33.5420, -117.7830], hours: ['07:00', '17:00'], closedDays: [], cost: 12, localOwned: true },
  'freedom-park': { name: 'Vietnam War Memorial, Freedom Park', city: 'westminster', type: 'Memorial', ll: [33.7566, -117.9958], hours: ['00:00', '23:59'], closedDays: [], cost: 0 },
  'che-co-ba': { name: 'Chè Cô Ba', city: 'westminster', type: 'Dessert', ll: [33.7575, -117.9895], hours: ['10:00', '21:00'], closedDays: [], cost: 6, localOwned: true },
  'ca-phe-corner': { name: 'Cà Phê Corner', city: 'westminster', type: 'Café', ll: [33.7530, -117.9902], hours: ['07:00', '22:00'], closedDays: [], cost: 6, localOwned: true },
  'hu-tieu-house': { name: 'Hủ Tiếu House', city: 'westminster', type: 'Noodles', ll: [33.7600, -117.9850], hours: ['08:00', '20:00'], closedDays: [2], cost: 14, localOwned: true },
  'fullerton-depot': { name: 'Fullerton Train Depot', city: 'fullerton', type: 'Historic site', ll: [33.8697, -117.9237], hours: ['00:00', '23:59'], closedDays: [], cost: 0 },
  'hillcrest-park': { name: 'Hillcrest Park', city: 'fullerton', type: 'Park', ll: [33.8790, -117.9218], hours: ['06:00', '22:00'], closedDays: [], cost: 0 },
  'muckenthaler': { name: 'Muckenthaler Cultural Center', city: 'fullerton', type: 'Arts center', ll: [33.8780, -117.9440], hours: ['10:00', '16:00'], closedDays: [1], cost: 10 },
  'back-room-coffee': { name: 'Back Room Coffee', city: 'fullerton', type: 'Café', ll: [33.8712, -117.9238], hours: ['07:00', '18:00'], closedDays: [], cost: 6, localOwned: true },
  'amerige-tacos': { name: 'Amerige Taco Window', city: 'fullerton', type: 'Tacos', ll: [33.8701, -117.9255], hours: ['11:00', '23:00'], closedDays: [1], cost: 12, localOwned: true },
  'pocket-matcha': { name: 'Pocket Matcha', city: 'costa-mesa', type: 'Café', ll: [33.6920, -117.9190], hours: ['08:00', '18:00'], closedDays: [], cost: 7, localOwned: true },
  'noguchi-garden': { name: 'California Scenario (Noguchi Garden)', city: 'costa-mesa', type: 'Sculpture garden', ll: [33.6905, -117.8866], hours: ['08:00', '21:00'], closedDays: [], cost: 0 },
  'segerstrom': { name: 'Segerstrom Center for the Arts', city: 'costa-mesa', type: 'Arts center', ll: [33.6912, -117.8827], hours: ['10:00', '22:00'], closedDays: [], cost: 0 },
  'cdm-beach': { name: 'Corona del Mar State Beach', city: 'newport-beach', type: 'Beach', ll: [33.5944, -117.8771], hours: ['06:00', '22:00'], closedDays: [], cost: 15 },
};

export const PACKAGES = [
  { id: 'day', name: 'Day Trip', price: 35, days: 1, turnaround: '48 hrs', blurb: 'One whole day out, stop by stop.' },
  { id: 'weekend', name: 'Weekend', price: 85, days: 2, turnaround: '3 days', blurb: 'Two days, with meals and a backup plan if it rains.' },
];
// Retired from sale; kept so older demo orders still open.
const RETIRED_PACKAGES = [
  { id: 'custom', name: 'Custom Trip', price: 150, days: 4, turnaround: '5 days', blurb: 'Up to four days, plus a 15-minute call to dial it in.' },
];
export const pkgById = (id) => [...PACKAGES, ...RETIRED_PACKAGES].find((p) => p.id === id);

// Upsell tiers on top of either package. Prices are demo placeholders.
export const TIERS = [
  { id: 'standard', name: 'Standard', add: 0, adjustments: 1, call: 0, blurb: '1 adjustment after delivery' },
  { id: 'plus', name: 'Plus', add: 15, adjustments: 3, call: 0, blurb: '3 adjustments after delivery' },
  { id: 'premium', name: 'Premium', add: 40, adjustments: 3, call: 30, blurb: '30-min call with your local + 3 adjustments' },
];
export const tierById = (id) => TIERS.find((t) => t.id === id) ?? TIERS[0];
export const orderPrice = (o) => pkgById(o.pkg).price + tierById(o.tier).add;

export const TAKE_RATE = 0.18;

export const CREATORS = [
  {
    id: 'marisol', name: 'Marisol Reyes', handle: 'santaana.eats', followers: 18400, city: 'santa-ana', ll: [33.7470, -117.8680],
    avatar: '🌮', color: '#FD9F64', rating: 4.9, reviews: 31,
    bio: 'Born and raised on 4th Street. I eat my way through Santa Ana so you don’t have to guess.',
    interests: ['Food', 'Art walks', 'Nightlife'], styles: ['Foodie', 'Budget-friendly'],
    top3: ['4th-st-market', 'el-viejo-taco', 'artists-village'],
    places: ['4th-st-market', 'el-viejo-taco', 'tacos-el-guero', 'artists-village', 'calle-cuatro', 'bowers', 'santa-ana-zoo', 'old-taqueria', 'paleteria-rosa'],
    socials: { instagram: 'santaana.eats', tiktok: 'santaana.eats' },
  },
  {
    id: 'dev', name: 'Dev Patel', handle: 'oldtowne.orange', followers: 12100, city: 'orange', ll: [33.7880, -117.8545],
    avatar: '☕', color: '#86CB2E', rating: 4.8, reviews: 19,
    bio: 'Coffee, antiques, and 1900s architecture. The slow-travel guide to Old Towne.',
    interests: ['Coffee', 'History', 'Antiques'], styles: ['Slow travel', 'Couples'],
    top3: ['plaza-espresso', 'circle-antiques', 'chapman-eats'],
    places: ['plaza-espresso', 'circle-antiques', 'orange-plaza', 'chapman-eats', 'irvine-park', 'orange-depot', 'plaza-paperbacks', 'soda-fountain', 'santiago-oaks'],
    socials: { instagram: 'oldtowne.orange' },
  },
  {
    id: 'kai', name: 'Kai Nakamura', handle: 'ocsaltlife', followers: 41200, city: 'laguna-beach', ll: [33.5480, -117.7850],
    avatar: '🌊', color: '#88B8FF', rating: 4.9, reviews: 54,
    bio: 'Tide pools at dawn, trails at golden hour. The coves the tour buses drive right past? That’s where we’re going.',
    interests: ['Beaches', 'Hiking', 'Photography'], styles: ['Outdoors', 'Active'],
    top3: ['heisler-park', 'crystal-cove', 'top-of-world'],
    places: ['heisler-park', 'crystal-cove', 'top-of-world', 'laguna-galleries', 'balboa-island', 'thousand-steps', 'treasure-island', 'aliso-wood', 'coast-acai'],
    socials: { instagram: 'ocsaltlife', tiktok: 'ocsaltlife', youtube: 'ocsaltlife' },
  },
  {
    id: 'tina', name: 'Tina Tran', handle: 'littlesaigon.bites', followers: 33500, city: 'westminster', ll: [33.7550, -117.9920],
    avatar: '🍜', color: '#FFDF70', rating: 5.0, reviews: 22,
    bio: 'Second-gen Little Saigon. Phở at 7am, night market at 9pm, everything in between.',
    interests: ['Food', 'Culture', 'Markets'], styles: ['Foodie', 'Families'],
    top3: ['pho-bolsa', 'banh-mi-lan', 'night-market'],
    places: ['pho-bolsa', 'banh-mi-lan', 'asian-garden', 'night-market', 'freedom-park', 'che-co-ba', 'ca-phe-corner', 'hu-tieu-house'],
    socials: { instagram: 'littlesaigon.bites', tiktok: 'littlesaigon.bites' },
  },
  {
    id: 'jordan', name: 'Jordan Brooks', handle: 'fullerton.afterdark', followers: 22000, city: 'fullerton', ll: [33.8720, -117.9230],
    avatar: '🎸', color: '#10AD33', rating: 4.7, reviews: 15,
    bio: 'Record stores by day, live music by night. Fullerton’s downtown, done right.',
    interests: ['Music', 'Nightlife', 'Gardens'], styles: ['Nightlife', 'Groups'],
    top3: ['record-shop', 'dt-fullerton', 'fullerton-arb'],
    places: ['record-shop', 'dt-fullerton', 'fullerton-arb', 'packing-district', 'fullerton-depot', 'hillcrest-park', 'muckenthaler', 'back-room-coffee', 'amerige-tacos'],
    socials: { instagram: 'fullerton.afterdark' },
  },
  {
    id: 'ana', name: 'Ana Lucía Ortiz', handle: 'costamesa.curated', followers: 27300, city: 'costa-mesa', ll: [33.6900, -117.9150],
    avatar: '🛍️', color: '#FD9F64', rating: 4.8, reviews: 28,
    bio: 'Design shops, long brunches, and a beach sunset to finish. Costa Mesa to Newport.',
    interests: ['Shopping', 'Brunch', 'Design'], styles: ['Treat yourself', 'Friends trip'],
    top3: ['the-lab', 'mesa-brunch', 'balboa-island'],
    places: ['the-lab', 'the-camp', 'mesa-brunch', 'balboa-island', 'crystal-cove', 'pocket-matcha', 'noguchi-garden', 'segerstrom', 'cdm-beach'],
    socials: { instagram: 'costamesa.curated', tiktok: 'costamesa.curated' },
  },
];

// Free portfolio itineraries. date picks the weekday used for validation.
export const SAMPLES = [
  { id: 's-marisol-1', creator: 'marisol', title: 'Santa Ana in one delicious day', intake: { budget: 80, group: 2, pace: 'balanced' },
    days: [{ date: '2026-11-07', stops: [
      { place: 'calle-cuatro', time: '09:00', duration: 45, note: 'Get the horchata cold brew.' },
      { place: 'bowers', time: '10:15', duration: 120, note: 'The Mesoamerican wing is the move.' },
      { place: '4th-st-market', time: '12:45', duration: 75, note: 'Lunch: split three stalls.' },
      { place: 'artists-village', time: '14:30', duration: 120, note: 'Wander the studios and murals.' },
      { place: 'el-viejo-taco', time: '18:30', duration: 60, note: 'Al pastor, trust me.' },
    ] }] },
  { id: 's-kai-1', creator: 'kai', title: 'Laguna sunrise to sunset', intake: { budget: 60, group: 2, pace: 'active' },
    days: [{ date: '2026-11-08', stops: [
      { place: 'heisler-park', time: '07:00', duration: 90, note: 'Check the tide chart; low tide is everything.' },
      { place: 'laguna-galleries', time: '11:00', duration: 90, note: 'Gallery row on foot.' },
      { place: 'crystal-cove', time: '13:30', duration: 180, note: 'Historic cottages + the quiet end of the beach.' },
      { place: 'top-of-world', time: '17:00', duration: 90, note: 'Sunset over Catalina on a clear day.' },
    ] }] },
  { id: 's-tina-1', creator: 'tina', title: 'Little Saigon, breakfast to night market', intake: { budget: 60, group: 3, pace: 'balanced' },
    days: [{ date: '2026-11-07', stops: [
      { place: 'pho-bolsa', time: '08:00', duration: 60, note: 'Order the đặc biệt.' },
      { place: 'asian-garden', time: '10:00', duration: 120, note: 'Jewelry floor + the food court upstairs.' },
      { place: 'banh-mi-lan', time: '13:00', duration: 30, note: 'Grab extra for later.' },
      { place: 'night-market', time: '19:00', duration: 120, note: 'Friday & Saturday only.' },
    ] }] },
  { id: 's-dev-1', creator: 'dev', title: 'A slow Saturday in Old Towne', intake: { budget: 90, group: 2, pace: 'relaxed' },
    days: [{ date: '2026-11-07', stops: [
      { place: 'plaza-espresso', time: '08:30', duration: 45, note: 'Sit outside facing the fountain.' },
      { place: 'orange-plaza', time: '09:30', duration: 60, note: 'Walk the four quadrants.' },
      { place: 'circle-antiques', time: '10:45', duration: 120, note: 'Ask for the back room.' },
      { place: 'chapman-eats', time: '18:00', duration: 90, note: 'Reserve a week ahead.' },
    ] }] },
  { id: 's-jordan-1', creator: 'jordan', title: 'Fullerton crate-dig & live music', intake: { budget: 70, group: 4, pace: 'balanced' },
    days: [{ date: '2026-11-06', stops: [
      { place: 'fullerton-arb', time: '10:00', duration: 90, note: 'Quiet morning reset.' },
      { place: 'packing-district', time: '12:30', duration: 75, note: 'Lunch for the whole group.' },
      { place: 'record-shop', time: '14:30', duration: 90, note: '$5 bin in the back.' },
      { place: 'dt-fullerton', time: '20:00', duration: 180, note: 'Check who’s playing that night.' },
    ] }] },
  { id: 's-ana-1', creator: 'ana', title: 'Brunch, browse, Balboa', intake: { budget: 100, group: 2, pace: 'relaxed' },
    days: [{ date: '2026-11-08', stops: [
      { place: 'mesa-brunch', time: '09:30', duration: 75, note: 'Get the ube pancakes.' },
      { place: 'the-lab', time: '11:15', duration: 90, note: 'Vintage + plant shops.' },
      { place: 'the-camp', time: '12:50', duration: 60, note: 'Right next door.' },
      { place: 'balboa-island', time: '15:00', duration: 150, note: 'Frozen banana, then walk the bayfront.' },
    ] }] },
];

export const cityName = (id) => CITIES.find((c) => c.id === id)?.name ?? id;
export const creatorById = (id) => CREATORS.find((c) => c.id === id);

/* ---------- Matching & trust layer ---------- */

// Canonical travel styles, shared by the match quiz, intake form and place tags.
export const VIBES = ['Food', 'Coffee', 'Art', 'Outdoors', 'Nightlife', 'Shopping', 'Stories & history', 'Kid-friendly'];

// What each place is good for. busy = expect lines/crowds at peak times.
const PLACE_TAGS = {
  '4th-st-market': { vibes: ['Food', 'Kid-friendly'], busy: true },
  'bowers': { vibes: ['Art', 'Stories & history', 'Kid-friendly'] },
  'artists-village': { vibes: ['Art', 'Nightlife'] },
  'calle-cuatro': { vibes: ['Coffee'] },
  'el-viejo-taco': { vibes: ['Food', 'Nightlife'] },
  'tacos-el-guero': { vibes: ['Food'] },
  'old-taqueria': { vibes: ['Food'] },
  'santa-ana-zoo': { vibes: ['Outdoors', 'Kid-friendly'] },
  'orange-plaza': { vibes: ['Stories & history', 'Shopping'] },
  'circle-antiques': { vibes: ['Shopping', 'Stories & history'] },
  'plaza-espresso': { vibes: ['Coffee'] },
  'irvine-park': { vibes: ['Outdoors', 'Kid-friendly'] },
  'chapman-eats': { vibes: ['Food'] },
  'the-lab': { vibes: ['Shopping', 'Art'] },
  'the-camp': { vibes: ['Shopping'] },
  'mesa-brunch': { vibes: ['Food', 'Coffee'], busy: true },
  'crystal-cove': { vibes: ['Outdoors', 'Stories & history'] },
  'balboa-island': { vibes: ['Outdoors', 'Food', 'Kid-friendly'], busy: true },
  'heisler-park': { vibes: ['Outdoors', 'Kid-friendly'] },
  'laguna-galleries': { vibes: ['Art', 'Shopping'] },
  'top-of-world': { vibes: ['Outdoors'] },
  'asian-garden': { vibes: ['Shopping', 'Food', 'Stories & history'] },
  'pho-bolsa': { vibes: ['Food'] },
  'banh-mi-lan': { vibes: ['Food'] },
  'night-market': { vibes: ['Food', 'Nightlife'], busy: true },
  'dt-fullerton': { vibes: ['Nightlife', 'Food'] },
  'fullerton-arb': { vibes: ['Outdoors', 'Kid-friendly'] },
  'record-shop': { vibes: ['Shopping', 'Art'] },
  'packing-district': { vibes: ['Food', 'Kid-friendly'], busy: true },
};
for (const [id, t] of Object.entries(PLACE_TAGS)) Object.assign(PLACES[id], t);

// Per-creator: style fingerprint (0–100 per vibe), usual pace & spend, track record,
// place library (last scouted + personal tip), and reviews from travelers.
const CREATOR_EXTRAS = {
  marisol: {
    fingerprint: { Food: 95, Art: 85, Nightlife: 70, Coffee: 60, 'Stories & history': 50, 'Kid-friendly': 45, Shopping: 30, Outdoors: 25 },
    pace: 'balanced', spend: 45,
    stats: { onTime: 100, replyHrs: 2, went: 94, repeat: 31 },
    library: {
      'paleteria-rosa': ['2026-10-04', 'Mango con chile. Eat it on the curb like everyone else.'],
      '4th-st-market': ['2026-10-11', 'Go before noon on weekends or the lines get real.'],
      'el-viejo-taco': ['2026-10-09', 'Al pastor, trust me. Cash is faster.'],
      'tacos-el-guero': ['2026-10-02', 'My runner-up, and open Tuesdays. Hit the salsa bar twice.'],
      'artists-village': ['2026-10-03', 'First Saturday art walk is the move.'],
      'calle-cuatro': ['2026-10-12', 'Get the horchata cold brew.'],
      'bowers': ['2026-09-20', 'The Mesoamerican wing is the move.'],
      'santa-ana-zoo': ['2026-06-14', 'Small and easy with kids. Two hours max.'],
      'old-taqueria': ['2025-11-02', 'RIP. Moved, and the new spot isn’t the same.'],
    },
    reviewList: [
      { name: 'Priya', trip: 'Couple · Foodies', rating: 5, went: true, when: 'Sep 2026', text: 'We would never have found the taco stand on our own. Every stop felt like a friend’s recommendation.' },
      { name: 'Marcus', trip: 'Friends · Art + nightlife', rating: 5, went: true, when: 'Aug 2026', text: 'She asked two questions I didn’t think to answer and nailed the whole day. The art walk timing was perfect.' },
      { name: 'Jen', trip: 'Family of 4', rating: 4, went: true, when: 'Jul 2026', text: 'Great food picks. Next time I’d ask for one less stop with the kids, but she offered a swap right away.' },
    ],
  },
  dev: {
    fingerprint: { Coffee: 95, 'Stories & history': 90, Shopping: 80, Food: 65, Art: 50, Outdoors: 45, 'Kid-friendly': 40, Nightlife: 20 },
    pace: 'relaxed', spend: 70,
    stats: { onTime: 95, replyHrs: 6, went: 89, repeat: 18 },
    library: {
      'orange-depot': ['2026-09-27', 'The old Santa Fe depot. Trains still stop, so time it with one.'],
      'plaza-paperbacks': ['2026-10-05', 'Local history shelf is by the register.'],
      'soda-fountain': ['2026-10-11', 'Malted and a patty melt at the counter.'],
      'santiago-oaks': ['2026-09-13', 'Windes Trail loop before it gets hot.'],
      'plaza-espresso': ['2026-10-13', 'Sit outside facing the fountain.'],
      'circle-antiques': ['2026-10-05', 'Ask for the back room.'],
      'orange-plaza': ['2026-10-13', 'Walk all four quadrants. Look up at the rooflines.'],
      'chapman-eats': ['2026-09-27', 'Reserve a week ahead.'],
      'irvine-park': ['2026-08-30', 'Rent a pedal boat if the lake is up.'],
    },
    reviewList: [
      { name: 'Hannah', trip: 'Couple · Slow travel', rating: 5, went: true, when: 'Oct 2026', text: 'The slowest, nicest Saturday we’ve had in a year. He knew the history of every building.' },
      { name: 'Luis', trip: 'Solo · Antiques', rating: 5, went: true, when: 'Aug 2026', text: 'The back-room tip alone was worth it.' },
    ],
  },
  kai: {
    fingerprint: { Outdoors: 98, 'Kid-friendly': 70, 'Stories & history': 55, Art: 45, Food: 40, Coffee: 30, Shopping: 20, Nightlife: 15 },
    pace: 'active', spend: 30,
    stats: { onTime: 98, replyHrs: 4, went: 96, repeat: 27 },
    library: {
      'thousand-steps': ['2026-10-12', 'It’s about 200 steps, not a thousand. Worth every one at low tide.'],
      'treasure-island': ['2026-10-01', 'Tide pools and a bluff path. Quieter than Heisler.'],
      'aliso-wood': ['2026-09-21', 'Go early and look for Cathedral Cave.'],
      'coast-acai': ['2026-10-12', 'Post-surf bowl. Get the peanut butter one.'],
      'heisler-park': ['2026-10-14', 'Check the tide chart. Low tide is everything.'],
      'crystal-cove': ['2026-10-10', 'Historic cottages, and the quiet end of the beach.'],
      'top-of-world': ['2026-10-06', 'Sunset over Catalina on a clear day.'],
      'laguna-galleries': ['2026-09-12', 'Gallery row on foot.'],
      'balboa-island': ['2026-07-19', 'Frozen banana, then walk the bayfront.'],
    },
    reviewList: [
      { name: 'Tom', trip: 'Friends · Active', rating: 5, went: true, when: 'Oct 2026', text: 'He timed the tide pools to the minute. We saw an octopus.' },
      { name: 'Aisha', trip: 'Family · Outdoors', rating: 5, went: true, when: 'Sep 2026', text: 'Kid-proof hikes and a beach that wasn’t packed. Exactly what we asked for.' },
    ],
  },
  tina: {
    fingerprint: { Food: 98, 'Stories & history': 80, 'Kid-friendly': 75, Shopping: 70, Nightlife: 55, Coffee: 50, Art: 30, Outdoors: 15 },
    pace: 'balanced', spend: 40,
    stats: { onTime: 100, replyHrs: 1, went: 97, repeat: 35 },
    library: {
      'freedom-park': ['2026-09-30', 'The memorial my parents take every visitor to.'],
      'che-co-ba': ['2026-10-10', 'Chè ba màu. Ask what’s fresh today.'],
      'ca-phe-corner': ['2026-10-13', 'Cà phê sữa đá, strong. They’ll ask if you’re sure.'],
      'hu-tieu-house': ['2026-10-06', 'Hủ tiếu Nam Vang, dry, soup on the side.'],
      'pho-bolsa': ['2026-10-14', 'Order the đặc biệt.'],
      'banh-mi-lan': ['2026-10-12', 'Grab extra for later.'],
      'asian-garden': ['2026-10-04', 'Jewelry floor, then the food court upstairs.'],
      'night-market': ['2026-09-26', 'Friday and Saturday only. Bring cash.'],
    },
    reviewList: [
      { name: 'Grace', trip: 'Family · Foodies', rating: 5, went: true, when: 'Oct 2026', text: 'My parents cried at the phở place. It tasted like home for them.' },
      { name: 'Ben', trip: 'Couple · Culture', rating: 5, went: true, when: 'Sep 2026', text: 'She explained the history of Little Saigon between every stop. Felt like a tour with a friend.' },
    ],
  },
  jordan: {
    fingerprint: { Nightlife: 95, Shopping: 75, Art: 65, Food: 60, Outdoors: 50, Coffee: 40, 'Stories & history': 35, 'Kid-friendly': 15 },
    pace: 'balanced', spend: 60,
    stats: { onTime: 90, replyHrs: 8, went: 85, repeat: 15 },
    library: {
      'fullerton-depot': ['2026-10-03', 'Old Santa Fe depot. Trains roll through every few minutes.'],
      'hillcrest-park': ['2026-10-08', 'Climb to the top lawn for sunset over downtown.'],
      'muckenthaler': ['2026-08-30', 'Check the outdoor concert calendar first.'],
      'back-room-coffee': ['2026-10-11', 'Where the record-shop crowd caffeinates.'],
      'amerige-tacos': ['2026-10-09', 'Late-night window. Carne asada fries for the group.'],
      'record-shop': ['2026-10-10', '$5 bin in the back.'],
      'dt-fullerton': ['2026-10-11', 'Check who’s playing that night.'],
      'fullerton-arb': ['2026-08-02', 'Quiet morning reset.'],
      'packing-district': ['2026-09-19', 'Lunch for the whole group.'],
    },
    reviewList: [
      { name: 'Dani', trip: 'Friends · Nightlife', rating: 5, went: true, when: 'Sep 2026', text: 'Best bachelorette night out, and nothing felt basic.' },
      { name: 'Chris', trip: 'Solo · Music', rating: 4, went: false, when: 'Aug 2026', text: 'Great list. Haven’t gone yet but the record shop picks look perfect.' },
    ],
  },
  ana: {
    fingerprint: { Shopping: 95, Food: 80, Coffee: 75, Art: 70, Outdoors: 55, Nightlife: 35, 'Kid-friendly': 35, 'Stories & history': 25 },
    pace: 'relaxed', spend: 85,
    stats: { onTime: 96, replyHrs: 3, went: 92, repeat: 24 },
    library: {
      'pocket-matcha': ['2026-10-12', 'Iced strawberry matcha. Tiny shop, big line.'],
      'noguchi-garden': ['2026-09-28', 'Free and almost always empty. Bring a book.'],
      'segerstrom': ['2026-10-02', 'The plaza and lobby are free to walk.'],
      'cdm-beach': ['2026-10-05', 'Walk to the jetty end for the best view.'],
      'the-lab': ['2026-10-12', 'Vintage and plant shops.'],
      'the-camp': ['2026-10-12', 'Right next door.'],
      'mesa-brunch': ['2026-10-05', 'Get the ube pancakes. Put your name down early.'],
      'balboa-island': ['2026-09-28', 'Frozen banana, then walk the bayfront.'],
      'crystal-cove': ['2026-08-16', 'Bring a towel and stay for sunset.'],
    },
    reviewList: [
      { name: 'Olivia', trip: 'Friends · Treat yourself', rating: 5, went: true, when: 'Oct 2026', text: 'Every shop was a yes. Brunch was the best of the trip.' },
      { name: 'Sam', trip: 'Couple · Design', rating: 5, went: true, when: 'Sep 2026', text: 'Felt like a magazine spread, but real and not stuffy.' },
    ],
  },
};
for (const c of CREATORS) Object.assign(c, CREATOR_EXTRAS[c.id]);

// How many locals have a place in their library: a cheap "vouched for" signal.
export const vouchers = (pid) => CREATORS.filter((c) => c.places.includes(pid));

/* ---------- The local's edge: insider details, perks, and what's happening this week ---------- */

// What a local adds to each stop that AI and review sites can't: [key, icon, label, placeholder]
export const INSIDER = [
  ['order', '🍽️', 'What to get', 'The al pastor, extra pineapple'],
  ['arrive', '🅿️', 'Getting there', 'Park in the 3rd St structure, not the street'],
  ['when', '⏰', 'Best time', 'Before 11, or the line wraps the block'],
  ['secret', '🤫', 'Local secret', 'Ask for the salsa they keep behind the counter'],
  ['story', '📖', 'The story', 'Same family since 1987. The abuela still makes the masa'],
  ['planB', '🔁', 'Plan B', 'If it’s packed, Tacos El Güero is 6 min away'],
];

// Relationships with local businesses ("tell them Marisol sent you"). Demo businesses only.
const PERKS = {
  marisol: { 'el-viejo-taco': 'Say “Marisol sent me” for a free agua fresca', 'calle-cuatro': 'Show your Limon plan for 10% off', 'tacos-el-guero': 'Ask for “Marisol’s plate” to get the off-menu salsa flight' },
  dev: { 'plaza-espresso': 'Free pastry with your first drink. Mention Dev', 'circle-antiques': '15% off one item with your Limon plan' },
  tina: { 'pho-bolsa': 'Free chè dessert when you mention Tina', 'banh-mi-lan': 'Buy five bánh mì, get one free' },
  jordan: { 'record-shop': '10% off plus a free sticker. Say Jordan sent you' },
  ana: { 'mesa-brunch': 'Mention Ana to skip the walk-in waitlist' },
  kai: {},
};

// Timely updates only someone who lives there knows. Shown on the profile as "This week in …".
const THIS_WEEK = {
  marisol: [['Oct 13', 'First Saturday art walk is this weekend. The new mural on the Artists Village side is finally done.'], ['Oct 9', 'El Viejo moved their truck hours: now open until 11:30 on Fridays.']],
  dev: [['Oct 12', 'The plaza’s fall antique fair runs both days this weekend. Go Saturday morning before the dealers pick it over.']],
  kai: [['Oct 14', 'Minus tides this week around 7am. Best tide pooling of the season at Heisler.'], ['Oct 10', 'Top of the World trail was re-graded. The loose section near the top is fixed.']],
  tina: [['Oct 14', 'Night market vendors are doing a mooncake pop-up through Sunday.'], ['Oct 8', 'Phở Bolsa Corner is closed Wednesdays now (new schedule).']],
  jordan: [['Oct 11', 'Two free shows downtown Friday. The early one is the better band.']],
  ana: [['Oct 12', 'The LAB has a weekend vintage market in the back lot. Bring cash.']],
};
for (const c of CREATORS) { c.perks = PERKS[c.id] ?? {}; c.thisWeek = THIS_WEEK[c.id] ?? []; }

// More free sample days, two per creator, built from places in each creator's library.
// November sunsets are around 4:50pm, so outdoor stops wrap up by then.
SAMPLES.push(
  { id: 's-marisol-2', creator: 'marisol', title: 'Taco crawl on Calle Cuatro', intake: { budget: 50, group: 2, pace: 'balanced' },
    days: [{ date: '2026-11-06', stops: [
      { place: 'tacos-el-guero', time: '13:00', duration: 45, note: 'Start here. Hit the salsa bar twice.' },
      { place: 'paleteria-rosa', time: '14:00', duration: 30, note: 'Mango con chile to cool down.' },
      { place: 'artists-village', time: '14:45', duration: 120, note: 'Walk it off between the studios.' },
      { place: 'el-viejo-taco', time: '17:30', duration: 60, note: 'Al pastor right when they open.' },
    ] }] },
  { id: 's-marisol-3', creator: 'marisol', title: 'Santa Ana with the kids', intake: { budget: 60, group: 4, pace: 'relaxed' },
    days: [{ date: '2026-11-08', stops: [
      { place: 'calle-cuatro', time: '09:00', duration: 45, note: 'Coffee for you, conchas for them.' },
      { place: 'santa-ana-zoo', time: '10:15', duration: 150, note: 'Small zoo, perfect for little legs.' },
      { place: '4th-st-market', time: '13:15', duration: 75, note: 'Everyone picks their own stall.' },
      { place: 'paleteria-rosa', time: '14:45', duration: 30, note: 'Paletas to end the day.' },
    ] }] },
  { id: 's-dev-2', creator: 'dev', title: 'Coffee, books and the old depot', intake: { budget: 50, group: 2, pace: 'relaxed' },
    days: [{ date: '2026-11-08', stops: [
      { place: 'plaza-espresso', time: '09:00', duration: 45, note: 'Cortado by the fountain.' },
      { place: 'orange-depot', time: '10:00', duration: 30, note: 'The old Santa Fe depot. Wait for a train.' },
      { place: 'plaza-paperbacks', time: '10:45', duration: 75, note: 'Find something about old Orange.' },
      { place: 'soda-fountain', time: '12:15', duration: 60, note: 'Malted and a patty melt at the counter.' },
    ] }] },
  { id: 's-dev-3', creator: 'dev', title: 'Oak trails, then antiques', intake: { budget: 80, group: 2, pace: 'balanced' },
    days: [{ date: '2026-11-14', stops: [
      { place: 'santiago-oaks', time: '08:00', duration: 120, note: 'Windes Trail loop while it’s cool.' },
      { place: 'soda-fountain', time: '10:30', duration: 60, note: 'Second breakfast. You earned it.' },
      { place: 'circle-antiques', time: '11:45', duration: 90, note: 'Ask for the back room.' },
      { place: 'orange-plaza', time: '13:30', duration: 60, note: 'Walk the four quadrants.' },
      { place: 'chapman-eats', time: '17:00', duration: 90, note: 'Book the early seating.' },
    ] }] },
  { id: 's-kai-2', creator: 'kai', title: 'Thousand Steps at low tide', intake: { budget: 40, group: 2, pace: 'active' },
    days: [{ date: '2026-11-15', stops: [
      { place: 'thousand-steps', time: '07:30', duration: 120, note: 'Time it with the low tide.' },
      { place: 'coast-acai', time: '10:00', duration: 45, note: 'Refuel on the way back north.' },
      { place: 'treasure-island', time: '11:15', duration: 90, note: 'Bluff path and a second round of tide pools.' },
      { place: 'laguna-galleries', time: '13:15', duration: 75, note: 'Galleries on foot to cool down.' },
    ] }] },
  { id: 's-kai-3', creator: 'kai', title: 'Canyon morning, cove afternoon', intake: { budget: 60, group: 2, pace: 'active' },
    days: [{ date: '2026-11-14', stops: [
      { place: 'aliso-wood', time: '07:30', duration: 150, note: 'Out to Cathedral Cave and back.' },
      { place: 'coast-acai', time: '10:30', duration: 45, note: 'Açaí before the beach.' },
      { place: 'crystal-cove', time: '11:45', duration: 180, note: 'Walk north past the cottages.' },
      { place: 'heisler-park', time: '15:15', duration: 90, note: 'Golden hour on the bluff. Sunset is around 4:50.' },
    ] }] },
  { id: 's-tina-2', creator: 'tina', title: 'Noodles, coffee, chè', intake: { budget: 50, group: 2, pace: 'balanced' },
    days: [{ date: '2026-11-14', stops: [
      { place: 'hu-tieu-house', time: '09:00', duration: 60, note: 'Hủ tiếu Nam Vang, dry, soup on the side.' },
      { place: 'ca-phe-corner', time: '10:30', duration: 45, note: 'Cà phê sữa đá, strong.' },
      { place: 'freedom-park', time: '11:30', duration: 45, note: 'The memorial. Take your time here.' },
      { place: 'banh-mi-lan', time: '12:30', duration: 30, note: 'Bánh mì for the road.' },
      { place: 'che-co-ba', time: '13:30', duration: 45, note: 'Chè ba màu to finish.' },
    ] }] },
  { id: 's-tina-3', creator: 'tina', title: 'Little Saigon with the whole family', intake: { budget: 60, group: 5, pace: 'relaxed' },
    days: [{ date: '2026-11-08', stops: [
      { place: 'pho-bolsa', time: '09:00', duration: 60, note: 'Big table in the back for groups.' },
      { place: 'asian-garden', time: '10:30', duration: 120, note: 'Let the kids pick a snack upstairs.' },
      { place: 'che-co-ba', time: '13:00', duration: 45, note: 'Something sweet for everyone.' },
      { place: 'freedom-park', time: '14:00', duration: 45, note: 'A good place to share family stories.' },
    ] }] },
  { id: 's-jordan-2', creator: 'jordan', title: 'Record Store Saturday', intake: { budget: 50, group: 2, pace: 'balanced' },
    days: [{ date: '2026-11-07', stops: [
      { place: 'back-room-coffee', time: '11:00', duration: 45, note: 'Where the crate-diggers caffeinate.' },
      { place: 'record-shop', time: '12:00', duration: 90, note: '$5 bin in the back.' },
      { place: 'amerige-tacos', time: '13:45', duration: 45, note: 'Tacos at the window.' },
      { place: 'fullerton-depot', time: '14:45', duration: 30, note: 'Watch a train roll through.' },
      { place: 'hillcrest-park', time: '15:45', duration: 60, note: 'Top lawn for sunset over downtown.' },
      { place: 'dt-fullerton', time: '19:00', duration: 180, note: 'Pick a show and stay for it.' },
    ] }] },
  { id: 's-jordan-3', creator: 'jordan', title: 'Friday art, then a late show', intake: { budget: 70, group: 4, pace: 'balanced' },
    days: [{ date: '2026-11-13', stops: [
      { place: 'back-room-coffee', time: '11:30', duration: 45, note: 'Fuel up first.' },
      { place: 'muckenthaler', time: '12:30', duration: 90, note: 'Check the outdoor concert calendar.' },
      { place: 'packing-district', time: '14:30', duration: 90, note: 'Late lunch, everyone picks a stall.' },
      { place: 'dt-fullerton', time: '18:00', duration: 240, note: 'Early show, then the late one.' },
    ] }] },
  { id: 's-ana-2', creator: 'ana', title: 'Design day in Costa Mesa', intake: { budget: 80, group: 2, pace: 'relaxed' },
    days: [{ date: '2026-11-14', stops: [
      { place: 'pocket-matcha', time: '09:15', duration: 45, note: 'Iced strawberry matcha.' },
      { place: 'noguchi-garden', time: '10:30', duration: 60, note: 'Free, quiet, and very photogenic.' },
      { place: 'segerstrom', time: '11:45', duration: 45, note: 'Walk the plaza and the lobby.' },
      { place: 'mesa-brunch', time: '13:00', duration: 60, note: 'Late brunch. Ube pancakes.' },
    ] }] },
  { id: 's-ana-3', creator: 'ana', title: 'Treat-yourself beach Sunday', intake: { budget: 100, group: 2, pace: 'relaxed' },
    days: [{ date: '2026-11-15', stops: [
      { place: 'mesa-brunch', time: '09:00', duration: 75, note: 'Mention Ana to skip the waitlist.' },
      { place: 'the-camp', time: '10:45', duration: 75, note: 'Slow browse, no rush.' },
      { place: 'cdm-beach', time: '12:45', duration: 150, note: 'Walk to the jetty end.' },
      { place: 'balboa-island', time: '15:45', duration: 90, note: 'Frozen banana at golden hour.' },
    ] }] },
);

// Insider details on the free sample days (by stop index), so portfolios show the full local layer.
const SAMPLE_INSIDER = {
  's-marisol-1': [
    { order: 'Horchata cold brew and a concha', arrive: 'Free 2-hour street parking on Sycamore', secret: 'The back patio has outlets and nobody knows about it' },
    { when: 'Weekday mornings are empty. School groups show up after 11', story: 'One of the oldest museums in OC, started in 1936 in a Mission Revival building', planB: 'If an exhibit’s closed, the courtyard café is worth a sit' },
    { order: 'Split three stalls. Start with the birria', when: 'Get there by 12:45 before the office lunch rush', arrive: 'It’s a 2-min walk from the museum. Leave the car', planB: 'If it’s slammed, grab a table outside and send one person per stall' },
    { secret: 'Studio doors with a chalkboard sign out front mean the artist is in. Knock', story: 'Old downtown buildings turned studios in the ’90s. Half the artists still live upstairs' },
    { order: 'Al pastor, two each. Trust me', when: 'Opens at 5. By 7 there’s a line', secret: 'Cash moves faster. There’s a separate cash window on the side', story: 'Same family since 1987' },
  ],
  's-kai-1': [
    { when: 'Check the tide chart. Anything under 0.5 ft is the jackpot', arrive: 'Park on Cliff Dr. Meters start at 8', secret: 'The best pools are north of the stairs, not south' },
    { order: 'Nothing to buy. Just walk Forest Ave to Pacific Coast Hwy', story: 'Laguna started as an artist colony in the 1900s' },
    { arrive: 'Use the Los Trancos lot and take the tunnel under PCH', secret: 'Walk north past the cottages. The crowd thins out fast', planB: 'If the lot’s full, Pelican Point lot is 5 min south' },
    { when: 'Start 45 min before sunset', arrive: 'Park at the end of Top of the World Dr', planB: 'On a foggy day, swap for a sunset walk at Heisler instead' },
  ],
  's-tina-1': [
    { order: 'Đặc biệt with extra herbs', when: 'Before 9 for the freshest broth' },
    { secret: 'Second floor has the jewelry stalls. Haggling is expected', story: 'The heart of Little Saigon since the ’80s' },
    { order: 'Grab extra for later. They hold up' },
    { when: 'Friday and Saturday only', arrive: 'Park a block away and walk in', order: 'Grilled corn with scallion oil' },
  ],
  's-marisol-2': [
    { order: 'Two asada and one cabeza. Add the grilled onions', arrive: 'Street parking on 4th is easiest before 1', secret: 'Ask for “Marisol’s plate” for the off-menu salsa flight' },
    { order: 'Mango con chile, or tamarindo if you like it tart', when: 'Mid-afternoon, before the after-school rush' },
    { secret: 'Studio doors with a chalkboard sign out front mean the artist is in. Knock', story: 'Old downtown storefronts turned studios. A lot of the artists live upstairs', planB: 'If studios are closed, the murals on the side streets are always open' },
    { order: 'Al pastor, two each. Trust me', when: 'Be there right at 5. By 7 there’s a line', secret: 'Cash moves faster. There’s a separate cash window on the side' },
  ],
  's-marisol-3': [
    { order: 'Horchata cold brew for you, conchas for the kids', arrive: 'Free 2-hour street parking on Sycamore' },
    { when: 'Right at opening, while the animals are most active', secret: 'The small train loop is the highlight for little kids. Do it first before the line builds', planB: 'If someone melts down, the shady picnic area near the entrance is a good reset' },
    { order: 'Everyone picks a stall. Grab a big table first', when: 'After 1:15 the lunch rush has cleared', arrive: 'Short drive back downtown. Park in the 3rd St structure' },
    { order: 'Fresa con crema for the kids', secret: 'They’ll let little ones taste a flavor before choosing' },
  ],
  's-dev-2': [
    { order: 'A cortado and whatever pastry is fresh', secret: 'Mention Dev for a free pastry with your first drink', arrive: 'Free 2-hour parking in the lots behind the plaza' },
    { when: 'Trains still stop here, so stay a few minutes and one may roll through', story: 'Old Towne grew up around the railroad. The depot is a reminder of when it was a citrus town' },
    { secret: 'The local history shelf is right by the register', planB: 'If you finish early, browse the antique shops on Glassell' },
    { order: 'Chocolate malted and a patty melt', when: 'Grab a counter seat before noon', story: 'A proper counter where the regulars all know each other' },
  ],
  's-dev-3': [
    { when: 'Start by 8. The trails get hot and busy by late morning', arrive: 'Park in the main lot. There’s a small day-use fee', secret: 'The Windes Trail loop has the best views for the effort' },
    { order: 'Pancakes and a malted. You earned it', arrive: 'About 15 minutes back to Old Towne' },
    { secret: 'Ask to see the back room. That’s where the good stuff is', order: 'Show your Limon plan for 15% off one item' },
    { story: 'One of the best-preserved old downtowns in California. Walk all four quadrants around the fountain', when: 'Early afternoon, when the shops are open but it’s not crowded' },
    { order: 'Whatever the seasonal special is', when: 'Book the early seating a week ahead', planB: 'If it’s full, the plaza has plenty of walk-in spots' },
  ],
  's-kai-2': [
    { when: 'Check the tide chart. Go within an hour of low tide', arrive: 'Street parking on PCH near 9th Ave. Read the signs carefully', secret: 'It’s about 200 steps down, not a thousand. Save energy for the climb back up' },
    { order: 'The peanut butter bowl with extra granola', arrive: 'Head back north on PCH. Park behind the shop' },
    { secret: 'Follow the bluff path to the tide pools on the north side', when: 'Late morning, while the tide is still low', planB: 'If the pools are covered, the bluff walk is still worth it' },
    { story: 'Laguna started as an artists’ colony in the early 1900s', order: 'Nothing to buy. Walk Forest Ave down to the water' },
  ],
  's-kai-3': [
    { when: 'Start at 7:30 before it heats up', arrive: 'Main lot off Alicia Pkwy. Small parking fee', secret: 'The side trail to Cathedral Cave is worth the extra climb' },
    { order: 'An açaí bowl with banana and honey', planB: 'If there’s a line, grab a smoothie to go' },
    { arrive: 'Use the Los Trancos lot and take the tunnel under PCH', secret: 'Walk north past the cottages. The crowd thins out fast', planB: 'If the lot’s full, Pelican Point lot is a few minutes south' },
    { when: 'Arrive by 3:15. Sunset is around 4:50 this time of year', arrive: 'Park on Cliff Dr. Read the meter signs', story: 'The bluff path has had the same view since Laguna was a tiny art town' },
  ],
  's-tina-2': [
    { order: 'Hủ tiếu Nam Vang, dry, soup on the side', when: 'Before 10 on weekends', secret: 'Ask for the pickled garlic. It isn’t on the table' },
    { order: 'Cà phê sữa đá, strong. They’ll ask if you’re sure', secret: 'Sit by the window and watch Bolsa wake up' },
    { story: 'A U.S. soldier and a South Vietnamese soldier stand side by side. It’s a place many families here visit together', when: 'Quiet in the late morning' },
    { order: 'The classic đặc biệt bánh mì', secret: 'Buy five, get one free. Take extras home' },
    { order: 'Chè ba màu, the three-color dessert', planB: 'If it’s busy, take it to go and eat in the plaza' },
  ],
  's-tina-3': [
    { order: 'Đặc biệt with extra herbs, plus a kids’ bowl', secret: 'Mention Tina for a free chè dessert', arrive: 'Big tables in the back. Groups of five fit easily' },
    { story: 'The heart of Little Saigon since the ’80s', secret: 'Second floor has the jewelry stalls. Haggling is expected', planB: 'Food court upstairs if anyone gets hungry again' },
    { order: 'A mix of chè so everyone can try a little', when: 'Early afternoon, before the dessert crowd' },
    { story: 'A good place to share family stories with the next generation', arrive: 'Plenty of parking around the park' },
  ],
  's-jordan-2': [
    { order: 'Oat cortado', secret: 'Ask the baristas what’s playing downtown tonight. They know' },
    { order: 'Start in the $5 bin in the back', secret: 'Say Jordan sent you for 10% off and a free sticker', when: 'Right after opening, before the crate-diggers clear out the new arrivals' },
    { order: 'Carne asada tacos and a horchata', arrive: 'Short walk down Amerige Ave' },
    { story: 'Fullerton grew up around this old Santa Fe depot. Trains still roll through every few minutes', secret: 'Stand on the footbridge for the best train view' },
    { when: 'Get there by 4. Sunset is around 4:50', arrive: 'Park at the top lot, then walk the stairs', secret: 'The upper lawn has the best view over downtown' },
    { when: 'Shows start around 8. Show up early for a spot', planB: 'If a show sells out, three other bars are within a block', arrive: 'Park in the Harbor Blvd structure' },
  ],
  's-jordan-3': [
    { order: 'A cold brew for the walk', when: 'Before noon on Fridays it’s quiet' },
    { story: 'A 1920s family mansion turned arts center', when: 'Check the outdoor concert calendar before you go', arrive: 'Park on the grounds or the street out front' },
    { order: 'Split a few stalls with the group', arrive: 'About 10 minutes south in Anaheim', secret: 'Seats on the upper level are easier to find mid-afternoon' },
    { when: 'Catch the early show, then decide on the late one', planB: 'If you’re tired, the early show alone is enough', arrive: 'Harbor Blvd structure is closest' },
  ],
  's-ana-2': [
    { order: 'Iced strawberry matcha', when: 'Before 10, or the line goes out the door' },
    { story: 'Isamu Noguchi designed it in the early ’80s. It’s hidden between office towers', secret: 'Free and almost always empty. Bring a book', arrive: 'Park in the public structure next door' },
    { secret: 'The lobby and the plaza are free to walk, even without a show', arrive: 'A short walk from the garden' },
    { order: 'Ube pancakes', secret: 'Mention Ana to skip the walk-in waitlist', when: 'Last seating before close' },
  ],
  's-ana-3': [
    { order: 'Ube pancakes and a lavender latte', secret: 'Mention Ana to skip the walk-in waitlist' },
    { secret: 'The shops at the back are less crowded', when: 'Late morning, before the lunch crowd' },
    { arrive: 'Park in the lower lot. It fills by noon on weekends', secret: 'Walk to the jetty end for the best view', planB: 'If the lot’s full, the street above has 2-hour parking' },
    { order: 'Frozen banana, dipped and rolled in nuts', when: 'Golden hour, right before sunset', story: 'The frozen banana stands on the island have been around for decades' },
  ],
  's-dev-1': [
    { order: 'A cortado and whatever pastry came out last', secret: 'Mention Dev for a free pastry with your first drink', arrive: 'Free 2-hour parking in the lots behind the plaza' },
    { story: 'One of the best-preserved old downtowns in California, built around the fountain in the middle of the circle', when: 'Before 10, while it’s quiet', secret: 'Look up. The second stories show the original buildings best' },
    { secret: 'Ask to see the back room. That’s where the good stuff is', order: 'Show your Limon plan for 15% off one item', when: 'Saturday morning, before the dealers pick it over' },
    { order: 'Whatever the seasonal special is', when: 'Reserve a week ahead for Saturday', planB: 'If it’s full, the plaza has plenty of walk-in spots' },
  ],
  's-jordan-1': [
    { story: 'A 26-acre garden on the Cal State Fullerton campus', when: 'Mornings are calm and cool', arrive: 'Use the arboretum lot, not the campus structures' },
    { order: 'Split a few stalls with the group', secret: 'Seats on the upper level are easier to find', arrive: 'About 10 minutes south in Anaheim' },
    { order: 'Start in the $5 bin in the back', secret: 'Say Jordan sent you for 10% off and a free sticker', when: 'Mid-afternoon, after the new arrivals are out' },
    { when: 'Shows start around 8. Get there early for a spot', planB: 'If a show sells out, there are other bars within a block', arrive: 'Park in a downtown structure and walk' },
  ],
  's-ana-1': [
    { order: 'Ube pancakes', secret: 'Mention Ana to skip the walk-in waitlist', when: 'Before 10 on weekends' },
    { secret: 'The vintage and plant shops are tucked toward the back', when: 'Late morning, before the lunch crowd' },
    { order: 'Browse the small makers’ shops', arrive: 'Right next door. Walk over, keep the car parked' },
    { order: 'Frozen banana, dipped and rolled in nuts', secret: 'Take the little ferry across to the Balboa Peninsula and back', when: 'Stay for sunset, around 4:50 this time of year' },
  ],
};
for (const s of SAMPLES) (SAMPLE_INSIDER[s.id] ?? []).forEach((ins, i) => { if (s.days[0].stops[i]) s.days[0].stops[i].insider = ins; });

/* ---------- Front-page categories ---------- */
export const CATEGORIES = ['Outdoors', 'Sports', 'History & museums', 'Shopping', 'Health & wellness', 'Events', 'Food & drink', 'Nightlife'];
const CREATOR_CATEGORIES = {
  marisol: ['Food & drink', 'History & museums', 'Events', 'Nightlife'],
  dev: ['History & museums', 'Shopping', 'Food & drink'],
  kai: ['Outdoors', 'Sports', 'Health & wellness'],
  tina: ['Food & drink', 'Shopping', 'Events'],
  jordan: ['Nightlife', 'Events', 'Food & drink'],
  ana: ['Shopping', 'Food & drink', 'Health & wellness', 'Outdoors'],
};
for (const c of CREATORS) c.categories = CREATOR_CATEGORIES[c.id] ?? [];

// Illustrated portraits (these creators are fictional) and a one-line travel taste for the map card.
// To use real photos later, point photo at e.g. assets/creators/marisol.jpg.
const TASTE = {
  marisol: 'Taquerías, murals and late-night street food',
  dev: 'Slow mornings, antiques and old-house history',
  kai: 'Tide pools, coastal trails and golden-hour views',
  tina: 'Phở at dawn, bánh mì runs and night markets',
  jordan: 'Vinyl digs, live sets and late nights downtown',
  ana: 'Design shops, long brunches and beach sunsets',
};
for (const c of CREATORS) { c.photo = `assets/creators/${c.id}.svg`; c.taste = TASTE[c.id] ?? ''; }

// Style scores (0–100) on the home-page categories, drawn as the web on each profile.
// Demo values: Outdoors, Shopping, Nightlife, Food & drink and History follow each fingerprint;
// Sports, Health & wellness and Events are set to match each creator's category tags.
const CATEGORY_SCORES = {
  marisol: { Outdoors: 25, Sports: 15, 'History & museums': 75, Shopping: 30, 'Health & wellness': 20, Events: 80, 'Food & drink': 95, Nightlife: 70 },
  dev: { Outdoors: 45, Sports: 15, 'History & museums': 90, Shopping: 80, 'Health & wellness': 35, Events: 30, 'Food & drink': 95, Nightlife: 20 },
  kai: { Outdoors: 98, Sports: 85, 'History & museums': 55, Shopping: 20, 'Health & wellness': 80, Events: 30, 'Food & drink': 40, Nightlife: 15 },
  tina: { Outdoors: 15, Sports: 10, 'History & museums': 60, Shopping: 75, 'Health & wellness': 30, Events: 80, 'Food & drink': 98, Nightlife: 55 },
  jordan: { Outdoors: 50, Sports: 20, 'History & museums': 35, Shopping: 75, 'Health & wellness': 15, Events: 85, 'Food & drink': 60, Nightlife: 95 },
  ana: { Outdoors: 70, Sports: 20, 'History & museums': 25, Shopping: 95, 'Health & wellness': 75, Events: 40, 'Food & drink': 85, Nightlife: 35 },
};
for (const c of CREATORS) c.categoryScores = CATEGORY_SCORES[c.id] ?? {};
