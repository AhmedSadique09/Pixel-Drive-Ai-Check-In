import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckInShell from '../../components/checkin-flow/CheckInShell'
import { useLanguage } from '../../i18n/LanguageContext'
import iconCalendar from '../../assets/bookingfound/icon-calendar.svg'
import iconCar from '../../assets/bookingfound/icon-car.svg'
import iconCircleCheck from '../../assets/bookingfound/icon-circle-check.svg'
import iconUser from '../../assets/bookingfound/icon-user.svg'
import iconUsers from '../../assets/bookingfound/icon-users.svg'
import iconYen from '../../assets/bookingfound/icon-yen.svg'
import iconZap from '../../assets/bookingfound/icon-zap.svg'
import './bookingfound.css'

const BOOKING = {
  guest: 'Taro Yamada',
  plate: '品川 300 あ 12-34',
  fee: '¥3,000',
}

interface RowProps {
  icon: string
  label: string
  value: string
  badge?: { text: string; tone: 'muted' | 'warning' }
}

function BookingRow({ icon, label, value, badge }: RowProps): ReactNode {
  return (
    <div className="booking-row">
      <dt className="booking-row__label">
        <img src={icon} alt="" width={16} height={16} />
        {label}
      </dt>
      <dd className="booking-row__value">
        {value}
        {badge && <span className={`badge badge--${badge.tone}`}>{badge.text}</span>}
      </dd>
    </div>
  )
}

export default function BookingFound() {
  const navigate = useNavigate()
  const copy = useLanguage().t.checkIn.bookingFound
  const { demo } = copy

  return (
    <CheckInShell
      step={1}
      onBack={() => navigate('/check-in/plate')}
      footer={
        <button type="button" className="btn btn--primary" onClick={() => navigate('/check-in/rules')}>
          {copy.cta}
        </button>
      }
    >
      <div className="booking-found">
        <p className="booking-found__banner" role="status">
          <img src={iconCircleCheck} alt="" width={20} height={20} />
          {copy.banner}
        </p>

        <section className="booking-card" aria-label={copy.cardAria}>
          <div className="booking-card__guest">
            <span className="booking-card__avatar">
              <img src={iconUser} alt="" width={22} height={22} />
            </span>
            <div className="booking-card__name">
              <h1 className="booking-card__title">{BOOKING.guest}</h1>
              <p className="booking-card__plate">
                <img src={iconCar} alt="" width={14} height={14} />
                {BOOKING.plate}
              </p>
            </div>
          </div>
          <dl className="booking-card__rows">
            <BookingRow
              icon={iconCalendar}
              label={copy.dates}
              value={demo.dates}
              badge={{ text: demo.nights, tone: 'muted' }}
            />
            <BookingRow icon={iconZap} label={copy.plan} value={demo.plan} />
            <BookingRow icon={iconUsers} label={copy.guests} value={demo.guests} />
            <BookingRow
              icon={iconYen}
              label={copy.fee}
              value={BOOKING.fee}
              badge={{ text: demo.feeStatus, tone: 'warning' }}
            />
          </dl>
        </section>

        <button type="button" className="booking-found__not-me" onClick={() => navigate('/check-in/plate')}>
          {copy.notMe}
        </button>
      </div>
    </CheckInShell>
  )
}
