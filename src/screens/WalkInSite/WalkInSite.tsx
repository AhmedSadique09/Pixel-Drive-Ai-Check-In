import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import iconArrowRight from '../../assets/walkinsite/icon-arrow-right.svg'
import iconCalendar from '../../assets/checkoutreminder/icon-calendar.svg'
import iconArrowRightMuted from '../../assets/walkinsite/icon-arrow-right-muted.svg'
import iconDroplet from '../../assets/walkinsite/icon-droplet.svg'
import iconMapPin from '../../assets/walkinsite/icon-map-pin.svg'
import iconTent from '../../assets/walkinsite/icon-tent.svg'
import iconTentChip from '../../assets/walkinsite/icon-tent-chip.svg'
import iconZap from '../../assets/walkinsite/icon-zap.svg'
import iconZapChip from '../../assets/walkinsite/icon-zap-chip.svg'
import { MAX_STAY_DATE, MIN_STAY_DATE } from '../WalkInDetails/availability'
import WalkInShell from '../WalkInDetails/WalkInShell'
import SiteTile from './SiteTile'
import { AREAS, countFree, getAreasForDate, getSiteDetails, type SiteKind } from './sites'
import '../WalkInDetails/walkin-details.css'
import './walkin-site.css'

type Filter = 'all' | SiteKind

const BASE_SITES = AREAS.flatMap((area) => area.sites)
const DEFAULT_SELECTED = 'B-07'

const FILTERS: { id: Filter; label: string; icon?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'powered', label: 'Powered', icon: iconZapChip },
  { id: 'standard', label: 'Standard', icon: iconTentChip },
]

const FACILITIES = [
  { icon: iconMapPin, label: 'Entrance' },
  { icon: iconDroplet, label: 'Restrooms' },
  { icon: iconTentChip, label: 'Kitchen' },
]

const yen = new Intl.NumberFormat('en-US')

export default function WalkInSite() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SELECTED)
  const [stayDate, setStayDate] = useState(MIN_STAY_DATE)

  if (countFree(BASE_SITES) === 0) return <Navigate to="/walk-in/full" replace />

  const areas = getAreasForDate(stayDate)
  const allSites = areas.flatMap((area) => area.sites)
  const selected = allSites.find((entry) => entry.id === selectedId && !entry.isTaken)
  const details = selected ? getSiteDetails(selected) : null
  const visibleAreas = areas.filter((area) => filter === 'all' || area.kind === filter)

  const countFor = (id: Filter) =>
    countFree(allSites.filter((entry) => id === 'all' || entry.kind === id))

  const handleStayDateChange = (value: string) => {
    if (value) setStayDate(value)
  }

  return (
    <WalkInShell
      step={0}
      isWide
      footer={
        <>
          {selected && details ? (
            <div className="wk-summary">
              <span className="wk-summary__tile">{selected.id}</span>
              <div className="wk-summary__text">
                <p className="wk-summary__title">{details.title}</p>
                <p className="wk-summary__note">{details.note}</p>
              </div>
              <p className="wk-summary__price">
                ¥{yen.format(details.price)}
                <span>/night</span>
              </p>
            </div>
          ) : (
            <p className="wk-summary__empty">Choose a free site to continue.</p>
          )}
          <button
            type="button"
            className="walkin-btn walkin-btn--primary"
            disabled={!selected}
            onClick={() => navigate('/check-in/payment')}
          >
            {selected ? `Continue with ${selected.id}` : 'Choose a site'}
            <img src={iconArrowRight} alt="" width={18} height={18} />
          </button>
        </>
      }
    >
      <div className="wk-sites">
        <div className="walkin__heading walkin__heading--tight">
          <h1 className="walkin__h1">Choose your site</h1>
          <p className="walkin__lead walkin__lead--sm">Pick your stay date, then tap any free site to select it.</p>
        </div>

        <div className="wk-field">
          <label className="wk-field__label" htmlFor="walkin-site-date">
            Stay date
          </label>
          <div className="wk-field__control">
            <img src={iconCalendar} alt="" width={16} height={16} />
            <input
              id="walkin-site-date"
              type="date"
              className="wk-field__input"
              value={stayDate}
              min={MIN_STAY_DATE}
              max={MAX_STAY_DATE}
              onChange={(event) => handleStayDateChange(event.target.value)}
            />
          </div>
        </div>

        <div className="wk-chips" role="group" aria-label="Filter sites">
          {FILTERS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              className={`wk-chip${filter === id ? ' wk-chip--active' : ''}`}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {icon && <img src={icon} alt="" width={13} height={13} />}
              <span className="wk-chip__label">{label}</span>
              <span className="wk-chip__count">{countFor(id)}</span>
            </button>
          ))}
        </div>

        <ul className="wk-legend" aria-label="Legend">
          <li><span className="wk-swatch wk-swatch--free" />Free</li>
          <li><span className="wk-swatch wk-swatch--selected" />Selected</li>
          <li><span className="wk-swatch wk-swatch--taken" />Taken</li>
        </ul>

        <div className="wk-map">
          {visibleAreas.map((area, index) => (
            <fieldset key={area.id} className="wk-area">
              <legend className="wk-area__header">
                <img
                  src={area.kind === 'powered' ? iconZap : iconTent}
                  alt=""
                  width={14}
                  height={14}
                />
                <span className="wk-area__name">{area.label}</span>
                <span className="wk-area__free">{countFree(area.sites)} free</span>
              </legend>
              <div className="wk-area__sites">
                {area.sites.map((entry) => (
                  <SiteTile
                    key={entry.id}
                    site={entry}
                    isSelected={entry.id === selectedId}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
              {index < visibleAreas.length - 1 && (
                <div className="wk-driveway" aria-hidden="true">
                  Driveway
                  <img src={iconArrowRightMuted} alt="" width={14} height={14} />
                </div>
              )}
            </fieldset>
          ))}

          <ul className="wk-facilities">
            {FACILITIES.map(({ icon, label }) => (
              <li key={label} className="wk-facility">
                <img src={icon} alt="" width={13} height={13} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WalkInShell>
  )
}
