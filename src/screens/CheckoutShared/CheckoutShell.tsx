import type { ReactNode } from 'react'
import LanguageMenu from '../../components/language-menu/LanguageMenu'
import iconChevronLeft from '../../assets/checkoutshared/icon-chevron-left.svg'
import iconGlobe from '../../assets/checkoutshared/icon-globe.svg'
import iconMoon from '../../assets/checkoutshared/icon-moon.svg'
import './checkout.css'

const FLOW_STEPS = ['Morning reminder', 'Checklist', 'Complete & receipt'] as const

interface CheckoutShellProps {
  /** 'brand' shows the logo + park name, 'back' shows a back button + "Check-out". */
  variant: 'brand' | 'back'
  /** 1-based position in the check-out flow, used by the desktop side rail. */
  step: 1 | 2 | 3
  onBack?: () => void
  /** Page content. */
  children: ReactNode
  /** Sticky bottom action area (mobile) / inline actions (desktop). */
  bar: ReactNode
}

export default function CheckoutShell({ variant, step, onBack, children, bar }: CheckoutShellProps) {
  return (
    <div className="co">
      <aside className="co__rail" aria-label="Check-out progress">
        <div className="co__rail-brand">
          <span className="co__logo">
            <img src={iconMoon} alt="" width={18} height={18} />
          </span>
          <div>
            <p className="co__rail-name">RV Park</p>
            <p className="co__rail-sub">24-hour self check-in</p>
          </div>
        </div>
        <div className="co__rail-body">
          <p className="co__rail-eyebrow">Check-out</p>
          <ol className="co__flow">
            {FLOW_STEPS.map((label, index) => {
              const number = index + 1
              const state = number < step ? 'done' : number === step ? 'current' : 'todo'
              return (
                <li
                  key={label}
                  className={`co__flow-item co__flow-item--${state}`}
                  aria-current={state === 'current' ? 'step' : undefined}
                >
                  <span className="co__flow-no">{number}</span>
                  {label}
                </li>
              )
            })}
          </ol>
        </div>
      </aside>

      <div className="co__pane">
        <header className="co__topbar">
          {variant === 'back' ? (
            <button type="button" className="co__round" aria-label="Back" onClick={onBack}>
              <img src={iconChevronLeft} alt="" width={20} height={20} />
            </button>
          ) : (
            <span className="co__logo">
              <img src={iconMoon} alt="" width={18} height={18} />
            </span>
          )}
          <p className="co__topbar-title">{variant === 'back' ? 'Check-out' : 'RV Park'}</p>
          <LanguageMenu icon={iconGlobe} triggerClassName="co__lang" />
        </header>

        <main className="co__main">
          <div className="co__content">{children}</div>
          <div className="co__bar">{bar}</div>
        </main>
      </div>
    </div>
  )
}
