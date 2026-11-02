/** Shared demo site-availability helpers for the walk-in booking steps (no backend). */

export const SITE_COUNT = 10
export const AVAILABILITY_RANGE_DAYS = 30

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

const TODAY = new Date()
export const MIN_STAY_DATE = toISODate(TODAY)
export const MAX_STAY_DATE = toISODate(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + AVAILABILITY_RANGE_DAYS))

/** Deterministic per-date hash so the same date always shows the same demo availability. */
function hashDate(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

export interface SiteSlot {
  id: string
  isOccupied: boolean
}

export function getAvailability(dateValue: string): SiteSlot[] {
  const seed = hashDate(dateValue)
  return Array.from({ length: SITE_COUNT }, (_, index) => ({
    id: `B-${String(index + 1).padStart(2, '0')}`,
    isOccupied: (seed >> index) % 3 === 0,
  }))
}

export function hasAvailability(dateValue: string): boolean {
  return getAvailability(dateValue).some((slot) => !slot.isOccupied)
}
