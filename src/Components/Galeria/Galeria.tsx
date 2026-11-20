import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { client } from '../../lib/sanity'
import { TRABAJOS_QUERY } from '../../lib/sanity.queries'
import type { ServicioSlug, Trabajo } from '../../lib/sanity.types'
import { buildWaLink, MENSAJE_TURNO } from '../../features/whatsapp/whatsapp'
import FiltroServicios from './FiltroServicios'
import GrillaTrabajos, { GrillaCargando } from './GrillaTrabajos'
import Visor from './Visor'
import { esServicio } from './galeria.utils'
// Eyebrow, título y botón usan las mismas clases que la portada
import '../Home/Hero.css'
import './Galeria.css'

const TITULO = 'Galería de trabajos | Nicolás Sanetti Coiffeur'

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'ok'; trabajos: Trabajo[] }

// Marca en el historial que el visor se abrió desde la grilla: al cerrarlo se vuelve
// atrás (así la flecha «atrás» del celular cierra el visor en vez de salir de la página).
interface EstadoVisor {
  visorDesdeGrilla?: boolean
}

function Galeria() {
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' })
  const [intento, setIntento] = useState(0)
  const [miniaturas] = useState(() => new Map<string, string>())
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const anterior = document.title
    document.title = TITULO
    return () => {
      document.title = anterior
    }
  }, [])

  // Se traen todos los trabajos una vez; el filtro se hace acá
  useEffect(() => {
    let vigente = true
    client
      .fetch<Trabajo[]>(TRABAJOS_QUERY)
      .then((trabajos) => vigente && setCarga({ estado: 'ok', trabajos: trabajos ?? [] }))
      .catch(() => vigente && setCarga({ estado: 'error' }))
    return () => {
      vigente = false
    }
  }, [intento])

  const reintentar = () => {
    setCarga({ estado: 'cargando' })
    setIntento((n) => n + 1)
  }

  const todos = useMemo(() => (carga.estado === 'ok' ? carga.trabajos : []), [carga])
  const paramServicio = searchParams.get('servicio')
  const servicio = esServicio(paramServicio) ? paramServicio : null // otro valor = «Todas»
  const visibles = useMemo(
    () => (servicio ? todos.filter((t) => t.servicio === servicio) : todos),
    [todos, servicio],
  )
  const cantidades = useMemo(() => {
    const c: Record<ServicioSlug, number> = {
      'lavado-y-peinado': 0,
      'corte-y-barberia': 0,
      'coloracion-y-mechas': 0,
    }
    for (const t of todos) c[t.servicio] = (c[t.servicio] ?? 0) + 1
    return c
  }, [todos])

  const fotoId = searchParams.get('foto')
  const indiceFoto = fotoId ? visibles.findIndex((t) => t._id === fotoId) : -1 // si no existe, se ignora
  const visorAbierto = indiceFoto >= 0

  const conParams = (cambiar: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(searchParams)
    cambiar(p)
    return p
  }

  const elegirServicio = (slug: ServicioSlug | null) => {
    setSearchParams(
      conParams((p) => {
        if (slug) p.set('servicio', slug)
        else p.delete('servicio')
        p.delete('foto')
      }),
      { replace: true },
    )
  }

  const abrirFoto = (id: string) => {
    setSearchParams(
      conParams((p) => p.set('foto', id)),
      { state: { visorDesdeGrilla: true } satisfies EstadoVisor },
    )
  }

  const irAFoto = (indice: number) => {
    const t = visibles[indice]
    if (!t) return
    setSearchParams(
      conParams((p) => p.set('foto', t._id)),
      { replace: true, state: location.state },
    )
  }

  const cerrarFoto = () => {
    if ((location.state as EstadoVisor | null)?.visorDesdeGrilla) {
      navigate(-1)
    } else {
      setSearchParams(
        conParams((p) => p.delete('foto')),
        { replace: true },
      )
    }
  }

  // Al cerrar el visor, el foco vuelve a la foto de la grilla (la última que se vio)
  const ultimaFotoRef = useRef<string | null>(null)
  useEffect(() => {
    if (visorAbierto) {
      ultimaFotoRef.current = visibles[indiceFoto]._id
      return
    }
    const id = ultimaFotoRef.current
    if (!id) return
    ultimaFotoRef.current = null
    document.querySelector<HTMLElement>(`[data-trabajo="${CSS.escape(id)}"]`)?.focus()
  }, [visorAbierto, indiceFoto, visibles])

  const reservar = (
    <a
      className="hero__btn hero__btn--primario"
      href={buildWaLink(MENSAJE_TURNO)}
      target="_blank"
      rel="noopener noreferrer"
    >
      Reservá tu turno
    </a>
  )

  return (
    <main className="galeria">
      <header className="galeria-encabezado">
        <p className="hero__eyebrow">
          <span className="hero__dot" aria-hidden="true">•</span>
          Nuestros trabajos
          <span className="hero__dot" aria-hidden="true">•</span>
        </p>
        <h1 className="hero__titulo">Galería</h1>
        <p className="galeria-bajada">
          Algunos de los trabajos que hacemos en el salón. Tocá una foto para verla completa.
        </p>
      </header>

      <section className="galeria-cuerpo" aria-label="Fotos de trabajos" aria-busy={carga.estado === 'cargando'}>
        {carga.estado === 'cargando' && (
          <div className="galeria-grilla-caja">
            <GrillaCargando />
          </div>
        )}

        {carga.estado === 'error' && (
          <div className="galeria-aviso" role="alert">
            <p>No pudimos cargar la galería.</p>
            <button type="button" className="hero__btn hero__btn--secundario galeria-reintentar" onClick={reintentar}>
              Probar de nuevo
            </button>
          </div>
        )}

        {carga.estado === 'ok' && todos.length > 0 && (
          <FiltroServicios
            activo={servicio}
            total={todos.length}
            cantidades={cantidades}
            onElegir={elegirServicio}
          />
        )}

        {carga.estado === 'ok' && visibles.length === 0 && (
          <div className="galeria-aviso">
            <p>Muy pronto vas a ver acá nuestros trabajos.</p>
            {reservar}
          </div>
        )}

        {carga.estado === 'ok' && visibles.length > 0 && (
          <div className="galeria-grilla-caja">
            <GrillaTrabajos
              key={servicio ?? 'todas'}
              trabajos={visibles}
              miniaturas={miniaturas}
              onAbrir={abrirFoto}
            />
          </div>
        )}
      </section>

      {carga.estado === 'ok' && visibles.length > 0 && (
        <section className="galeria-cierre">
          <h2>¿Te gustó algún trabajo?</h2>
          {reservar}
        </section>
      )}

      {visorAbierto && (
        <Visor
          trabajos={visibles}
          indice={indiceFoto}
          miniaturas={miniaturas}
          onIr={irAFoto}
          onCerrar={cerrarFoto}
        />
      )}
    </main>
  )
}

export default Galeria
