import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import iconChevronLeft from '../../assets/walkindetails/icon-chevron-left.svg'
import iconGlobe from '../../assets/walkindetails/icon-globe.svg'
import iconMoon from '../../assets/walkindetails/icon-moon.svg'
import './walkin-shell.css'

const STEPS = ['Booking', 'Rules', 'Payment']

interface WalkInShellProps {
  /** 0-based index of the active step; omit to hide the stepper. */
  step?: number
  /** Use the wide two-pane layout on desktop (content left, footer right). */
  isWide?: boolean
  children: ReactNode
  footer: ReactNode
}

/** Shared chrome for the walk-in flow: top bar, stepper, content and sticky footer. */
export default function WalkInShell({ step, isWide = false, children, footer }: WalkInShellProps) {
  const navigate = useNavigate()

  return (
    <main className={`walkin${isWide ? ' walkin--wide' : ''}`}>
      <div className="walkin__brand">
        <span className="walkin__logo">
          <img src={iconMoon} alt="" width={20} height={20} />
        </span>
        <div>
          <p className="walkin__brand-name">RV Park</p>
          <p className="walkin__brand-sub">24-hour self check-in</p>
        </div>
      </div>

      <div className="walkin__panel">
        <header className="walkin__bar">
          <button
            type="button"
            className="walkin__back"
            aria-label="Go back"
            onClick={() => navigate(-1)}
          >
            <img src={iconChevronLeft} alt="" width={20} height={20} />
          </button>
          <p className="walkin__title">Walk-in check-in</p>
          <span className="walkin__lang">
            <img src={iconGlobe} alt="" width={16} height={16} />
            English
          </span>
        </header>

        {step !== undefined && (
          <ol className="walkin__steps" aria-label="Progress">
            {STEPS.map((label, index) => {
              const isCurrent = index === step
              return (
                <li
                  key={label}
                  className={`walkin__step${isCurrent ? ' walkin__step--current' : ''}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className="walkin__step-bar" />
                  <span className="walkin__step-label">
                    <span>{index + 1}</span>
                    <span className="walkin__step-name">{label}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        )}

        <div className="walkin__body">{children}</div>
        <div className="walkin__footer">{footer}</div>
      </div>
    </main>
  )
}
