import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import iconArrowRight from '../../assets/walkindetails/icon-arrow-right.svg'
import iconCalendar from '../../assets/checkoutreminder/icon-calendar.svg'
import WalkInShell from '../WalkInDetails/WalkInShell'
import { SITE_COUNT, MIN_STAY_DATE, MAX_STAY_DATE, getAvailability } from '../WalkInDetails/availability'
import '../WalkInDetails/walkin-details.css'

export default function WalkInPlate() {
  const navigate = useNavigate()
  const [stayDate, setStayDate] = useState(MIN_STAY_DATE)
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)

  const availability = useMemo(() => getAvailability(stayDate), [stayDate])
  const availableCount = availability.filter((slot) => !slot.isOccupied).length

  const handleStayDateChange = (value: string) => {
    setStayDate(value)
    setSelectedSiteId(null)
  }

  const canProceed = Boolean(stayDate) && Boolean(selectedSiteId)

  const handleSubmit = () => {
    if (!canProceed) return
    navigate('/check-in/rules', { state: { siteNumber: selectedSiteId } })
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

        <div className="wk-field">
          <label className="wk-field__label" htmlFor="walkin-stay-date">
            Stay date
          </label>
          <div className="wk-field__control">
            <img src={iconCalendar} alt="" width={16} height={16} />
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
