import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { SAMPLE_RULES_TEXT, guestLink, type FacilityRow } from './facility-data'

const MENU_WIDTH = 160
const MENU_HEIGHT = 100
const MENU_GAP = 6
const VIEWPORT_PADDING = 8
const MIN_NAME_LENGTH = 2
const MAX_SITES = 60
const DEFAULT_FEE = 3000
const DEFAULT_SITES = 10
const MS_PER_SECOND = 1000

interface IconProps {
  children: ReactNode
}

function Icon({ children }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const KebabIcon = () => (
  <Icon>
    <circle cx="12" cy="5" r="1.2" fill="currentColor" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <circle cx="12" cy="19" r="1.2" fill="currentColor" />
  </Icon>
)

const EditIcon = () => (
  <Icon>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Icon>
)

const DeleteIcon = () => (
  <Icon>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
  </Icon>
)

interface MenuPosition {
  top: number
  left: number
}

interface FacilityActionsMenuProps {
  facility: FacilityRow
  onEdit: (facility: FacilityRow) => void
  onDelete: (facility: FacilityRow) => void
}

/** Three-dot button that opens an Edit / Delete menu. The menu is portaled and fixed so the table's overflow never clips it. */
export function FacilityActionsMenu({ facility, onEdit, onDelete }: FacilityActionsMenuProps) {
  const copy = useLanguage().t.admin.activeFacilities
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<MenuPosition | null>(null)
  const isOpen = position !== null

  useEffect(() => {
    if (!isOpen) return
    const close = () => setPosition(null)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
      triggerRef.current?.focus()
    }
    menuRef.current?.querySelector('button')?.focus()
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [isOpen])

  const handleToggle = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (isOpen || !rect) {
      setPosition(null)
      return
    }
    const opensDownward = rect.bottom + MENU_GAP + MENU_HEIGHT <= window.innerHeight
    setPosition({
      top: opensDownward ? rect.bottom + MENU_GAP : rect.top - MENU_GAP - MENU_HEIGHT,
      left: Math.max(VIEWPORT_PADDING, rect.right - MENU_WIDTH),
    })
  }

  const choose = (action: (facility: FacilityRow) => void) => {
    setPosition(null)
    action(facility)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="facility-menu__trigger"
        aria-label={copy.moreActions(facility.name)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <KebabIcon />
      </button>
      {position &&
        createPortal(
          <>
            <div className="facility-menu__backdrop" onClick={() => setPosition(null)} />
            <div ref={menuRef} role="menu" className="facility-menu" style={{ top: position.top, left: position.left, width: MENU_WIDTH }}>
              <button type="button" role="menuitem" className="facility-menu__item" onClick={() => choose(onEdit)}>
                <EditIcon />
                {copy.edit}
              </button>
              <button type="button" role="menuitem" className="facility-menu__item facility-menu__item--danger" onClick={() => choose(onDelete)}>
                <DeleteIcon />
                {copy.delete}
              </button>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}

interface DialogShellProps {
  title: string
  role: 'dialog' | 'alertdialog'
  onClose: () => void
  children: ReactNode
}

export function DialogShell({ title, role, onClose, children }: DialogShellProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return createPortal(
    <div className="facility-dialog__overlay">
      <div className="facility-dialog" role={role} aria-modal="true" aria-label={title}>
        <h2 className="facility-dialog__title">{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}

interface EditFacilityDialogProps {
  facility: FacilityRow
  onSave: (facility: FacilityRow) => void
  onClose: () => void
}

export function EditFacilityDialog({ facility, onSave, onClose }: EditFacilityDialogProps) {
  const { activeFacilities: copy, facilities: formCopy } = useLanguage().t.admin
  const [name, setName] = useState(facility.name)
  const [fee, setFee] = useState(facility.fee)
  const [siteCount, setSiteCount] = useState(facility.siteCount)

  const canSave = name.trim().length >= MIN_NAME_LENGTH && fee >= 0 && Number.isInteger(siteCount) && siteCount >= 1 && siteCount <= MAX_SITES

  return (
    <DialogShell title={copy.editTitle} role="dialog" onClose={onClose}>
      <form
        className="facility-dialog__form"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave({ ...facility, name: name.trim(), fee, siteCount })
        }}
      >
        <label className="facility-form__field">
          {formCopy.facilityName}
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </label>
        <div className="facility-form__row">
          <label className="facility-form__field">
            {formCopy.fee}
            <input type="number" min={0} value={fee} onChange={(e) => setFee(Number(e.target.value))} />
          </label>
          <label className="facility-form__field">
            {formCopy.numberOfSites}
            <input type="number" min={1} max={MAX_SITES} value={siteCount} onChange={(e) => setSiteCount(Number(e.target.value))} />
          </label>
        </div>
        <div className="facility-dialog__actions">
          <button type="button" className="facility-dialog__btn" onClick={onClose}>
            {copy.cancel}
          </button>
          <button type="submit" className="facility-dialog__btn facility-dialog__btn--primary" disabled={!canSave}>
            {copy.saveChanges}
          </button>
        </div>
      </form>
    </DialogShell>
  )
}

interface DeleteFacilityDialogProps {
  facility: FacilityRow
  onConfirm: (facility: FacilityRow) => void
  onClose: () => void
}

export function DeleteFacilityDialog({ facility, onConfirm, onClose }: DeleteFacilityDialogProps) {
  const copy = useLanguage().t.admin.activeFacilities

  return (
    <DialogShell title={copy.deleteTitle} role="alertdialog" onClose={onClose}>
      <p className="facility-dialog__message">{copy.deleteMessage(facility.name)}</p>
      <div className="facility-dialog__actions">
        <button type="button" className="facility-dialog__btn" onClick={onClose} autoFocus>
          {copy.cancel}
        </button>
        <button type="button" className="facility-dialog__btn facility-dialog__btn--danger" onClick={() => onConfirm(facility)}>
          {copy.delete}
        </button>
      </div>
    </DialogShell>
  )
}

interface AddFacilityDialogProps {
  onCreate: (facility: FacilityRow) => FacilityRow
  onClose: () => void
}

/** Popup for creating a new facility — the form that used to sit directly on the Facilities tab. */
export function AddFacilityDialog({ onCreate, onClose }: AddFacilityDialogProps) {
  const { facilities: copy, activeFacilities: actionsCopy } = useLanguage().t.admin
  const [openedAt] = useState(() => Date.now())
  const [name, setName] = useState('')
  const [fee, setFee] = useState(DEFAULT_FEE)
  const [siteCount, setSiteCount] = useState(DEFAULT_SITES)
  const [docName, setDocName] = useState('rules.txt')
  const [text, setText] = useState('')
  const [created, setCreated] = useState<{ facility: FacilityRow; seconds: number } | null>(null)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setDocName(file.name)
    setText(await file.text())
  }

  const loadSample = () => {
    setName('Yamabiko Forest RV Park')
    setDocName('Yamabiko Rules.pdf')
    setText(SAMPLE_RULES_TEXT)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const facility: FacilityRow = {
      id: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: name.trim(),
      fee,
      siteCount,
      docName,
      status: 'live',
      rulesText: text,
    }
    const storedFacility = onCreate(facility)
    setCreated({ facility: storedFacility, seconds: Math.max(1, Math.round((Date.now() - openedAt) / MS_PER_SECOND)) })
  }

  const sectionCount = text.split(/\n#{1,3}\s/).filter((s) => s.trim()).length
  const canCreate = name.trim().length >= MIN_NAME_LENGTH && text.trim().length >= 20

  if (created) {
    return (
      <DialogShell title={copy.liveIn(created.seconds)} role="dialog" onClose={onClose}>
        <div className="facility-created">
          <p className="facility-created__eyebrow">{copy.liveIn(created.seconds)}</p>
          <h3 className="facility-created__name">{created.facility.name}</h3>
          <p className="facility-created__meta">{copy.sectionsIndexed(sectionCount, created.facility.siteCount)}</p>
          <a href={guestLink(created.facility.id)} target="_blank" rel="noopener noreferrer" className="facility-created__link">
            {copy.openGuestView}
          </a>
        </div>
        <div className="facility-dialog__actions">
          <button type="button" className="facility-dialog__btn facility-dialog__btn--primary" onClick={onClose}>
            {copy.done}
          </button>
        </div>
      </DialogShell>
    )
  }

  return (
    <DialogShell title={copy.addTitle} role="dialog" onClose={onClose}>
      <form onSubmit={handleSubmit} className="facility-dialog__form">
        <div className="facility-form__head">
          <p className="admin__hint">{copy.addHint}</p>
          <button type="button" onClick={loadSample} className="facility-form__sample">
            {copy.loadSample}
          </button>
        </div>

        <label className="facility-form__field">
          {copy.facilityName}
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </label>

        <div className="facility-form__row">
          <label className="facility-form__field">
            {copy.fee}
            <input type="number" min={0} value={fee} onChange={(e) => setFee(Number(e.target.value))} />
          </label>
          <label className="facility-form__field">
            {copy.numberOfSites}
            <input type="number" min={1} max={MAX_SITES} value={siteCount} onChange={(e) => setSiteCount(Number(e.target.value))} />
          </label>
        </div>

        <label className="facility-form__field">
          {copy.rulesDocument}
          <input type="file" accept=".txt,.md,text/plain" onChange={handleFile} />
        </label>

        <label className="facility-form__field">
          {copy.pasteRulesText}
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} className="facility-form__textarea" />
        </label>

        <p className="admin__hint">{copy.plainTextHint}</p>

        <div className="facility-dialog__actions">
          <button type="button" className="facility-dialog__btn" onClick={onClose}>
            {actionsCopy.cancel}
          </button>
          <button type="submit" disabled={!canCreate} className="facility-dialog__btn facility-dialog__btn--primary">
            {copy.createFacility}
          </button>
        </div>
      </form>
    </DialogShell>
  )
}
