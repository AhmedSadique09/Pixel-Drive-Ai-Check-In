interface PlatePreviewProps {
  region: string
  classNo: string
  kana: string
  number: string
}

/** Mini Japanese number plate that mirrors the form values. */
export default function PlatePreview({ region, classNo, kana, number }: PlatePreviewProps) {
  const top = `${region} ${classNo}`.trim()
  return (
    <div className="wk-plate" role="img" aria-label={`Plate preview: ${top} ${kana} ${number}`}>
      <span className="wk-plate__top">{top}</span>
      <span className="wk-plate__kana">{kana}</span>
      <span className="wk-plate__number">{number}</span>
    </div>
  )
}
