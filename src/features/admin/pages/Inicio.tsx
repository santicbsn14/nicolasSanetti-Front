import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink, Images, ShoppingBag } from 'lucide-react'
import BarraSuperior from '../components/BarraSuperior'
import './Inicio.css'

export default function Inicio() {
  return (
    <>
      <BarraSuperior titulo="Panel" mostrarSalir />
      <main className="adm-contenido">
        <h2 className="adm-inicio__saludo">Hola, Nico</h2>
        <p className="adm-inicio__sub">¿Qué querés cambiar en la web?</p>

        <nav className="adm-inicio__tarjetas" aria-label="Secciones del panel">
          <Link to="/admin/productos" className="adm-inicio__tarjeta adm-tarjeta">
            <span className="adm-inicio__icono" aria-hidden="true">
              <ShoppingBag size={30} />
            </span>
            <span className="adm-inicio__textos">
              <span className="adm-inicio__titulo">Productos</span>
              <span className="adm-inicio__desc">Lo que vendés en el salón</span>
            </span>
            <ChevronRight size={24} aria-hidden="true" className="adm-inicio__flecha" />
          </Link>

          <Link to="/admin/galeria" className="adm-inicio__tarjeta adm-tarjeta">
            <span className="adm-inicio__icono" aria-hidden="true">
              <Images size={30} />
            </span>
            <span className="adm-inicio__textos">
              <span className="adm-inicio__titulo">Galería de trabajos</span>
              <span className="adm-inicio__desc">Fotos de tus trabajos</span>
            </span>
            <ChevronRight size={24} aria-hidden="true" className="adm-inicio__flecha" />
          </Link>
        </nav>

        <a href="/" target="_blank" rel="noopener noreferrer" className="adm-link adm-inicio__web">
          Ver la web <ExternalLink size={18} aria-hidden="true" />
        </a>
      </main>
    </>
  )
}
