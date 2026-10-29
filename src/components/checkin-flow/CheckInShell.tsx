import type { ReactNode } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import LanguageMenu from '../language-menu/LanguageMenu'
import iconChevronLeft from '../../assets/checkin-shell/icon-chevron-left.svg'
import iconCheckSmall from '../../assets/checkin-shell/icon-check-small.svg'
import iconGlobe from '../../assets/checkin-shell/icon-globe.svg'
import './checkin-shell.css'

export type CheckInStep = 1 | 2

interface CheckInShellProps {
  step: CheckInStep
  onBack: () => void
  /** Action area: sticky bottom bar on mobile, panel footer on desktop */
  footer: ReactNode
  /** Panel width on desktop */
  size?: 'narrow' | 'wide'
  children: ReactNode
}

function Stepper({ step }: { step: CheckInStep }) {
  const { t } = useLanguage()

  return (
    <ol className="shell__stepper" aria-label={t.checkIn.progressLabel}>
      {t.checkIn.steps.map((label, index) => {
        const number = index + 1
        const state = number < step ? 'done' : number === step ? 'current' : 'todo'
        return (
          <li
            key={number}
            className={`shell__step shell__step--${state}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className="shell__step-bar" />
            <span className="shell__step-label">
              {state === 'done' ? (
                <img src={iconCheckSmall} alt="" width={12} height={12} />
              ) : (
                <span className="shell__step-number">{number}</span>
              )}
              <span className="shell__step-name">{label}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default function CheckInShell({
  step,
  onBack,
  footer,
  size = 'narrow',
  children,
}: CheckInShellProps) {
  const { t } = useLanguage()

  return (
    <div className={`shell shell--${size}`}>
      <p className="shell__eyebrow" aria-hidden="true">
        {t.common.selfCheckIn}
      </p>
      <div className="shell__panel">
        <header className="shell__top">
          <button
            type="button"
            className="shell__back"
            onClick={onBack}
            aria-label={t.common.goBack}
          >
            <img src={iconChevronLeft} alt="" width={20} height={20} />
          </button>
          <p className="shell__title">RV Park</p>
          <LanguageMenu icon={iconGlobe} triggerClassName="shell__lang" />
        </header>
        <Stepper step={step} />
        <main className="shell__content">{children}</main>
        <div className="shell__footer">{footer}</div>
      </div>
    </div>
  )
}
