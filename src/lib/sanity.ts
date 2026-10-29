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
export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-19',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format')
