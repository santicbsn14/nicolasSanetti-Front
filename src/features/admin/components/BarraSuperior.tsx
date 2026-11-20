import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSesion } from '../auth/AdminAuthContext'
import './BarraSuperior.css'

interface Props {
  titulo: string
  /** Ruta a la que vuelve, o función (para confirmar cambios sin guardar) */
  volver?: string | (() => void)
  mostrarSalir?: boolean
}

export default function BarraSuperior({ titulo, volver, mostrarSalir }: Props) {
  const navigate = useNavigate()
  const { salir } = useSesion()

  const alVolver = () => {
    if (typeof volver === 'function') volver()
    else if (volver) navigate(volver)
  }

  return (
    <header className="adm-barra">
      <div className="adm-barra__interno">
        {volver ? (
          <button type="button" className="adm-barra__volver" onClick={alVolver}>
            <ArrowLeft size={22} aria-hidden="true" />
            <span>Volver</span>
          </button>
        ) : (
          <span className="adm-barra__lugar" />
        )}
        <h1 className="adm-barra__titulo">
          {titulo}
          <span className="adm-barra__punto" aria-hidden="true">.</span>
        </h1>
        {mostrarSalir ? (
          <button type="button" className="adm-barra__salir" onClick={() => void salir()}>
            Salir
          </button>
        ) : (
          <span className="adm-barra__lugar" />
        )}
      </div>
    </header>
  )
}
