export type SiteKind = 'powered' | 'standard'

export interface Site {
  id: string
  kind: SiteKind
  isTaken: boolean
}

export interface SiteArea {
  id: 'B' | 'A'
  kind: SiteKind
  label: string
  sites: readonly Site[]
}

export interface SiteDetails {
  title: string
  note: string
  price: number
}

const site = (id: string, kind: SiteKind, isTaken = false): Site => ({ id, kind, isTaken })

export const AREAS: readonly SiteArea[] = [
  {
    id: 'B',
    kind: 'powered',
    label: 'Area B · Powered',
    sites: [
      site('B-07', 'powered'),
      site('B-08', 'powered', true),
      site('B-09', 'powered'),
      site('B-10', 'powered', true),
      site('B-11', 'powered', true),
      site('B-12', 'powered'),
    ],
  },
  {
    id: 'A',
    kind: 'standard',
    label: 'Area A · Standard',
    sites: [
      site('A-01', 'standard'),
      site('A-02', 'standard', true),
      site('A-03', 'standard'),
      site('A-04', 'standard'),
      site('A-05', 'standard', true),
      site('A-06', 'standard'),
    ],
  },
]

const PRICE_BY_KIND: Record<SiteKind, number> = { powered: 3000, standard: 2000 }

export function getSiteDetails(selected: Site): SiteDetails {
  const isPowered = selected.kind === 'powered'
  return {
    title: `${selected.id} · ${isPowered ? 'Powered site' : 'Standard site'}`,
    note: isPowered ? 'Opposite restrooms · AC 100V' : 'Flat ground · near the kitchen',
    price: PRICE_BY_KIND[selected.kind],
  }
}

export function countFree(sites: readonly Site[]): number {
  return sites.filter((entry) => !entry.isTaken).length
}
