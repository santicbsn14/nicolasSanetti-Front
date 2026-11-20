import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { client } from '../../lib/sanity'
import { PRODUCTO_POR_SLUG_QUERY } from '../../lib/sanity.queries'
import type { Producto, SanityImagen, Variante } from '../../lib/sanity.types'
import { buildWaLink } from '../../features/whatsapp/whatsapp'
import { agregar } from '../../features/pedido/carrito'
import { precioVisible } from '../../features/pedido/items'
import { formatoPrecio } from '../../features/pedido/formato'
import BarraPedido from './BarraPedido'
import { useAviso } from './useAviso'
import Cantidad from './Cantidad'
import {
  altProducto,
  imagenCuadrada,
  imagenDetalle,
  itemDe,
  precioDe,
  SIZES_DETALLE,
  textoPrecioTarjeta,
  textoPrecioUnitario,
  tieneVariantes,
  tituloPagina,
} from './productos.utils'
import '../Home/Hero.css'
import './Productos.css'
import './ProductoDetalle.css'

// Deslizar: mismo umbral que el visor de la galería (50 px y claramente más horizontal que vertical)
const UMBRAL_SWIPE = 50

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'no-disponible' }
  | { estado: 'ok'; producto: Producto }

function mensajeConsulta(nombre: string, variante?: string | null): string {
  return `¡Hola Nico! Quería consultar por el producto «${nombre}»${variante ? ` (${variante})` : ''}.`
}

// Al pasar de un producto a otro se vuelve a montar (estado limpio)
function ProductoDetallePagina() {
  const { slug = '' } = useParams()
  return <ProductoDetalle key={slug} slug={slug} />
}

function ProductoDetalle({ slug }: { slug: string }) {
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' })
  const [intento, setIntento] = useState(0)
  const [aviso, avisar] = useAviso()

  useEffect(() => {
    let vigente = true
    client
      .fetch<Producto | null>(PRODUCTO_POR_SLUG_QUERY, { slug })
      .then((p) => {
        if (!vigente) return
        setCarga(p ? { estado: 'ok', producto: p } : { estado: 'no-disponible' })
      })
      .catch(() => vigente && setCarga({ estado: 'error' }))
    return () => {
      vigente = false
    }
  }, [slug, intento])

  const nombre = carga.estado === 'ok' ? carga.producto.nombre : null
  useEffect(() => {
    const anterior = document.title
    document.title = tituloPagina(
      nombre ?? (carga.estado === 'no-disponible' ? 'Producto no disponible' : 'Productos'),
    )
    return () => {
      document.title = anterior
    }
  }, [nombre, carga.estado])

  return (
    <main className="productos producto-detalle">
      <div className="producto-detalle__caja">
        <Link to="/productos" className="producto-detalle__volver">
          ← Volver a productos
        </Link>

        {carga.estado === 'cargando' && <DetalleCargando />}

        {carga.estado === 'error' && (
          <div className="productos-aviso" role="alert">
            <p>No pudimos cargar el producto.</p>
            <button
              type="button"
              className="hero__btn hero__btn--secundario productos-btn-reset"
              onClick={() => {
                setCarga({ estado: 'cargando' })
                setIntento((n) => n + 1)
              }}
            >
              Probar de nuevo
            </button>
          </div>
        )}

        {carga.estado === 'no-disponible' && (
          <div className="productos-aviso">
            <h1 className="producto-detalle__no-disponible">Este producto ya no está disponible.</h1>
            <Link to="/productos" className="hero__btn hero__btn--primario">
              Ver todos los productos
            </Link>
          </div>
        )}

        {carga.estado === 'ok' && (
          <Ficha producto={carga.producto} onAgregado={avisar} />
        )}
      </div>

      <BarraPedido aviso={aviso} />
    </main>
  )
}

