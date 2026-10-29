import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckInShell from '../../components/checkin-flow/CheckInShell'
import { useLanguage } from '../../i18n/LanguageContext'
import bolt from '../../assets/findbyplate/bolt.svg'
import iconSearch from '../../assets/findbyplate/icon-search.svg'
import './findbyplate.css'

interface PlateFields {
  region: string
  classNo: string
  kana: string
  serial: string
}

type FieldName = keyof PlateFields

const DEMO_PLATE: PlateFields = { region: '品川', classNo: '300', kana: 'あ', serial: '12-34' }

const FIELD_LIMITS: Record<FieldName, number> = { region: 4, classNo: 3, kana: 1, serial: 5 }

function PlatePreview({ region, classNo, kana, serial }: PlateFields) {
  const { t } = useLanguage()

  return (
    <div
      className="plate-preview"
      role="img"
      aria-label={`${t.checkIn.plate.plateAria}: ${region} ${classNo} ${kana} ${serial}`}
    >
      <div className="plate">
        <p className="plate__top">
          {region} {classNo}
        </p>
        <p className="plate__kana">{kana}</p>
        <p className="plate__serial">{serial}</p>
        <img className="plate__bolt plate__bolt--left" src={bolt} alt="" width={7} height={7} />
        <img className="plate__bolt plate__bolt--right" src={bolt} alt="" width={7} height={7} />
      </div>
    </div>
  )
}

interface InputFieldProps {
  id: FieldName
  label: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  className?: string
  autoFocus?: boolean
}

function InputField({ id, label, value, onChange, className = '', autoFocus }: InputFieldProps) {
  return (
    <div className={`plate-field ${className}`}>
      <label className="plate-field__label" htmlFor={`plate-${id}`}>
        {label}
      </label>
      <input
        id={`plate-${id}`}
        name={id}
        className="plate-field__input"
        value={value}
        maxLength={FIELD_LIMITS[id]}
        onChange={onChange}
        autoComplete="off"
        autoFocus={autoFocus}
      />
    </div>
  )
}

function matchesDemoBooking(fields: PlateFields): boolean {
  return (Object.keys(DEMO_PLATE) as FieldName[]).every(
    (key) => fields[key].trim() === DEMO_PLATE[key],
  )
}

export default function FindByPlate() {
  const navigate = useNavigate()
  const copy = useLanguage().t.checkIn.plate
  const [fields, setFields] = useState<PlateFields>(DEMO_PLATE)

  const handleChange = (name: FieldName) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setFields((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(matchesDemoBooking(fields) ? '/check-in/booking' : '/check-in/no-booking')
  }

  const canSubmit = Object.values(fields).every((value) => value.trim().length > 0)

  return (
    <CheckInShell
      step={1}
      size="wide"
      onBack={() => navigate('/')}
      footer={
        <button type="submit" form="plate-form" className="btn btn--primary" disabled={!canSubmit}>
          <img src={iconSearch} alt="" width={18} height={18} />
          {copy.submit}
        </button>
      }
    >
      <form id="plate-form" className="plate-page" onSubmit={handleSubmit} noValidate>
        <div className="plate-page__intro">
          <h1 className="plate-page__title">{copy.title}</h1>
          <p className="plate-page__desc">{copy.desc}</p>
        </div>

        <PlatePreview {...fields} />

        <fieldset className="plate-page__fields">
          <legend className="plate-page__legend">{copy.legend}</legend>
          <div className="plate-page__row">
            <InputField id="region" label={copy.region} value={fields.region} onChange={handleChange('region')} />
            <InputField id="classNo" label={copy.classNo} value={fields.classNo} onChange={handleChange('classNo')} />
          </div>
          <div className="plate-page__row plate-page__row--kana">
            <InputField id="kana" label={copy.kana} value={fields.kana} onChange={handleChange('kana')} />
            <InputField id="serial" label={copy.serial} value={fields.serial} onChange={handleChange('serial')} autoFocus />
          </div>
        </fieldset>
      </form>
    </CheckInShell>
  )
}
