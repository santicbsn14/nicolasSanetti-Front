// Tipos de los documentos de Sanity (ver studio/schemaTypes/)
// Los campos opcionales pueden venir en null: GROQ devuelve null cuando el campo proyectado no existe.

export type ServicioSlug = 'lavado-y-peinado' | 'corte-y-barberia' | 'coloracion-y-mechas'

// Mismo orden que la lista del Studio
export const SERVICIOS: { slug: ServicioSlug; nombre: string }[] = [
  { slug: 'lavado-y-peinado', nombre: 'Lavado y peinado' },
  { slug: 'corte-y-barberia', nombre: 'Corte y barbería' },
  { slug: 'coloracion-y-mechas', nombre: 'Coloración y mechas' },
]

export interface SanityImagen {
  _type: 'image'
  _key?: string
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string | null
}

export interface Variante {
  _key: string
  nombre: string
  precio?: number | null
}

export interface Producto {
  _id: string
  nombre: string
  slug: string
  descripcion?: string | null
  imagenes: SanityImagen[]
  precio?: number | null
  mostrarPrecio: boolean
  variantes?: Variante[] | null
  categoria?: string | null
  orden?: number | null
}

// Lo que devuelve PRODUCTOS_QUERY (listado)
export type ProductoResumen = Pick<
  Producto,
  '_id' | 'nombre' | 'slug' | 'precio' | 'mostrarPrecio' | 'categoria'
> & { imagen: SanityImagen | null }

export interface Trabajo {
  _id: string
  imagen: SanityImagen
  servicio: ServicioSlug
  descripcion?: string | null
  destacado: boolean
}
