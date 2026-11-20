import type {FC} from 'react'
import { Link } from 'react-router-dom'
import { buildWaLink } from '../../features/whatsapp/whatsapp'
import port from '../Imagenes/port-services-port_.webp'
// import primerService from '../Imagenes/primerService_.webp'
import segundoService from '../Imagenes/ServicioDos_.webp'
import tercerService from '../Imagenes/colorYMechas.webp'
import video from '../Videos/servicio-lavado.mp4'
import videoPoster from '../Videos/servicio-lavado.webp'
import VideoLazy from '../Videos/VideoLazy'
import './Services.css'

const Services : FC = () =>{
  
    const servicios = [
        {
          titulo: 'LAVADO Y PEINADO',
          slug: 'lavado-y-peinado',
          descripcion:
            'Más que un servicio, es un momento de relax y bienestar. Con nuestro lavacabezas premium a 180°, disfrutas de un masaje capilar revitalizante, acompañado de productos de alta calidad que nutren y protegen tu cabello. Te invitamos a desconectar y disfrutar de una experiencia única. Luego, nuestro equipo de expertos crea el peinado ideal para ti: desde un brushing perfecto hasta ondas suaves, un alisado impecable o un recogido elegante. Todo pensado para que tu look refleje tu estilo, realce tu belleza y te haga sentir radiante en cualquier ocasión.',
          media: video, // Cambiamos 'imagen' por 'media'
          mediaType: 'video', // Agregamos el tipo: 'image' o 'video'
          prestaciones: [
            'LAVADO Y BRUSHING',
            'PEINADOS',
          ],
          bgColor: "white",
          reverse: false,
        },
        {
            titulo: 'CORTE Y BARBERÍA',
            slug: 'corte-y-barberia',
            descripcion:
              'Es un momento de renovación. Con nuestro servicio premium, disfrutas de productos de calidad. Luego, creamos tu estilo ideal: cortes clásicos, degradados, perfilado de barba o afeitado, para que tu imagen refleje tu personalidad y te haga sentir impecable.',
            media: segundoService,
            mediaType: 'image',
            prestaciones: [
              'LAVADO Y CORTE FEMENINO',
              'LAVADO Y CORTE MASCULINO',
              'LAVADO, CORTE Y BARBA',
            ],
            bgColor:'#F4EFE5',
            reverse: true
          },
          {
            titulo: 'COLORACIÓN Y MECHAS',
            slug: 'coloracion-y-mechas',
            descripcion:
              'Más que un color, es una transformación. Con nuestra coloración premium, cuidamos tu cabello con productos de calidad y técnicas personalizadas. Disfruta de un servicio cómodo y relajante mientras creamos el tono ideal: balayage, babylights, reflejos o coloración completa, para que tu look resalte y te haga sentir única.',
            media: tercerService,
            mediaType: 'image',
            prestaciones: [
              'COLOR',
              'REFLEJOS',
              'HIGH LIGHT',
              'BALAYAGE',
              'DECOLORACION',
            ],
            bgColor:'white',
            reverse: false
          },
      ];
    
    return (
        <section className='services'>
            <div className='port-services'>
                <img className='port-services-img' src={port} alt="Portada de Servicios" />
                <div className="titulo-overlay">SERVICIOS</div>
            </div>
            <section className="servicios-section">
      {servicios.map((servicio, index) => (
        <div key={index} className="servicio" style={{ backgroundColor: servicio.bgColor }}>
            <div className={`servicio-content ${servicio.reverse ? "reverse" : ""}`}>
          <div className="servicio-imagen">
            {servicio.mediaType === 'video' ? (
              <VideoLazy
                src={servicio.media}
                poster={videoPoster}
                className="servicio-media"
              />
            ) : (
              <img 
                src={servicio.media} 
                alt={servicio.titulo}
                className="servicio-media"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <div className="servicio-texto">
            <h2>{servicio.titulo}</h2>
            <p>{servicio.descripcion}</p>
            <ul className="servicio-precios">
              {servicio.prestaciones.map((nombre) => (
                <li key={nombre} className="precio-item">
                  <span className="precio-nombre">{nombre}</span>
                </li>
              ))}
            </ul>
            <div className="servicio-links">
              <a
                className="servicio-link servicio-link--wa"
                href={buildWaLink(`¡Hola Nico! Quería consultar el precio de ${servicio.titulo.toLowerCase()}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultá precios por WhatsApp
              </a>
              <Link className="servicio-link servicio-galeria-link" to={`/galeria?servicio=${servicio.slug}`}>
                Ver trabajos de {servicio.titulo.toLowerCase()}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          </div>
        </div>
      ))}
    </section>
        </section>
    )
}

export default Services