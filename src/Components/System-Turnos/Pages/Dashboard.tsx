import { useEffect, useState, type FC } from 'react'

import { type Appointment } from '../Pages/MisTurnos';
import dayjs from 'dayjs'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Css/Dasboard.css'
import { getAppointments } from '../../../Services-Api/Appointments';
export const getAppointmentsApi = async (): Promise<Appointment[]> => {
  try {
    const response = await getAppointments()// Ajusta la URL según tu API
    if (!response.appointments) {
      throw new Error('Error al obtener los turnos');
    }

    return response.appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

const Dashboard: FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
      const loadAppointments = async () => {
        try {
          setLoading(true);
        
          const appointmentsData = await getAppointmentsApi();
          console.log(appointmentsData)
          setAppointments(appointmentsData);

        } catch (err) { 
        const errorMessage = err instanceof Error ? err.message : String(err);
        toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      };
  
      loadAppointments();
    }, []);
  const turnosHoy = appointments.filter(t => dayjs(t.date_time).isSame(dayjs(), 'day'))
  const clientesAsignados = turnosHoy.length
    if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#333'
      }}>
        <div>Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Bienvenido</h1>

      <section className="dashboard__stats">
        <div className="dashboard__card">
          <h3>Turnos de hoy</h3>
          <p>{turnosHoy.length}</p>
        </div>
        <div className="dashboard__card">
          <h3>Clientes asignados</h3>
          <p>{clientesAsignados}</p>
        </div>
      </section>

      <section className="dashboard__list">
        <h2>Listado de turnos</h2>
        <ul>
          {turnosHoy.map((turno: Appointment) => (
            <li key={turno._id} className="dashboard__item">
              <div className="dashboard__item-info">
                <div className="dashboard__item-name">{turno.client_id.firstname} {turno.client_id.lastname}</div>
                <div className="dashboard__item-time">
                  {dayjs(turno.date_time).format('HH:mm')} - {turno.service_id.name}
                </div>
              </div>
              <div>
                <span className={`dashboard__status dashboard__status--${turno.state}`}>
                  {turno.state === 'Pendiente' ? 'Pendiente' : 'Confirmado'}
                </span>
                <a
                  href={`https://wa.me/${turno.client_id.phone}`}
                  target="_blank"
                  className="dashboard__whatsapp"
                >
                  WhatsApp
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  )
}

export default Dashboard
