import { useEffect, useRef, useState, type TouchEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Trabajo } from '../../lib/sanity.types'
import { buildWaLink } from '../../features/whatsapp/whatsapp'
import { altTrabajo, imagenVisor, mensajeLook, nombreServicio, SIZES_VISOR } from './galeria.utils'
import './Visor.css'

// Deslizar: mínimo 50 px de costado y claramente más horizontal que vertical
const UMBRAL_SWIPE = 50

interface Props {
  trabajos: Trabajo[]
  indice: number
  miniaturas: Map<string, string>
  onIr: (indice: number) => void
  onCerrar: () => void
}

// Visor a pantalla completa (lightbox), sin librerías.
function Visor({ trabajos, indice, miniaturas, onIr, onCerrar }: Props) {
  const t = trabajos[indice]
  const hayAnterior = indice > 0
  const haySiguiente = indice < trabajos.length - 1

  const dialogoRef = useRef<HTMLDivElement>(null)
  const cerrarRef = useRef<HTMLButtonElement>(null)
  const anteriorRef = useRef<HTMLButtonElement>(null)
  const siguienteRef = useRef<HTMLButtonElement>(null)
  const toqueRef = useRef<{ x: number; y: number } | null>(null)
  // Evita cerrar dos veces (dos Esc seguidos harían navigate(-1) dos veces y saldrían de la página)
  const cerrandoRef = useRef(false)
  const [cargadas, setCargadas] = useState<ReadonlySet<string>>(() => new Set())

  const cerrar = () => {
    if (cerrandoRef.current) return
    cerrandoRef.current = true
    onCerrar()
  }
  const anterior = () => hayAnterior && onIr(indice - 1)
  const siguiente = () => haySiguiente && onIr(indice + 1)

  // Foco al ✕ al abrir y scroll de la página bloqueado mientras está abierto
  useEffect(() => {
    cerrarRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  // Teclado: ← → Esc, y Tab no se escapa del visor
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        cerrar()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        anterior()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        siguiente()
      } else if (e.key === 'Tab' && dialogoRef.current) {
        const enfocables = Array.from(
          dialogoRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'),
        )
        if (enfocables.length === 0) return
        const primero = enfocables[0]
        const ultimo = enfocables[enfocables.length - 1]
        const activo = document.activeElement
        if (!dialogoRef.current.contains(activo)) {
          e.preventDefault()
          primero.focus()
        } else if (e.shiftKey && activo === primero) {
          e.preventDefault()
          ultimo.focus()
        } else if (!e.shiftKey && activo === ultimo) {
          e.preventDefault()
          primero.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  // Si la flecha que tenía el foco se deshabilitó (primera o última foto), el foco pasa a la otra
  useEffect(() => {
    const activo = document.activeElement
    const perdido =
      activo === document.body || (activo instanceof HTMLButtonElement && activo.disabled)
    if (!perdido) return
    const destino = [siguienteRef.current, anteriorRef.current].find((b) => b && !b.disabled)
    ;(destino ?? cerrarRef.current)?.focus()
  }, [indice])

  // Precarga la foto anterior y la siguiente
  useEffect(() => {
    for (const vecino of [trabajos[indice - 1], trabajos[indice + 1]]) {
      if (!vecino) continue
      const { src, srcSet } = imagenVisor(vecino)
      const img = new Image()
      img.sizes = SIZES_VISOR
      img.srcset = srcSet
      img.src = src
    }
  }, [trabajos, indice])

  if (!t) return null

  const { src, srcSet } = imagenVisor(t)
  const lista = cargadas.has(t._id)
  const miniatura = miniaturas.get(t._id)
  const descripcion = t.descripcion?.trim()
  const servicio = nombreServicio(t.servicio)

  const onTouchStart = (e: TouchEvent) => {
    toqueRef.current =
      e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null
  }
  const onTouchEnd = (e: TouchEvent) => {
    const inicio = toqueRef.current
    toqueRef.current = null
    if (!inicio || e.changedTouches.length !== 1) return
    const dx = e.changedTouches[0].clientX - inicio.x
    const dy = e.changedTouches[0].clientY - inicio.y
    if (Math.abs(dx) < UMBRAL_SWIPE || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0) siguiente()
    else anterior()
  }

  return createPortal(
    <div
      ref={dialogoRef}
      className="visor"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${indice + 1} de ${trabajos.length}: ${altTrabajo(t)}`}
      onClick={(e) => e.target === e.currentTarget && cerrar()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => (toqueRef.current = null)}
    >
      <button
        ref={cerrarRef}
        type="button"
        className="visor__cerrar"
        aria-label="Cerrar"
        onClick={cerrar}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="visor__escenario" onClick={(e) => e.target === e.currentTarget && cerrar()}>
        {!lista && miniatura && (
          <img className="visor__foto" src={miniatura} alt="" aria-hidden="true" />
        )}
        <img
          key={t._id}
          className={`visor__foto${lista ? '' : ' visor__foto--cargando'}`}
          src={src}
          srcSet={srcSet}
          sizes={SIZES_VISOR}
          alt={altTrabajo(t)}
          onLoad={() => setCargadas((prev) => new Set(prev).add(t._id))}
        />

        <button
          ref={anteriorRef}
          type="button"
          className="visor__flecha visor__flecha--anterior"
          aria-label="Foto anterior"
          onClick={anterior}
          disabled={!hayAnterior}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          ref={siguienteRef}
          type="button"
          className="visor__flecha visor__flecha--siguiente"
          aria-label="Foto siguiente"
          onClick={siguiente}
          disabled={!haySiguiente}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="visor__pie">
        <div className="visor__info">
          <p className="visor__servicio">{servicio}</p>
          {descripcion && <p className="visor__desc">{descripcion}</p>}
        </div>
        <p className="visor__contador" aria-live="polite">
          {indice + 1} / {trabajos.length}
        </p>
        <a
          className="visor__cta"
          href={buildWaLink(mensajeLook(t))}
          target="_blank"
          rel="noopener noreferrer"
        >
          Quiero este look
        </a>
      </div>
    </div>,
    document.body,
  )
}

export default Visor
