import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import iconCheck from '../../assets/checkoutextend/icon-check.svg'
import iconClock from '../../assets/checkoutextend/icon-clock.svg'
import iconClockMuted from '../../assets/checkoutextend/icon-clock-muted.svg'
import iconInfo from '../../assets/checkoutextend/icon-info.svg'
import iconLock from '../../assets/checkoutextend/icon-lock.svg'
import iconMoon from '../../assets/checkoutextend/icon-moon.svg'
import iconMail from '../../assets/checkoutcomplete/icon-mail.svg'
import iconCheckSmall from '../../assets/checkoutcomplete/icon-check-sm.svg'
import CheckoutShell from '../CheckoutShared/CheckoutShell'
import '../CheckoutComplete/checkoutcomplete.css'
import './checkoutextend.css'

interface ExtendOption {
  id: string
  label: string
  until: string
  price: number
  iconSelected: string
  icon: string
}

const OPTIONS: readonly ExtendOption[] = [
  { id: 'hour-1', label: '1 extra hour', until: 'Until 11:00', price: 500, iconSelected: iconClock, icon: iconClockMuted },
  { id: 'hour-2', label: '2 extra hours', until: 'Until 12:00', price: 1000, iconSelected: iconClock, icon: iconClockMuted },
  { id: 'night', label: 'Stay another night', until: 'Until 10:00 tomorrow', price: 3000, iconSelected: iconMoon, icon: iconMoon },
]

const formatYen = (amount: number) => `¥${amount.toLocaleString('en-US')}`

export default function CheckoutExtend() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(OPTIONS[0].id)
  const [isPaid, setIsPaid] = useState(false)
  const [isReceiptSent, setIsReceiptSent] = useState(false)
  const selected = OPTIONS.find((option) => option.id === selectedId) ?? OPTIONS[0]

  if (isPaid) {
    return (
      <CheckoutShell
        variant="back"
        step={2}
        onBack={() => navigate('/stay')}
        bar={
          <button type="button" className="co-btn co-btn--primary" onClick={() => navigate('/stay')}>
            Continue to check-in
          </button>
        }
      >
        <section className="complete__success" aria-labelledby="extend-receipt-title">
          <span className="complete__success-icon">
            <img src={iconCheck} alt="" width={26} height={26} />
          </span>
          <div className="complete__success-text">
            <h1 id="extend-receipt-title" className="complete__success-title">
              Stay extended
            </h1>
            <p className="complete__success-sub">Your payment was confirmed.</p>
          </div>
        </section>

        <section className="receipt" aria-labelledby="extend-receipt-heading">
          <div className="receipt__head">
            <h2 id="extend-receipt-heading" className="receipt__title">
              Your receipt
            </h2>
            <p className="receipt__paid">
              <img src={iconCheckSmall} alt="" width={11} height={11} />
              Paid
            </p>
          </div>
          <dl className="receipt__rows">
            <div className="receipt__row">
              <dt>{selected.label}</dt>
              <dd>{selected.until}</dd>
            </div>
            <div className="receipt__row receipt__row--total">
              <dt>Total (tax incl.)</dt>
              <dd>{formatYen(selected.price)}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="receipt__email"
            disabled={isReceiptSent}
            onClick={() => setIsReceiptSent(true)}
          >
            <img src={iconMail} alt="" width={16} height={16} />
            {isReceiptSent ? 'Receipt sent to your email' : 'Email me the receipt'}
          </button>
        </section>
      </CheckoutShell>
    )
  }

  return (
    <CheckoutShell
      variant="back"
      step={1}
      onBack={() => navigate('/check-out')}
      bar={
        <button type="button" className="co-btn co-btn--primary" onClick={() => setIsPaid(true)}>
          <img src={iconLock} alt="" width={18} height={18} />
          Pay {formatYen(selected.price)} and extend
        </button>
      }
    >
      <header className="extend__header">
        <h1 className="co-title">Extend your stay</h1>
        <p className="extend__availability">
          <img src={iconCheck} alt="" width={16} height={16} />
          B-07 is free today, so you can stay longer.
        </p>
      </header>

      <fieldset className="extend__options">
        <legend className="extend__legend">Choose how long to extend</legend>
        {OPTIONS.map((option) => {
          const isSelected = option.id === selectedId
          return (
            <label key={option.id} className={`extend-option${isSelected ? ' extend-option--selected' : ''}`}>
              <input
                type="radio"
                name="extend"
                className="extend-option__input"
                value={option.id}
                checked={isSelected}
                onChange={() => setSelectedId(option.id)}
              />
              <span className="extend-option__icon">
                <img src={isSelected ? option.iconSelected : option.icon} alt="" width={20} height={20} />
              </span>
              <span className="extend-option__text">
                <span className="extend-option__label">{option.label}</span>
                <span className="extend-option__until">{option.until}</span>
              </span>
              <span className="extend-option__price">{formatYen(option.price)}</span>
              <span className="extend-option__radio" aria-hidden="true" />
            </label>
          )
        })}
      </fieldset>

      <p className="extend__note">
        <img src={iconInfo} alt="" width={14} height={14} />
        Charged to the card you used at check-in (test mode)
      </p>
    </CheckoutShell>
  )
}
