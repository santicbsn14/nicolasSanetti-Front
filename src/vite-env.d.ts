/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Firebase (Auth del panel /admin)
  readonly VITE_API_KEY_FIREBASE: string
  readonly VITE_PROJECT_ID: string
  readonly VITE_MESSAGING_SENDER_ID: string
  readonly VITE_APP_ID: string
  // Sanity (lectura pública)
  readonly VITE_SANITY_PROJECT_ID: string
  readonly VITE_SANITY_DATASET: string
  // API (back Express), sin barra final
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
