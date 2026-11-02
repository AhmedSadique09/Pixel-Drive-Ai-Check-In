export interface FacilityRow {
  id: string
  name: string
  fee: number
  siteCount: number
  docName: string
  status: 'live' | 'draft'
  location?: string
  about?: string
  amenities?: string[]
  rulesText?: string
}

export const SAMPLE_RULES_TEXT = `# Arrival / Check-in
Check-in from 14:00. Late arrivals welcome; use the QR code at the gate.

# Garbage
Garbage is take-home only; there is no garbage station on site.

# Generators
Generators may run from 9:00 to 20:00 only.

# Power
Each site has a 20A power hookup.

# Quiet hours
Quiet hours start at 21:30 and end at 7:00. No open fires.

# Check-out
Check-out is by 10:30.`

/** Returns `baseId`, or `baseId-2`, `baseId-3`… when that id is already taken, so every facility keeps a unique id. */
export function uniqueFacilityId(baseId: string, facilities: FacilityRow[]): string {
  const takenIds = new Set(facilities.map((facility) => facility.id))
  if (!takenIds.has(baseId)) return baseId
  let suffix = 2
  while (takenIds.has(`${baseId}-${suffix}`)) suffix += 1
  return `${baseId}-${suffix}`
}

/** Static demo facilities so the Active facilities table is populated before anything is created (no backend yet). */
export const SEED_FACILITIES: FacilityRow[] = [
  {
    id: 'yamabiko-forest-rv-park',
    name: 'Yamabiko Forest RV Park',
    fee: 3000,
    siteCount: 10,
    docName: 'Yamabiko Rules.pdf',
    status: 'live',
    location: 'Nagano Prefecture, Japan',
    about: 'A quiet forest RV park with spacious pull-through sites, built for campervans and motorhomes. Guests check in themselves with the QR code at the gate.',
    amenities: ['20A power hookup at every site', 'Fresh water station', 'Hot spring 10 minutes away', 'Self check-in with QR code'],
    rulesText: SAMPLE_RULES_TEXT,
  },
  {
    id: 'lakeside-camp-fuji',
    name: 'Lakeside Camp Fuji',
    fee: 4500,
    siteCount: 24,
    docName: 'Lakeside Rules.pdf',
    status: 'live',
    location: 'Yamanashi Prefecture, Japan',
    about: 'A lakeside campground with open views of Mt. Fuji. Sites sit close to the shore and suit both tents and small campervans.',
    amenities: ['Lake access and boat rental', 'Shared kitchen and sinks', 'Hot showers', 'Free Wi-Fi at the office'],
  },
  {
    id: 'karuizawa-pine-campground',
    name: 'Karuizawa Pine Campground',
    fee: 3800,
    siteCount: 18,
    docName: 'Karuizawa Guide.txt',
    status: 'live',
    location: 'Nagano Prefecture, Japan',
    about: 'A shaded campground among pine trees, popular in summer for its cool air. Firewood is sold at the front office.',
    amenities: ['Fire pits at every site', 'Firewood on sale', 'Coin laundry', 'Pet-friendly sites'],
  },
  {
    id: 'hakone-onsen-rv-stop',
    name: 'Hakone Onsen RV Stop',
    fee: 5200,
    siteCount: 12,
    docName: 'Hakone Rules.pdf',
    status: 'live',
    location: 'Kanagawa Prefecture, Japan',
    about: 'A small RV stop beside an onsen town. Guests get a discounted bath ticket on arrival.',
    amenities: ['Discounted onsen entry', '30A power hookup', 'Sewage dump station', 'Convenience store 5 minutes away'],
  },
  {
    id: 'nasu-highland-auto-camp',
    name: 'Nasu Highland Auto Camp',
    fee: 3500,
    siteCount: 30,
    docName: 'Nasu Rules.md',
    status: 'live',
    location: 'Tochigi Prefecture, Japan',
    about: 'A large highland auto camp with room for groups and families. Cars park right next to the tent on every site.',
    amenities: ['Group sites for up to 8 people', 'Playground and dog run', 'Hot showers', 'On-site shop'],
  },
  {
    id: 'izu-seaside-camp-garden',
    name: 'Izu Seaside Camp Garden',
    fee: 4000,
    siteCount: 16,
    docName: 'Izu Seaside Rules.pdf',
    status: 'live',
    location: 'Shizuoka Prefecture, Japan',
    about: 'A seaside camp garden a short walk from the beach, with mild weather through most of the year.',
    amenities: ['Beach 3 minutes on foot', 'Outdoor showers', 'Rental BBQ sets', 'Open year-round'],
  },
]
