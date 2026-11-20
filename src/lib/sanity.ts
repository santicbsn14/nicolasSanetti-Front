import { createClient } from '@sanity/client'
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Faltan variables de Sanity: definí VITE_SANITY_PROJECT_ID y VITE_SANITY_DATASET en el .env',
  )
}

// Solo lectura: dataset público, sin token. Las escrituras pasan por el back.
// useCdn: false a propósito: con el CDN de la API, lo que Nico guarda en el panel
// tardaba de 0 a ~4 minutos en verse en la web (prueba del brief 07), y él sube una
// foto y mira la web enseguida. El tráfico es chico y el plan gratis alcanza sin CDN.
// Las imágenes siguen saliendo de cdn.sanity.io: eso lo arma urlFor, no este flag.
export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-19',
  useCdn: false,
})

const builder = createImageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format')
