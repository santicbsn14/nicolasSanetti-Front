import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import type {
  ImagenSubida,
  ProductoAdmin,
  ProductoEnvio,
  ProductoResumenAdmin,
  TrabajoAdmin,
  TrabajoEnvio,
} from './tipos'

const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const SIN_CONEXION = 'No hay conexión con el servidor. Probá de nuevo en un rato'

async function mensajeDeError(res: Response): Promise<string> {
  switch (res.status) {
    case 401:
      return 'Tu sesión venció, volvé a ingresar'
    case 403:
      return 'Esta cuenta no tiene permiso para el panel'
    case 404:
      return 'No se encontró. Puede que ya se haya borrado'
    case 413:
      return 'La foto es muy pesada'
  }
  if (res.status === 400) {
    try {
      const body = (await res.json()) as { message?: string }
      if (body.message) return body.message
    } catch {
      // sin body JSON
    }
    return 'Revisá los datos e intentá de nuevo'
  }
  return 'Algo salió mal en el servidor. Probá de nuevo en un rato'
}

async function pedir<T>(ruta: string, opciones: { method?: string; json?: unknown; form?: FormData } = {}): Promise<T> {
  const headers: Record<string, string> = {}
  const usuario = auth.currentUser
  if (usuario) headers.Authorization = `Bearer ${await usuario.getIdToken()}`

  let body: BodyInit | undefined
  if (opciones.form) {
    body = opciones.form
  } else if (opciones.json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(opciones.json)
  }

  let res: Response
  try {
    res = await fetch(`${API_URL}${ruta}`, { method: opciones.method ?? 'GET', headers, body })
  } catch {
    throw new ApiError(SIN_CONEXION, 0)
  }

  if (!res.ok) {
    const mensaje = await mensajeDeError(res)
    if (res.status === 401) await signOut(auth).catch(() => undefined)
    throw new ApiError(mensaje, res.status)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/** Despierta el servidor de Render (duerme cuando no se usa). No importa si falla. */
export function despertarServidor(): void {
  fetch(`${API_URL}/api/health`).catch(() => undefined)
}

export function subirImagen(archivo: File): Promise<ImagenSubida> {
  const form = new FormData()
  form.append('imagen', archivo)
  return pedir('/api/admin/imagenes', { method: 'POST', form })
}

// Productos
export const listarProductos = () => pedir<ProductoResumenAdmin[]>('/api/admin/productos')
export const obtenerProducto = (id: string) => pedir<ProductoAdmin>(`/api/admin/productos/${encodeURIComponent(id)}`)
export const crearProducto = (datos: ProductoEnvio) =>
  pedir<ProductoAdmin>('/api/admin/productos', { method: 'POST', json: datos })
export const editarProducto = (id: string, datos: ProductoEnvio) =>
  pedir<ProductoAdmin>(`/api/admin/productos/${encodeURIComponent(id)}`, { method: 'PATCH', json: datos })
export const reordenarProductos = (ids: string[]) =>
  pedir<ProductoResumenAdmin[]>('/api/admin/productos/reordenar', { method: 'POST', json: { ids } })
export const eliminarProducto = (id: string) =>
  pedir<void>(`/api/admin/productos/${encodeURIComponent(id)}`, { method: 'DELETE' })

// Trabajos (galería)
export const listarTrabajos = () => pedir<TrabajoAdmin[]>('/api/admin/trabajos')
export const obtenerTrabajo = (id: string) => pedir<TrabajoAdmin>(`/api/admin/trabajos/${encodeURIComponent(id)}`)
export const crearTrabajo = (datos: TrabajoEnvio) =>
  pedir<TrabajoAdmin>('/api/admin/trabajos', { method: 'POST', json: datos })
export const editarTrabajo = (id: string, datos: TrabajoEnvio) =>
  pedir<TrabajoAdmin>(`/api/admin/trabajos/${encodeURIComponent(id)}`, { method: 'PATCH', json: datos })
export const reordenarTrabajos = (ids: string[]) =>
  pedir<TrabajoAdmin[]>('/api/admin/trabajos/reordenar', { method: 'POST', json: { ids } })
export const eliminarTrabajo = (id: string) =>
  pedir<void>(`/api/admin/trabajos/${encodeURIComponent(id)}`, { method: 'DELETE' })

export function mensaje(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Algo salió mal. Probá de nuevo'
}