function Ficha({ producto: p, onAgregado }: { producto: Producto; onAgregado: (nombre: string) => void }) {
  const variantes = p.variantes ?? []
  // Con una sola variante, ya viene elegida (no hay nada que elegir)
  const [elegida, setElegida] = useState<string | null>(variantes.length === 1 ? variantes[0]._key : null)
  const [cantidad, setCantidad] = useState(1)
  const variante = variantes.find((v) => v._key === elegida) ?? null
  const faltaElegir = tieneVariantes(p) && !variante

  const precio = variante ? textoPrecioUnitario(p, variante) : textoPrecioTarjeta(p)
  const descripcion = p.descripcion?.trim()
  const imagenes = p.imagenes ?? []

  const agregarAlPedido = () => {
    if (faltaElegir) return
    agregar(itemDe(p, imagenes[0] ?? null, variante, cantidad))
    onAgregado(variante ? `${p.nombre} (${variante.nombre})` : p.nombre)
  }

  return (
    <div className="producto-ficha">
      <Fotos nombre={p.nombre} imagenes={imagenes} />

      <div className="producto-ficha__info">
        <h1 className="producto-ficha__nombre">{p.nombre}</h1>
        <p className="producto-ficha__precio" aria-live="polite">
          {precio}
        </p>

        {descripcion && <p className="producto-ficha__descripcion">{descripcion}</p>}

        {variantes.length > 0 && (
          <Variantes producto={p} variantes={variantes} elegida={elegida} onElegir={setElegida} />
        )}

        <div className="producto-ficha__cantidad">
          <span className="producto-ficha__etiqueta" aria-hidden="true">
            Cantidad
          </span>
          <Cantidad valor={cantidad} onCambiar={setCantidad} etiqueta={`Cantidad de ${p.nombre}`} />
        </div>

        <div className="producto-ficha__acciones">
          <button
            type="button"
            className="hero__btn hero__btn--primario producto-ficha__agregar"
            disabled={faltaElegir}
            onClick={agregarAlPedido}
          >
            {faltaElegir ? 'Elegí un tamaño o tono' : 'Agregar al pedido'}
          </button>
          <a
            className="hero__btn hero__btn--secundario producto-ficha__consultar"
            href={buildWaLink(mensajeConsulta(p.nombre, variante?.nombre))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

interface VariantesProps {
  producto: Producto
  variantes: Variante[]
  elegida: string | null
  onElegir: (key: string) => void
}

// Chips con flechas del teclado (patrón radiogroup: Tab entra al grupo, ← → cambian)
function Variantes({ producto, variantes, elegida, onElegir }: VariantesProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const indiceElegida = variantes.findIndex((v) => v._key === elegida)

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const n = variantes.length
    let destino = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') destino = (i + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') destino = (i - 1 + n) % n
    else if (e.key === 'Home') destino = 0
    else if (e.key === 'End') destino = n - 1
    if (destino < 0) return
    e.preventDefault()
    onElegir(variantes[destino]._key)
    refs.current[destino]?.focus()
  }

  return (
    <div className="producto-variantes">
      <span className="producto-ficha__etiqueta" id="variantes-etiqueta">
        Tamaño o tono
      </span>
      <div className="producto-variantes__lista" role="radiogroup" aria-labelledby="variantes-etiqueta">
        {variantes.map((v, i) => {
          const activa = v._key === elegida
          const precio = precioVisible({ precio: precioDe(producto, v), mostrarPrecio: producto.mostrarPrecio })
          return (
            <button
              key={v._key}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={activa}
              tabIndex={activa || (indiceElegida < 0 && i === 0) ? 0 : -1}
              className={`producto-variante${activa ? ' producto-variante--activa' : ''}`}
              onClick={() => onElegir(v._key)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="producto-variante__nombre">{v.nombre}</span>
              {precio !== null && <span className="producto-variante__precio">{formatoPrecio(precio)}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Fotos({ nombre, imagenes }: { nombre: string; imagenes: SanityImagen[] }) {
  const [indice, setIndice] = useState(0)
  const toqueRef = useRef<{ x: number; y: number } | null>(null)
  const actual = imagenes[indice] ?? imagenes[0]
  const varias = imagenes.length > 1

  const ir = (i: number) => {
    if (i >= 0 && i < imagenes.length) setIndice(i)
  }

  const onTouchStart = (e: TouchEvent) => {
    toqueRef.current = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null
  }
  const onTouchEnd = (e: TouchEvent) => {
    const inicio = toqueRef.current
    toqueRef.current = null
    if (!varias || !inicio || e.changedTouches.length !== 1) return
    const dx = e.changedTouches[0].clientX - inicio.x
    const dy = e.changedTouches[0].clientY - inicio.y
    if (Math.abs(dx) < UMBRAL_SWIPE || Math.abs(dx) < Math.abs(dy) * 1.5) return
    ir(dx < 0 ? indice + 1 : indice - 1)
  }

  if (!actual) return <div className="producto-fotos__principal" />

  const grande = imagenDetalle(actual)

  return (
    <div className="producto-fotos">
      <div
        className="producto-fotos__principal"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => (toqueRef.current = null)}
      >
        <img
          key={actual.asset._ref + indice}
          src={grande.src}
          srcSet={grande.srcSet}
          sizes={SIZES_DETALLE}
          alt={altProducto(nombre, actual, indice + 1)}
          draggable={false}
        />
        {varias && (
          <span className="producto-fotos__contador" aria-hidden="true">
            {indice + 1} / {imagenes.length}
          </span>
        )}
      </div>

      {varias && (
        <ul className="producto-fotos__miniaturas">
          {imagenes.map((img, i) => {
            const mini = imagenCuadrada(img, [120, 240])
            return (
              <li key={img._key ?? i}>
                <button
                  type="button"
                  className={`producto-fotos__mini${i === indice ? ' producto-fotos__mini--activa' : ''}`}
                  aria-label={`Ver foto ${i + 1} de ${imagenes.length}`}
                  aria-current={i === indice ? 'true' : undefined}
                  onClick={() => ir(i)}
                >
                  <img src={mini.src} srcSet={mini.srcSet} sizes="72px" alt="" loading="lazy" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function DetalleCargando() {
  return (
    <div className="producto-ficha" aria-hidden="true">
      <span className="producto-fotos__principal productos-skeleton" />
      <div className="producto-ficha__info">
        <span className="productos-skeleton productos-skeleton--linea" style={{ height: 28, width: '70%' }} />
        <span className="productos-skeleton productos-skeleton--linea productos-skeleton--corta" />
        <span className="productos-skeleton productos-skeleton--linea" />
        <span className="productos-skeleton productos-skeleton--linea" />
      </div>
    </div>
  )
}

export default ProductoDetallePagina
