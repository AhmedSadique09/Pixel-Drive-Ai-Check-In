import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import iconArrowRight from '../../assets/walkindetails/icon-arrow-right.svg'
import iconCheck from '../../assets/walkindetails/icon-check.svg'
import iconInfo from '../../assets/walkindetails/icon-info.svg'
import iconUser from '../../assets/walkindetails/icon-user.svg'
import PlatePreview from './PlatePreview'
import WalkInShell from './WalkInShell'
import './walkin-details.css'

type FieldName = 'name' | 'region' | 'classNo' | 'kana' | 'number'
type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName, string>>

const FORM_ID = 'walkin-details-form'

const INITIAL_VALUES: Values = {
  name: 'Taro Yamada',
  region: '品川',
  classNo: '300',
  kana: 'あ',
  number: '12-34',
}

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (values.region.trim().length === 0) errors.region = 'Enter the region name.'
  if (!/^[0-9A-Za-z]{1,3}$/.test(values.classNo.trim())) errors.classNo = 'Use 1 to 3 digits.'
  if (!/^[ぁ-ゖ]$/.test(values.kana.trim())) errors.kana = 'One hiragana.'
  if (!/^(?=.*\d)[0-9-]{1,5}$/.test(values.number.trim())) errors.number = 'e.g. 12-34'
  return errors
}

interface PlateFieldProps {
  name: FieldName
  label: string
  value: string
  error?: string
  className?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: (name: FieldName) => void
}

function PlateField({ name, label, value, error, className, onChange, onBlur }: PlateFieldProps) {
  const id = `walkin-${name}`
  return (
    <div className={`wk-field ${className ?? ''}`}>
      <label className="wk-field__label wk-field__label--sm" htmlFor={id}>
        {label}
      </label>
      <div className={`wk-field__control${error ? ' wk-field__control--error' : ''}`}>
        <input
          id={id}
          name={name}
          className="wk-field__input wk-field__input--plate"
          value={value}
          onChange={onChange}
          onBlur={() => onBlur(name)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete="off"
        />
      </div>
      {error && (
        <p className="wk-field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function WalkInDetails() {
  const navigate = useNavigate()
  const [values, setValues] = useState<Values>(INITIAL_VALUES)
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})

  const errors = validate(values)
  const visibleErrors: Errors = {}
  ;(Object.keys(errors) as FieldName[]).forEach((key) => {
    if (touched[key]) visibleErrors[key] = errors[key]
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  const handleBlur = (name: FieldName) => {
    setTouched((previous) => ({ ...previous, [name]: true }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (Object.keys(errors).length > 0) {
      setTouched({ name: true, region: true, classNo: true, kana: true, number: true })
      return
    }
    navigate('/walk-in/site')
  }

  const plateProps = { onChange: handleChange, onBlur: handleBlur }

  return (
    <WalkInShell
      step={0}
      footer={
        <button type="submit" form={FORM_ID} className="walkin-btn walkin-btn--primary">
          Next: choose a site
          <img src={iconArrowRight} alt="" width={18} height={18} />
        </button>
      }
    >
      <form id={FORM_ID} className="wk-details" onSubmit={handleSubmit} noValidate>
        <div className="walkin__heading">
          <h1 className="walkin__h1">Your name and number plate</h1>
          <p className="walkin__lead">We’ll use these to check you in. You’ll pick your site next.</p>
        </div>

        <div className="wk-field">
          <label className="wk-field__label" htmlFor="walkin-name">
            Full name
          </label>
          <div className={`wk-field__control${visibleErrors.name ? ' wk-field__control--error' : ''}`}>
            <img src={iconUser} alt="" width={16} height={16} />
            <input
              id="walkin-name"
              name="name"
              className="wk-field__input wk-field__input--name"
              value={values.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              aria-invalid={visibleErrors.name ? true : undefined}
              aria-describedby={visibleErrors.name ? 'walkin-name-error' : undefined}
              autoComplete="name"
            />
            {!errors.name && <img src={iconCheck} alt="" width={16} height={16} />}
          </div>
          {visibleErrors.name && (
            <p className="wk-field__error" id="walkin-name-error">
              {visibleErrors.name}
            </p>
          )}
        </div>

        <fieldset className="wk-plate-fields">
          <legend className="wk-plate-fields__legend">
            <span className="wk-field__label">Your number plate</span>
            <PlatePreview
              region={values.region}
              classNo={values.classNo}
              kana={values.kana}
              number={values.number}
            />
          </legend>

          <div className="wk-plate-fields__row">
            <PlateField name="region" label="Region" value={values.region} error={visibleErrors.region} {...plateProps} />
            <PlateField name="classNo" label="Class no." value={values.classNo} error={visibleErrors.classNo} {...plateProps} />
          </div>
          <div className="wk-plate-fields__row wk-plate-fields__row--kana">
            <PlateField name="kana" label="Kana" value={values.kana} error={visibleErrors.kana} className="wk-field--kana" {...plateProps} />
            <PlateField name="number" label="Number" value={values.number} error={visibleErrors.number} {...plateProps} />
          </div>

          <p className="walkin__hint">
            <img src={iconInfo} alt="" width={14} height={14} />
            Used to identify your car on site
          </p>
        </fieldset>
      </form>
    </WalkInShell>
  )
}
