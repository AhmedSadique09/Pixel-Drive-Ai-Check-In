import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckInShell from '../../components/checkin-flow/CheckInShell'
import { useLanguage } from '../../i18n/LanguageContext'
import iconCheck from '../../assets/siterules/icon-check.svg'
import iconClock from '../../assets/siterules/icon-clock.svg'
import iconFlame from '../../assets/siterules/icon-flame.svg'
import iconMapPin from '../../assets/siterules/icon-map-pin.svg'
import iconMoon from '../../assets/siterules/icon-moon.svg'
import iconNavigation from '../../assets/siterules/icon-navigation.svg'
import iconTrash from '../../assets/siterules/icon-trash.svg'
import siteMap from '../../assets/siterules/map.svg'
import './siterules.css'

const SITE_NUMBER = 'B-07'

// Same order as `siteRules.rules` in the translations.
const RULE_ICONS = [iconMoon, iconTrash, iconFlame, iconClock]

export default function SiteRules() {
  const navigate = useNavigate()
  const copy = useLanguage().t.checkIn.siteRules
  const [hasAgreed, setHasAgreed] = useState(true)

  return (
    <CheckInShell
      step={2}
      size="wide"
      onBack={() => navigate('/check-in/booking')}
      footer={
        <>
          <label className={`agree${hasAgreed ? ' agree--checked' : ''}`}>
            <input
              type="checkbox"
              className="agree__input"
              checked={hasAgreed}
              onChange={(event) => setHasAgreed(event.target.checked)}
            />
            <span className="agree__box" aria-hidden="true">
              {hasAgreed && <img src={iconCheck} alt="" width={16} height={16} />}
            </span>
            <span className="agree__text">{copy.agreeText}</span>
          </label>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!hasAgreed}
            onClick={() => navigate('/check-in/payment')}
          >
            {copy.agreeCta}
          </button>
        </>
      }
    >
      <div className="site-rules">
        <section className="site-card" aria-labelledby="site-card-label">
          <div className="site-card__head">
            <div>
              <p id="site-card-label" className="site-card__label">
                {copy.siteLabel}
              </p>
              <p className="site-card__number">{SITE_NUMBER}</p>
            </div>
            <span className="site-card__pin">
              <img src={iconNavigation} alt="" width={20} height={20} />
            </span>
          </div>

          <div
            className="site-map"
            role="img"
            aria-label={copy.mapAria(SITE_NUMBER)}
          >
            <div className="site-map__canvas">
              <img src={siteMap} alt="" width={322} height={112} />
              <span className="site-map__label site-map__label--site">{SITE_NUMBER}</span>
              <span className="site-map__label site-map__label--restroom">{copy.restrooms}</span>
              <span className="site-map__label site-map__label--kitchen">{copy.kitchen}</span>
              <span className="site-map__label site-map__label--entrance">{copy.entrance}</span>
            </div>
          </div>

          <p className="site-card__directions">
            <img src={iconMapPin} alt="" width={16} height={16} />
            {copy.directions}
          </p>
        </section>

        <section className="rules" aria-labelledby="rules-title">
          <h1 id="rules-title" className="rules__title">
            {copy.title}
          </h1>
          <ul className="rules__list">
            {copy.rules.map(({ title, text }, index) => (
              <li key={RULE_ICONS[index]} className="rule">
                <span className="rule__icon">
                  <img src={RULE_ICONS[index]} alt="" width={20} height={20} />
                </span>
                <div className="rule__text">
                  <p className="rule__title">{title}</p>
                  <p className="rule__desc">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </CheckInShell>
  )
}
