import React, { useEffect, useRef, useState } from 'react';
import heroDesktop from '../Videos/hero-desktop.mp4';
import heroDesktopPoster from '../Videos/hero-desktop.webp';
import heroMobile from '../Videos/hero-mobile.mp4';
import heroMobilePoster from '../Videos/hero-mobile.webp';
import ColorCarousel from './CarrouselServices';
import estrellitas from '../Imagenes/estrellitas.png';
import spa from '../Imagenes/spa-y-relax.png';
import infinito from '../Imagenes/infinito.png';
import librito from '../Imagenes/librito.png';
import fotoNicolas from '../Imagenes/fotoNicolas_.webp'
import './Home.css'
// Video del hero elegido por Nico (material-nico/video-portada.mp4), en versión horizontal y vertical.
const HERO_VIDEO = {
  desktop: { src: heroDesktop, poster: heroDesktopPoster },
  mobile: { src: heroMobile, poster: heroMobilePoster },
};

// Se decide una sola vez al montar: no cambia si se redimensiona la ventana.
const elegirHero = () => {
  const formato = window.matchMedia('(orientation: landscape) and (min-width: 769px)').matches ? 'desktop' : 'mobile';
  return {
    ...HERO_VIDEO[formato],
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
};

const Home: React.FC = () => {
  const [hero] = useState(elegirHero);
  const heroRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroRef.current;
    if (!video || hero.reducedMotion) return;
    // React no siempre deja el atributo muted en el DOM y sin él iOS no hace autoplay
    video.muted = true;
    video.play().catch(() => {});
  }, [hero]);

  return (
    <div className="font-sans text-gray-900">
      {/* Portada */}
<section className="hero-section">
  <video
    ref={heroRef}
    className="hero-section__video"
    src={hero.src}
    poster={hero.poster}
    autoPlay={!hero.reducedMotion}
    preload={hero.reducedMotion ? 'none' : 'auto'}
    muted
    loop
    playsInline
    aria-hidden="true"
  />
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
          loading="lazy"
          decoding="async"
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
