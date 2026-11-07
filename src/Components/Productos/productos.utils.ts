import { urlFor } from '../../lib/sanity'
import type { Producto, ProductoResumen, SanityImagen, Variante } from '../../lib/sanity.types'
import { formatoPrecio } from '../../features/pedido/formato'
import { precioVisible, type ItemPedido } from '../../features/pedido/items'

export const CONSULTAR = 'Consultar precio'

type ConPrecio = Pick<Producto, 'precio' | 'mostrarPrecio' | 'variantes'>

// Precio unitario de un ítem: el de la variante si tiene; si no, el del producto
export function precioDe(p: ConPrecio, v?: Variante | null): number | null {
  const n = v?.precio ?? p.precio
  return typeof n === 'number' ? n : null
}

export function textoPrecioUnitario(p: ConPrecio, v?: Variante | null): string {
  const n = precioVisible({ precio: precioDe(p, v), mostrarPrecio: p.mostrarPrecio })
  return n === null ? CONSULTAR : formatoPrecio(n)
}

export function tieneVariantes(p: Pick<Producto, 'variantes'>): boolean {
  return (p.variantes?.length ?? 0) > 0
}

// Tarjeta: «$ 15.000», «Desde $ 12.500» si las variantes cuestan distinto, o «Consultar precio»
export function textoPrecioTarjeta(p: ConPrecio): string {
  if (!p.mostrarPrecio) return CONSULTAR
  if (!tieneVariantes(p)) return textoPrecioUnitario(p)
  const precios = (p.variantes ?? []).map((v) => precioDe(p, v))
  const numeros = precios.filter((n): n is number => n !== null)
  if (numeros.length === 0) return CONSULTAR
  const min = Math.min(...numeros)
  const todasIguales = numeros.length === precios.length && numeros.every((n) => n === min)
  return todasIguales ? formatoPrecio(min) : `Desde ${formatoPrecio(min)}`
}

export function itemDe(
  p: Pick<Producto, '_id' | 'slug' | 'nombre' | 'precio' | 'mostrarPrecio' | 'variantes'>,
  imagen: SanityImagen | null,
  variante: Variante | null,
  cantidad: number,
): ItemPedido {
  const item: ItemPedido = {
    productoId: p._id,
    slug: p.slug,
    nombre: p.nombre,
    precio: precioDe(p, variante),
    mostrarPrecio: p.mostrarPrecio,
    imagen,
    cantidad,
  }
  if (variante) {
    item.varianteKey = variante._key
    item.varianteNombre = variante.nombre
  }
  return item
}

export function itemDeResumen(p: ProductoResumen): ItemPedido {
  return itemDe(p, p.imagen, null, 1)
}

// ----- Imágenes -----
const ANCHOS_CUADRADO = [300, 500, 800]
export const SIZES_TARJETA = '(min-width: 1024px) 285px, (min-width: 768px) 33vw, 50vw'

function srcCuadrado(img: SanityImagen, ancho: number): string {
  return urlFor(img).width(ancho).height(ancho).fit('crop').url()
}

// Foto 1:1 recortada (tarjetas y miniaturas)
export function imagenCuadrada(img: SanityImagen, anchos = ANCHOS_CUADRADO) {
  return {
    src: srcCuadrado(img, anchos[Math.min(1, anchos.length - 1)]),
    srcSet: anchos.map((w) => `${srcCuadrado(img, w)} ${w}w`).join(', '),
  }
}

// Foto principal del detalle: entera (sin recortar el envase) dentro de un cuadrado
const ANCHOS_DETALLE = [500, 800, 1200]
export const SIZES_DETALLE = '(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw'

function srcDetalle(img: SanityImagen, ancho: number): string {
  return urlFor(img).width(ancho).height(ancho).fit('max').url()
}

export function imagenDetalle(img: SanityImagen) {
  return {
    src: srcDetalle(img, 800),
    srcSet: ANCHOS_DETALLE.map((w) => `${srcDetalle(img, w)} ${w}w`).join(', '),
  }
}

export function altProducto(nombre: string, img: SanityImagen | null | undefined, n?: number): string {
  const alt = img?.alt?.trim()
  if (alt) return alt
  return n && n > 1 ? `${nombre}, foto ${n}` : nombre
}

export const tituloPagina = (t: string) => `${t} | Nicolás Sanetti Coiffeur`
