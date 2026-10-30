import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
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
import iconMoonRule from '../../assets/siterules/icon-moon.svg'
import iconTrash from '../../assets/siterules/icon-trash.svg'
import iconFlame from '../../assets/siterules/icon-flame.svg'
import iconClock from '../../assets/siterules/icon-clock.svg'
import iconNavigation from '../../assets/siterules/icon-navigation.svg'
import iconMapPin from '../../assets/siterules/icon-map-pin.svg'
import iconLogOut from '../../assets/checkoutreminder/icon-log-out.svg'
import iconClockBtn from '../../assets/checkoutreminder/icon-clock-btn.svg'
import '../SiteRules/siterules.css'
import './stayhome.css'

interface HostMessage {
  id: string
  from: 'guest' | 'host'
  text: string
  time: string
}

interface AiMessage {
  id: string
  from: 'guest' | 'ai'
  text: string
  source?: string
}

/** Sample questions guests can tap — answer only appears once tapped. */
const SAMPLE_QA = [
  {
    id: 'generator',
    question: 'Until what time can I run a generator?',
    answer: 'Generators are allowed 7:00–21:00 only. Quiet hours are 22:00–7:00, so please don’t idle your engine either.',
    source: 'Park rules p.2',
  },
  {
    id: 'checkout',
    question: 'Can I get a late check-out?',
    answer: 'Check-out is by 10:00. Late check-out is ¥500/hour — let the host know how much extra time you need.',
    source: 'Park rules p.1',
  },
  {
    id: 'rubbish',
    question: 'Where do I put the rubbish?',
    answer: 'Sort it into 3 types — burnable, cans & bottles, PET — at the trash station.',
    source: 'Park rules p.1',
  },
  {
    id: 'wifi',
    question: 'What’s the Wi-Fi password?',
    answer: 'Network RV-Guest, password camp2026 — same as on your stay pass.',
    source: 'Your stay pass',
  },
  {
    id: 'fire',
    question: 'Can I light a fire?',
    answer: 'Fires are allowed in fire pits only — not directly on the ground.',
    source: 'Park rules p.1',
  },
  {
    id: 'power',
    question: 'What power hookup do I get at my site?',
    answer: 'Each site has a 20A power hookup.',
    source: 'Facility info',
  },
]

const PASS_ROWS = [
  { icon: iconCalendar, label: 'Check-out', value: 'Sat 31 Oct, 10:00' },
  { icon: iconWifi, label: 'Wi-Fi', value: 'RV-Guest・camp2026' },
]

const RULE_ICONS = [iconMoonRule, iconTrash, iconFlame, iconClock]

const QUICK_ACTIONS = [
  { icon: iconMap, label: 'Site map', to: null, action: 'site-map' as const },
  { icon: iconBook, label: 'Rules', to: null, action: 'rules' as const },
  { icon: iconMessageDark, label: 'Contact host', to: null, action: 'contact-host' as const },
]

const SITE_NUMBER = 'B-07'

function VanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 16.5V9a1 1 0 0 1 1-1h8.5a1 1 0 0 1 .8.4l3 4a1 1 0 0 0 .8.4H20a1 1 0 0 1 1 1v2.7" />
      <path d="M3 16.5h18" />
      <path d="M12.5 8v4.8" />
      <circle cx="7.2" cy="17.3" r="1.7" />
      <circle cx="16.8" cy="17.3" r="1.7" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  )
}

type SpotStatus = 'you' | 'occupied' | 'empty'

const PARKING_SITES: { id: string; status: SpotStatus }[] = [
  { id: 'B-01', status: 'occupied' },
  { id: 'B-02', status: 'empty' },
  { id: 'B-03', status: 'occupied' },
  { id: 'B-04', status: 'occupied' },
  { id: 'B-05', status: 'empty' },
  { id: 'B-06', status: 'occupied' },
  { id: SITE_NUMBER, status: 'you' },
  { id: 'B-08', status: 'empty' },
  { id: 'B-09', status: 'occupied' },
  { id: 'B-10', status: 'empty' },
]

