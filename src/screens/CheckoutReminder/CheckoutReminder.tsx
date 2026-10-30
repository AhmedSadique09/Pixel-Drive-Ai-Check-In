import { useNavigate } from 'react-router-dom'
import iconCalendar from '../../assets/checkoutreminder/icon-calendar.svg'
import iconCheck from '../../assets/checkoutreminder/icon-check.svg'
import iconClock from '../../assets/checkoutreminder/icon-clock.svg'
import iconClockBtn from '../../assets/checkoutreminder/icon-clock-btn.svg'
import iconLogOut from '../../assets/checkoutreminder/icon-log-out.svg'
import iconSun from '../../assets/checkoutreminder/icon-sun.svg'
import CheckoutShell from '../CheckoutShared/CheckoutShell'
import './checkoutreminder.css'

const STEPS = ['Before you leave', 'Check-out']

export default function CheckoutReminder() {
  const navigate = useNavigate()

  return (
    <CheckoutShell
      variant="brand"
      step={0}
      bar={
        <>
          <button type="button" className="co-btn co-btn--primary" onClick={() => navigate('/check-out/checklist')}>
            <img src={iconLogOut} alt="" width={18} height={18} />
            Start check-out
          </button>
          <button type="button" className="co-btn co-btn--secondary" onClick={() => navigate('/check-out/extend')}>
            <img src={iconClockBtn} alt="" width={18} height={18} />
            Stay a bit longer
          </button>
        </>
      }
    >
      <section className="reminder__greeting" aria-labelledby="reminder-title">
        <p className="reminder__hello">
          <img src={iconSun} alt="" width={16} height={16} />
          Good morning
        </p>
        <h1 id="reminder-title" className="co-title">
          Check-out is today at 10:00
        </h1>
        <p className="reminder__countdown">
          <img src={iconClock} alt="" width={14} height={14} />
          1 h 12 min left
        </p>
      </section>

      <section className="reminder__pass" aria-label="Your stay">
        <div className="reminder__site">
          <div>
            <p className="reminder__site-label">Site</p>
            <p className="reminder__site-number">B-07</p>
          </div>
          <p className="reminder__paid">
            <img src={iconCheck} alt="" width={12} height={12} />
            Paid
          </p>
        </div>
        <hr className="reminder__divider" />
        <div className="reminder__row">
          <img src={iconCalendar} alt="" width={16} height={16} />
          <span className="reminder__row-label">Check-out</span>
          <span className="reminder__row-value">Sat 31 Oct, 10:00</span>
        </div>
      </section>

      <ol className="reminder__steps">
        {STEPS.map((label, index) => (
          <li key={label} className="reminder__step">
            <span className="reminder__step-no">{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      <p className="reminder__hint">Run through the checklist before you leave, then check out here.</p>
    </CheckoutShell>
  )
}
