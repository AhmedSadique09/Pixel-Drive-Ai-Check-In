/** Screen manifest: one folder per screen under src/screens/<folder>/<folder>.tsx (default export). */
export interface ScreenRoute {
  path: string
  folder: string
  /** Figma frame the screen was built from, when one exists */
  figmaNodeId?: string
}

export const SCREEN_ROUTES: ScreenRoute[] = [
  { path: '/', folder: 'Welcome', figmaNodeId: '6:259' },
  /** No Figma frame — built from the project requirements doc, not a design file. */
  { path: '/admin', folder: 'Admin' },
  { path: '/check-in/plate', folder: 'FindByPlate', figmaNodeId: '8:739' },
  { path: '/check-in/no-booking', folder: 'NoBooking', figmaNodeId: '8:835' },
  { path: '/check-in/booking', folder: 'BookingFound', figmaNodeId: '6:429' },
  { path: '/check-in/rules', folder: 'SiteRules', figmaNodeId: '6:534' },
  { path: '/check-in/payment', folder: 'Payment', figmaNodeId: '6:648' },
  { path: '/stay', folder: 'StayHome', figmaNodeId: '6:732' },
  { path: '/guide', folder: 'GuideAnswers', figmaNodeId: '6:817' },
  { path: '/guide/ask-host', folder: 'GuideAskHost', figmaNodeId: '6:905' },
  { path: '/guide/host-replied', folder: 'GuideHostReplied', figmaNodeId: '6:981' },
  { path: '/walk-in', folder: 'WalkInDetails', figmaNodeId: '10:599' },
  { path: '/walk-in/site', folder: 'WalkInSite', figmaNodeId: '10:689' },
  { path: '/walk-in/full', folder: 'WalkInFull', figmaNodeId: '8:1120' },
  { path: '/check-out', folder: 'CheckoutReminder', figmaNodeId: '17:711' },
  { path: '/check-out/checklist', folder: 'CheckoutChecklist', figmaNodeId: '17:794' },
  { path: '/check-out/extend', folder: 'CheckoutExtend', figmaNodeId: '17:888' },
  { path: '/check-out/complete', folder: 'CheckoutComplete', figmaNodeId: '17:959' },
]
