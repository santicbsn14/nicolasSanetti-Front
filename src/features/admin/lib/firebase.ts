// Firebase Auth solo para el panel. Este módulo se carga únicamente desde el chunk lazy de /admin.
// No usa src/Services-Api/Auth.tsx (sistema de turnos viejo).
import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth'

const projectId = import.meta.env.VITE_PROJECT_ID

const app = initializeApp(
  {
    apiKey: import.meta.env.VITE_API_KEY_FIREBASE,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
  },
  'admin',
)

export const auth = getAuth(app)
auth.languageCode = 'es'

// Sesión guardada en el dispositivo: Nico no tiene que ingresar cada vez
export const persistenciaLista = setPersistence(auth, browserLocalPersistence)
