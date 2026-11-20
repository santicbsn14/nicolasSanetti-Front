import { useSesion } from '../auth/AdminAuthContext'
import './Login.css'
import './SinPermiso.css'

export default function SinPermiso() {
  const { usuario, salir } = useSesion()
  return (
    <main className="adm-login">
      <div className="adm-login__caja">
        <div className="adm-login__marca">
          <img src="/nico.svg" alt="" width={56} height={56} />
          <p className="adm-login__nombre">Nicolás Sanetti Coiffeur</p>
        </div>
        <div className="adm-tarjeta adm-sinpermiso">
          <h1 className="adm-sinpermiso__titulo">Esta cuenta no tiene permiso para usar el panel</h1>
          {usuario?.email && <p className="adm-ayuda adm-sinpermiso__email">Ingresaste como {usuario.email}</p>}
          <button type="button" className="adm-boton adm-boton--ancho" onClick={() => void salir()}>
            Salir
          </button>
        </div>
      </div>
    </main>
  )
}
