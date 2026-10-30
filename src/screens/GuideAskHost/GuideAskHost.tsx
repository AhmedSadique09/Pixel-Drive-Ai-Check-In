import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import iconHelp from '../../assets/guideaskhost/help.svg'
import iconMessageGreen from '../../assets/guideaskhost/message-green.svg'
import iconMessageWhite from '../../assets/guideaskhost/message-white.svg'
import { AiMessage, ChatHeader, Composer, GuestMessage } from '../GuideAnswers/ChatParts'
import '../GuideAnswers/guideanswers.css'
import './guideaskhost.css'

const INITIAL_QUESTION = 'Can I bring two dogs?'

export default function GuideAskHost() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const [followUps, setFollowUps] = useState<string[]>([])
  const [isEscalationOpen, setIsEscalationOpen] = useState(true)

  const handleSubmit = () => {
    setFollowUps((previous) => [...previous, draft.trim()])
    setDraft('')
  }

  return (
    <main className="chat">
      {isEscalationOpen && (
        <aside className="askhost__sidebar" aria-label="Contact host">
          <section className="askhost__card" aria-labelledby="askhost-title">
            <div className="askhost__card-head">
              <span className="askhost__card-icon">
                <img src={iconMessageGreen} alt="" width={20} height={20} />
              </span>
              <h2 id="askhost-title" className="askhost__card-title">
                Ask the host instead?
              </h2>
            </div>
            <p className="askhost__card-desc">
              We’ll send your question to the host on LINE. Their reply will appear here.
            </p>
            <button type="button" className="askhost__line" onClick={() => navigate('/guide/host-replied')}>
              <img src={iconMessageWhite} alt="" width={18} height={18} />
              Send to host on LINE
            </button>
            <button type="button" className="askhost__ghost" onClick={() => setIsEscalationOpen(false)}>
              Not now
            </button>
          </section>
        </aside>
      )}

      <div className="chat__panel">
        <ChatHeader onBack={() => navigate('/guide')} />

        <div className="chat__thread">
          <ol className="chat__messages" aria-label="Conversation">
            <li className="chat__time">
              <span>21:55</span>
            </li>
            <GuestMessage text={INITIAL_QUESTION} />
            <AiMessage variant="missing">
              <p className="askhost__missing">
                <img src={iconHelp} alt="" width={14} height={14} />
                Not in park documents
              </p>
              <p className="chat__ai-text">Sorry — I couldn’t find anything about pets in the park’s documents.</p>
            </AiMessage>
            {followUps.map((text, index) => (
              <GuestMessage key={`${index}-${text}`} text={text} />
            ))}
          </ol>
        </div>

        <Composer value={draft} onChange={setDraft} onSubmit={handleSubmit} />
      </div>
    </main>
  )
}
