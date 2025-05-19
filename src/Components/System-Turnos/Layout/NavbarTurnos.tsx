import type { FC } from 'react'
import './NavbarTurnos.css'

const NavbarTurnos: FC = () => {
  return (
    <header className="navbar-turnos">
      <h1 className="navbar-turnos__titulo">NICOLAS SANETTI COIFFEUR</h1>
      <button className="navbar-turnos__login">INICIAR SESIÓN</button>
    </header>
  )
}

export default NavbarTurnos
