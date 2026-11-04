import { useId } from 'react'
import './Interruptor.css'

interface Props {
  texto: string
  ayuda?: string
  activo: boolean
  onChange: (valor: boolean) => void
  deshabilitado?: boolean
  compacto?: boolean
}

/** Interruptor grande con el texto al lado (role="switch") */
export default function Interruptor({ texto, ayuda, activo, onChange, deshabilitado, compacto }: Props) {
  const id = useId()
  return (
    <div className={`adm-interruptor ${compacto ? 'adm-interruptor--compacto' : ''}`}>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={activo}
        aria-describedby={ayuda ? `${id}-ayuda` : undefined}
        className={`adm-interruptor__boton ${activo ? 'is-on' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onChange(!activo)
        }}
        disabled={deshabilitado}
      >
        <span className="adm-interruptor__pista" aria-hidden="true">
          <span className="adm-interruptor__perilla" />
        </span>
        <span className="adm-interruptor__textos">
          <span className="adm-interruptor__texto">{texto}</span>
          {ayuda && (
            <span id={`${id}-ayuda`} className="adm-interruptor__ayuda">
              {ayuda}
            </span>
          )}
        </span>
      </button>
    </div>
  )
}
