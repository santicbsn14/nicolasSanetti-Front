// Queries GROQ. Solo documentos activos, ordenados por `orden` y después por más recientes.

const ORDEN = 'order(orden asc, _createdAt desc)'

export const PRODUCTOS_QUERY = `*[_type == "producto" && activo == true] | ${ORDEN} {
  _id,
  nombre,
  "slug": slug.current,
  "imagen": imagenes[0],
  precio,
  mostrarPrecio,
  categoria
}`

export const PRODUCTO_POR_SLUG_QUERY = `*[_type == "producto" && activo == true && slug.current == $slug][0] {
  _id,
  nombre,
  "slug": slug.current,
  descripcion,
  imagenes,
  precio,
  mostrarPrecio,
  variantes,
  categoria,
  orden
}`

const TRABAJO_CAMPOS = `{
  _id,
  imagen,
  servicio,
  descripcion,
  destacado
}`

export const TRABAJOS_QUERY = `*[_type == "trabajo" && activo == true] | ${ORDEN} ${TRABAJO_CAMPOS}`

export const TRABAJOS_POR_SERVICIO_QUERY = `*[_type == "trabajo" && activo == true && servicio == $servicio] | ${ORDEN} ${TRABAJO_CAMPOS}`
