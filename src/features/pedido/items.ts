// Lógica pura del pedido (sin React ni Sanity): se prueba con `npm test`.
// Los imports llevan `.ts` para que Node los corra directo en los tests.
import type { SanityImagen } from '../../lib/sanity.types'

export const CANTIDAD_MIN = 1
export const CANTIDAD_MAX = 20

export interface ItemPedido {
  productoId: string
  slug: string
  nombre: string
  varianteKey?: string
  varianteNombre?: string
  // Precio unitario: el de la variante si tiene, si no el del producto
  precio: number | null
  mostrarPrecio: boolean
  imagen: SanityImagen | null
  cantidad: number
}

// Mismo producto + misma variante = mismo ítem
export function claveItem(i: Pick<ItemPedido, 'productoId' | 'varianteKey'>): string {
  return `${i.productoId}::${i.varianteKey ?? ''}`
}

export function limitarCantidad(n: number): number {
  if (!Number.isFinite(n)) return CANTIDAD_MIN
  return Math.min(CANTIDAD_MAX, Math.max(CANTIDAD_MIN, Math.round(n)))
}

export function sumarItem(items: ItemPedido[], nuevo: ItemPedido): ItemPedido[] {
  const clave = claveItem(nuevo)
  const existente = items.find((i) => claveItem(i) === clave)
  if (!existente) return [...items, { ...nuevo, cantidad: limitarCantidad(nuevo.cantidad) }]
  return items.map((i) =>
    i === existente ? { ...nuevo, cantidad: limitarCantidad(i.cantidad + nuevo.cantidad) } : i,
  )
}

// El precio que ve el cliente, o null («Consultar precio»)
export function precioVisible(i: Pick<ItemPedido, 'precio' | 'mostrarPrecio'>): number | null {
  return i.mostrarPrecio && typeof i.precio === 'number' && Number.isFinite(i.precio) ? i.precio : null
}

export function subtotal(i: ItemPedido): number | null {
  const p = precioVisible(i)
  return p === null ? null : p * i.cantidad
}

export interface Total {
  total: number
  // Hay al menos un ítem con precio visible
  hayPrecio: boolean
  // Hay al menos un ítem «Consultar precio»
  hayConsultar: boolean
}

export function calcularTotal(items: ItemPedido[]): Total {
  let total = 0
  let hayPrecio = false
  let hayConsultar = false
  for (const i of items) {
    const s = subtotal(i)
    if (s === null) hayConsultar = true
    else {
      total += s
      hayPrecio = true
    }
  }
  return { total, hayPrecio, hayConsultar }
}

// Lee lo guardado en el navegador descartando lo que no tenga la forma esperada
export function itemsValidos(valor: unknown): ItemPedido[] {
  if (!Array.isArray(valor)) return []
  const vistos = new Set<string>()
  const items: ItemPedido[] = []
  for (const v of valor) {
    if (!v || typeof v !== 'object') continue
    const i = v as Partial<ItemPedido>
    if (typeof i.productoId !== 'string' || !i.productoId) continue
    if (typeof i.nombre !== 'string' || typeof i.slug !== 'string') continue
    const item: ItemPedido = {
      productoId: i.productoId,
      slug: i.slug,
      nombre: i.nombre,
      precio: typeof i.precio === 'number' ? i.precio : null,
      mostrarPrecio: i.mostrarPrecio === true,
      imagen: i.imagen && typeof i.imagen === 'object' ? i.imagen : null,
      cantidad: limitarCantidad(Number(i.cantidad)),
    }
    if (typeof i.varianteKey === 'string' && i.varianteKey) {
      item.varianteKey = i.varianteKey
      if (typeof i.varianteNombre === 'string') item.varianteNombre = i.varianteNombre
    }
    const clave = claveItem(item)
    if (vistos.has(clave)) continue
    vistos.add(clave)
    items.push(item)
  }
  return items
}
