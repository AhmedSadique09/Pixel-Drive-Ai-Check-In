import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import iconArrowRight from '../../assets/walkindetails/icon-arrow-right.svg'
import iconCalendar from '../../assets/checkoutreminder/icon-calendar.svg'
import WalkInShell from '../WalkInDetails/WalkInShell'
import { SITE_COUNT, MIN_STAY_DATE, MAX_STAY_DATE, getAvailability } from '../WalkInDetails/availability'
import '../WalkInDetails/walkin-details.css'

const MS_PER_DAY = 1000 * 60 * 60 * 24

type StayLength = 'single' | 'range'

function nightsBetween(fromDate: string, toDate: string): number {
  return Math.max(1, Math.round((new Date(toDate).getTime() - new Date(fromDate).getTime()) / MS_PER_DAY))
}

export default function WalkInPlate() {
  const navigate = useNavigate()
  const [stayLength, setStayLength] = useState<StayLength>('single')
  const [stayDate, setStayDate] = useState(MIN_STAY_DATE)
  const [fromDate, setFromDate] = useState(MIN_STAY_DATE)
  const [toDate, setToDate] = useState(MIN_STAY_DATE)
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)

  const queryDate = stayLength === 'single' ? stayDate : fromDate
  const availability = useMemo(() => getAvailability(queryDate), [queryDate])
  const availableCount = availability.filter((slot) => !slot.isOccupied).length

  const handleStayLengthChange = (value: StayLength) => {
    setStayLength(value)
    setSelectedSiteId(null)
  }

  const handleStayDateChange = (value: string) => {
    setStayDate(value)
    setSelectedSiteId(null)
  }

  const handleFromDateChange = (value: string) => {
    setFromDate(value)
    if (toDate < value) setToDate(value)
    setSelectedSiteId(null)
  }

  const handleToDateChange = (value: string) => {
    setToDate(value)
    setSelectedSiteId(null)
  }

  const canProceed =
    Boolean(selectedSiteId) &&
    (stayLength === 'single' ? Boolean(stayDate) : Boolean(fromDate) && Boolean(toDate) && toDate >= fromDate)

  const handleSubmit = () => {
    if (!canProceed) return
    const checkoutDate = stayLength === 'single' ? stayDate : toDate
    navigate('/check-in/rules', { state: { siteNumber: selectedSiteId, checkoutDate } })
  }

  return (
    <WalkInShell
      step={0}
      footer={
        <button type="button" disabled={!canProceed} onClick={handleSubmit} className="walkin-btn walkin-btn--primary">
          Next
          <img src={iconArrowRight} alt="" width={18} height={18} />
        </button>
      }
    >
      <div className="wk-details">
        <div className="walkin__heading">
          <h1 className="walkin__h1">Your date and site</h1>
          <p className="walkin__lead">Pick when you’re staying, then choose an available site.</p>
        </div>

        <div className="wk-stay-toggle" role="group" aria-label="Length of stay">
          <button
            type="button"
            aria-pressed={stayLength === 'single'}
            className={`wk-stay-toggle__btn${stayLength === 'single' ? ' wk-stay-toggle__btn--active' : ''}`}
            onClick={() => handleStayLengthChange('single')}
          >
            Stay for one day
          </button>
          <button
            type="button"
            aria-pressed={stayLength === 'range'}
            className={`wk-stay-toggle__btn${stayLength === 'range' ? ' wk-stay-toggle__btn--active' : ''}`}
            onClick={() => handleStayLengthChange('range')}
          >
            Stay for more days
          </button>
        </div>

        {stayLength === 'single' ? (
          <div className="wk-field">
            <label className="wk-field__label" htmlFor="walkin-stay-date">
              Stay date
            </label>
            <div className="wk-field__control wk-field__control--date">
              <span className="wk-field__icon-badge">
                <img src={iconCalendar} alt="" width={15} height={15} />
              </span>
              <input
                id="walkin-stay-date"
                type="date"
                className="wk-field__input"
                value={stayDate}
                min={MIN_STAY_DATE}
                max={MAX_STAY_DATE}
                onChange={(event) => handleStayDateChange(event.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="wk-field">
            <div className="wk-date-range">
              <div className="wk-field wk-date-range__field">
                <label className="wk-field__label" htmlFor="walkin-to-date">
                  To
                </label>
                <div className="wk-field__control wk-field__control--date">
                  <span className="wk-field__icon-badge">
                    <img src={iconCalendar} alt="" width={15} height={15} />
                  </span>
                  <input
                    id="walkin-to-date"
                    type="date"
                    className="wk-field__input"
                    value={fromDate}
                    min={MIN_STAY_DATE}
                    max={MAX_STAY_DATE}
                    onChange={(event) => handleFromDateChange(event.target.value)}
                  />
                </div>
              </div>
              <span className="wk-date-range__divider" aria-hidden="true">
                →
              </span>
              <div className="wk-field wk-date-range__field">
                <label className="wk-field__label" htmlFor="walkin-from-date">
                  From
                </label>
                <div className="wk-field__control wk-field__control--date">
                  <span className="wk-field__icon-badge">
                    <img src={iconCalendar} alt="" width={15} height={15} />
                  </span>
                  <input
                    id="walkin-from-date"
                    type="date"
                    className="wk-field__input"
                    value={toDate}
                    min={fromDate}
                    max={MAX_STAY_DATE}
                    onChange={(event) => handleToDateChange(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <p className="wk-date-range__nights">
              {nightsBetween(fromDate, toDate)} {nightsBetween(fromDate, toDate) === 1 ? 'night' : 'nights'}
            </p>
          </div>
        )}

        <div className="wk-availability">
          <div className="wk-availability__head">
            <p className="wk-field__label">Site availability</p>
            <p className="wk-availability__count">{availableCount} of {SITE_COUNT} sites available</p>
          </div>
          <ul className="wk-availability__legend">
            <li>
              <span className="wk-availability__dot wk-availability__dot--available" />
              Available
            </li>
            <li>
              <span className="wk-availability__dot wk-availability__dot--occupied" />
              Occupied
            </li>
          </ul>
          <div className="wk-availability__grid">
            {availability.map((slot) => {
              const isSelected = slot.id === selectedSiteId
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={slot.isOccupied}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedSiteId(isSelected ? null : slot.id)}
                  className={`wk-availability__slot ${slot.isOccupied ? 'wk-availability__slot--occupied' : 'wk-availability__slot--available'}${isSelected ? ' wk-availability__slot--selected' : ''}`}
                >
                  {slot.id}
                </button>
              )
            })}
          </div>
          {selectedSiteId && <p className="wk-availability__selected">Selected site: {selectedSiteId}</p>}
        </div>
      </div>
    </WalkInShell>
  )
}
