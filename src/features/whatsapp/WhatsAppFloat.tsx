import type { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { buildWaLink, MENSAJE_TURNO } from './whatsapp'
import './WhatsAppFloat.css'

const WhatsAppFloat: FC = () => {
  return (
    <a
      className="whatsapp-float"
      href={buildWaLink(MENSAJE_TURNO)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservá tu turno por WhatsApp"
    >
      <FontAwesomeIcon icon={faWhatsapp} className="whatsapp-float__icon" />
    </a>
  )
}

export default WhatsAppFloat
