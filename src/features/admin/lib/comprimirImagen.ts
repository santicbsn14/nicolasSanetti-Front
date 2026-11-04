// Achica y comprime una foto antes de subirla: 1600 px en el lado más largo (sin agrandar),
// WebP calidad 0,8 (o JPEG 0,85 si el navegador no genera WebP). Respeta la orientación EXIF.

const LADO_MAXIMO = 1600

type Fuente = { dibujable: CanvasImageSource; ancho: number; alto: number; liberar: () => void }

async function cargar(archivo: File): Promise<Fuente> {
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(archivo, { imageOrientation: 'from-image' })
      return { dibujable: bitmap, ancho: bitmap.width, alto: bitmap.height, liberar: () => bitmap.close() }
    } catch {
      // algunos navegadores no aceptan las opciones o el formato: sigue con <img>
    }
  }
  const url = URL.createObjectURL(archivo)
  const img = new Image()
  img.decoding = 'async'
  img.src = url
  try {
    await img.decode()
  } catch {
    URL.revokeObjectURL(url)
    throw new Error('No se pudo leer la foto')
  }
  // <img> ya aplica la orientación EXIF en los navegadores actuales (image-orientation: from-image)
  return { dibujable: img, ancho: img.naturalWidth, alto: img.naturalHeight, liberar: () => URL.revokeObjectURL(url) }
}

function aBlob(canvas: HTMLCanvasElement, tipo: string, calidad: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, tipo, calidad))
}

export async function comprimirImagen(archivo: File): Promise<File> {
  const fuente = await cargar(archivo)
  try {
    const escala = Math.min(1, LADO_MAXIMO / Math.max(fuente.ancho, fuente.alto))
    const ancho = Math.round(fuente.ancho * escala)
    const alto = Math.round(fuente.alto * escala)

    const canvas = document.createElement('canvas')
    canvas.width = ancho
    canvas.height = alto
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No se pudo procesar la foto')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(fuente.dibujable, 0, 0, ancho, alto)

    let blob = await aBlob(canvas, 'image/webp', 0.8)
    if (!blob || blob.type !== 'image/webp') blob = await aBlob(canvas, 'image/jpeg', 0.85)
    if (!blob) throw new Error('No se pudo procesar la foto')

    const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
    const base = archivo.name.replace(/\.[^.]+$/, '') || 'foto'
    return new File([blob], `${base}.${extension}`, { type: blob.type })
  } finally {
    fuente.liberar()
  }
}
