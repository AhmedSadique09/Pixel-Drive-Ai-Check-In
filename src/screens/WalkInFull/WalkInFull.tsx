import { useNavigate } from 'react-router-dom'
import iconCar from '../../assets/walkinfull/icon-car.svg'
import iconInfo from '../../assets/walkinfull/icon-info.svg'
import iconMapPin from '../../assets/walkinfull/icon-map-pin.svg'
import iconMessage from '../../assets/walkinfull/icon-message.svg'
import iconNavigation from '../../assets/walkinfull/icon-navigation.svg'
import WalkInShell from '../WalkInDetails/WalkInShell'
import './walkin-full.css'

interface NearbyPlace {
  name: string
  meta: string
  distance: string
}

const NEARBY: readonly NearbyPlace[] = [
  { name: 'RV Park Midori-no-Sato', meta: '12 min drive · power · ¥3,500', distance: '5.8 km' },
  { name: 'Michi-no-Eki Shirakaba', meta: '18 min drive · 24h restrooms · free', distance: '9.2 km' },
]

const routeUrl = (name: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name)}`

export default function WalkInFull() {
  const navigate = useNavigate()

  return (
    <WalkInShell
      footer={
        <button
          type="button"
          className="walkin-btn walkin-btn--secondary"
          onClick={() => navigate('/guide/ask-host')}
        >
          <img src={iconMessage} alt="" width={18} height={18} />
          Ask the host
        </button>
      }
    >
      <div className="wk-full">
        <div className="walkin__heading wk-full__heading">
          <span className="wk-full__icon">
            <img src={iconCar} alt="" width={26} height={26} />
          </span>
          <h1 className="walkin__h1">We’re full tonight</h1>
          <p className="walkin__lead">Sorry — there are no free sites tonight.</p>
        </div>

        <section className="wk-full__list" aria-labelledby="nearby-heading">
          <h2 id="nearby-heading" className="wk-full__subtitle">
            Places nearby with space
          </h2>
          <ul className="wk-full__cards">
            {NEARBY.map(({ name, meta, distance }) => (
              <li key={name} className="wk-place">
                <div className="wk-place__head">
                  <span className="wk-place__icon">
                    <img src={iconMapPin} alt="" width={20} height={20} />
                  </span>
                  <div className="wk-place__text">
                    <p className="wk-place__name">{name}</p>
                    <p className="wk-place__meta">{meta}</p>
                    <span className="wk-place__tag">Space tonight</span>
                  </div>
                </div>
                <div className="wk-place__actions">
                  <span className="wk-place__distance">{distance}</span>
                  <a
                    className="wk-place__route"
                    href={routeUrl(name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Route to ${name}`}
                  >
                    <img src={iconNavigation} alt="" width={14} height={14} />
                    Route
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="walkin__hint">
          <img src={iconInfo} alt="" width={14} height={14} />
          Availability from PixelDrive partner parks
        </p>
      </div>
    </WalkInShell>
  )
}
