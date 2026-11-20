import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import BarraSuperior from '../components/BarraSuperior'
import FilaLista from '../components/FilaLista'
import Cargando from '../components/Cargando'
import { useAvisos } from '../components/Avisos'
import { editarProducto, listarProductos, reordenarProductos } from '../lib/api'
import { useLista } from '../lib/useLista'
import { formatoPrecio } from '../lib/util'
import type { ProductoResumenAdmin } from '../lib/tipos'
import '../components/Lista.css'

function textoPrecio(p: ProductoResumenAdmin): string {
  if (p.precio == null) return 'Sin precio'
  if (p.mostrarPrecio === false) return 'Precio oculto'
  return formatoPrecio(p.precio)
}

export default function Productos() {
  const navigate = useNavigate()
  const { avisar } = useAvisos()
  const cambiarVisible = useCallback((id: string, activo: boolean) => editarProducto(id, { activo }), [])
  const { items, error, cargar, ocupados, visible, moverItem, reordenando } = useLista(
    listarProductos,
    cambiarVisible,
    reordenarProductos,
    avisar,
  )

  const agregar = (
    <button type="button" className="adm-boton adm-lista__agregar" onClick={() => navigate('/admin/productos/nuevo')}>
      + Agregar producto
    </button>
  )

  return (
    <>
      <BarraSuperior titulo="Productos" volver="/admin" />
      <main className="adm-contenido">
        {error ? (
          <div className="adm-error-carga adm-tarjeta">
            <p>{error}</p>
            <button type="button" className="adm-boton" onClick={() => void cargar()}>
              Probar de nuevo
            </button>
          </div>
        ) : items === null ? (
          <Cargando texto="Cargando productos…" />
        ) : items.length === 0 ? (
          <>
            {agregar}
            <p className="adm-vacio adm-tarjeta">Todavía no cargaste productos</p>
          </>
        ) : (
          <>
            {agregar}
            <ul className="adm-lista">
              {items.map((p, i) => (
                <FilaLista
                  key={p._id}
                  a={`/admin/productos/${p._id}`}
                  foto={p.imagen?.url ?? null}
                  titulo={p.nombre}
                  detalle={textoPrecio(p)}
                  visible={p.activo !== false}
                  onVisible={(v) => void visible(p._id, v)}
                  ocupado={ocupados.has(p._id)}
                  flechas={{
                    subir: i > 0 ? () => void moverItem(i, -1) : null,
                    bajar: i < items.length - 1 ? () => void moverItem(i, 1) : null,
                    deshabilitadas: reordenando,
                  }}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  )
}
