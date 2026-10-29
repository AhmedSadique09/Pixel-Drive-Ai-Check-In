import { useNavigate } from 'react-router-dom'
import CheckInShell from '../../components/checkin-flow/CheckInShell'
import { useLanguage } from '../../i18n/LanguageContext'
import bullet from '../../assets/nobooking/bullet.svg'
import iconChevronRight from '../../assets/nobooking/icon-chevron-right.svg'
import iconMessage from '../../assets/nobooking/icon-message.svg'
import iconPencil from '../../assets/nobooking/icon-pencil.svg'
import iconSearchX from '../../assets/nobooking/icon-search-x.svg'
import iconTent from '../../assets/nobooking/icon-tent.svg'
import iconUser from '../../assets/nobooking/icon-user.svg'
import './nobooking.css'

const SEARCHED_PLATE = '品川 300 あ 12-34'

export default function NoBooking() {
  const navigate = useNavigate()
  const copy = useLanguage().t.checkIn.noBooking

  return (
    <CheckInShell
      step={1}
      size="wide"
      onBack={() => navigate('/check-in/plate')}
      footer={
        <button type="button" className="ghost-btn" onClick={() => navigate('/guide/ask-host')}>
          <img src={iconMessage} alt="" width={18} height={18} />
          {copy.askHost}
        </button>
      }
    >
      <div className="no-booking">
        <section className="no-booking__header" aria-labelledby="no-booking-title">
          <span className="no-booking__badge">
            <img src={iconSearchX} alt="" width={26} height={26} />
          </span>
          <h1 id="no-booking-title" className="no-booking__title">
            {copy.title}
          </h1>
          <p className="no-booking__desc">{copy.desc(SEARCHED_PLATE)}</p>
        </section>

        <section className="no-booking__reasons" aria-labelledby="reasons-title">
          <h2 id="reasons-title" className="no-booking__reasons-title">
            {copy.reasonsTitle}
          </h2>
          <ul className="no-booking__reason-list">
            {copy.reasons.map((reason) => (
              <li key={reason} className="no-booking__reason">
                <img src={bullet} alt="" width={5} height={14} />
                {reason}
              </li>
            ))}
          </ul>
        </section>

        <div className="no-booking__retry">
          <button type="button" className="outline-btn" onClick={() => navigate('/check-in/plate')}>
            <img src={iconPencil} alt="" width={16} height={16} />
            {copy.editPlate}
          </button>
          <button type="button" className="outline-btn" onClick={() => navigate('/check-in/plate')}>
            <img src={iconUser} alt="" width={16} height={16} />
            {copy.searchByName}
          </button>
        </div>

        <section className="walk-in" aria-labelledby="walk-in-title">
          <div className="walk-in__head">
            <span className="walk-in__icon">
              <img src={iconTent} alt="" width={20} height={20} />
            </span>
            <div className="walk-in__text">
              <h2 id="walk-in-title" className="walk-in__title">
                {copy.walkInTitle}
              </h2>
              <p className="walk-in__desc">{copy.walkInDesc}</p>
            </div>
          </div>
          <button type="button" className="walk-in__cta" onClick={() => navigate('/walk-in')}>
            {copy.walkInCta}
            <img src={iconChevronRight} alt="" width={18} height={18} />
          </button>
        </section>
      </div>
    </CheckInShell>
  )
}
