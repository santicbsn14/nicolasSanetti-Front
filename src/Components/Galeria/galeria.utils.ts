import { urlFor } from '../../lib/sanity'
import { SERVICIOS, type ServicioSlug, type Trabajo } from '../../lib/sanity.types'

// Grilla: recorte 4:5 en tres tamaños, el navegador elige según `sizes`
const ANCHOS_GRILLA = [400, 700, 1000]

// Columnas: 2 en celular, 3 en tablet, 4 en desktop (ancho máx. 1200 px)
export const SIZES_GRILLA = '(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw'
export const SIZES_GRILLA_DESTACADA = '(min-width: 1024px) 600px, (min-width: 768px) 66vw, 100vw'

// Visor: foto completa, sin recorte, hasta 1600 px de ancho
const ANCHOS_VISOR = [800, 1200, 1600]
export const SIZES_VISOR = '(min-width: 1600px) 1600px, 100vw'

export function esServicio(valor: string | null): valor is ServicioSlug {
  return SERVICIOS.some((s) => s.slug === valor)
}

export function nombreServicio(slug: ServicioSlug): string {
  return SERVICIOS.find((s) => s.slug === slug)?.nombre ?? 'peluquería'
}

function srcGrilla(t: Trabajo, ancho: number): string {
  return urlFor(t.imagen).width(ancho).height(Math.round(ancho * 1.25)).fit('crop').url()
}

export function imagenGrilla(t: Trabajo) {
  return {
    src: srcGrilla(t, 700),
    srcSet: ANCHOS_GRILLA.map((w) => `${srcGrilla(t, w)} ${w}w`).join(', '),
  }
}

function srcVisor(t: Trabajo, ancho: number): string {
  return urlFor(t.imagen).width(ancho).fit('max').url()
}

export function imagenVisor(t: Trabajo) {
  return {
    src: srcVisor(t, 1600),
    srcSet: ANCHOS_VISOR.map((w) => `${srcVisor(t, w)} ${w}w`).join(', '),
  }
}

export function altTrabajo(t: Trabajo): string {
  return (
    t.imagen.alt?.trim() ||
    t.descripcion?.trim() ||
    `Trabajo de ${nombreServicio(t.servicio).toLowerCase()}`
  )
}

export function mensajeLook(t: Trabajo): string {
  const servicio = nombreServicio(t.servicio).toLowerCase()
  const descripcion = t.descripcion?.trim()
  return `¡Hola Nico! Vi en la web un trabajo de ${servicio}${descripcion ? ` («${descripcion}»)` : ''} y me gustaría sacar turno.`
}
