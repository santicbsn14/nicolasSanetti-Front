import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BarraSuperior from '../components/BarraSuperior'
import FilaLista from '../components/FilaLista'
import Cargando from '../components/Cargando'
import { useAvisos } from '../components/Avisos'
import { editarTrabajo, listarTrabajos, reordenarTrabajos } from '../lib/api'
import { useLista } from '../lib/useLista'
import { nombreServicio } from '../lib/util'
import { SERVICIOS, type ServicioSlug } from '../../../lib/sanity.types'
import '../components/Lista.css'

export default function Galeria() {
  const navigate = useNavigate()
  const { avisar } = useAvisos()
  const [filtro, setFiltro] = useState<ServicioSlug | 'todas'>('todas')
  const cambiarVisible = useCallback((id: string, activo: boolean) => editarTrabajo(id, { activo }), [])
  const { items, error, cargar, ocupados, visible, moverItem, reordenando } = useLista(
    listarTrabajos,
    cambiarVisible,
    reordenarTrabajos,
    avisar,
  )

  const conFiltro = filtro !== 'todas'
  const mostrados = items?.filter((t) => !conFiltro || t.servicio === filtro) ?? []

  const agregar = (
    <button type="button" className="adm-boton adm-lista__agregar" onClick={() => navigate('/admin/galeria/nueva')}>
      + Agregar foto
    </button>
  )

  return (
    <>
      <BarraSuperior titulo="Galería de trabajos" volver="/admin" />
      <main className="adm-contenido">
        {error ? (
          <div className="adm-error-carga adm-tarjeta">
            <p>{error}</p>
            <button type="button" className="adm-boton" onClick={() => void cargar()}>
              Probar de nuevo
            </button>
          </div>
        ) : items === null ? (
          <Cargando texto="Cargando fotos…" />
        ) : items.length === 0 ? (
          <>
            {agregar}
            <p className="adm-vacio adm-tarjeta">Todavía no subiste fotos de trabajos</p>
          </>
        ) : (
          <>
            {agregar}
            <div className="adm-filtro" role="group" aria-label="Filtrar por servicio">
              <button type="button" className="adm-filtro__boton" aria-pressed={!conFiltro} onClick={() => setFiltro('todas')}>
                Todas
              </button>
              {SERVICIOS.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  className="adm-filtro__boton"
                  aria-pressed={filtro === s.slug}
                  onClick={() => setFiltro(s.slug)}
                >
                  {s.nombre}
                </button>
              ))}
            </div>

            {conFiltro && <p className="adm-lista__nota">Para cambiar el orden, elegí «Todas»</p>}

            {mostrados.length === 0 ? (
              <p className="adm-vacio adm-tarjeta">No hay fotos de {nombreServicio(filtro as ServicioSlug).toLowerCase()}</p>
            ) : (
              <ul className="adm-lista">
                {mostrados.map((t, i) => (
                  <FilaLista
                    key={t._id}
                    a={`/admin/galeria/${t._id}`}
                    foto={t.imagen?.url ?? null}
                    titulo={nombreServicio(t.servicio)}
                    detalle={t.descripcion || 'Sin descripción'}
                    marca={t.destacado ? 'Destacada' : undefined}
                    visible={t.activo !== false}
                    onVisible={(v) => void visible(t._id, v)}
                    ocupado={ocupados.has(t._id)}
                    flechas={
                      conFiltro
                        ? undefined
                        : {
                            subir: i > 0 ? () => void moverItem(i, -1) : null,
                            bajar: i < mostrados.length - 1 ? () => void moverItem(i, 1) : null,
                            deshabilitadas: reordenando,
                          }
                    }
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </>
  )
}
