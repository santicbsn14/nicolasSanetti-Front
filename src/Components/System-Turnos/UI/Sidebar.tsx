import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import '../Css/Sidebar.css'

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si estamos en mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 850)
      // Cerrar sidebar si cambió a desktop
      if (window.innerWidth > 850) {
        setIsOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  // Cerrar sidebar al hacer click en un link (mobile)
  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar()
    }
  }

  return (
    <>
      {/* Botón toggle para mobile */}
      {isMobile && (
        <button 
          className="sidebar__toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      )}
      
      {/* Overlay para mobile */}
      {isMobile && (
        <div 
          className={`sidebar__overlay ${isOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar-prof ${isOpen ? 'mobile-open' : ''}`}>
        <h2 className="sidebar__title">Peluquero</h2>
        <nav className="sidebar__nav">
          <NavLink 
            to="/turnos/professional/dashboard" 
            className="sidebar__link"
            onClick={handleLinkClick}
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/turnos/professional/turnos" 
            className="sidebar__link"
            onClick={handleLinkClick}
          >
            Mis turnos
          </NavLink>
          <NavLink 
            to="/turnos/professional/horarios" 
            className="sidebar__link"
            onClick={handleLinkClick}
          >
            Mis horarios
          </NavLink>
          <NavLink 
            to="/turnos/professional/servicios" 
            className="sidebar__link"
            onClick={handleLinkClick}
          >
            Mis Servicios
          </NavLink>
          <NavLink 
            to="/turnos/professional/notificaciones" 
            className="sidebar__link"
            onClick={handleLinkClick}
          >
            Notificaciones
          </NavLink>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar