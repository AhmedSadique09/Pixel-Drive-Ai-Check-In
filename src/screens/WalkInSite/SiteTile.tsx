import iconCar from '../../assets/walkinsite/icon-car.svg'
import iconCheck from '../../assets/walkinsite/icon-check.svg'
import iconTent from '../../assets/walkinsite/icon-tent.svg'
import iconZap from '../../assets/walkinsite/icon-zap.svg'
import type { Site } from './sites'

interface SiteTileProps {
  site: Site
  isSelected: boolean
  onSelect: (id: string) => void
}

/** Radio-style tile: a visually hidden native radio keeps arrow-key navigation. */
export default function SiteTile({ site, isSelected, onSelect }: SiteTileProps) {
  let icon = site.kind === 'powered' ? iconZap : iconTent
  let size = 14
  if (site.isTaken) {
    icon = iconCar
    size = 16
  } else if (isSelected) {
    icon = iconCheck
    size = 16
  }

  return (
    <label className="wk-site">
      <input
        type="radio"
        name="walkin-site"
        className="wk-site__input"
        value={site.id}
        checked={isSelected}
        disabled={site.isTaken}
        onChange={() => onSelect(site.id)}
      />
      <span className="wk-site__tile">
        <img src={icon} alt="" width={size} height={size} />
        <span className="wk-site__id">{site.id}</span>
        {site.isTaken && <span className="wk-site__sr">taken</span>}
      </span>
    </label>
  )
}
