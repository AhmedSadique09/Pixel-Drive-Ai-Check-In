import type { FormEvent, ReactNode } from 'react'
import iconChevronLeft from '../../assets/guideanswers/chevron-left.svg'
import iconSparkles from '../../assets/guideanswers/sparkles.svg'
import iconOnline from '../../assets/guideanswers/online.svg'
import iconGlobe from '../../assets/guideanswers/globe.svg'
import iconSparklesSm from '../../assets/guideanswers/sparkles-sm.svg'
import iconMic from '../../assets/guideanswers/mic.svg'
import iconSend from '../../assets/guideanswers/send.svg'
import './guideanswers.css'

interface ChatHeaderProps {
  onBack: () => void
}

export function ChatHeader({ onBack }: ChatHeaderProps) {
  return (
    <header className="chat__header">
      <button type="button" className="chat__back" aria-label="Back" onClick={onBack}>
        <img src={iconChevronLeft} alt="" width={20} height={20} />
      </button>
      <span className="chat__avatar">
        <img src={iconSparkles} alt="" width={20} height={20} />
      </span>
      <div className="chat__header-text">
        <h1 className="chat__header-title">AI guide</h1>
        <p className="chat__header-sub">
          <img src={iconOnline} alt="" width={7} height={7} />
          <span>Answers from park documents</span>
        </p>
      </div>
      <span className="chat__lang">
        <img src={iconGlobe} alt="" width={16} height={16} />
        English
      </span>
    </header>
  )
}

export function GuestMessage({ text }: { text: string }) {
  return (
    <li className="chat__guest">
      <p className="chat__guest-bubble">{text}</p>
    </li>
  )
}

export function AiMessage({ children, variant }: { children: ReactNode; variant?: 'missing' }) {
  return (
    <li className="chat__ai">
      <span className="chat__ai-avatar">
        <img src={iconSparklesSm} alt="" width={14} height={14} />
      </span>
      <div className="chat__ai-col">
        <div className={`chat__ai-bubble${variant ? ` chat__ai-bubble--${variant}` : ''}`}>{children}</div>
      </div>
    </li>
  )
}

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  suggestions?: string[]
}

export function Composer({ value, onChange, onSubmit, suggestions = [] }: ComposerProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (value.trim()) onSubmit()
  }

  return (
    <form className="chat__composer" onSubmit={handleSubmit}>
      {suggestions.length > 0 && (
        <ul className="chat__chips" aria-label="Suggested questions">
          {suggestions.map((text) => (
            <li key={text}>
              <button type="button" className="chat__chip" onClick={() => onChange(text)}>
                {text}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="chat__input-row">
        <label className="chat__input">
          <span className="chat__sr-only">Ask the AI guide a question</span>
          <input
            type="text"
            value={value}
            placeholder="Ask anything…"
            autoComplete="off"
            onChange={(event) => onChange(event.target.value)}
          />
          <button type="button" className="chat__mic" aria-label="Voice input">
            <img src={iconMic} alt="" width={20} height={20} />
          </button>
        </label>
        <button type="submit" className="chat__send" aria-label="Send">
          <img src={iconSend} alt="" width={20} height={20} />
        </button>
      </div>
      <p className="chat__note">Answers are based on the park’s documents</p>
    </form>
  )
}
