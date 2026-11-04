import { MENSAJE_LENTO, useLento } from '../lib/util'
import './Cargando.css'

export default function Cargando({ texto = 'Cargando…', pantallaCompleta }: { texto?: string; pantallaCompleta?: boolean }) {
  const lento = useLento(true)
  return (
    <div className={`adm-cargando ${pantallaCompleta ? 'adm-cargando--pantalla' : ''}`} role="status">
      <span className="adm-ruedita" aria-hidden="true" />
      <p>{texto}</p>
      {lento && <p className="adm-cargando__lento">{MENSAJE_LENTO}</p>}
    </div>
  )
}
