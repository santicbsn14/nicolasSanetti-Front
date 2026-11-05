import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Camera } from 'lucide-react'
import BarraSuperior from '../components/BarraSuperior'
import Cargando from '../components/Cargando'
import Interruptor from '../components/Interruptor'
import { useAvisos } from '../components/Avisos'
import { crearTrabajo, editarTrabajo, eliminarTrabajo, mensaje, obtenerTrabajo } from '../lib/api'
import { fotoDesdeAdmin, useFotos } from '../lib/useFotos'
import { MENSAJE_LENTO, fotoAncha, nombreServicio, useAvisoAlCerrar, useLento } from '../lib/util'
import { SERVICIOS, type ServicioSlug } from '../../../lib/sanity.types'
import type { TrabajoEnvio } from '../lib/tipos'
import '../components/Formulario.css'

const MAX_DESCRIPCION = 140

export default function TrabajoForm() {
  const { id } = useParams()
  const esNuevo = !id
  const navigate = useNavigate()
  const { avisar, confirmar } = useAvisos()
  const onErrorFoto = useCallback((t: string) => avisar(t, 'error'), [avisar])
  const { fotos, setFotos, agregar, subiendo } = useFotos(1, onErrorFoto, true)
  const foto = fotos[0] ?? null

  const [cargando, setCargando] = useState(!esNuevo)
  const [errorCarga, setErrorCarga] = useState('')
  const [servicio, setServicio] = useState<ServicioSlug | null>(null)
  const [descripcion, setDescripcion] = useState('')
  const [destacado, setDestacado] = useState(false)
  const [activo, setActivo] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [inicial, setInicial] = useState<string | null>(esNuevo ? '' : null)
  const input = useRef<HTMLInputElement>(null)
  const ultimoPedido = useRef(0)
  const lento = useLento(guardando)

  const actual = JSON.stringify({ servicio, descripcion, destacado, activo, foto: foto ? (foto.assetId ?? foto.clave) : null })
  const alAbrir = useRef(actual)
  const hayCambios = inicial !== null && actual !== (esNuevo ? alAbrir.current : inicial)
  useAvisoAlCerrar(hayCambios && !guardando)

  const cargar = useCallback(async () => {
    if (!id) return
    const pedido = ++ultimoPedido.current
    setCargando(true)
    setErrorCarga('')
    try {
      const t = await obtenerTrabajo(id)
      if (pedido !== ultimoPedido.current) return // llegó tarde: no pisa lo que ya se cargó o editó
      const lista = t.imagen ? [fotoDesdeAdmin(t.imagen)] : []
      setFotos(lista)
      setServicio(t.servicio)
      setDescripcion(t.descripcion ?? '')
      setDestacado(t.destacado === true)
      setActivo(t.activo !== false)
      setInicial(
        JSON.stringify({
          servicio: t.servicio,
          descripcion: t.descripcion ?? '',
          destacado: t.destacado === true,
          activo: t.activo !== false,
          foto: lista[0]?.assetId ?? null,
        }),
      )
    } catch (e) {
      if (pedido === ultimoPedido.current) setErrorCarga(mensaje(e))
    } finally {
      if (pedido === ultimoPedido.current) setCargando(false)
    }
  }, [id, setFotos])

  useEffect(() => {
    void cargar()
  }, [cargar])

  const volver = async () => {
    if (hayCambios && !(await confirmar('Tenés cambios sin guardar. ¿Salir igual?', { confirmar: 'Salir sin guardar', peligro: true })))
      return
    navigate('/admin/galeria')
  }

  const guardar = async (e: FormEvent) => {
    e.preventDefault()
    if (subiendo || guardando) return
    if (!foto?.assetId) return avisar('Elegí la foto del trabajo', 'error')
    if (!servicio) return avisar('Elegí qué servicio es', 'error')

    const texto = descripcion.trim()
    const datos: TrabajoEnvio = {
      imagen: { assetId: foto.assetId, alt: texto || nombreServicio(servicio) },
      servicio,
      destacado,
      activo,
    }
    if (id) datos.descripcion = texto || null
    else if (texto) datos.descripcion = texto

    setGuardando(true)
    try {
      if (id) await editarTrabajo(id, datos)
      else await crearTrabajo(datos)
      avisar('Guardado. Puede tardar hasta un minuto en verse en la web')
      navigate('/admin/galeria')
    } catch (err) {
      avisar(mensaje(err), 'error')
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    if (!id) return
    const si = await confirmar('¿Seguro que querés eliminar esta foto? No se puede deshacer', {
      confirmar: 'Sí, eliminar',
      peligro: true,
    })
    if (!si) return
    setGuardando(true)
    try {
      await eliminarTrabajo(id)
      avisar('Foto eliminada')
      navigate('/admin/galeria')
    } catch (err) {
      avisar(mensaje(err), 'error')
      setGuardando(false)
    }
  }

  const titulo = esNuevo ? 'Foto nueva' : 'Editar foto'

  if (cargando || errorCarga) {
    return (
      <>
        <BarraSuperior titulo={titulo} volver="/admin/galeria" />
        <main className="adm-contenido">
          {errorCarga ? (
            <div className="adm-error-carga adm-tarjeta">
              <p>{errorCarga}</p>
              <button type="button" className="adm-boton" onClick={() => void cargar()}>
                Probar de nuevo
              </button>
            </div>
          ) : (
            <Cargando texto="Cargando foto…" />
          )}
        </main>
      </>
    )
  }

  return (
    <>
      <BarraSuperior titulo={titulo} volver={() => void volver()} />
      <form className="adm-contenido adm-contenido--con-pie" onSubmit={guardar} noValidate>
        <section className="adm-seccion adm-seccion--fotos adm-tarjeta" aria-labelledby="adm-titulo-foto">
          <h2 id="adm-titulo-foto" className="adm-seccion__titulo">
            Foto
          </h2>
          <p className="adm-seccion__ayuda">Una foto del trabajo terminado.</p>
          {foto && (
            <div className="adm-foto-unica">
              <img src={foto.url.startsWith('blob:') ? foto.url : fotoAncha(foto.url)} alt="Foto del trabajo" />
              {foto.subiendo && (
                <span className="adm-fotos__subiendo" role="status">
                  <span className="adm-ruedita adm-ruedita--chica" aria-hidden="true" />
                  Subiendo…
                </span>
              )}
            </div>
          )}
          <input
            ref={input}
            type="file"
            accept="image/*"
            className="adm-sr"
            tabIndex={-1}
            onChange={(e) => {
              const archivos = Array.from(e.target.files ?? [])
              e.target.value = ''
              if (archivos.length) void agregar(archivos, 0)
            }}
          />
          <button
            type="button"
            className="adm-boton adm-boton--secundario adm-boton--ancho"
            onClick={() => input.current?.click()}
            disabled={subiendo}
          >
            <Camera size={22} aria-hidden="true" />
            {foto ? 'Cambiar foto' : 'Elegir foto'}
          </button>
        </section>

        <section className="adm-seccion adm-tarjeta">
          <fieldset className="adm-campo adm-opciones" role="radiogroup" aria-labelledby="adm-titulo-servicio">
            <legend id="adm-titulo-servicio" className="adm-etiqueta adm-opciones__titulo">
              Servicio
            </legend>
            {SERVICIOS.map((s) => (
              <button
                key={s.slug}
                type="button"
                role="radio"
                aria-checked={servicio === s.slug}
                className="adm-opcion"
                onClick={() => setServicio(s.slug)}
              >
                <span className="adm-opcion__circulo" aria-hidden="true" />
                {s.nombre}
              </button>
            ))}
          </fieldset>

          <div className="adm-campo">
            <label className="adm-etiqueta" htmlFor="adm-trabajo-descripcion">
              Descripción <small>(opcional)</small>
            </label>
            <textarea
              id="adm-trabajo-descripcion"
              className="adm-input"
              value={descripcion}
              maxLength={MAX_DESCRIPCION}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej.: Balayage con matiz cenizo"
              aria-describedby="adm-trabajo-contador"
            />
            <span id="adm-trabajo-contador" className="adm-contador">
              {descripcion.length} / {MAX_DESCRIPCION}
            </span>
          </div>
        </section>

        <Interruptor texto="Destacar" ayuda="Aparece primero en la galería" activo={destacado} onChange={setDestacado} />
        <Interruptor texto="Se ve en la web" ayuda="Si lo apagás, queda guardada pero oculta" activo={activo} onChange={setActivo} />

        {!esNuevo && (
          <button type="button" className="adm-boton adm-boton--peligro adm-eliminar" onClick={() => void eliminar()} disabled={guardando}>
            Eliminar foto
          </button>
        )}

        <div className="adm-pie">
          <div className="adm-pie__interno">
            {lento && <p className="adm-pie__lento">{MENSAJE_LENTO}</p>}
            {subiendo && !lento && <p className="adm-pie__lento">Esperá a que termine de subir la foto…</p>}
            <button type="submit" className="adm-boton" disabled={subiendo || guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
