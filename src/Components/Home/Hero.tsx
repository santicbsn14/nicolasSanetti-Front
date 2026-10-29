import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildWaLink, MENSAJE_TURNO } from '../../features/whatsapp/whatsapp';
import heroVideo from '../Videos/hero-vertical.mp4';
import heroPoster from '../Videos/hero-vertical.webp';
import fotoNico from '../Imagenes/hero-nico.webp';
import fotoSalon from '../Imagenes/hero-salon.webp';
import './Hero.css';

// Portada: texto a la izquierda y mosaico con el video vertical completo
// (sin recortes) entre dos fotos del fotógrafo.
const Hero: React.FC = () => {
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    // React no siempre deja el atributo muted en el DOM y sin él iOS no hace autoplay
    video.muted = true;
    video.play().catch(() => {});
  }, [reducedMotion]);

  return (
    <section className="hero" aria-label="Portada">
      <div className="hero__inner">
        <div className="hero__texto">
          <p className="hero__eyebrow">
            <span className="hero__dot" aria-hidden="true">•</span>
            San Nicolás de los Arroyos
            <span className="hero__dot" aria-hidden="true">•</span>
          </p>
          <h1 className="hero__titulo">
            Estilo, color
            <br />
            y bienestar
          </h1>
          <p className="hero__bajada">
            Más que un servicio, un espacio para relajarte, renovarte y salir
            con una sonrisa.
          </p>
          <div className="hero__acciones">
            <a
              className="hero__btn hero__btn--primario"
              href={buildWaLink(MENSAJE_TURNO)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reservá tu turno
            </a>
            <Link className="hero__btn hero__btn--secundario" to="/servicios">
              Ver servicios
            </Link>
          </div>
        </div>

        <div className="hero__mosaico">
          <figure className="hero__tile hero__tile--izq">
            <img
              src={fotoNico}
              alt="Nicolás Sanetti peinando a una modelo"
              decoding="async"
            />
          </figure>

          <div className="hero__tile hero__tile--video">
            <video
              ref={videoRef}
              src={heroVideo}
              poster={heroPoster}
              autoPlay={!reducedMotion}
              preload={reducedMotion ? 'none' : 'auto'}
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          </div>

          <figure className="hero__tile hero__tile--der">
            <img
              src={fotoSalon}
              alt="El salón de Nicolás Sanetti Coiffeur"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Hero;
