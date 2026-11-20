// Pedido del cliente: store chico con useSyncExternalStore, guardado en localStorage.
// Va en el chunk principal (lo usa la navbar): no importar @sanity/client acá.
import { useSyncExternalStore } from 'react'
import {
  claveItem,
  itemsValidos,
  limitarCantidad,
  sumarItem,
  type ItemPedido,
} from './items.ts'

export type { ItemPedido } from './items.ts'

const CLAVE = 'nsc-pedido-v1'

interface Estado {
  items: ItemPedido[]
  cantidadTotal: number
}

function crearEstado(items: ItemPedido[]): Estado {
  return { items, cantidadTotal: items.reduce((n, i) => n + i.cantidad, 0) }
}

function leer(): ItemPedido[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    return crudo ? itemsValidos(JSON.parse(crudo)) : []
  } catch {
    return [] // storage bloqueado o JSON roto: se arranca vacío y se sigue en memoria
  }
}

function guardar(items: ItemPedido[]) {
  try {
    if (items.length === 0) window.localStorage.removeItem(CLAVE)
    else window.localStorage.setItem(CLAVE, JSON.stringify(items))
  } catch {
    // Sin storage (modo privado, cuota llena): el pedido sigue en memoria
  }
}

const VACIO = crearEstado([])
let estado: Estado | null = null
const oyentes = new Set<() => void>()

function obtener(): Estado {
  if (!estado) estado = typeof window === 'undefined' ? VACIO : crearEstado(leer())
  return estado
}

function avisar() {
  for (const o of oyentes) o()
}

function escribir(items: ItemPedido[]) {
  estado = crearEstado(items)
  guardar(items)
  avisar()
}

// Otra pestaña cambió el pedido: se relee
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== CLAVE && e.key !== null) return
    estado = crearEstado(leer())
    avisar()
  })
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente)
  return () => {
    oyentes.delete(oyente)
  }
}

export function useCarrito(): Estado {
  return useSyncExternalStore(suscribir, obtener, () => VACIO)
}

export function leerCarrito(): ItemPedido[] {
  return obtener().items
}

export function agregar(item: ItemPedido) {
  escribir(sumarItem(obtener().items, item))
}

export function cambiarCantidad(clave: string, cantidad: number) {
  escribir(
    obtener().items.map((i) =>
      claveItem(i) === clave ? { ...i, cantidad: limitarCantidad(cantidad) } : i,
    ),
  )
}

export function quitar(clave: string) {
  escribir(obtener().items.filter((i) => claveItem(i) !== clave))
}

export function vaciar() {
  escribir([])
}

// Revalidación de /pedido: reemplaza los ítems con los datos frescos (solo escribe si algo cambió)
export function actualizarItems(cambiar: (items: ItemPedido[]) => ItemPedido[]) {
  const actuales = obtener().items
  const nuevos = cambiar(actuales)
  if (JSON.stringify(nuevos) !== JSON.stringify(actuales)) escribir(nuevos)
}
