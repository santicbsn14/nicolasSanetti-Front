// TODO: confirmar con Nico
export const WHATSAPP_NUMBER = '5493364614298'

export const MENSAJE_TURNO = '¡Hola Nico! Quiero reservar un turno. ¿Qué disponibilidad tenés?'

export function buildWaLink(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}
