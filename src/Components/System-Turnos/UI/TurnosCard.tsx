// components/Turnos/ServicioCard.tsx
import type { FC } from 'react'
interface ServicioCardProps {
  titulo: string
  descripcion: string
  precio: string
}

const ServicioCard: FC<ServicioCardProps> = ({ titulo, descripcion, precio }) => {
  return (
    <div className="card-servicio">
      <h3 className="card-servicio__titulo">{titulo}</h3>
      <p className="card-servicio__descripcion">{descripcion}</p>
      <div className="card-servicio__footer">
        <span className="card-servicio__precio">
          <small>DESDE</small> ${precio}
        </span>
        <button className="card-servicio__boton">Agendar servicio</button>
      </div>
    </div>
  )
}

export default ServicioCard
