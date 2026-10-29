import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { LANGUAGE_OPTIONS } from '../../i18n/translations'
import iconCheck from '../../assets/welcome/icon-check.svg'
import './language-menu.css'

interface LanguageMenuProps {
  /** Globe icon shown inside the trigger (each shell ships its own asset). */
  icon: string
  /** Shell-specific class so the trigger keeps the look of its header. */
  triggerClassName: string
}

export default function LanguageMenu({ icon, triggerClassName }: LanguageMenuProps) {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const current = LANGUAGE_OPTIONS.find(({ code }) => code === language) ?? LANGUAGE_OPTIONS[0]

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="lang-menu" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-label={`${t.common.changeLanguage}: ${current.name}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <img src={icon} alt="" width={16} height={16} />
        <span lang={current.code}>{current.name}</span>
        <span className="lang-menu__caret" aria-hidden="true" />
      </button>

      {isOpen && (
        <ul id={menuId} className="lang-menu__list">
          {LANGUAGE_OPTIONS.map(({ code, name, hint }) => {
            const isSelected = code === language
            return (
              <li key={code}>
                <button
                  type="button"
                  lang={code}
                  className={`lang-menu__item${isSelected ? ' lang-menu__item--selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setLanguage(code)
                    setIsOpen(false)
                    triggerRef.current?.focus()
                  }}
                >
                  <span className="lang-menu__item-text">
                    <span className="lang-menu__item-name">{name}</span>
                    <span className="lang-menu__item-hint">{hint}</span>
                  </span>
                  {isSelected && (
                    <span className="lang-menu__check">
                      <img src={iconCheck} alt="" width={12} height={12} />
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
