import type {FC} from 'react'
import port from '../Imagenes/port-services.png'
import imagen1 from '../Imagenes/historiaUno.webp'
import imagen2 from '../Imagenes/historiaDos_.webp'
import imagen3 from '../Imagenes/historiaTres_.webp'
import imagen4 from '../Imagenes/historiaCuatro_.webp'
import imagen5 from '../Imagenes/historiaCinco_.webp'
import './Historia.css'
const Historia : FC = () =>{
    return (
        <section className='historia'>
            <div className='port-historia'>
                <img className='port-historia-img' src={port} alt="Imagen de portada Historia" />
                <div className="titulo-overlay">HISTORIA</div>
            </div>
            <div className="mosaico-precios"> 
                <span>Precios vigentes desde el 4/12/2024 </span> 
                <span className="divider">|</span> 
                <span>3 y 6 cuotas sin interés</span>
            </div>
            <div className="historia-contenido">
                {/* Sección 1 */}
                <div className="historia-seccion">
                    <h2 className="historia-titulo"><span className="punto-dorado">•</span>UN SUEÑO CON RULEROS <span className="punto-dorado">•</span></h2>
                    <div className="historia-imagen-container">
                        <img src={imagen1} alt="Un sueño con ruleros" className="historia-imagen" />
                    </div>
                    <p className="historia-texto">
                        Desde muy pequeño, mi interés por la peluquería comenzó gracias a mi abuela, 
                        quien siempre me pedía que le peine con ruleros. A los 15 años, decidí dar mis 
                        primeros pasos en este mundo estudiando en Ficciaro, y desde entonces no he 
                        parado de aprender. En el último año de la escuela secundaria, tuve mi primer contacto profesional con el estilismo al trabajar en un 
                        gran salón de otra ciudad. Viajé todos los días y poner en práctica mis 
                        conocimientos fue un desafío, pero también una experiencia invaluable para 
                        aprender a relacionarme con los clientes y crecer profesionalmente.
                    </p>
                </div>
                
                {/* Sección 2 */}
                <div className="historia-seccion">
                    <h2 className="historia-titulo"><span className="punto-dorado">•</span>PASIÓN Y CRECIMIENTO <span className="punto-dorado">•</span></h2>
                    <div className="historia-imagen-container">
                        <img src={imagen2} alt="Pasión y crecimiento" className="historia-imagen" />
                    </div>
                    <p className="historia-texto">
                        A lo largo de mi carrera, las capacitaciones han sido fundamentales, pero lo que 
                        realmente me ha forjado ha sido la experiencia adquirida en distintos lugares, 
                        conociendo personas y adaptándome a las necesidades del mercado. No tuve un 
                        mentor específico, pero desde chico me fascinaba la moda y los desfiles que veía
                        por televisión. Trabajar con importantes marcas nacionales e internacionales y 
                        celebridades, un logro que marcó un hito en mi trayectoria.
                    </p>
                </div>
                
                {/* Sección 3 */}
                <div className="historia-seccion">
                    <h2 className="historia-titulo"><span className="punto-dorado">•</span>MÁS QUE TENDENCIAS <span className="punto-dorado">•</span></h2>
                    <div className="historia-imagen-container">
                        <img src={imagen3} alt="Más que tendencias" className="historia-imagen" />
                    </div>
                    <p className="historia-texto">
                        En mi salón, me especializo en trabajos tanto para hombres como para mujeres, 
                        con un enfoque particular en los colores rubios, utilizando técnicas como 
                        balayage, highlights y tintes personalizados. Siempre me gusta informar a mis 
                        clientes sobre las tendencias de cada temporada, pero mi principal consejo es que 
                        elijan aquello que mejor les favorezca y con lo que se sientan cómodos. Mi objetivo 
                        principal es que cada persona salga satisfecha del salón y se sienta llena de 
                        confianza en su imagen.
                    </p>
                </div>
                
                {/* Sección 4 */}
                <div className="historia-seccion">
                    <h2 className="historia-titulo"><span className="punto-dorado">•</span>DEL SALÓN A LA ÉLITE <span className="punto-dorado">•</span></h2>
                    <div className="historia-imagen-container">
                        <img src={imagen4} alt="Del salón a la élite" className="historia-imagen" />
                    </div>
                    <p className="historia-texto">
                        Uno de los momentos más significativos de mi carrera fue el honor de haber 
                        peinado en la boda de Lionel Messi y Antonela Roccuzzo. Llevar mi trabajo a ese 
                        nivel fue un reconocimiento a años de esfuerzo y sacrificio. Además, con el tiempo, 
                        he adaptado mis servicios a las necesidades actuales, ofreciendo mayor 
                        comodidad, servicios de larga duración para facilitar el mantenimiento en casa y 
                        ampliando los horarios de atención para brindar una mejor experiencia.
                    </p>
                </div>
                
                {/* Sección 5 */}
                <div className="historia-seccion">
                    <h2 className="historia-titulo"><span className="punto-dorado">•</span>CONFIANZA Y EVOLUCIÓN <span className="punto-dorado">•</span></h2>
                    <div className="historia-imagen-container">
                        <img src={imagen5} alt="Confianza y evolución" className="historia-imagen" />
                    </div>
                    <p className="historia-texto">
                        Cada día en el salón es una nueva oportunidad para crear historias y compartir 
                        momentos especiales con mis clientes. Lo que más valoro es la confianza y 
                        la conexión que se genera en cada visita. Mi mayor satisfacción es la fidelización 
                        y cuando confían en mi trabajo, y por eso siempre me esfuerzo en estar a la 
                        vanguardia. Mi visión para el futuro es seguir creciendo, modernizar el 
                        salón, ofrecer nuevos servicios y seguir viajando al exterior para capacitarme y 
                        traer nuevas tendencias para mis clientes.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Historia