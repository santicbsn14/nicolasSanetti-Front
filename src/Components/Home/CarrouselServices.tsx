import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import itemUno from '../Imagenes/itemUno.png';
import itemDos from '../Imagenes/itemDos.png';
import itemTres from '../Imagenes/itemTres.png';
import itemCuatro from '../Imagenes/itemCuatro.png'
import './CarrouselServices.css';

type Slide = {
  title: string;
  paragraphs: string[];
  img: string;
};

const slides: Slide[] = [
  {
    title: 'COLOR',
    paragraphs: [
      'El servicio de color es un universo infinito, adaptado a cada cliente según sus necesidades y estilo. Si bien el mantenimiento de raíces es lo más frecuente, existen muchas opciones para transformar el cabello: cambios totales, correcciones, contrastes, iluminaciones, decoloraciones y mechas, entre otros.',
      'Nuestro objetivo es asesorarte y encontrar el color ideal para ti, realzando tu belleza mientras cuidamos la salud de tu cabello.',
    ],
    img: itemUno,
  },
  {
    title: 'ILUMINACIÓN',
    paragraphs: [
      'Nuestro corte está diseñado exclusivamente para vos, adaptándose a la textura de tu cabello, tu estilo personal y tu rutina diaria. Buscamos crear un look que no solo te favorezca, sino que también sea práctico y fácil de mantener, para que siempre luzcas impecable sin esfuerzo.',
      'Cada corte es único, pensado para resaltar tu belleza natural y brindarte comodidad, equilibrio y armonía con tu imagen.',
    ],
    img: itemDos,
  },
  {
    title: 'CORTE Y ESTILO',
    paragraphs: [
      'El servicio más esperado del salón, diseñado para brindarte una experiencia de relajación absoluta. Contamos con un lavacabezas premium con inclinación a 180 grados, que se adapta perfectamente para ofrecerte el máximo confort.',
      'Cada lavado se convierte en un verdadero momento de disfrute, combinando masajes capilares, productos de alta calidad y un ambiente pensado para tu bienestar. Más que un simple paso en tu rutina de belleza, es una pausa de relax total, donde podés desconectarte y renovar energías mientras cuidamos tu cabello.',
    ],
    img: itemTres,
  },
  {
    title: 'PEINADO',
    paragraphs: [
      'Hay muchas maneras de lograr el peinado perfecto, adaptado a tu estilo, tipo de cabello y ocasión. Desde un brushing pulido, alisado con planchita o diferentes tipos de ondas, hasta recogidos, semi recogidos y trenzas.',
      'Trabajamos cada detalle para que tu look refleje tu personalidad y te haga sentir segura y radiante, ya sea para un evento especial o para el día a día.',
    ],
    img: itemCuatro,
  },
];

const ColorCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const current = slides[index];
  const next = slides[(index + 1) % slides.length];

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        <div className="carousel-text">
        <h2 className="carousel-title ">
  <span className="carousel-dot">●</span>
  {current.title.trim()}
  <span className="carousel-dot">●</span>
</h2>

          {current.paragraphs.map((p, i) => (
            <p key={i} className="carousel-paragraph">{p}</p>
          ))}
                <div className="carousel-buttons">
        <button onClick={prevSlide} className="carousel-btn">
          <ArrowLeft size={20} />
        </button>
        <button onClick={nextSlide} className="carousel-btn">
          <ArrowRight size={20} />
        </button>
      </div>
        </div>
        <div className="carousel-images">
          <AnimatePresence mode="wait">
            <motion.img
              key={current.img}
              src={current.img}
              alt="Actual"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="carousel-main-img"
            />
          </AnimatePresence>
          <img
            src={next.img}
            alt="Siguiente"
            className="carousel-next-img"
          />
        </div>
      </div>
    </section>
  );
};

export default ColorCarousel;

