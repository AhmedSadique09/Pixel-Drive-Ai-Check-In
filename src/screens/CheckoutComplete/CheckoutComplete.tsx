import { useState } from 'react'
import iconCheck from '../../assets/checkoutcomplete/icon-check.svg'
import iconCheckSmall from '../../assets/checkoutcomplete/icon-check-sm.svg'
import iconCheckTag from '../../assets/checkoutcomplete/icon-check-tag.svg'
import iconMail from '../../assets/checkoutcomplete/icon-mail.svg'
import starOff from '../../assets/checkoutcomplete/star-off.svg'
import starOn from '../../assets/checkoutcomplete/star-on.svg'
import CheckoutShell from '../CheckoutShared/CheckoutShell'
import './checkoutcomplete.css'

const RECEIPT_ROWS = [
  { label: 'Stay', value: '30 Oct 21:48 – 31 Oct 09:32' },
  { label: 'Plan', value: 'B-07 · ¥2,500' },
  { label: 'Power hookup', value: '¥500' },
]

const TAGS = ['Quiet', 'Clean', 'Near an onsen', 'Would come back']
const STAR_VALUES = [1, 2, 3, 4, 5] as const

export default function CheckoutComplete() {
  const [rating, setRating] = useState(4)
  const [selectedTags, setSelectedTags] = useState<readonly string[]>(['Quiet', 'Near an onsen'])
  const [isReceiptSent, setIsReceiptSent] = useState(false)
  const [isRatingSent, setIsRatingSent] = useState(false)

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))

  return (
    <CheckoutShell
      variant="brand"
      step={3}
      bar={
        <button
          type="button"
          className="co-btn co-btn--primary"
          disabled={isRatingSent}
          onClick={() => setIsRatingSent(true)}
        >
          {isRatingSent ? 'Thanks for your rating' : 'Send rating'}
        </button>
      }
    >
      <section className="complete__success" aria-labelledby="complete-title">
        <span className="complete__success-icon">
          <img src={iconCheck} alt="" width={26} height={26} />
        </span>
        <div className="complete__success-text">
          <h1 id="complete-title" className="complete__success-title">
            Thanks for staying with us
          </h1>
          <p className="complete__success-sub">You’re checked out. Safe travels!</p>
        </div>
      </section>

      <section className="receipt" aria-labelledby="receipt-title">
        <div className="receipt__head">
          <h2 id="receipt-title" className="receipt__title">
            Your receipt
          </h2>
          <p className="receipt__paid">
            <img src={iconCheckSmall} alt="" width={11} height={11} />
            Paid
          </p>
        </div>
        <dl className="receipt__rows">
          {RECEIPT_ROWS.map(({ label, value }) => (
            <div key={label} className="receipt__row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <div className="receipt__row receipt__row--total">
            <dt>Total (tax incl.)</dt>
            <dd>¥3,000</dd>
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

      <section className="rating" aria-labelledby="rating-title">
        <h2 id="rating-title" className="rating__title">
          How was your stay?
        </h2>
        <div className="rating__stars" role="radiogroup" aria-labelledby="rating-title">
          {STAR_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={value === rating}
              aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
              className="rating__star"
              onClick={() => setRating(value)}
            >
              <img src={value <= rating ? starOn : starOff} alt="" width={32} height={32} />
            </button>
          ))}
        </div>
        <ul className="rating__tags">
          {TAGS.map((tag) => {
            const isOn = selectedTags.includes(tag)
            return (
              <li key={tag}>
                <button
                  type="button"
                  className={`rating__tag${isOn ? ' rating__tag--on' : ''}`}
                  aria-pressed={isOn}
                  onClick={() => toggleTag(tag)}
                >
                  {isOn && <img src={iconCheckTag} alt="" width={12} height={12} />}
                  {tag}
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </CheckoutShell>
  )
}
