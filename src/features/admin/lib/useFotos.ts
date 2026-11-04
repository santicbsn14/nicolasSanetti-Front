import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, subirImagen } from './api'
import { comprimirImagen } from './comprimirImagen'
import type { ImagenAdmin } from './tipos'

export interface Foto {
  clave: string
  assetId: string | null // null mientras sube
  url: string // URL del CDN o vista previa local (blob:)
  alt?: string | null
  subiendo: boolean
}

let contador = 0
const nuevaClave = () => `f${Date.now()}-${contador++}`

export function fotoDesdeAdmin(img: ImagenAdmin): Foto {
  return { clave: img._key ?? nuevaClave(), assetId: img.assetId, url: img.url, alt: img.alt, subiendo: false }
}

/**
 * Lista de fotos con subida: cada archivo se comprime, se sube al back y queda con su assetId.
 * `maximo` limita la cantidad; con `reemplazar` (galería) la foto nueva pisa la anterior.
 */
export function useFotos(maximo: number, onError: (texto: string) => void, reemplazar = false) {
  const [fotos, setFotos] = useState<Foto[]>([])
  const blobs = useRef<string[]>([])

  useEffect(() => {
    const lista = blobs.current
    return () => lista.forEach((u) => URL.revokeObjectURL(u))
  }, [])

  const agregar = useCallback(
    async (archivos: File[], actuales: number) => {
      const lugar = reemplazar ? 1 : maximo - actuales
      if (lugar <= 0) {
        onError(`Podés cargar hasta ${maximo} fotos`)
        return
      }
      if (archivos.length > lugar) onError(`Podés cargar hasta ${maximo} fotos. Se agregan las primeras ${lugar}`)
      const elegidos = archivos.slice(0, lugar)

      const nuevas: Foto[] = elegidos.map((archivo) => {
        const url = URL.createObjectURL(archivo)
        blobs.current.push(url)
        return { clave: nuevaClave(), assetId: null, url, subiendo: true }
      })
      setFotos((prev) => (reemplazar ? nuevas : [...prev, ...nuevas]))

      await Promise.all(
        elegidos.map(async (archivo, i) => {
          const clave = nuevas[i].clave
          try {
            const comprimido = await comprimirImagen(archivo)
            const subida = await subirImagen(comprimido)
            setFotos((prev) =>
              prev.map((f) => (f.clave === clave ? { ...f, assetId: subida.assetId, url: subida.url, subiendo: false } : f)),
            )
          } catch (error) {
            setFotos((prev) => prev.filter((f) => f.clave !== clave))
            onError(error instanceof ApiError ? error.message : 'No se pudo leer la foto. Probá con otra')
          }
        }),
      )
    },
    [maximo, onError, reemplazar],
  )

  const quitar = (clave: string) => setFotos((prev) => prev.filter((f) => f.clave !== clave))

  const ponerPrimera = (clave: string) =>
    setFotos((prev) => {
      const foto = prev.find((f) => f.clave === clave)
      return foto ? [foto, ...prev.filter((f) => f.clave !== clave)] : prev
    })

  const subiendo = fotos.some((f) => f.subiendo)

  return { fotos, setFotos, agregar, quitar, ponerPrimera, subiendo }
}