function nowLabel(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function StayHome() {
  const navigate = useNavigate()
  const copy = useLanguage().t.checkIn.siteRules
  const [showRules, setShowRules] = useState(false)
  const [showSiteMap, setShowSiteMap] = useState(false)
  const [showContactHost, setShowContactHost] = useState(false)
  const [hostMessages, setHostMessages] = useState<HostMessage[]>([])
  const [hostDraft, setHostDraft] = useState('')
  const [showAiGuide, setShowAiGuide] = useState(false)
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([])
  const [askedQaIds, setAskedQaIds] = useState<string[]>([])
  const [aiDraft, setAiDraft] = useState('')
  const [aiTyping, setAiTyping] = useState(false)
  const aiTypingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!showAiGuide && aiTypingTimeout.current) {
      clearTimeout(aiTypingTimeout.current)
      aiTypingTimeout.current = null
      setAiTyping(false)
    }
  }, [showAiGuide])

  const handleSendToHost = () => {
    if (hostDraft.trim().length === 0) return
    const message: HostMessage = { id: `${Date.now()}`, from: 'guest', text: hostDraft.trim(), time: nowLabel() }
    setHostMessages((current) => [...current, message])
    setHostDraft('')
  }

  const handleAskSampleQuestion = (id: string) => {
    const qa = SAMPLE_QA.find((item) => item.id === id)
    if (!qa || askedQaIds.includes(id) || aiTyping) return
    setAskedQaIds((current) => [...current, id])
    setAiMessages((current) => [...current, { id: `${id}-q`, from: 'guest', text: qa.question }])
    setAiTyping(true)
    aiTypingTimeout.current = setTimeout(() => {
      setAiMessages((current) => [...current, { id: `${id}-a`, from: 'ai', text: qa.answer, source: qa.source }])
      setAiTyping(false)
      aiTypingTimeout.current = null
    }, 5000)
  }

  const handleAskAiGuide = () => {
    if (aiDraft.trim().length === 0) return
    const message: AiMessage = { id: `${Date.now()}`, from: 'guest', text: aiDraft.trim() }
    setAiMessages((current) => [...current, message])
    setAiDraft('')
  }

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
                <p className="stay__site-number">{SITE_NUMBER}</p>
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
            <button type="button" className="stay__cta" onClick={() => setShowAiGuide(true)}>
              <img src={iconMessageWhite} alt="" width={18} height={18} />
              Ask the AI guide
            </button>
          </section>

          <div className="stay__actions-group">
            <ul className="stay__actions">
              {QUICK_ACTIONS.map(({ icon, label, to, action }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="stay__action"
                    disabled={to === null && action === null}
                    onClick={() => {
                      if (action === 'site-map') setShowSiteMap(true)
                      else if (action === 'rules') setShowRules(true)
                      else if (action === 'contact-host') setShowContactHost(true)
                      else if (to) navigate(to)
                    }}
                  >
                    <img src={icon} alt="" width={22} height={22} />
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="stay__checkout-bar">
              <button type="button" className="co-btn co-btn--primary" onClick={() => navigate('/check-out/checklist')}>
                <img src={iconLogOut} alt="" width={18} height={18} />
                Start check-out
              </button>
              <button type="button" className="co-btn co-btn--secondary" onClick={() => navigate('/check-out/extend')}>
                <img src={iconClockBtn} alt="" width={18} height={18} />
                Stay a bit longer
              </button>
            </div>
          </div>
        </div>
      </div>

      {showRules && (
        <div className="stay__modal-overlay" role="dialog" aria-modal="true" aria-labelledby="stay-rules-title" onClick={() => setShowRules(false)}>
          <div className="stay__modal" onClick={(event) => event.stopPropagation()}>
            <div className="stay__modal-head">
              <h2 id="stay-rules-title" className="stay__modal-title">
                {copy.title}
              </h2>
              <button type="button" className="stay__modal-close" onClick={() => setShowRules(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
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
          </div>
        </div>
      )}

      {showSiteMap && (
        <div className="stay__modal-overlay" role="dialog" aria-modal="true" aria-labelledby="stay-sitemap-title" onClick={() => setShowSiteMap(false)}>
          <div className="stay__modal" onClick={(event) => event.stopPropagation()}>
            <div className="stay__modal-head">
              <h2 id="stay-sitemap-title" className="stay__modal-title">
                Site map
              </h2>
              <button type="button" className="stay__modal-close" onClick={() => setShowSiteMap(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <section className="site-card" aria-labelledby="stay-sitemap-number">
              <div className="site-card__head">
                <div>
                  <p id="stay-sitemap-number" className="site-card__label">
                    {copy.siteLabel}
                  </p>
                  <p className="site-card__number">{SITE_NUMBER}</p>
                </div>
                <span className="site-card__pin">
                  <img src={iconNavigation} alt="" width={20} height={20} />
                </span>
              </div>

              <div className="parking-lot" role="img" aria-label={copy.mapAria(SITE_NUMBER)}>
                <ul className="parking-lot__legend">
                  <li>
                    <span className="parking-dot parking-dot--you" /> Your site
                  </li>
                  <li>
                    <span className="parking-dot parking-dot--occupied" /> Occupied
                  </li>
                  <li>
                    <span className="parking-dot parking-dot--empty" /> Empty
                  </li>
                </ul>
                <div className="parking-lot__grid">
                  {PARKING_SITES.map((site) => (
                    <div key={site.id} className={`parking-spot parking-spot--${site.status}`}>
                      {site.status !== 'empty' && (
                        <span className="parking-spot__van">
                          <VanIcon />
                        </span>
                      )}
                      <span className="parking-spot__id">{site.id}</span>
                    </div>
                  ))}
                </div>
                <div className="parking-lot__entrance">{copy.entrance}</div>
              </div>

              <p className="site-card__directions">
                <img src={iconMapPin} alt="" width={16} height={16} />
                {copy.directions}
              </p>
            </section>
          </div>
        </div>
      )}

      {showContactHost && (
        <div className="stay__drawer-overlay" onClick={() => setShowContactHost(false)}>
          <aside
            className="stay__drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stay-host-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="stay__drawer-head">
              <span className="stay__drawer-avatar">
                <img src={iconMessageDark} alt="" width={18} height={18} />
              </span>
              <div className="stay__drawer-head-text">
                <h2 id="stay-host-title" className="stay__drawer-title">
                  Contact host
                </h2>
                <p className="stay__drawer-desc">We’ll send your message to the host on LINE. Their reply will appear here.</p>
              </div>
              <button type="button" className="stay__drawer-close" onClick={() => setShowContactHost(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>

            <div className="stay__drawer-thread">
              {hostMessages.length === 0 ? (
                <p className="stay__drawer-empty">No messages yet. Say hello to your host.</p>
              ) : (
                hostMessages.map((message) => (
                  <div key={message.id} className="stay__drawer-bubble">
                    <p>{message.text}</p>
                    <span>{message.time}</span>
                  </div>
                ))
              )}
            </div>

            <form
              className="stay__drawer-composer"
              onSubmit={(event) => {
                event.preventDefault()
                handleSendToHost()
              }}
            >
              <input
                value={hostDraft}
                onChange={(event) => setHostDraft(event.target.value)}
                placeholder="Type a message"
                aria-label="Message the host"
              />
              <button type="submit" disabled={hostDraft.trim().length === 0} className="stay__drawer-send">
                Send
              </button>
            </form>
          </aside>
        </div>
      )}

      {showAiGuide && (
        <div className="stay__drawer-overlay" onClick={() => setShowAiGuide(false)}>
          <aside
            className="stay__drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stay-ai-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="stay__drawer-head">
              <span className="stay__drawer-avatar">
                <img src={iconSparkles} alt="" width={18} height={18} />
              </span>
              <div className="stay__drawer-head-text">
                <h2 id="stay-ai-title" className="stay__drawer-title">
                  AI guide
                </h2>
                <p className="stay__drawer-desc">
                  <span className="stay__drawer-online" aria-hidden="true" />
                  Answers 24/7 from the park’s own documents.
                </p>
              </div>
              <button type="button" className="stay__drawer-close" onClick={() => setShowAiGuide(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>

            <div className="stay__drawer-thread">
              {aiMessages.length === 0 && (
                <p className="stay__drawer-empty">Tap a question below to see the answer.</p>
              )}
              {aiMessages.map((message) =>
                message.from === 'guest' ? (
                  <div key={message.id} className="stay__drawer-bubble">
                    <p>{message.text}</p>
                  </div>
                ) : (
                  <div key={message.id} className="stay__drawer-ai-row">
                    <span className="stay__drawer-ai-avatar">
                      <img src={iconSparkles} alt="" width={12} height={12} />
                    </span>
                    <div className="stay__drawer-bubble stay__drawer-bubble--ai">
                      <p>{message.text}</p>
                      {message.source && <span className="stay__drawer-source">{message.source}</span>}
                    </div>
                  </div>
                ),
              )}
              {aiTyping && (
                <div className="stay__drawer-ai-row">
                  <span className="stay__drawer-ai-avatar">
                    <img src={iconSparkles} alt="" width={12} height={12} />
                  </span>
                  <div className="stay__drawer-bubble stay__drawer-bubble--ai stay__drawer-bubble--typing" aria-label="AI guide is typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>

            {SAMPLE_QA.some((qa) => !askedQaIds.includes(qa.id)) && (
              <ul className="stay__drawer-chips" aria-label="Sample questions">
                {SAMPLE_QA.filter((qa) => !askedQaIds.includes(qa.id)).map((qa) => (
                  <li key={qa.id}>
                    <button type="button" className="stay__drawer-chip" disabled={aiTyping} onClick={() => handleAskSampleQuestion(qa.id)}>
                      {qa.question}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form
              className="stay__drawer-composer"
              onSubmit={(event) => {
                event.preventDefault()
                handleAskAiGuide()
              }}
            >
              <input
                value={aiDraft}
                onChange={(event) => setAiDraft(event.target.value)}
                placeholder="Ask anything…"
                aria-label="Ask the AI guide"
              />
              <button type="submit" disabled={aiDraft.trim().length === 0} className="stay__drawer-send">
                Send
              </button>
            </form>
          </aside>
        </div>
      )}
    </main>
  )
}
