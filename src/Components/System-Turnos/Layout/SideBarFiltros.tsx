// components/Turnos/SidebarFiltros.tsx
import type { FC } from 'react'

interface Props {
  categorias: string[]
  categoriaSeleccionada: string
  onCategoriaSelect: (categoria: string) => void
  onBusquedaChange: (texto: string) => void
}


const SidebarFiltros: FC<Props> = ({ categorias, onCategoriaSelect, categoriaSeleccionada, onBusquedaChange }) => {
  return (
    <aside className="sidebar">
      <label className="sidebar__label">Buscar servicio</label>
      <input
  type="text"
  className="sidebar__buscador"
  placeholder="Buscar..."
  onChange={(e) => onBusquedaChange(e.target.value)}
/>


      <div className="sidebar__categorias">
        {categorias.map((categoria) => (
          <div key={categoria}>
            <button
              key={categoria}
              onClick={() => onCategoriaSelect(categoria)}
              className={`sidebar__categoria ${categoria === categoriaSeleccionada ? 'activa' : ''}`}
            >
              <span>{categoria}</span>
              <span className="sidebar__flecha">{'>'}</span>
            </button>         
        </div>
        ))}
      </div>

      <div className="turnos__linea-vertical" />
    </aside>
  )
}

export default SidebarFiltros
