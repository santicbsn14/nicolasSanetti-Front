import type { FC } from 'react'
import { useState, useEffect } from 'react'
import SidebarFiltros from '../Layout/SideBarFiltros'
import ServicioCard from '../UI/TurnosCard'
import TurnosHeader from '../Layout/TurnosHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { getServices } from '../../../Services-Api/Services'
import type { IService } from '../../../Services-Api/Services' // Ajusta la ruta según donde tengas definida la interfaz

import '../turnos.css'

// Interfaz para el formato que espera ServicioCard
interface ServicioCardData {
    _id: string;
    titulo: string;
    descripcion: string;
    duracion: number;
    precio: number;
}
interface ServicesResponse {
    services: IService[];
}
const Turnos: FC = () => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
    const [_servicios, setServicios] = useState<IService[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [serviciosAgrupados, setServiciosAgrupados] = useState<Record<string, ServicioCardData[]>>({})
    const [busqueda, setBusqueda] = useState('');

    // Función para categorizar servicios
    const categorizarServicio = (nombreServicio: string): string => {
        const nombre = nombreServicio.toLowerCase();

        if (nombre.includes('corte') || nombre.includes('barberia') || nombre.includes('barba')) {
            return 'CORTE Y BARBERIA';
        } else if (nombre.includes('lavado') || nombre.includes('peinado') || nombre.includes('brushing')) {
            return 'LAVADO Y PEINADO';
        } else if (nombre.includes('color') || nombre.includes('mecha') || nombre.includes('tintura') || nombre.includes('decolor')) {
            return 'COLORACION Y MECHAS';
        } else {
            return 'OTROS';
        }
    };

    // Función para agrupar servicios por categoría
    const agruparServicios = (servicios: IService[]): Record<string, ServicioCardData[]> => {
        const agrupados: Record<string, ServicioCardData[]> = {}

        servicios.forEach(servicio => {
            const categoria = categorizarServicio(servicio.name)

            if (!agrupados[categoria]) {
                agrupados[categoria] = []
            }

            // Convertir Service a ServicioCardData
            const servicioCard: ServicioCardData = {
                _id: servicio._id as unknown as string,
                titulo: servicio.name,
                descripcion: servicio.description,
                duracion: servicio.duration,
                precio: servicio.price.toLocaleString('es-AR') as unknown as number
            }

            agrupados[categoria].push(servicioCard)
        })

        return agrupados
    }

    // Función para obtener los servicios
    const fetchServicios = async () => {
        try {
            setLoading(true)
            setError(null)

            const data: ServicesResponse = await getServices()

            // Filtrar solo servicios habilitados
            const serviciosHabilitados = data.services.filter(servicio => servicio.enabled)

            setServicios(serviciosHabilitados)

            // Agrupar servicios por categoría
            const agrupados = agruparServicios(serviciosHabilitados)
            setServiciosAgrupados(agrupados)

            // Establecer la primera categoría como seleccionada por defecto
            const categorias = Object.keys(agrupados)
            if (categorias.length > 0 && !categoriaSeleccionada) {
                setCategoriaSeleccionada(categorias[0])
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los servicios')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServicios()
    }, [])

    // Estado de carga
    if (loading) {
        return (
            <section style={{ backgroundColor: 'white', paddingBottom: '8rem', transform: 'scale(0.9)' }}>
                <div className="turnos-topbar">
                    <div className="turnos-topbar__location">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>Colón 153, San Nicolás de Los Arroyos</span>
                    </div>
                    <div className="turnos-topbar__whatsapp">
                        <FontAwesomeIcon icon={faWhatsapp} />
                        <span>+54 9 3364 614298</span>
                    </div>
                </div>
                <TurnosHeader />
                <div className="turnos-divider-horizontal" />
                <div className="turnos__contenedor">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>Cargando servicios...</p>
                    </div>
                </div>
            </section>
        )
    }

    // Estado de error
    if (error) {
        return (
            <section style={{ backgroundColor: 'white', paddingBottom: '8rem', transform: 'scale(0.9)' }}>
                <div className="turnos-topbar">
                    <div className="turnos-topbar__location">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>Colón 153, San Nicolás de Los Arroyos</span>
                    </div>
                    <div className="turnos-topbar__whatsapp">
                        <FontAwesomeIcon icon={faWhatsapp} />
                        <span>+54 9 3364 614298</span>
                    </div>
                </div>
                <TurnosHeader />
                <div className="turnos-divider-horizontal" />
                <div className="turnos__contenedor">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p style={{ color: 'red' }}>Error: {error}</p>
                        <button onClick={fetchServicios} style={{ marginTop: '1rem' }}>
                            Reintentar
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    // Renderizado principal
    return (
        <section style={{ backgroundColor: 'white', paddingBottom: '8rem', transform: 'scale(0.9)' }}>
            <div className="turnos-topbar">
                <div className="turnos-topbar__location">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>Av. San Nicolás 2323</span>
                </div>
                <div className="turnos-topbar__whatsapp">
                    <FontAwesomeIcon icon={faWhatsapp} />
                    <span>+54 3364 614298</span>
                </div>
            </div>
            <TurnosHeader />
            <div className="turnos-divider-horizontal" />
            <div className="turnos__contenedor">
                <SidebarFiltros
                    categorias={Object.keys(serviciosAgrupados)}
                    onCategoriaSelect={setCategoriaSeleccionada}
                    categoriaSeleccionada={categoriaSeleccionada}
                    onBusquedaChange={setBusqueda}
                />

                <div className="turnos__contenido">
                    <h2 className="turnos__titulo">{categoriaSeleccionada}</h2>
                    <div className="turnos__linea-horizontal" />
                    <div className="turnos__cards">
                        {serviciosAgrupados[categoriaSeleccionada]
                            ?.filter((servicio) =>
                                servicio.titulo.toLowerCase().includes(busqueda.toLowerCase())
                            )
                            .map((servicio, i) => (
                                <ServicioCard key={i} {...servicio} />
                            ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Turnos