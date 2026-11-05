import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import BarraSuperior from '../components/BarraSuperior'
import Cargando from '../components/Cargando'
import GrillaFotos from '../components/GrillaFotos'
import Interruptor from '../components/Interruptor'
import { useAvisos } from '../components/Avisos'
import { crearProducto, editarProducto, eliminarProducto, mensaje, obtenerProducto } from '../lib/api'
import { fotoDesdeAdmin, useFotos } from '../lib/useFotos'
import { MENSAJE_LENTO, useAvisoAlCerrar, useLento } from '../lib/util'
import type { ProductoEnvio } from '../lib/tipos'
import '../components/Formulario.css'

const MAX_FOTOS = 6
const MAX_NOMBRE = 80
const MAX_DESCRIPCION = 600

interface FilaVariante {
  clave: string
  nombre: string
  precio: string
}

let contador = 0
const filaNueva = (nombre = '', precio = ''): FilaVariante => ({ clave: `v${contador++}`, nombre, precio })
const soloNumeros = (v: string) => v.replace(/\D/g, '').slice(0, 9)
const aNumero = (v: string): number | null => (v.trim() === '' ? null : Number(v))

export default function ProductoForm() {
  const { id } = useParams()
  const esNuevo = !id
  const navigate = useNavigate()
  const { avisar, confirmar } = useAvisos()
  const onErrorFoto = useCallback((t: string) => avisar(t, 'error'), [avisar])
  const { fotos, setFotos, agregar, quitar, ponerPrimera, subiendo } = useFotos(MAX_FOTOS, onErrorFoto)

  const [cargando, setCargando] = useState(!esNuevo)
  const [errorCarga, setErrorCarga] = useState('')
  const [nombre, setNombre] = useState('')
  const [nombreGuardado, setNombreGuardado] = useState('')
  const [precio, setPrecio] = useState('')
  const [mostrarPrecio, setMostrarPrecio] = useState(true)
  const [descripcion, setDescripcion] = useState('')
  const [variantes, setVariantes] = useState<FilaVariante[]>([])
  const [verVariantes, setVerVariantes] = useState(false)
  const [activo, setActivo] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [inicial, setInicial] = useState<string | null>(esNuevo ? '' : null)
  const nombreRef = useRef<HTMLInputElement>(null)
  const ultimoPedido = useRef(0)
  const lento = useLento(guardando)

  // Estado del formulario como texto, para saber si hay cambios sin guardar
  const actual = JSON.stringify({
    nombre,
    precio,
    mostrarPrecio,
    descripcion,
    activo,
    variantes: variantes.filter((v) => v.nombre || v.precio).map((v) => [v.nombre, v.precio]),
    fotos: fotos.map((f) => f.assetId ?? f.clave),
  })
  const alAbrir = useRef(actual) // en uno nuevo, se compara con el formulario recién abierto
  const hayCambios = inicial !== null && actual !== (esNuevo ? alAbrir.current : inicial)
  useAvisoAlCerrar(hayCambios && !guardando)

  const cargar = useCallback(async () => {
    if (!id) return
    const pedido = ++ultimoPedido.current
    setCargando(true)
    setErrorCarga('')
    try {
      const p = await obtenerProducto(id)
      if (pedido !== ultimoPedido.current) return // llegó tarde: no pisa lo que ya se cargó o editó
      const filas = (p.variantes ?? []).map((v) => filaNueva(v.nombre, v.precio == null ? '' : String(v.precio)))
      const precioTexto = p.precio == null ? '' : String(p.precio)
      setNombre(p.nombre)
      setNombreGuardado(p.nombre)
      setPrecio(precioTexto)
      setMostrarPrecio(p.mostrarPrecio !== false)
      setDescripcion(p.descripcion ?? '')
      setVariantes(filas)
      setVerVariantes(filas.length > 0)
      setActivo(p.activo !== false)
      const lista = (p.imagenes ?? []).map(fotoDesdeAdmin)
      setFotos(lista)
      setInicial(
        JSON.stringify({
          nombre: p.nombre,
          precio: precioTexto,
          mostrarPrecio: p.mostrarPrecio !== false,
          descripcion: p.descripcion ?? '',
          activo: p.activo !== false,
          variantes: filas.map((v) => [v.nombre, v.precio]),
          fotos: lista.map((f) => f.assetId),
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
    navigate('/admin/productos')
  }

  const guardar = async (e: FormEvent) => {
    e.preventDefault()
    if (subiendo || guardando) return
    if (fotos.length === 0) return avisar('Agregá al menos una foto', 'error')
    if (!nombre.trim()) {
      nombreRef.current?.focus()
      return avisar('Escribí el nombre del producto', 'error')
    }
    const filas = variantes
      .map((v) => ({ nombre: v.nombre.trim(), precio: v.precio.trim() }))
      .filter((v) => v.nombre || v.precio)
    if (filas.some((v) => !v.nombre)) {
      setVerVariantes(true)
      return avisar('Cada tamaño o tono necesita un nombre', 'error')
    }

    const alt = nombre.trim()
    const datos: ProductoEnvio = {
      nombre: nombre.trim(),
      imagenes: fotos.map((f) => ({ assetId: f.assetId as string, alt })),
      mostrarPrecio,
      activo,
    }
    const numero = aNumero(precio)
    const texto = descripcion.trim()
    const listaVariantes = filas.map((v) => (v.precio ? { nombre: v.nombre, precio: Number(v.precio) } : { nombre: v.nombre }))
    if (esNuevo) {
      if (numero !== null) datos.precio = numero
      if (texto) datos.descripcion = texto
      if (listaVariantes.length) datos.variantes = listaVariantes
    } else {
      // En la edición, null borra el campo
      datos.precio = numero
      datos.descripcion = texto || null
      datos.variantes = listaVariantes.length ? listaVariantes : null
    }

    setGuardando(true)
    try {
      if (id) await editarProducto(id, datos)
      else await crearProducto(datos)
      avisar('Guardado. Puede tardar hasta un minuto en verse en la web')
      navigate('/admin/productos')
    } catch (err) {
      avisar(mensaje(err), 'error')
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    if (!id) return
    const si = await confirmar(`¿Seguro que querés eliminar «${nombreGuardado}»? No se puede deshacer`, {
      confirmar: 'Sí, eliminar',
      peligro: true,
    })
    if (!si) return
    setGuardando(true)
    try {
      await eliminarProducto(id)
      avisar('Producto eliminado')
      navigate('/admin/productos')
    } catch (err) {
      avisar(mensaje(err), 'error')
      setGuardando(false)
    }
  }

  const cambiarVariante = (clave: string, campo: 'nombre' | 'precio', valor: string) =>
    setVariantes((prev) => prev.map((v) => (v.clave === clave ? { ...v, [campo]: valor } : v)))

  const titulo = esNuevo ? 'Producto nuevo' : 'Editar producto'

  if (cargando || errorCarga) {
    return (
      <>
        <BarraSuperior titulo={titulo} volver="/admin/productos" />
        <main className="adm-contenido">
          {errorCarga ? (
            <div className="adm-error-carga adm-tarjeta">
              <p>{errorCarga}</p>
              <button type="button" className="adm-boton" onClick={() => void cargar()}>
                Probar de nuevo
              </button>
            </div>
          ) : (
            <Cargando texto="Cargando producto…" />
          )}
        </main>
      </>
    )
  }

  return (
    <>
      <BarraSuperior titulo={titulo} volver={() => void volver()} />
      <form className="adm-contenido adm-contenido--con-pie" onSubmit={guardar} noValidate>
        <section className="adm-seccion adm-seccion--fotos adm-tarjeta" aria-labelledby="adm-titulo-fotos">
          <h2 id="adm-titulo-fotos" className="adm-seccion__titulo">
            Fotos
          </h2>
          <p className="adm-seccion__ayuda">La primera foto es la que se ve en el catálogo. Podés cargar hasta {MAX_FOTOS}.</p>
          <GrillaFotos
            fotos={fotos}
            maximo={MAX_FOTOS}
            onAgregar={(archivos) => void agregar(archivos, fotos.length)}
            onQuitar={quitar}
            onPonerPrimera={ponerPrimera}
          />
        </section>

        <section className="adm-seccion adm-tarjeta">
          <div className="adm-campo">
            <label className="adm-etiqueta" htmlFor="adm-nombre">
              Nombre
            </label>
            <input
              ref={nombreRef}
              id="adm-nombre"
              className="adm-input"
              value={nombre}
              maxLength={MAX_NOMBRE}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej.: Shampoo reparador"
              required
            />
          </div>

          <div className="adm-campo">
            <label className="adm-etiqueta" htmlFor="adm-precio">
              Precio <small>(opcional)</small>
            </label>
            <div className="adm-precio">
              <span className="adm-precio__signo" aria-hidden="true">
                $
              </span>
              <input
                id="adm-precio"
                className="adm-input"
                inputMode="numeric"
                pattern="[0-9]*"
                value={precio}
                onChange={(e) => setPrecio(soloNumeros(e.target.value))}
                placeholder="Ej.: 15000"
              />
            </div>
          </div>
          <Interruptor texto="Mostrar el precio en la web" activo={mostrarPrecio} onChange={setMostrarPrecio} />

          <div className="adm-campo">
            <label className="adm-etiqueta" htmlFor="adm-descripcion">
              Descripción <small>(opcional)</small>
            </label>
            <textarea
              id="adm-descripcion"
              className="adm-input"
              value={descripcion}
              maxLength={MAX_DESCRIPCION}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Para qué sirve, cómo se usa…"
              aria-describedby="adm-descripcion-contador"
            />
            <span id="adm-descripcion-contador" className="adm-contador">
              {descripcion.length} / {MAX_DESCRIPCION}
            </span>
          </div>
        </section>

        <section className="adm-plegable adm-tarjeta">
          <button
            type="button"
            className="adm-plegable__boton"
            aria-expanded={verVariantes}
            aria-controls="adm-variantes"
            onClick={() => {
              if (!verVariantes && variantes.length === 0) setVariantes([filaNueva()])
              setVerVariantes((v) => !v)
            }}
          >
            ¿Tiene tamaños o tonos?
            {verVariantes ? <ChevronUp size={22} aria-hidden="true" /> : <ChevronDown size={22} aria-hidden="true" />}
          </button>
          {verVariantes && (
            <div id="adm-variantes" className="adm-plegable__cuerpo">
              <p className="adm-seccion__ayuda">Por ejemplo «500 ml» o «Rubio ceniza». El precio es opcional.</p>
              {variantes.map((v, i) => (
                <div key={v.clave} className="adm-variante">
                  <div className="adm-campo">
                    <label className="adm-etiqueta" htmlFor={`adm-var-nombre-${v.clave}`}>
                      Nombre
                    </label>
                    <input
                      id={`adm-var-nombre-${v.clave}`}
                      className="adm-input"
                      value={v.nombre}
                      onChange={(e) => cambiarVariante(v.clave, 'nombre', e.target.value)}
                      placeholder={i === 0 ? 'Ej.: 500 ml' : ''}
                    />
                  </div>
                  <div className="adm-campo">
                    <label className="adm-etiqueta" htmlFor={`adm-var-precio-${v.clave}`}>
                      Precio
                    </label>
                    <div className="adm-precio">
                      <span className="adm-precio__signo" aria-hidden="true">
                        $
                      </span>
                      <input
                        id={`adm-var-precio-${v.clave}`}
                        className="adm-input"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={v.precio}
                        onChange={(e) => cambiarVariante(v.clave, 'precio', soloNumeros(e.target.value))}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="adm-link adm-variante__quitar"
                    onClick={() => setVariantes((prev) => prev.filter((x) => x.clave !== v.clave))}
                  >
                    Quitar
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="adm-boton adm-boton--secundario adm-boton--ancho"
                onClick={() => setVariantes((prev) => [...prev, filaNueva()])}
              >
                <Plus size={20} aria-hidden="true" /> Agregar otro
              </button>
            </div>
          )}
        </section>

        <Interruptor texto="Se ve en la web" ayuda="Si lo apagás, queda guardado pero oculto" activo={activo} onChange={setActivo} />

        {!esNuevo && (
          <button type="button" className="adm-boton adm-boton--peligro adm-eliminar" onClick={() => void eliminar()} disabled={guardando}>
            Eliminar producto
          </button>
        )}

        <div className="adm-pie">
          <div className="adm-pie__interno">
            {lento && <p className="adm-pie__lento">{MENSAJE_LENTO}</p>}
            {subiendo && !lento && <p className="adm-pie__lento">Esperá a que terminen de subir las fotos…</p>}
            <button type="submit" className="adm-boton" disabled={subiendo || guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
