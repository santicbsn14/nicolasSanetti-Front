import { useEffect, useState } from 'react'
import { SERVICIOS, type ServicioSlug } from '../../../lib/sanity.types'

export function formatoPrecio(precio: number): string {
  return `$ ${precio.toLocaleString('es-AR')}`
}

export function nombreServicio(slug: ServicioSlug): string {
  return SERVICIOS.find((s) => s.slug === slug)?.nombre ?? slug
}

/** Miniatura desde el CDN de Sanity */
export function miniatura(url: string, ancho = 240): string {
  return `${url}?w=${ancho}&h=${ancho}&fit=crop&auto=format`
}

/** Foto sin recortar, para verla grande */
export function fotoAncha(url: string, ancho = 900): string {
  return `${url}?w=${ancho}&auto=format`
}

/** true si `activo` lleva más de 5 s: el servidor de Render probablemente se está despertando */
export function useLento(activo: boolean, ms = 5000): boolean {
  const [lento, setLento] = useState(false)
  useEffect(() => {
    if (!activo) {
      setLento(false)
      return
    }
    const t = window.setTimeout(() => setLento(true), ms)
    return () => window.clearTimeout(t)
  }, [activo, ms])
  return lento
}

export const MENSAJE_LENTO = 'El servidor se está despertando, puede tardar hasta un minuto…'

/** Avisa al cerrar o recargar la pestaña si hay cambios sin guardar */
export function useAvisoAlCerrar(hayCambios: boolean): void {
  useEffect(() => {
    if (!hayCambios) return
    const alCerrar = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', alCerrar)
    return () => window.removeEventListener('beforeunload', alCerrar)
  }, [hayCambios])
}

/** Mueve el elemento `i` una posición (-1 sube, +1 baja) */
export function mover<T>(lista: T[], i: number, delta: -1 | 1): T[] {
  const j = i + delta
  if (j < 0 || j >= lista.length) return lista
  const copia = [...lista]
  ;[copia[i], copia[j]] = [copia[j], copia[i]]
  return copia
}
