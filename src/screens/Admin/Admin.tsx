import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPanelIcon } from '../../components/AdminPanelIcon'
import LanguageMenu from '../../components/language-menu/LanguageMenu'
import { useLanguage } from '../../i18n/LanguageContext'
import iconGlobe from '../../assets/checkoutshared/icon-globe.svg'
import './admin.css'

type Tab = 'arrivals' | 'questions' | 'facilities' | 'activeFacilities'

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  )
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {collapsed ? <path d="M6 3.5 10.5 8 6 12.5" /> : <path d="M10 3.5 5.5 8l4.5 4.5" />}
    </svg>
  )
}

function ArrivalsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="14" height="13" rx="2" />
      <path d="M3 8h14M7 2.5v3M13 2.5v3" />
    </svg>
  )
}

function QuestionsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4.5h14v9H8l-3.5 3v-3H3v-9Z" />
    </svg>
  )
}

function FacilitiesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 17V8l6-4.5L16 8v9" />
      <path d="M8 17v-5h4v5" />
    </svg>
  )
}

function ActiveFacilitiesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5h12M4 10h12M4 14.5h7" />
      <circle cx="16" cy="14.5" r="1.4" />
    </svg>
  )
}

interface ArrivalRow {
  guest: string
  plate: string
  site: string
  checkedIn: boolean
  paid: boolean
}

interface ChatMessage {
  id: string
  sender: 'guest' | 'ai' | 'operator'
  text: string
  time: string
}

interface GuestThread {
  id: string
  name: string
  lang: string
  messages: ChatMessage[]
}

interface FacilityRow {
  id: string
  name: string
  fee: number
  siteCount: number
  docName: string
  status: 'live' | 'draft'
}

const DEFAULT_FEE = 3000
const DEFAULT_SITES = 10
const MS_PER_SECOND = 1000

const SAMPLE_RULES_TEXT = `# Arrival / Check-in
Check-in from 14:00. Late arrivals welcome; use the QR code at the gate.

# Garbage
Garbage is take-home only; there is no garbage station on site.

# Generators
Generators may run from 9:00 to 20:00 only.

# Power
Each site has a 20A power hookup.

# Quiet hours
Quiet hours start at 21:30 and end at 7:00. No open fires.

# Check-out
Check-out is by 10:30.`

/** Static demo data matching the single seeded booking used across the guest flow (no backend yet). */
const ARRIVALS: ArrivalRow[] = [{ guest: '山田 太郎', plate: '品川 300 あ 12-34', site: 'B-07', checkedIn: true, paid: true }]

