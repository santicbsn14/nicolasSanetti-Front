import type { ServicioSlug } from '../../../lib/sanity.types'

// Formas que devuelve el back en /api/admin/*. GROQ devuelve null en los campos que no existen.

export interface ImagenAdmin {
  _key?: string
  assetId: string
  alt?: string | null
  url: string
}

export interface ImagenSubida {
  assetId: string
  url: string
  width?: number
  height?: number
}

export interface ImagenEnvio {
  assetId: string
  alt?: string | null
}

export interface ProductoResumenAdmin {
  _id: string
  nombre: string
  slug: string
  precio?: number | null
  mostrarPrecio?: boolean | null
  categoria?: string | null
  activo?: boolean | null
  orden?: number | null
  imagen: ImagenAdmin | null
  cantidadImagenes: number
}

export interface ProductoAdmin extends Omit<ProductoResumenAdmin, 'imagen' | 'cantidadImagenes'> {
  descripcion?: string | null
  imagenes: ImagenAdmin[] | null
  variantes?: { _key: string; nombre: string; precio?: number | null }[] | null
}

export interface ProductoEnvio {
  nombre?: string
  descripcion?: string | null
  imagenes?: ImagenEnvio[]
  precio?: number | null
  mostrarPrecio?: boolean
  variantes?: { nombre: string; precio?: number }[] | null
  activo?: boolean
}

export interface TrabajoAdmin {
  _id: string
  imagen: ImagenAdmin | null
  servicio: ServicioSlug
  descripcion?: string | null
  destacado?: boolean | null
  activo?: boolean | null
  orden?: number | null
}

export interface TrabajoEnvio {
  imagen?: ImagenEnvio
  servicio?: ServicioSlug
  descripcion?: string | null
  destacado?: boolean
  activo?: boolean
}
