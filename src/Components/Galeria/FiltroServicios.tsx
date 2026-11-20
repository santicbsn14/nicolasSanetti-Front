import { SERVICIOS, type ServicioSlug } from '../../lib/sanity.types'
import './FiltroServicios.css'

interface Props {
  activo: ServicioSlug | null
  total: number
  cantidades: Record<ServicioSlug, number>
  onElegir: (servicio: ServicioSlug | null) => void
}

// Chips «Todas · servicio · …». Los servicios sin fotos no se muestran,
// salvo que sea el que está elegido (por ejemplo, si se entró con el link).
function FiltroServicios({ activo, total, cantidades, onElegir }: Props) {
  const opciones = [
    { slug: null, nombre: 'Todas', cantidad: total },
    ...SERVICIOS.filter((s) => cantidades[s.slug] > 0 || s.slug === activo).map((s) => ({
      ...s,
      cantidad: cantidades[s.slug],
    })),
  ]

  return (
    <div className="galeria-filtro" role="group" aria-label="Filtrar por servicio">
      {opciones.map((o) => {
        const elegido = o.slug === activo
        return (
          <button
            key={o.slug ?? 'todas'}
            type="button"
            className={`galeria-chip${elegido ? ' galeria-chip--activo' : ''}`}
            aria-pressed={elegido}
            onClick={() => onElegir(o.slug)}
          >
            {o.nombre}
            <span className="galeria-chip__cant">{o.cantidad}</span>
          </button>
        )
      })}
    </div>
  )
}

export default FiltroServicios
