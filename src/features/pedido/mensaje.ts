// Texto del pedido que se manda por WhatsApp (ver tests en pedido.test.ts)
import { formatoPrecio } from './formato.ts'
import { calcularTotal, subtotal, type ItemPedido } from './items.ts'

export type Entrega = 'retiro' | 'envio'

export const ENTREGAS: { valor: Entrega; texto: string }[] = [
  { valor: 'retiro', texto: 'Retiro en el salón' },
  { valor: 'envio', texto: 'Envío a coordinar' },
]

export function textoEntrega(e: Entrega): string {
  return ENTREGAS.find((x) => x.valor === e)?.texto ?? ENTREGAS[0].texto
}

export interface DatosPedido {
  // Solo los ítems disponibles (los que «ya no están» no se mandan)
  items: ItemPedido[]
  nombre: string
  entrega: Entrega
  comentario?: string
}

export function nombreConVariante(i: Pick<ItemPedido, 'nombre' | 'varianteNombre'>): string {
  return i.varianteNombre ? `${i.nombre} (${i.varianteNombre})` : i.nombre
}

export function textoTotal(items: ItemPedido[]): string | null {
  const { total, hayPrecio, hayConsultar } = calcularTotal(items)
  if (!hayPrecio) return null
  return `${formatoPrecio(total)}${hayConsultar ? ' + productos a consultar' : ''}`
}

export function armarMensajePedido({ items, nombre, entrega, comentario }: DatosPedido): string {
  const lineas = items.map((i) => {
    const s = subtotal(i)
    const precio = s === null ? 'consultar precio' : formatoPrecio(s)
    return `• ${i.cantidad} × ${nombreConVariante(i)} — ${precio}`
  })

  const partes = ['¡Hola Nico! Quiero hacer este pedido desde la web:', lineas.join('\n')]

  const total = textoTotal(items)
  if (total) partes.push(`Total: ${total}`)

  const datos = [`Nombre: ${nombre.trim()}`, `Entrega: ${textoEntrega(entrega)}`]
  const c = comentario?.trim()
  if (c) datos.push(`Comentario: ${c}`)
  partes.push(datos.join('\n'))

  return partes.join('\n\n')
}
