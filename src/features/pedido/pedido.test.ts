// Tests del pedido: `npm test` (runner nativo de Node 22.18+/24, que corre TypeScript sin compilar).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatoPrecio } from './formato.ts'
import { calcularTotal, itemsValidos, sumarItem, type ItemPedido } from './items.ts'
import { armarMensajePedido } from './mensaje.ts'

function item(p: Partial<ItemPedido> & { nombre: string }): ItemPedido {
  return {
    productoId: p.nombre,
    slug: p.nombre.toLowerCase(),
    precio: null,
    mostrarPrecio: true,
    imagen: null,
    cantidad: 1,
    ...p,
  }
}

const shampoo500 = item({
  nombre: 'Shampoo reparador',
  productoId: 'p1',
  varianteKey: 'v500',
  varianteNombre: '500 ml',
  precio: 12500,
  cantidad: 2,
})
const crema = item({ nombre: 'Crema de peinado', productoId: 'p2', precio: 9000, mostrarPrecio: false })
const aceite = item({ nombre: 'Aceite capilar', productoId: 'p3', precio: 7800 })
const sinPrecio = item({ nombre: 'Tónico', productoId: 'p4', precio: null })

test('formatoPrecio: es-AR sin decimales', () => {
  assert.equal(formatoPrecio(15000), '$ 15.000')
  assert.equal(formatoPrecio(1250000), '$ 1.250.000')
  assert.equal(formatoPrecio(900), '$ 900')
  assert.equal(formatoPrecio(999.6), '$ 1.000')
})

test('mensaje: el ejemplo del brief (mezcla con «consultar precio», con variante y comentario)', () => {
  const m = armarMensajePedido({
    items: [shampoo500, crema],
    nombre: '  Juan ',
    entrega: 'retiro',
    comentario: 'Paso el sábado a la mañana',
  })
  assert.equal(
    m,
    [
      '¡Hola Nico! Quiero hacer este pedido desde la web:',
      '',
      '• 2 × Shampoo reparador (500 ml) — $ 25.000',
      '• 1 × Crema de peinado — consultar precio',
      '',
      'Total: $ 25.000 + productos a consultar',
      '',
      'Nombre: Juan',
      'Entrega: Retiro en el salón',
      'Comentario: Paso el sábado a la mañana',
    ].join('\n'),
  )
})

test('mensaje: todo con precio, sin comentario (no va la línea)', () => {
  const m = armarMensajePedido({
    items: [shampoo500, { ...aceite, cantidad: 3 }],
    nombre: 'Ana',
    entrega: 'envio',
    comentario: '   ',
  })
  assert.equal(
    m,
    [
      '¡Hola Nico! Quiero hacer este pedido desde la web:',
      '',
      '• 2 × Shampoo reparador (500 ml) — $ 25.000',
      '• 3 × Aceite capilar — $ 23.400',
      '',
      'Total: $ 48.400',
      '',
      'Nombre: Ana',
      'Entrega: Envío a coordinar',
    ].join('\n'),
  )
})

test('mensaje: nada con precio visible (sin línea de total)', () => {
  const m = armarMensajePedido({ items: [crema, sinPrecio], nombre: 'Leo', entrega: 'retiro' })
  assert.equal(
    m,
    [
      '¡Hola Nico! Quiero hacer este pedido desde la web:',
      '',
      '• 1 × Crema de peinado — consultar precio',
      '• 1 × Tónico — consultar precio',
      '',
      'Nombre: Leo',
      'Entrega: Retiro en el salón',
    ].join('\n'),
  )
  assert.doesNotMatch(m, /Total/)
})

test('carrito: mismo producto + misma variante suma; otra variante es otro ítem; tope 20', () => {
  let items = sumarItem([], { ...shampoo500, cantidad: 1 })
  items = sumarItem(items, { ...shampoo500, cantidad: 2 })
  assert.equal(items.length, 1)
  assert.equal(items[0].cantidad, 3)

  items = sumarItem(items, { ...shampoo500, varianteKey: 'v1000', varianteNombre: '1 litro', cantidad: 1 })
  assert.equal(items.length, 2)

  items = sumarItem(items, { ...shampoo500, cantidad: 50 })
  assert.equal(items[0].cantidad, 20)
})

test('total: suma solo precios visibles', () => {
  assert.deepEqual(calcularTotal([shampoo500, crema]), { total: 25000, hayPrecio: true, hayConsultar: true })
  assert.deepEqual(calcularTotal([crema]), { total: 0, hayPrecio: false, hayConsultar: true })
})

test('itemsValidos: descarta basura y duplicados del localStorage', () => {
  const r = itemsValidos([shampoo500, shampoo500, null, 'x', { nombre: 'sin id' }, { ...aceite, cantidad: 99 }])
  assert.equal(r.length, 2)
  assert.equal(r[1].cantidad, 20)
  assert.deepEqual(itemsValidos('no es lista'), [])
})
