import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import iconCheck from '../../assets/guidehostreplied/icon-check.svg'
import iconChevronLeft from '../../assets/guidehostreplied/icon-chevron-left.svg'
import iconGlobe from '../../assets/guidehostreplied/icon-globe.svg'
import iconHelp from '../../assets/guidehostreplied/icon-help.svg'
import iconMic from '../../assets/guidehostreplied/icon-mic.svg'
import iconSend from '../../assets/guidehostreplied/icon-send.svg'
import iconSparkles from '../../assets/guidehostreplied/icon-sparkles.svg'
import iconSparklesAccent from '../../assets/guidehostreplied/icon-sparkles-accent.svg'
import iconSparklesSm from '../../assets/guidehostreplied/icon-sparkles-sm.svg'
import iconUser from '../../assets/guidehostreplied/icon-user.svg'
import online from '../../assets/guidehostreplied/online.svg'
import './guide-host-replied.css'

const SUGGESTIONS = ['Rubbish rules', 'Power hookup', 'Showers?']

export default function GuideHostReplied() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState<readonly string[]>([])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setSent((previous) => [...previous, text])
    setDraft('')
  }

  return (
    <main className="guide">
      <div className="guide__card">
        <header className="guide__header">
          <button
            type="button"
            className="guide__round-btn"
            aria-label="Back to your stay"
            onClick={() => navigate('/stay')}
          >
            <img src={iconChevronLeft} alt="" width={20} height={20} />
          </button>
          <span className="guide__avatar">
            <img src={iconSparkles} alt="" width={20} height={20} />
          </span>
          <div className="guide__title-block">
            <h1 className="guide__title">AI guide</h1>
            <p className="guide__status">
              <img src={online} alt="" width={7} height={7} />
              <span>Answers from park documents</span>
            </p>
          </div>
          <span className="guide__lang">
            <img src={iconGlobe} alt="" width={16} height={16} />
            English
          </span>
        </header>

        <div className="guide__thread" role="log" aria-live="polite" aria-label="Conversation">
          <div className="gh-msg gh-msg--guest">
            <p className="gh-bubble gh-bubble--guest">Can I bring two dogs?</p>
          </div>

          <div className="gh-msg gh-msg--ai">
            <span className="gh-msg__avatar">
              <img src={iconSparklesSm} alt="" width={14} height={14} />
            </span>
            <div className="gh-msg__column">
              <div className="gh-bubble gh-bubble--ai gh-bubble--notfound">
                <p className="gh-notfound">
                  <img src={iconHelp} alt="" width={14} height={14} />
                  Not in park documents
                </p>
                <p>Sorry — I couldn’t find anything about pets in the park’s documents.</p>
              </div>
            </div>
          </div>

          <div className="gh-sent-status">
            <span className="gh-sent-status__check">
              <img src={iconCheck} alt="" width={14} height={14} />
            </span>
            <div>
              <p className="gh-sent-status__title">Sent to the host</p>
              <p className="gh-sent-status__sub">Their reply will show up here</p>
            </div>
          </div>

          <div className="gh-msg gh-msg--ai">
            <span className="gh-msg__avatar gh-msg__avatar--host">
              <img src={iconUser} alt="" width={14} height={14} />
            </span>
            <div className="gh-msg__column gh-msg__column--host">
              <p className="gh-sender">
                <span className="gh-sender__name">Host</span>
                <span className="gh-sender__line">LINE</span>
                <span className="gh-sender__time">21:58</span>
              </p>
              <p className="gh-bubble gh-bubble--host">Yes — up to two small dogs are fine. Please keep them on a lead.</p>
            </div>
          </div>

          <p className="gh-learned">
            <img src={iconSparklesAccent} alt="" width={14} height={14} />
            This answer has been added to the AI guide
          </p>

          {sent.map((text, index) => (
            <div className="gh-msg gh-msg--guest" key={`${index}-${text}`}>
              <p className="gh-bubble gh-bubble--guest">{text}</p>
            </div>
          ))}
        </div>

        <form className="gh-composer" onSubmit={handleSubmit}>
          <div className="gh-composer__chips">
            {SUGGESTIONS.map((label) => (
              <button key={label} type="button" className="gh-chip" onClick={() => setDraft(label)}>
                {label}
              </button>
            ))}
          </div>
          <div className="gh-composer__row">
            <div className="gh-composer__input">
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask anything…"
                aria-label="Ask the AI guide"
                autoComplete="off"
              />
              <img src={iconMic} alt="" width={20} height={20} />
            </div>
            <button type="submit" className="gh-composer__send" aria-label="Send question">
              <img src={iconSend} alt="" width={20} height={20} />
            </button>
          </div>
          <p className="gh-composer__note">Answers are based on the park’s documents</p>
        </form>
      </div>
    </main>
  )
}
