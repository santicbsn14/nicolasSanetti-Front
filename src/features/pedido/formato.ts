// Precios en pesos, como se escriben en Argentina: «$ 15.000» (sin decimales)
const PESOS = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

export function formatoPrecio(n: number): string {
  return `$ ${PESOS.format(Math.round(n))}`
}

export function plural(n: number, uno: string, varios: string): string {
  return `${n} ${n === 1 ? uno : varios}`
}
