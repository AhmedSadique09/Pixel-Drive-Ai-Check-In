import { useNavigate } from 'react-router-dom'
import iconMoon from '../../assets/stayhome/moon.svg'
import iconGlobe from '../../assets/stayhome/globe.svg'
import iconCheckSuccess from '../../assets/stayhome/check-success.svg'
import iconCheckBadge from '../../assets/stayhome/check-badge.svg'
import iconCalendar from '../../assets/stayhome/calendar.svg'
import iconWifi from '../../assets/stayhome/wifi.svg'
import iconSparkles from '../../assets/stayhome/sparkles.svg'
import iconMessageWhite from '../../assets/stayhome/message-white.svg'
import iconMap from '../../assets/stayhome/map.svg'
import iconBook from '../../assets/stayhome/book.svg'
import iconMessageDark from '../../assets/stayhome/message-dark.svg'
import './stayhome.css'

const PASS_ROWS = [
  { icon: iconCalendar, label: 'Check-out', value: 'Sat 31 Oct, 10:00' },
  { icon: iconWifi, label: 'Wi-Fi', value: 'RV-Guest・camp2026' },
]

const QUICK_ACTIONS = [
  { icon: iconMap, label: 'Site map', to: null },
  { icon: iconBook, label: 'Rules', to: '/check-in/rules' },
  { icon: iconMessageDark, label: 'Contact host', to: '/guide/ask-host' },
]

export default function StayHome() {
  const navigate = useNavigate()

  return (
    <main className="stay">
      <div className="stay__frame">
        <header className="stay__topbar">
          <span className="stay__logo">
            <img src={iconMoon} alt="" width={18} height={18} />
          </span>
          <p className="stay__park">RV Park</p>
          <span className="stay__lang">
            <img src={iconGlobe} alt="" width={16} height={16} />
            English
          </span>
        </header>

        <div className="stay__content">
          <section className="stay__success" aria-labelledby="stay-title">
            <span className="stay__success-icon">
              <img src={iconCheckSuccess} alt="" width={26} height={26} />
            </span>
            <div className="stay__success-text">
              <h1 id="stay-title" className="stay__title">
                You’re checked in
              </h1>
              <p className="stay__sub">Enjoy your night.</p>
            </div>
          </section>

          <section className="stay__pass" aria-label="Your stay pass">
            <div className="stay__site">
              <div>
                <p className="stay__site-label">Site</p>
                <p className="stay__site-number">B-07</p>
              </div>
              <span className="stay__paid">
                <img src={iconCheckBadge} alt="" width={12} height={12} />
                Paid
              </span>
            </div>
            <hr className="stay__divider" />
            <dl className="stay__rows">
              {PASS_ROWS.map(({ icon, label, value }) => (
                <div key={label} className="stay__row">
                  <img src={icon} alt="" width={16} height={16} />
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="stay__guide" aria-labelledby="guide-title">
            <div className="stay__guide-head">
              <span className="stay__guide-icon">
                <img src={iconSparkles} alt="" width={20} height={20} />
              </span>
              <div>
                <h2 id="guide-title" className="stay__guide-title">
                  Questions? Ask the AI guide
                </h2>
                <p className="stay__guide-desc">Answers 24/7 from the park’s own documents.</p>
              </div>
            </div>
            <button type="button" className="stay__cta" onClick={() => navigate('/guide')}>
              <img src={iconMessageWhite} alt="" width={18} height={18} />
              Ask the AI guide
            </button>
          </section>

          <ul className="stay__actions">
            {QUICK_ACTIONS.map(({ icon, label, to }) => (
              <li key={label}>
                <button
                  type="button"
                  className="stay__action"
                  disabled={to === null}
                  onClick={() => to && navigate(to)}
                >
                  <img src={icon} alt="" width={22} height={22} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
