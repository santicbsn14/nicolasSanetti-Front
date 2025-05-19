import type {FC} from 'react'
import {  useState } from 'react'
import SidebarFiltros from '../Layout/SideBarFiltros'
import ServicioCard from '../UI/TurnosCard'
import { serviciosData } from '../../MockService/Turnos'
import TurnosHeader from '../Layout/TurnosHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faWhatsapp} from  '@fortawesome/free-brands-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import '../turnos.css'

const Turnos : FC = () => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Lavado y Peinado')
    return (
        <section style={{backgroundColor:'white', paddingBottom:'8rem'}}>
                  <div className="turnos-topbar">
        <div className="turnos-topbar__location">
          <FontAwesomeIcon icon={faLocationDot}/>
          <span>Av. San Nicolás 2323</span>
        </div>
        <div className="turnos-topbar__whatsapp">
          <FontAwesomeIcon icon={faWhatsapp} />
          <span>+54 9 458 9282</span>
        </div>
      </div>
            <TurnosHeader/>
            <div className="turnos-divider-horizontal" />
            <div className="turnos__contenedor">
        <SidebarFiltros
          categorias={Object.keys(serviciosData)}
          onCategoriaSelect={setCategoriaSeleccionada}
          categoriaSeleccionada={categoriaSeleccionada}
        />

        <div className="turnos__contenido">
          <h2 className="turnos__titulo">{categoriaSeleccionada}</h2>
          <div className="turnos__linea-horizontal" />
          <div className="turnos__cards">
            {serviciosData[categoriaSeleccionada]?.map((servicio, i) => (
              <ServicioCard key={i} {...servicio} />
            ))}
          </div>
        </div>
      </div>
        </section>
    )
}
export default Turnos