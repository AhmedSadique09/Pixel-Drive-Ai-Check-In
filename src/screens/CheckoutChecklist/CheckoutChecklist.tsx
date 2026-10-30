import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import iconCamera from '../../assets/checkoutchecklist/icon-camera.svg'
import iconCheck from '../../assets/checkoutchecklist/icon-check.svg'
import iconFlame from '../../assets/checkoutchecklist/icon-flame.svg'
import iconInfo from '../../assets/checkoutchecklist/icon-info.svg'
import iconLogOut from '../../assets/checkoutchecklist/icon-log-out.svg'
import iconPlus from '../../assets/checkoutchecklist/icon-plus.svg'
import iconTent from '../../assets/checkoutchecklist/icon-tent.svg'
import iconTrash from '../../assets/checkoutchecklist/icon-trash.svg'
import iconZap from '../../assets/checkoutchecklist/icon-zap.svg'
import CheckoutShell from '../CheckoutShared/CheckoutShell'
import './checkoutchecklist.css'

interface ChecklistItem {
  id: string
  icon: string
  label: string
  isWarm?: boolean
}

const ITEMS: readonly ChecklistItem[] = [
  { id: 'rubbish', icon: iconTrash, label: 'Sorted rubbish and took it to the trash station' },
  { id: 'fire', icon: iconFlame, label: 'Fire is fully out' },
  { id: 'power', icon: iconZap, label: 'Unplugged and put back the power cable' },
  { id: 'site', icon: iconTent, label: 'Nothing left behind at the site', isWarm: true },
]

const INITIALLY_CHECKED: readonly string[] = []

export default function CheckoutChecklist() {
  const navigate = useNavigate()
  const [checkedIds, setCheckedIds] = useState<readonly string[]>(INITIALLY_CHECKED)
  const [photoName, setPhotoName] = useState<string | null>(null)

  const doneCount = checkedIds.length
  const remaining = ITEMS.length - doneCount
  const isComplete = remaining === 0

  const toggle = (id: string) =>
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    setPhotoName(event.target.files?.[0]?.name ?? null)
  }

  return (
    <CheckoutShell
      variant="back"
      step={1}
      onBack={() => navigate('/check-out')}
      bar={
        <>
          {!isComplete && (
            <p className="checklist__helper" role="status">
              <img src={iconInfo} alt="" width={14} height={14} />
              {remaining} {remaining === 1 ? 'item' : 'items'} left to tick
            </p>
          )}
          <button
            type="button"
            className="co-btn co-btn--primary"
            disabled={!isComplete}
            onClick={() => navigate('/check-out/complete')}
          >
            <img src={iconLogOut} alt="" width={18} height={18} className="checklist__btn-icon" />
            Finish check-out
          </button>
        </>
      }
    >
      <header className="checklist__header">
        <h1 className="co-title">Before you leave</h1>
        <p className="co-lead">Tick everything to finish checking out.</p>
      </header>

      <div className="checklist__progress">
        <div className="checklist__bar" aria-hidden="true">
          {ITEMS.map((item, index) => (
            <span
              key={item.id}
              className={`checklist__segment${index < doneCount ? ' checklist__segment--on' : ''}`}
            />
          ))}
        </div>
        <p className="checklist__count">
          {doneCount} of {ITEMS.length} done
        </p>
      </div>

      <ul className="checklist__list">
        {ITEMS.map(({ id, icon, label, isWarm }) => {
          const isChecked = checkedIds.includes(id)
          return (
            <li key={id}>
              <label className={`check-item${isChecked ? ' check-item--checked' : ''}`}>
                <input
                  type="checkbox"
                  className="check-item__input"
                  checked={isChecked}
                  onChange={() => toggle(id)}
                />
                <span className={`check-item__icon${isWarm ? ' check-item__icon--warm' : ''}`}>
                  <img src={icon} alt="" width={18} height={18} />
                </span>
                <span className="check-item__label">{label}</span>
                <span className="check-item__box" aria-hidden="true">
                  {isChecked && <img src={iconCheck} alt="" width={16} height={16} />}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <label className="checklist__photo">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="check-item__input"
          onChange={handlePhoto}
        />
        <span className="checklist__photo-icon">
          <img src={iconCamera} alt="" width={18} height={18} />
        </span>
        <span className="checklist__photo-text">
          <span className="checklist__photo-title">Send a photo of your site (optional)</span>
          <span className="checklist__photo-sub">{photoName ?? 'Saves the host a site check'}</span>
        </span>
        <img src={iconPlus} alt="" width={18} height={18} />
      </label>
    </CheckoutShell>
  )
}
