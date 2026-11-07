import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { client } from '../../lib/sanity'
import { PRODUCTOS_POR_IDS_QUERY } from '../../lib/sanity.queries'
import type { ProductoParaPedido } from '../../lib/sanity.types'
import { buildWaLink } from '../../features/whatsapp/whatsapp'
import {
  actualizarItems,
  cambiarCantidad,
  quitar,
  useCarrito,
  vaciar,
} from '../../features/pedido/carrito'
import { formatoPrecio } from '../../features/pedido/formato'
import { claveItem, precioVisible, subtotal, type ItemPedido } from '../../features/pedido/items'
import {
  armarMensajePedido,
  ENTREGAS,
  nombreConVariante,
  textoTotal,
  type Entrega,
} from '../../features/pedido/mensaje'
import Cantidad from './Cantidad'
import { altProducto, CONSULTAR, imagenCuadrada, precioDe, tituloPagina } from './productos.utils'
import '../Home/Hero.css'
import './Productos.css'
import './Pedido.css'

const CLAVE_CLIENTE = 'nsc-pedido-cliente-v1'
const MAX_COMENTARIO = 300

interface DatosCliente {
  nombre: string
  entrega: Entrega
}

function leerCliente(): DatosCliente {
  try {
    const d = JSON.parse(window.localStorage.getItem(CLAVE_CLIENTE) ?? 'null') as Partial<DatosCliente> | null
    return {
      nombre: typeof d?.nombre === 'string' ? d.nombre.slice(0, 60) : '',
      entrega: d?.entrega === 'envio' ? 'envio' : 'retiro',
    }
  } catch {
    return { nombre: '', entrega: 'retiro' }
  }
}

function guardarCliente(d: DatosCliente) {
  try {
    window.localStorage.setItem(CLAVE_CLIENTE, JSON.stringify(d))
  } catch {
    // sin storage: no se recuerda, no pasa nada
  }
}

type Revision = 'revisando' | 'ok' | 'error'

// Revalida el pedido guardado contra Sanity: nombre, foto y precio frescos; marca lo que ya no está
function useRevalidacion(items: ItemPedido[]) {
  const [revision, setRevision] = useState<Revision>('revisando')
  const [noDisponibles, setNoDisponibles] = useState<ReadonlySet<string>>(() => new Set())
  const [avisos, setAvisos] = useState<string[]>([])

  const ids = useMemo(() => [...new Set(items.map((i) => i.productoId))].sort(), [items])
  const idsClave = ids.join('|')

  useEffect(() => {
    if (!idsClave) {
      setRevision('ok')
      return
    }
    let vigente = true
    client
      .fetch<ProductoParaPedido[]>(PRODUCTOS_POR_IDS_QUERY, { ids: idsClave.split('|') })
      .then((productos) => {
        if (!vigente) return
        const porId = new Map((productos ?? []).map((p) => [p._id, p]))
        const faltan = new Set<string>()
        const cambios: string[] = []

        actualizarItems((actuales) =>
          actuales.map((i) => {
            const p = porId.get(i.productoId)
            const v = i.varianteKey ? p?.variantes?.find((x) => x._key === i.varianteKey) : null
            if (!p || (i.varianteKey && !v)) {
              faltan.add(claveItem(i))
              return i
            }
            const fresco: ItemPedido = {
              ...i,
              slug: p.slug,
              nombre: p.nombre,
              imagen: p.imagen ?? i.imagen,
              precio: precioDe(p, v),
              mostrarPrecio: p.mostrarPrecio,
            }
            if (v) fresco.varianteNombre = v.nombre
            if (precioVisible(fresco) !== precioVisible(i)) {
              cambios.push(`Actualizamos el precio de ${nombreConVariante(fresco)}`)
            }
            return fresco
          }),
        )

        setNoDisponibles(faltan)
        if (cambios.length) setAvisos((a) => [...new Set([...a, ...cambios])])
        setRevision('ok')
      })
      .catch(() => vigente && setRevision('error'))
    return () => {
      vigente = false
    }
  }, [idsClave])

  return { revision, noDisponibles, avisos }
}

