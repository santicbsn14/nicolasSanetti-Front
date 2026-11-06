import type { Trabajo } from '../../lib/sanity.types'
import {
  altTrabajo,
  imagenGrilla,
  SIZES_GRILLA,
  SIZES_GRILLA_DESTACADA,
} from './galeria.utils'
import './GrillaTrabajos.css'

// Las primeras fotos se ven sin scrollear: van sin lazy
const SIN_LAZY = 4

interface Props {
  trabajos: Trabajo[]
  // Se anota la URL que eligió el navegador para usarla en el visor mientras carga la grande
  miniaturas: Map<string, string>
  onAbrir: (id: string) => void
}

function GrillaTrabajos({ trabajos, miniaturas, onAbrir }: Props) {
  return (
    <ul className="galeria-grilla galeria-grilla--entrada">
      {trabajos.map((t, i) => {
        const { src, srcSet } = imagenGrilla(t)
        const descripcion = t.descripcion?.trim()
        return (
          <li
            key={t._id}
            className={`galeria-item${t.destacado ? ' galeria-item--destacado' : ''}`}
          >
            <button
              type="button"
              className="galeria-foto"
              data-trabajo={t._id}
              aria-haspopup="dialog"
              onClick={() => onAbrir(t._id)}
            >
              <img
                src={src}
                srcSet={srcSet}
                sizes={t.destacado ? SIZES_GRILLA_DESTACADA : SIZES_GRILLA}
                alt={altTrabajo(t)}
                loading={i < SIN_LAZY ? undefined : 'lazy'}
                decoding={i < SIN_LAZY ? undefined : 'async'}
                onLoad={(e) => miniaturas.set(t._id, e.currentTarget.currentSrc)}
              />
              {descripcion && (
                <span className="galeria-foto__desc" aria-hidden="true">
                  {descripcion}
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function GrillaCargando() {
  return (
    <ul className="galeria-grilla" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <li key={i} className="galeria-item">
          <div className="galeria-skeleton" />
        </li>
      ))}
    </ul>
  )
}

export default GrillaTrabajos
