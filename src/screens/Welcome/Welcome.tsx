import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { LANGUAGE_OPTIONS } from '../../i18n/translations'
import iconCheck from '../../assets/welcome/icon-check.svg'
import iconChevronRight from '../../assets/welcome/icon-chevron-right.svg'
import iconClock from '../../assets/welcome/icon-clock.svg'
import iconMoon from '../../assets/welcome/icon-moon.svg'
import iconSmartphone from '../../assets/welcome/icon-smartphone.svg'
import iconSparkles from '../../assets/welcome/icon-sparkles.svg'
import illustration from '../../assets/welcome/illustration.svg'
import './welcome.css'

// Same order as `welcome.highlights` in the translations.
const HIGHLIGHT_ICONS = [iconClock, iconSmartphone, iconSparkles]

export default function Welcome() {
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage()
  const copy = t.welcome

  return (
    <main className="welcome">
      <section className="welcome__hero">
        <div className="welcome__brand">
          <span className="welcome__logo">
            <img src={iconMoon} alt="" width={20} height={20} />
          </span>
          <div>
            <p className="welcome__brand-name">RV Park</p>
            <p className="welcome__brand-sub">{t.common.selfCheckIn}</p>
          </div>
        </div>

        <div className="welcome__intro">
          <p className="welcome__greet">{copy.greet}</p>
          <h1 className="welcome__title">{copy.title}</h1>
          <p className="welcome__desc">{copy.desc}</p>
        </div>

        <ul className="welcome__pills">
          {copy.highlights.map((label, index) => (
            <li key={HIGHLIGHT_ICONS[index]} className="welcome__pill">
              <img src={HIGHLIGHT_ICONS[index]} alt="" width={14} height={14} />
              {label}
            </li>
          ))}
        </ul>

        <div className="welcome__landscape" aria-hidden="true">
          <img src={illustration} alt="" width={390} height={96} />
        </div>
      </section>

      <section className="welcome__sheet" aria-labelledby="lang-heading">
        <div className="welcome__sheet-inner">
          <h2 id="lang-heading" className="welcome__sheet-title">
            {copy.chooseLanguage}
          </h2>
          <ul className="welcome__langs">
            {LANGUAGE_OPTIONS.map(({ code, name, hint }) => {
              const isSelected = code === language
              return (
                <li key={code}>
                  <button
                    type="button"
                    lang={code}
                    className={`lang-option${isSelected ? ' lang-option--selected' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => setLanguage(code)}
                  >
                    <span className="lang-option__text">
                      <span className="lang-option__name">{name}</span>
                      <span className="lang-option__hint">{hint}</span>
                    </span>
                    {isSelected ? (
                      <span className="lang-option__check">
                        <img src={iconCheck} alt="" width={14} height={14} />
                      </span>
                    ) : (
                      <img src={iconChevronRight} alt="" width={20} height={20} />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            className="welcome__continue"
            onClick={() => navigate('/check-in/plate')}
          >
            {copy.continueLabel}
          </button>
          <p className="welcome__powered">{copy.powered}</p>
        </div>
      </section>
    </main>
  )
}