function Pedido() {
  const { items } = useCarrito()
  const { revision, noDisponibles, avisos } = useRevalidacion(items)
  const [cliente, setCliente] = useState<DatosCliente>(leerCliente)
  const [comentario, setComentario] = useState('')
  const [errorNombre, setErrorNombre] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const nombreRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const anterior = document.title
    document.title = tituloPagina('Tu pedido')
    return () => {
      document.title = anterior
    }
  }, [])

  const cambiarCliente = (cambio: Partial<DatosCliente>) => {
    setCliente((c) => {
      const nuevo = { ...c, ...cambio }
      guardarCliente(nuevo)
      return nuevo
    })
  }

  const disponibles = items.filter((i) => !noDisponibles.has(claveItem(i)))
  const total = textoTotal(disponibles)

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    if (!cliente.nombre.trim()) {
      setErrorNombre(true)
      nombreRef.current?.focus()
      return
    }
    if (disponibles.length === 0) return
    const mensaje = armarMensajePedido({
      items: disponibles,
      nombre: cliente.nombre,
      entrega: cliente.entrega,
      comentario,
    })
    window.open(buildWaLink(mensaje), '_blank', 'noopener,noreferrer')
    setEnviado(true)
  }

  if (items.length === 0) {
    return (
      <main className="productos pedido">
        <div className="pedido__caja">
          <h1 className="hero__titulo pedido__titulo">Tu pedido</h1>
          <div className="productos-aviso">
            <p>Tu pedido está vacío.</p>
            <Link to="/productos" className="hero__btn hero__btn--primario">
              Ver productos
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="productos pedido">
      <div className="pedido__caja">
        <Link to="/productos" className="producto-detalle__volver pedido__volver">
          ← Seguir viendo productos
        </Link>
        <h1 className="hero__titulo pedido__titulo">Tu pedido</h1>

        <div className="pedido__avisos" role="status" aria-live="polite">
          {avisos.map((a) => (
            <p key={a} className="pedido__aviso">
              {a}
            </p>
          ))}
          {revision === 'error' && (
            <p className="pedido__aviso pedido__aviso--error">
              No pudimos revisar los precios. Igual podés mandar el pedido y Nico te confirma.
            </p>
          )}
        </div>

        <ul className="pedido-lista" aria-label="Productos del pedido">
          {items.map((i) => (
            <Linea key={claveItem(i)} item={i} noDisponible={noDisponibles.has(claveItem(i))} />
          ))}
        </ul>

        {total && (
          <p className="pedido-total">
            <span>Total</span>
            <strong>{total}</strong>
          </p>
        )}

        <form className="pedido-form" onSubmit={enviar} noValidate>
          <h2 className="pedido-form__titulo">Tus datos</h2>

          <div className="pedido-campo">
            <label htmlFor="pedido-nombre">Tu nombre</label>
            <input
              ref={nombreRef}
              id="pedido-nombre"
              type="text"
              autoComplete="given-name"
              maxLength={60}
              required
              aria-invalid={errorNombre || undefined}
              aria-describedby={errorNombre ? 'pedido-nombre-error' : undefined}
              value={cliente.nombre}
              onChange={(e) => {
                cambiarCliente({ nombre: e.target.value })
                if (e.target.value.trim()) setErrorNombre(false)
              }}
            />
            {errorNombre && (
              <p id="pedido-nombre-error" className="pedido-campo__error">
                Escribí tu nombre para que Nico sepa de quién es el pedido.
              </p>
            )}
          </div>

          <fieldset className="pedido-campo pedido-entrega">
            <legend>¿Cómo lo querés recibir?</legend>
            <div className="pedido-entrega__opciones">
              {ENTREGAS.map((op) => (
                <label
                  key={op.valor}
                  className={`pedido-entrega__opcion${cliente.entrega === op.valor ? ' pedido-entrega__opcion--activa' : ''}`}
                >
                  <input
                    type="radio"
                    name="entrega"
                    value={op.valor}
                    checked={cliente.entrega === op.valor}
                    onChange={() => cambiarCliente({ entrega: op.valor })}
                  />
                  {op.texto}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="pedido-campo">
            <label htmlFor="pedido-comentario">
              Comentario <span className="pedido-campo__opcional">(opcional)</span>
            </label>
            <textarea
              id="pedido-comentario"
              rows={3}
              maxLength={MAX_COMENTARIO}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              aria-describedby="pedido-comentario-cuenta"
            />
            <p id="pedido-comentario-cuenta" className="pedido-campo__cuenta">
              {comentario.length}/{MAX_COMENTARIO}
            </p>
          </div>

          <button
            type="submit"
            className="hero__btn hero__btn--primario pedido-enviar"
            disabled={revision === 'revisando' || disponibles.length === 0}
          >
            {revision === 'revisando' ? 'Revisando precios…' : 'Enviar pedido por WhatsApp'}
          </button>
          {disponibles.length === 0 && revision !== 'revisando' && (
            <p className="pedido-campo__error">Ninguno de estos productos está disponible ahora.</p>
          )}
        </form>

        {enviado && (
          <div className="pedido-enviado" role="status">
            <p>¿Ya mandaste el mensaje? Podés vaciar el pedido.</p>
            <button
              type="button"
              className="hero__btn hero__btn--secundario productos-btn-reset"
              onClick={() => {
                vaciar()
                setEnviado(false)
                setComentario('')
              }}
            >
              Vaciar pedido
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

function Linea({ item: i, noDisponible }: { item: ItemPedido; noDisponible: boolean }) {
  const clave = claveItem(i)
  const unitario = precioVisible(i)
  const sub = subtotal(i)
  const foto = i.imagen ? imagenCuadrada(i.imagen, [96, 192]) : null
  const nombre = nombreConVariante(i)

  return (
    <li className={`pedido-item${noDisponible ? ' pedido-item--no-disponible' : ''}`}>
      <span className="pedido-item__foto">
        {foto && <img src={foto.src} srcSet={foto.srcSet} sizes="72px" alt={altProducto(i.nombre, i.imagen)} />}
      </span>

      <div className="pedido-item__datos">
        {noDisponible ? (
          <span className="pedido-item__nombre">{i.nombre}</span>
        ) : (
          <Link to={`/productos/${encodeURIComponent(i.slug)}`} className="pedido-item__nombre">
            {i.nombre}
          </Link>
        )}
        {i.varianteNombre && <span className="pedido-item__variante">{i.varianteNombre}</span>}
        {noDisponible ? (
          <span className="pedido-item__estado">Ya no está disponible</span>
        ) : (
          <span className="pedido-item__unitario">
            {unitario === null ? CONSULTAR : `${formatoPrecio(unitario)} c/u`}
          </span>
        )}
      </div>

      <div className="pedido-item__acciones">
        {!noDisponible && (
          <Cantidad
            chico
            valor={i.cantidad}
            onCambiar={(n) => cambiarCantidad(clave, n)}
            etiqueta={`Cantidad de ${nombre}`}
          />
        )}
        {!noDisponible && sub !== null && <span className="pedido-item__subtotal">{formatoPrecio(sub)}</span>}
        <button
          type="button"
          className="pedido-item__quitar"
          aria-label={`Quitar ${nombre}`}
          onClick={() => quitar(clave)}
        >
          Quitar
        </button>
      </div>
    </li>
  )
}

export default Pedido
