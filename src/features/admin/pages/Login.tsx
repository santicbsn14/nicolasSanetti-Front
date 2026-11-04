import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth, persistenciaLista } from '../lib/firebase'
import { despertarServidor } from '../lib/api'
import { useSesion } from '../auth/AdminAuthContext'
import { MENSAJE_LENTO, useLento } from '../lib/util'
import Cargando from '../components/Cargando'
import './Login.css'

function traducir(error: unknown): string {
  const codigo = error instanceof FirebaseError ? error.code : ''
  switch (codigo) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-login-credentials':
      return 'Email o contraseña incorrectos'
    case 'auth/invalid-email':
      return 'Revisá el email, parece que está mal escrito'
    case 'auth/missing-password':
      return 'Escribí la contraseña'
    case 'auth/too-many-requests':
      return 'Demasiados intentos, esperá unos minutos'
    case 'auth/user-disabled':
      return 'Esta cuenta está deshabilitada'
    case 'auth/network-request-failed':
      return 'No hay conexión a internet. Probá de nuevo'
    default:
      return 'No se pudo ingresar. Probá de nuevo'
  }
}

export default function Login() {
  const { estado } = useSesion()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [verClave, setVerClave] = useState(false)
  const [ingresando, setIngresando] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const lento = useLento(ingresando)

  // Despierta el servidor de Render mientras Nico escribe
  useEffect(() => {
    despertarServidor()
  }, [])

  if (estado === 'cargando' && !ingresando) return <Cargando pantallaCompleta />
  if (estado === 'admin' || estado === 'sin-permiso') {
    const desde = (location.state as { desde?: string } | null)?.desde
    return <Navigate to={desde && desde !== '/admin/login' ? desde : '/admin'} replace />
  }

  const ingresar = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email.trim() || !clave) {
      setError('Completá el email y la contraseña')
      return
    }
    setIngresando(true)
    try {
      await persistenciaLista
      await signInWithEmailAndPassword(auth, email.trim(), clave)
    } catch (err) {
      setError(traducir(err))
      setIngresando(false)
    }
  }

  const olvide = async () => {
    setError('')
    setInfo('')
    if (!email.trim()) {
      setError('Escribí tu email arriba y volvé a tocar «Me olvidé la contraseña»')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setInfo('Te mandamos un mail para crear una contraseña nueva')
    } catch (err) {
      const codigo = err instanceof FirebaseError ? err.code : ''
      // Por seguridad, si el email no existe se muestra lo mismo
      if (codigo === 'auth/user-not-found') setInfo('Te mandamos un mail para crear una contraseña nueva')
      else setError(traducir(err))
    }
  }

  return (
    <main className="adm-login">
      <div className="adm-login__caja">
        <div className="adm-login__marca">
          <img src="/nico.svg" alt="" width={56} height={56} />
          <p className="adm-login__nombre">Nicolás Sanetti Coiffeur</p>
          <h1 className="adm-login__titulo">
            Panel<span aria-hidden="true">.</span>
          </h1>
        </div>

        <form className="adm-login__form adm-tarjeta" onSubmit={ingresar} noValidate>
          <div className="adm-campo">
            <label className="adm-etiqueta" htmlFor="adm-email">
              Email
            </label>
            <input
              id="adm-email"
              className="adm-input"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="adm-campo">
            <label className="adm-etiqueta" htmlFor="adm-clave">
              Contraseña
            </label>
            <div className="adm-login__clave">
              <input
                id="adm-clave"
                className="adm-input"
                type={verClave ? 'text' : 'password'}
                autoComplete="current-password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
              <button
                type="button"
                className="adm-login__ver"
                onClick={() => setVerClave((v) => !v)}
                aria-label={verClave ? 'Ocultar la contraseña' : 'Mostrar la contraseña'}
                aria-pressed={verClave}
              >
                {verClave ? <EyeOff size={22} aria-hidden="true" /> : <Eye size={22} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="adm-login__error" role="alert">
              {error}
            </p>
          )}
          {info && (
            <p className="adm-login__info" role="status">
              {info}
            </p>
          )}

          <button type="submit" className="adm-boton adm-boton--ancho" disabled={ingresando}>
            {ingresando ? 'Ingresando…' : 'Ingresar'}
          </button>
          {lento && <p className="adm-ayuda adm-login__lento">{MENSAJE_LENTO}</p>}

          <button type="button" className="adm-link adm-login__olvide" onClick={() => void olvide()}>
            Me olvidé la contraseña
          </button>
        </form>
      </div>
    </main>
  )
}