/** The two sample questions from the project's own demo script, as a chat thread for the single seeded guest. */
const INITIAL_THREADS: GuestThread[] = [
  {
    id: 'yamada',
    name: '山田 太郎',
    lang: 'JA',
    messages: [
      { id: 'q1', sender: 'guest', text: '発電機は何時まで使える？', time: '14:12' },
      { id: 'a1', sender: 'ai', text: '発電機は9:00〜20:00までご利用いただけます。', time: '14:12' },
      { id: 'q2', sender: 'guest', text: '近くの温泉は何時まで？', time: '16:40' },
      { id: 'a2', sender: 'ai', text: '近くの温泉は21:00まで営業しています。', time: '16:40' },
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah Johnson',
    lang: 'EN',
    messages: [
      { id: 'q1', sender: 'guest', text: 'Can I get a late check-out tomorrow?', time: '09:05' },
      { id: 'a1', sender: 'ai', text: 'Check-out is by 10:00. Late check-out is ¥500/hour.', time: '09:05' },
      { id: 'q2', sender: 'guest', text: "What's the Wi-Fi password?", time: '09:11' },
      { id: 'a2', sender: 'ai', text: 'Network RV-Guest, password camp2026.', time: '09:11' },
    ],
  },
  {
    id: 'minjun',
    name: '김민준',
    lang: 'KO',
    messages: [
      { id: 'q1', sender: 'guest', text: '사이트에 전원 연결은 어떻게 하나요?', time: '11:20' },
      { id: 'a1', sender: 'ai', text: '각 사이트에는 20A 전원 연결이 제공됩니다.', time: '11:20' },
    ],
  },
  {
    id: 'wangwei',
    name: '王伟',
    lang: 'ZH',
    messages: [
      { id: 'q1', sender: 'guest', text: '垃圾应该放在哪里？', time: '18:02' },
      { id: 'a1', sender: 'ai', text: '请分类放置：可燃、罐瓶、PET，在垃圾站处理。', time: '18:02' },
      { id: 'q2', sender: 'guest', text: '可以生火吗？', time: '18:05' },
      { id: 'a2', sender: 'ai', text: '仅可在火盆中生火，禁止直接在地面生火。', time: '18:05' },
    ],
  },
]

const TABS: { id: Tab; Icon: typeof ArrivalsIcon }[] = [
  { id: 'arrivals', Icon: ArrivalsIcon },
  { id: 'questions', Icon: QuestionsIcon },
  { id: 'facilities', Icon: FacilitiesIcon },
  { id: 'activeFacilities', Icon: ActiveFacilitiesIcon },
]

const guestLink = (id: string) => `${typeof window === 'undefined' ? '' : window.location.origin}/?facility=${id}`

function ArrivalsPanel() {
  const copy = useLanguage().t.admin.arrivals
  const checkedInCount = ARRIVALS.filter((a) => a.checkedIn).length
  const unpaidCount = ARRIVALS.filter((a) => !a.paid).length
  return (
    <div className="admin__panel">
      <div className="admin__stats">
        <div className="admin__stat">
          <p className="admin__stat-value">{ARRIVALS.length}</p>
          <p className="admin__stat-label">{copy.arrivalsToday}</p>
        </div>
        <div className="admin__stat">
          <p className="admin__stat-value">{checkedInCount}</p>
          <p className="admin__stat-label">{copy.checkedIn}</p>
        </div>
        <div className="admin__stat admin__stat--warn">
          <p className="admin__stat-value">{unpaidCount}</p>
          <p className="admin__stat-label">{copy.unpaid}</p>
        </div>
      </div>
      <table className="admin__table">
        <thead>
          <tr>
            <th>{copy.guest}</th>
            <th>{copy.plate}</th>
            <th>{copy.site}</th>
            <th>{copy.checkIn}</th>
            <th>{copy.payment}</th>
          </tr>
        </thead>
        <tbody>
          {ARRIVALS.map((row) => (
            <tr key={row.plate}>
              <td>{row.guest}</td>
              <td>{row.plate}</td>
              <td>{row.site}</td>
              <td>
                <span className={`admin__badge ${row.checkedIn ? 'admin__badge--ok' : 'admin__badge--wait'}`}>
                  {row.checkedIn ? copy.checkedInBadge : copy.notYetBadge}
                </span>
              </td>
              <td>
                <span className={`admin__badge ${row.paid ? 'admin__badge--ok' : 'admin__badge--bad'}`}>
                  {row.paid ? copy.paidBadge : copy.unpaidBadge}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function initials(name: string): string {
  return name.trim().slice(0, 1)
}

function nowLabel(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function GuestAvatar({ name }: { name: string }) {
  return (
    <span className="chat__avatar" aria-hidden="true">
      {initials(name)}
    </span>
  )
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12.5 4.5L6 10l6.5 5.5" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.5 2.5L9 11M17.5 2.5L12 17.5l-3-6.5-6.5-3L17.5 2.5Z" />
    </svg>
  )
}

function ReadReceiptIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 5.5L4.5 9 11 1.5" />
      <path d="M5.5 5.5L9 9 15.5 1.5" />
    </svg>
  )
}

function QuestionsPanel() {
  const copy = useLanguage().t.admin.questions
  const [threads, setThreads] = useState<GuestThread[]>(INITIAL_THREADS)
  const [selectedId, setSelectedId] = useState('')
  const [draft, setDraft] = useState('')

  const selectedThread = threads.find((thread) => thread.id === selectedId) ?? null

  const handleSend = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedThread || draft.trim().length === 0) return
    const message: ChatMessage = { id: `${selectedThread.id}-${Date.now()}`, sender: 'operator', text: draft.trim(), time: nowLabel() }
    setThreads((current) => current.map((thread) => (thread.id === selectedThread.id ? { ...thread, messages: [...thread.messages, message] } : thread)))
    setDraft('')
  }

  return (
    <div className="admin__panel">
      <div className={`chat ${selectedThread ? 'chat--thread-open' : ''}`}>
        <div className="chat__guests-panel">
          <div className="chat__guests-header">{copy.chats}</div>
          <ul className="chat__guests">
          {threads.map((thread) => {
            const lastMessage = thread.messages[thread.messages.length - 1]
            return (
              <li key={thread.id}>
                <button
                  type="button"
                  className={`chat__guest ${thread.id === selectedId ? 'chat__guest--active' : ''}`}
                  onClick={() => setSelectedId(thread.id)}
                >
                  <GuestAvatar name={thread.name} />
                  <span className="chat__guest-info">
                    <span className="chat__guest-row">
                      <span className="chat__guest-name">{thread.name}</span>
                      {lastMessage && <span className="chat__guest-time">{lastMessage.time}</span>}
                    </span>
                    <span className="chat__guest-preview">{lastMessage?.text}</span>
                  </span>
                </button>
              </li>
            )
          })}
          </ul>
        </div>

        {selectedThread ? (
          <div className="chat__thread">
            <div className="chat__thread-header">
              <button type="button" className="chat__back" onClick={() => setSelectedId('')} aria-label={copy.backToChats}>
                <BackIcon />
              </button>
              <GuestAvatar name={selectedThread.name} />
              <div className="chat__thread-head-text">
                <p className="chat__thread-name">{selectedThread.name}</p>
                <span className="chat__thread-status">
                  <span className="admin__question-lang">{selectedThread.lang}</span>
                  {copy.online}
                </span>
              </div>
            </div>

            <div className="chat__messages">
              {selectedThread.messages.map((message) => (
                <div key={message.id} className={`chat__bubble ${message.sender === 'guest' ? 'chat__bubble--in' : 'chat__bubble--out'}`}>
                  {message.sender !== 'guest' && <span className="chat__bubble-label">{message.sender === 'ai' ? copy.aiGuide : copy.you}</span>}
                  <p>{message.text}</p>
                  <span className="chat__bubble-meta">
                    {message.time}
                    {message.sender !== 'guest' && <ReadReceiptIcon />}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="chat__composer">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={copy.typeMessage}
                aria-label={`Message ${selectedThread.name}`}
              />
              <button type="submit" disabled={draft.trim().length === 0} className="chat__send" aria-label={copy.send}>
                <SendIcon />
              </button>
            </form>
          </div>
        ) : (
          <div className="chat__empty-state">
            <p>{copy.selectConversation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ActiveFacilitiesPanel({ facilities }: { facilities: FacilityRow[] }) {
  const copy = useLanguage().t.admin.activeFacilities

  if (facilities.length === 0) {
    return (
      <div className="admin__panel">
        <p className="admin__hint">{copy.empty}</p>
      </div>
    )
  }

  return (
    <div className="admin__panel">
      <div className="admin__stats">
        <div className="admin__stat">
          <p className="admin__stat-value">{facilities.length}</p>
          <p className="admin__stat-label">{copy.statLabel}</p>
        </div>
      </div>
      <table className="admin__table">
        <thead>
          <tr>
            <th>{copy.facility}</th>
            <th>{copy.fee}</th>
            <th>{copy.sites}</th>
            <th>{copy.rulesDoc}</th>
            <th>{copy.status}</th>
            <th>{copy.guestLink}</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <tr key={facility.id}>
              <td>{facility.name}</td>
              <td>¥{facility.fee}</td>
              <td>{facility.siteCount}</td>
              <td>{facility.docName}</td>
              <td>
                <span className="admin__badge admin__badge--ok">{copy.live}</span>
              </td>
              <td>
                <a href={guestLink(facility.id)} target="_blank" rel="noopener noreferrer" className="admin__table-link">
                  {copy.openGuestView}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FacilitiesPanel({ onCreate }: { onCreate: (facility: FacilityRow) => void }) {
  const copy = useLanguage().t.admin.facilities
  const [openedAt] = useState(() => Date.now())
  const [name, setName] = useState('')
  const [fee, setFee] = useState(DEFAULT_FEE)
  const [siteCount, setSiteCount] = useState(DEFAULT_SITES)
  const [docName, setDocName] = useState('rules.txt')
  const [text, setText] = useState('')
  const [created, setCreated] = useState<{ facility: FacilityRow; seconds: number } | null>(null)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setDocName(file.name)
    setText(await file.text())
  }

  const loadSample = () => {
    setName('Yamabiko Forest RV Park')
    setDocName('Yamabiko Rules.pdf')
    setText(SAMPLE_RULES_TEXT)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const facility: FacilityRow = {
      id: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: name.trim(),
      fee,
      siteCount,
      docName,
      status: 'live',
    }
    onCreate(facility)
    setCreated({ facility, seconds: Math.max(1, Math.round((Date.now() - openedAt) / MS_PER_SECOND)) })
    setName('')
    setText('')
  }

  const sectionCount = text.split(/\n#{1,3}\s/).filter((s) => s.trim()).length
  const canCreate = name.trim().length >= 2 && text.trim().length >= 20

  return (
    <div className="admin__panel facilities-panel">
      <div className="facilities-panel__grid">
        <form onSubmit={handleSubmit} className="facility-form">
          <div className="facility-form__head">
            <div>
              <h2 className="facility-form__title">{copy.addTitle}</h2>
              <p className="admin__hint">{copy.addHint}</p>
            </div>
            <button type="button" onClick={loadSample} className="facility-form__sample">
              {copy.loadSample}
            </button>
          </div>

          <label className="facility-form__field">
            {copy.facilityName}
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <div className="facility-form__row">
            <label className="facility-form__field">
              {copy.fee}
              <input type="number" min={0} value={fee} onChange={(e) => setFee(Number(e.target.value))} />
            </label>
            <label className="facility-form__field">
              {copy.numberOfSites}
              <input type="number" min={1} max={60} value={siteCount} onChange={(e) => setSiteCount(Number(e.target.value))} />
            </label>
          </div>

          <label className="facility-form__field">
            {copy.rulesDocument}
            <input type="file" accept=".txt,.md,text/plain" onChange={handleFile} />
          </label>

          <label className="facility-form__field">
            {copy.pasteRulesText}
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} className="facility-form__textarea" />
          </label>

          <p className="admin__hint">{copy.plainTextHint}</p>

          <button type="submit" disabled={!canCreate} className="btn btn--primary">
            {copy.createFacility}
          </button>
        </form>

        {created && (
          <div className="facilities-panel__side">
            <div className="facility-created">
              <p className="facility-created__eyebrow">{copy.liveIn(created.seconds)}</p>
              <h3 className="facility-created__name">{created.facility.name}</h3>
              <p className="facility-created__meta">{copy.sectionsIndexed(sectionCount, created.facility.siteCount)}</p>
              <a href={guestLink(created.facility.id)} target="_blank" rel="noopener noreferrer" className="facility-created__link">
                {copy.openGuestView}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const copy = useLanguage().t.admin
  const [tab, setTab] = useState<Tab>('arrivals')
  const [facilities, setFacilities] = useState<FacilityRow[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleCreateFacility = (facility: FacilityRow) => {
    setFacilities((current) => [...current, facility])
  }

  const selectTab = (id: Tab) => {
    setTab(id)
    setIsSidebarOpen(false)
  }

  return (
    <main className="admin">
      <header className="admin__mobile-bar">
        <button
          type="button"
          className="admin__menu-button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label={copy.openMenu}
          aria-expanded={isSidebarOpen}
        >
          <HamburgerIcon />
        </button>
        <span className="admin__mobile-title">{copy.title}</span>
        <LanguageMenu icon={iconGlobe} triggerClassName="admin__lang" />
      </header>

      {isSidebarOpen && <div className="admin__sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <nav
        className={`admin__sidebar ${isSidebarOpen ? 'admin__sidebar--open' : ''} ${isSidebarCollapsed ? 'admin__sidebar--collapsed' : ''}`}
        aria-label="Admin sections"
      >
        <div className="admin__sidebar-head">
          <span className="admin__logo" aria-hidden="true">
            <AdminPanelIcon />
          </span>
          <h1 className="admin__title">{copy.title}</h1>
          <button
            type="button"
            className="admin__collapse-toggle"
            onClick={() => setIsSidebarCollapsed((current) => !current)}
            aria-label={isSidebarCollapsed ? copy.expandSidebar : copy.collapseSidebar}
            aria-expanded={!isSidebarCollapsed}
          >
            <CollapseIcon collapsed={isSidebarCollapsed} />
          </button>
          <button type="button" className="admin__sidebar-close" onClick={() => setIsSidebarOpen(false)} aria-label={copy.closeMenu}>
            <CloseIcon />
          </button>
        </div>
        <div className="admin__sidebar-nav">
          {TABS.map(({ id, Icon }) => (
            <button
              key={id}
              type="button"
              className={`admin__tab ${tab === id ? 'admin__tab--active' : ''}`}
              aria-current={tab === id ? 'page' : undefined}
              title={isSidebarCollapsed ? copy.tabs[id] : undefined}
              onClick={() => selectTab(id)}
            >
              <Icon />
              <span className="admin__tab-label">{copy.tabs[id]}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="admin__back"
          title={isSidebarCollapsed ? copy.guestView : undefined}
          onClick={() => navigate('/')}
        >
          <BackIcon />
          <span className="admin__tab-label">{copy.guestView}</span>
        </button>
      </nav>

      <div className="admin__content">
        {tab !== 'questions' && (
          <div className="admin__content-lang">
            <LanguageMenu icon={iconGlobe} triggerClassName="admin__lang-content" />
          </div>
        )}
        {tab === 'arrivals' && <ArrivalsPanel />}
        {tab === 'questions' && <QuestionsPanel />}
        {tab === 'facilities' && <FacilitiesPanel onCreate={handleCreateFacility} />}
        {tab === 'activeFacilities' && <ActiveFacilitiesPanel facilities={facilities} />}
      </div>
    </main>
  )
}
