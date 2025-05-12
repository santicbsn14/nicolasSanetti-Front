import React from 'react';
import portHome from '../Imagenes/port-NicoSanetti.jpg';
import ColorCarousel from './CarrouselServices';
import estrellitas from '../Imagenes/estrellitas.png';
import spa from '../Imagenes/spa-y-relax.png';
import infinito from '../Imagenes/infinito.png';
import librito from '../Imagenes/librito.png';
import fotoNicolas from '../Imagenes/fotoNicolas.png'
import './Home.css'
const Home: React.FC = () => {
  return (
    <div className="font-sans text-gray-900">
      {/* Portada */}
      <section className="w-full h-[90vh] bg-cover bg-center" style={{
        backgroundImage: `url(${portHome})`, height: '816px', backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Dejá el espacio para que se cargue la imagen desde el estilo */}
      </section>

      {/* Sección Color */}
      <ColorCarousel />

      {/* Sección Experiencia Destacada */}
      <section className="virtudes-section">
        <div className="virtudes-grid">
          <div className="virtud-item">
            <img src={estrellitas} className="virtud-icon"></img>
            <h3 className="virtud-title">EXPERIENCIA EN ESPECTÁCULOS</h3>
            <p className="virtud-text">
              Experiencia laboral con celebridades, eventos, desfiles, teatro y televisión, destacando en el rubro.
            </p>
          </div>
          <div className="virtud-item">
            <img src={librito} className="virtud-icon"></img>
            <h3 className="virtud-title">FORMACIÓN INTERNACIONAL</h3>
            <p className="virtud-text">
              Experiencia laboral en Europa, incorporando conocimientos, técnicas y tendencias de vanguardia en el sector.
            </p>
          </div>
          <div className="virtud-item">
            <img src={spa} className="virtud-icon"></img>
            <h3 className="virtud-title">BIENESTAR, RELAX Y MÁS</h3>
            <p className="virtud-text">
              Un ambiente perfecto para desconectar, relajarte, renovar energías y disfrutar de una experiencia única.
            </p>
          </div>
          <div className="virtud-item">
            <img src={infinito} className="virtud-icon"></img>
            <h3 className="virtud-title">AMBIENTE ÚNICO PARA VOS</h3>
            <p className="virtud-text">
              Infusiones, buena música y espacios amplios con vista al parque San Martín para tu confort y bienestar.
            </p>
          </div>
        </div>
      </section>


      {/* Sección Historia / Fundador */}
      <section className="nicolas-section">
      <div className="nicolas-container">
        <img
          src={fotoNicolas}
          alt="Nicolas Sanetti working"
          className="nicolas-image"
        />
        <div className="nicolas-text">
          <h2>NICOLAS SANETTI COIFFEUR</h2>
          <h3>FOUNDER</h3>
          <p>
            Somos un equipo que no solo cuida tu cabello, sino que también te
            brindamos un espacio diseñado para tu bienestar. Nuestra ubicación
            privilegiada en el centro de la ciudad, con vista al río y rodeados
            de naturaleza, crea el entorno perfecto para que tu visita sea un
            momento de relax y desconexión.
          </p>
          <p>
          Aquí encontrarás un ambiente de calma y buenas energías,
          donde cada detalle está pensado para que disfrutes de una experiencia placentera.
          Nos enfocamos en realzar tu imagen mientras cuidamos de tu bienestar,
          combinando profesionalismo, creatividad y un trato personalizado
          </p>
          <p>
          Más que un servicio, ofrecemos un espacio donde puedas relajarte,
          renovarte y salir con una sonrisa, sintiéndote en armonía contigo
          misma/o y con la confianza de verte y sentirte mejor.
          </p>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Home;
