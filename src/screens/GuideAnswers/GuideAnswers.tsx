import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import iconFile from '../../assets/guideanswers/file.svg'
import { AiMessage, ChatHeader, Composer, GuestMessage } from './ChatParts'
import './guideanswers.css'

const SUGGESTIONS = ['Rubbish rules', 'Power hookup', 'Showers?']

const ANSWERS = [
  {
    question: 'Until what time can I run a generator?',
    answer: 'Generators are allowed 7:00–21:00 only. Quiet hours are 22:00–7:00, so please don’t idle your engine either.',
    source: 'Park rules p.2',
  },
  {
    question: 'How late is the nearest onsen open?',
    answer: 'Midori-no-Yu, about 5 min by car, is open until 22:00 (last entry 21:30). Adults ¥700.',
    source: 'Local guide sheet',
  },
]

export default function GuideAnswers() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')

  // Anything the guide cannot answer from the demo documents falls through to the host.
  const handleSubmit = () => navigate('/guide/ask-host')

  return (
    <main className="chat">
      <div className="chat__panel">
        <ChatHeader onBack={() => navigate('/stay')} />

        <div className="chat__thread">
          <ol className="chat__messages" aria-label="Conversation">
            <li className="chat__time">
              <span>21:52</span>
            </li>
            {ANSWERS.map(({ question, answer, source }) => (
              <li key={question} className="chat__pair">
                <ol className="chat__pair-list">
                  <GuestMessage text={question} />
                  <AiMessage>
                    <p className="chat__ai-text">{answer}</p>
                    <span className="chat__source">
                      <img src={iconFile} alt="" width={13} height={13} />
                      {source}
                    </span>
                  </AiMessage>
                </ol>
              </li>
            ))}
          </ol>
        </div>

        <Composer value={draft} onChange={setDraft} onSubmit={handleSubmit} suggestions={SUGGESTIONS} />
      </div>
    </main>
  )
}
