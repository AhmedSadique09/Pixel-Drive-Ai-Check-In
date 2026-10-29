import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import iconChevronLeft from '../../assets/payment/chevron-left.svg'
import iconGlobe from '../../assets/payment/globe.svg'
import iconCheck from '../../assets/payment/check.svg'
import iconInfo from '../../assets/payment/info.svg'
import iconCreditCard from '../../assets/payment/credit-card.svg'
import iconLockWhite from '../../assets/payment/lock-white.svg'
import iconLockMuted from '../../assets/payment/lock-muted.svg'
import './payment.css'

const STEPS = [
  { id: 'booking', label: 'Booking', done: true },
  { id: 'rules', label: 'Rules', done: true },
  { id: 'payment', label: 'Payment', done: false },
]

const LINE_ITEMS = [
  { label: 'Powered site (1 night)', amount: '¥2,500' },
  { label: 'Power hookup', amount: '¥500' },
]

const TOTAL = '¥3,000'

export default function Payment() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('card')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/stay')
  }

  return (
    <main className="pay">
      <div className="pay__frame">
        <header className="pay__topbar">
          <button type="button" className="pay__back" aria-label="Back" onClick={() => navigate(-1)}>
            <img src={iconChevronLeft} alt="" width={20} height={20} />
          </button>
          <p className="pay__park">RV Park</p>
          <span className="pay__lang">
            <img src={iconGlobe} alt="" width={16} height={16} />
            English
          </span>
        </header>

        <ol className="pay__stepper" aria-label="Check-in progress">
          {STEPS.map(({ id, label, done }) => (
            <li key={id} className="pay__step" aria-current={done ? undefined : 'step'}>
              <span className="pay__step-bar" />
              <span className={`pay__step-label${done ? '' : ' pay__step-label--current'}`}>
                {done ? <img src={iconCheck} alt="" width={12} height={12} /> : <span>3</span>}
                {label}
              </span>
            </li>
          ))}
        </ol>

        <form className="pay__form" onSubmit={handleSubmit}>
          <div className="pay__content">
            <div className="pay__head">
              <h1 className="pay__title">Payment</h1>
              <p className="pay__desc">Pay your fee to finish checking in.</p>
            </div>

            <section className="pay__summary" aria-label="Order summary">
              <dl className="pay__lines">
                {LINE_ITEMS.map(({ label, amount }) => (
                  <div key={label} className="pay__line">
                    <dt>{label}</dt>
                    <dd>{amount}</dd>
                  </div>
                ))}
              </dl>
              <div className="pay__total">
                <span className="pay__total-label">Total (tax incl.)</span>
                <span className="pay__total-amount">{TOTAL}</span>
              </div>
            </section>

            <p className="pay__test" role="note">
              <img src={iconInfo} alt="" width={18} height={18} />
              Test mode: you won’t be charged
            </p>

            <fieldset className="pay__method">
              <legend className="pay__method-title">Payment method</legend>
              <label className="pay__option">
                <input
                  type="radio"
                  name="method"
                  value="card"
                  className="pay__radio-input"
                  checked={method === 'card'}
                  onChange={() => setMethod('card')}
                />
                <span className="pay__option-icon">
                  <img src={iconCreditCard} alt="" width={20} height={20} />
                </span>
                <span className="pay__option-text">
                  <span className="pay__option-name">Credit card</span>
                  <span className="pay__option-hint">Visa · Mastercard · JCB · AMEX</span>
                </span>
                <span className="pay__radio" aria-hidden="true" />
              </label>
            </fieldset>
          </div>

          <div className="pay__bottom">
            <button type="submit" className="pay__submit">
              <img src={iconLockWhite} alt="" width={18} height={18} />
              Pay {TOTAL}
            </button>
            <p className="pay__secure">
              <img src={iconLockMuted} alt="" width={12} height={12} />
              You’ll continue on a secure payment page
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
