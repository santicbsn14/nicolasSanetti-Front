import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client } from '../../lib/sanity'
import { PRODUCTOS_QUERY } from '../../lib/sanity.queries'
import type { ProductoResumen } from '../../lib/sanity.types'
import { buildWaLink } from '../../features/whatsapp/whatsapp'
import { agregar } from '../../features/pedido/carrito'
import BarraPedido from './BarraPedido'
import { useAviso } from './useAviso'
import {
  altProducto,
  imagenCuadrada,
  itemDeResumen,
  SIZES_TARJETA,
  textoPrecioTarjeta,
  tieneVariantes,
  tituloPagina,
} from './productos.utils'
// Eyebrow, título y botones usan las mismas clases que la portada
import '../Home/Hero.css'
import './Productos.css'

const MENSAJE_CONSULTA = '¡Hola Nico! Quería consultar por los productos que vendés.'

// Las primeras fotos se ven sin scrollear: van sin lazy
const SIN_LAZY = 4

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'ok'; productos: ProductoResumen[] }

function Productos() {
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' })
  const [intento, setIntento] = useState(0)
  const [aviso, avisar] = useAviso()

  useEffect(() => {
    const anterior = document.title
    document.title = tituloPagina('Productos')
    return () => {
      document.title = anterior
    }
  }, [])

  useEffect(() => {
    let vigente = true
    client
      .fetch<ProductoResumen[]>(PRODUCTOS_QUERY)
      .then((productos) => vigente && setCarga({ estado: 'ok', productos: productos ?? [] }))
      .catch(() => vigente && setCarga({ estado: 'error' }))
    return () => {
      vigente = false
    }
  }, [intento])

  const reintentar = () => {
    setCarga({ estado: 'cargando' })
    setIntento((n) => n + 1)
  }

  const agregarProducto = (p: ProductoResumen) => {
    agregar(itemDeResumen(p))
    avisar(p.nombre)
  }

  return (
    <main className="productos">
      <header className="productos-encabezado">
        <p className="hero__eyebrow">
          <span className="hero__dot" aria-hidden="true">•</span>
          Productos
          <span className="hero__dot" aria-hidden="true">•</span>
        </p>
        <h1 className="hero__titulo">Productos</h1>
        <p className="productos-bajada">
          Productos para el cuidado de tu pelo. Armá tu pedido y lo coordinamos por WhatsApp.
        </p>
      </header>

      <section className="productos-cuerpo" aria-label="Lista de productos" aria-busy={carga.estado === 'cargando'}>
        {carga.estado === 'cargando' && <GrillaCargando />}

        {carga.estado === 'error' && (
          <div className="productos-aviso" role="alert">
            <p>No pudimos cargar los productos.</p>
            <button type="button" className="hero__btn hero__btn--secundario productos-btn-reset" onClick={reintentar}>
              Probar de nuevo
            </button>
          </div>
        )}

        {carga.estado === 'ok' && carga.productos.length === 0 && (
          <div className="productos-aviso">
            <p>Muy pronto vas a ver acá nuestros productos.</p>
            <a
              className="hero__btn hero__btn--primario"
              href={buildWaLink(MENSAJE_CONSULTA)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultanos por WhatsApp
            </a>
          </div>
        )}

        {carga.estado === 'ok' && carga.productos.length > 0 && (
          <ul className="productos-grilla">
            {carga.productos.map((p, i) => (
              <Tarjeta key={p._id} producto={p} prioridad={i < SIN_LAZY} onAgregar={agregarProducto} />
            ))}
          </ul>
        )}
      </section>

      <BarraPedido aviso={aviso} />
    </main>
  )
}

interface TarjetaProps {
  producto: ProductoResumen
  prioridad: boolean
  onAgregar: (p: ProductoResumen) => void
}

function Tarjeta({ producto: p, prioridad, onAgregar }: TarjetaProps) {
  const foto = p.imagen ? imagenCuadrada(p.imagen) : null
  const url = `/productos/${encodeURIComponent(p.slug)}`

  return (
    <li className="producto-tarjeta">
      <Link to={url} className="producto-tarjeta__link">
        <span className="producto-tarjeta__foto">
          {foto && (
            <img
              src={foto.src}
              srcSet={foto.srcSet}
              sizes={SIZES_TARJETA}
              alt={altProducto(p.nombre, p.imagen)}
              loading={prioridad ? undefined : 'lazy'}
              decoding={prioridad ? undefined : 'async'}
            />
          )}
        </span>
        <span className="producto-tarjeta__nombre">{p.nombre}</span>
      </Link>
      <p className="producto-tarjeta__precio">{textoPrecioTarjeta(p)}</p>
      {tieneVariantes(p) ? (
        <Link to={url} className="producto-tarjeta__btn" aria-label={`Elegir opción de ${p.nombre}`}>
          Elegir
        </Link>
      ) : (
        <button
          type="button"
          className="producto-tarjeta__btn"
          aria-label={`Agregar ${p.nombre} al pedido`}
          onClick={() => onAgregar(p)}
        >
          Agregar
        </button>
      )}
    </li>
  )
}

function GrillaCargando() {
  return (
    <ul className="productos-grilla" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <li key={i} className="producto-tarjeta">
          <span className="producto-tarjeta__foto productos-skeleton" />
          <span className="productos-skeleton productos-skeleton--linea" />
          <span className="productos-skeleton productos-skeleton--linea productos-skeleton--corta" />
        </li>
      ))}
    </ul>
  )
}

export default Productos
