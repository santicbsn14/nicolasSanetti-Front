import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';


// Otras importaciones que necesites

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY_FIREBASE,
  authDomain: "nicolas-sanetti-coiffeur.firebaseapp.com",
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: "nicolas-sanetti-coiffeur.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: "G-XJLY6N42B5"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // Ejemplo para la autenticación