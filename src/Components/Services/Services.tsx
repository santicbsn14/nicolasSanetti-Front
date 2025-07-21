import type {FC} from 'react'
import port from '../Imagenes/port-services-port_.webp'
import primerService from '../Imagenes/primerService_.webp'
import segundoService from '../Imagenes/ServicioDos_.webp'
import tercerService from '../Imagenes/servicioTres_.webp'
import './Services.css'

const Services : FC = () =>{
  
    const servicios = [
        {
          titulo: 'LAVADO Y PEINADO',
          descripcion:
            'Más que un servicio, es un momento de relax y bienestar. Con nuestro lavacabezas premium a 180°, disfrutas de un masaje capilar revitalizante, acompañado de productos de alta calidad que nutren y protegen tu cabello. Te invitamos a desconectar y disfrutar de una experiencia única. Luego, nuestro equipo de expertos crea el peinado ideal para ti: desde un brushing perfecto hasta ondas suaves, un alisado impecable o un recogido elegante. Todo pensado para que tu look refleje tu estilo, realce tu belleza y te haga sentir radiante en cualquier ocasión.',
          imagen: primerService,
          precios: [
            { nombre: 'LAVADO Y BRUSHING', valor: '10.000' },
            { nombre: 'PEINADOS', valor: '20.000', desde: true },
          ],
          bgColor: "white",
          reverse: false,
        },
        {
            titulo: 'CORTE Y BARBERÍA',
            descripcion:
              'Más que un corte, es un momento de renovación. Con nuestro servicio premium, disfrutas de toallas calientes, masajes faciales y productos de calidad. Luego, creamos tu estilo ideal: cortes clásicos, degradados, perfilado de barba o afeitado, para que tu imagen refleje tu personalidad y te haga sentir impecable.',
            imagen: segundoService,
            precios: [
              { nombre: 'LAVADO Y CORTE FEMENINO', valor: '15.000' },
              { nombre: 'LAVADO Y CORTE MASCULINO', valor: '15.000' },
              { nombre: 'LAVADO, CORTE Y BARBA', valor: '18.000' },
            ],
            bgColor:'#F4EFE5',
            reverse: true
          },
          {
            titulo: 'COLORACIÓN Y MECHAS',
            descripcion:
              'Más que un color, es una transformación. Con nuestra coloración premium, cuidamos tu cabello con productos de calidad y técnicas personalizadas. Disfruta de un servicio cómodo y relajante mientras creamos el tono ideal: balayage, babylights, reflejos o coloración completa, para que tu look resalte y te haga sentir única.',
            imagen: tercerService,
            precios: [
              { nombre: 'COLOR', valor: '28.000', desde: true },
              { nombre: 'REFLEJOS', valor: '50.000', desde: true },
              { nombre: 'HIGH LIGHT', valor: '50.000', desde: true },
              { nombre: 'BALAYAGE', valor: '90.000', desde: true },
              { nombre: 'DECOLORACION', valor: '40.000', desde: true },
            ],
            bgColor:'white',
            reverse: false
          },
        // Podés seguir agregando más objetos de este tipo
      ];
    return (
        <section className='services'>
            <div className='port-services'>
                <img className='port-services-img' src={port} alt="Imagen de portada Historia" />
                <div className="titulo-overlay">SERVICIOS</div>
            </div>
            <div className="mosaico-precios"> 
                <span>Precios vigentes desde el 4/12/2024 </span> 
                <span className="divider">|</span> 
                <span>3 y 6 cuotas sin interés</span>
            </div>
            <section className="servicios-section">
      {servicios.map((servicio, index) => (
        <div key={index} className="servicio" style={{ backgroundColor: servicio.bgColor }}>
            <div className={`servicio-content ${servicio.reverse ? "reverse" : ""}`}>
          <div className="servicio-imagen">
            <img src={servicio.imagen} alt={servicio.titulo} />
          </div>
          <div className="servicio-texto">
            <h2>{servicio.titulo}</h2>
            <p>{servicio.descripcion}</p>
            <div className="servicio-precios">
              {servicio.precios.map((precio, i) => (
                <div key={i} className="precio-item">
                  <span className="precio-nombre">{precio.nombre}</span>
                  <span className="precio-valor">
                    {precio.desde ? 'Desde ' : ''}
                    {precio.valor}
                  </span>
                </div>
              ))}
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