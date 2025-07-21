import { useState, useEffect } from 'react';
import '../Css/MisTurnos.css'
import { getAppointments, makeAppointment, updateAppointment,deleteAppointment }  from '../../../Services-Api/Appointments';
import { getServices } from '../../../Services-Api/Services';
import { getHairdresserByUserId, type Hairdresser, type IdMongo } from '../../../Services-Api/Hairdresser';
import { useAuth } from '../../Contexts/AuthContext';
import { getClients } from '../../../Services-Api/Clients';
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

import 'react-toastify/dist/ReactToastify.css';
// Tipos basados en tu API
type appointmentState = 'Solicitado' | 'Confirmado' | 'Completado' | 'Cancelado' | 'Pendiente';

interface IClient {
  _id?: string;
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  dni: number;
  phone: number;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Appointment {
  _id?: string;
  client_id: IClient ;
  hairdresser_id: Hairdresser;
  date_time: Date;
  state: appointmentState;
  service_id: Service ;
  notes?: string[];
}

// Función para obtener turnos de la API
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

const MisTurnos = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [hairdresser, setHairdresser] = useState<Hairdresser>()
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState('all'); 
  const [showSuccess, setShowSuccess] = useState('');
  const [clientMode, setClientMode] = useState<'select' | 'create'>('select');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para formulario
  const [appointmentForm, setAppointmentForm] = useState({
    client_id: '',
    date_time: '',
    time: '',
    service_id: '',
    state: 'Pendiente' as appointmentState,
    notes: ''
  });

  const [newClientForm, setNewClientForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    age: '',
    dni: '',
    phone: ''
  });
  const { mongoUser } = useAuth();
  // useEffect para cargar los turnos al montar el componente
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError('');
        const appointmentsData = await getAppointmentsApi();
        const servicesData = await getServices()
        const hairdresser = await getHairdresserByUserId(mongoUser?._id as unknown as IdMongo)
        const clients = await getClients()
        setClients(clients)
        setHairdresser(hairdresser)
        setAppointments(appointmentsData);
        setServices(servicesData.services)
      } catch (err) {
        setError('Error al cargar los turnos. Por favor, intenta nuevamente.');
        const errorMessage = err instanceof Error ? err.message : String(err);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);
  
  const getStateColor = (state: appointmentState) => {
    const colors = {
      'Solicitado': { bg: '#fef3c7', color: '#92400e' },
      'Confirmado': { bg: '#dbeafe', color: '#1d4ed8' },
      'Completado': { bg: '#dcfce7', color: '#166534' },
      'Cancelado': { bg: '#fee2e2', color: '#991b1b' },
      'Pendiente': { bg: '#f3f4f6', color: '#374151' }
    };
    return colors[state];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const canCancelAppointment = (dateTime: Date) => {
  const now = new Date();
  const appointmentDate = new Date(dateTime);
  const diffTime = appointmentDate.getTime() - now.getTime();
  const diffHours = diffTime / (1000 * 60 * 60);
  return diffHours >= 2; // 2 horas de anticipación
  };

  const filterAppointments = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date_time);
      
      switch (filterDate) {
        case 'today':
          return appointmentDate >= today && appointmentDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        case 'week':
          return appointmentDate >= today && appointmentDate <= weekFromNow;
        case 'month':
          return appointmentDate >= today && appointmentDate <= monthFromNow;
        default:
          return true;
      }
    }).sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());
  };

  const generateWhatsAppUrl = (appointment: Appointment) => {
    const client = appointment.client_id;
    const service = appointment.service_id;
    const date = formatDate(new Date(appointment.date_time));
    const time = formatTime(new Date(appointment.date_time));
    
    const message = `Hola ${client.firstname}! Te recordamos que tienes tu turno para ${service.name} el ${date} a las ${time}. ¡Te esperamos! 💇‍♀️✨`;
    
    return `https://api.whatsapp.com/send?phone=${client.phone}&text=${encodeURIComponent(message)}`;
  };

const handleCreateAppointment = async () => {
  try {
    let clientToUse: string | IClient;

    if (clientMode === 'create') {
      // Armar objeto cliente nuevo (aún sin _id)
      const newClient: IClient = {
        firstname: newClientForm.firstname,
        lastname: newClientForm.lastname,
        email: newClientForm.email,
        age: parseInt(newClientForm.age),
        dni: parseInt(newClientForm.dni),
        phone: parseInt(newClientForm.phone)
      };

      // Lo mandamos como client_id (el backend lo interpreta como cliente nuevo)
      clientToUse = newClient;
    } else {
      // Buscar cliente existente
      const existingClient = clients.find(c => c._id === appointmentForm.client_id);
      if (!existingClient) {
        toast.error('Cliente no encontrado');
        return;
      }
      clientToUse = existingClient._id!;
    }

    // Buscar servicio seleccionado
    const selectedService = services.find(s => s._id === appointmentForm.service_id)!;
    const localDate = `${appointmentForm.date_time}T${appointmentForm.time}`;
    const datetime = dayjs.tz(localDate, 'America/Argentina/Buenos_Aires').utc().toDate();

    const newAppointment: Appointment = {
      client_id: clientToUse as unknown as IClient,
      hairdresser_id: hairdresser?._id as unknown as Hairdresser,
      date_time: datetime,
      state: appointmentForm.state,
      service_id: selectedService,
      notes: appointmentForm.notes ? [appointmentForm.notes] : []
    };

    await makeAppointment(newAppointment);

    // 🔁 Refrescar lista de clientes si se acaba de crear uno
    if (clientMode === 'create') {
      const updatedClients = await getClients();
      setClients(updatedClients);
    }

    // Actualizar lista local de turnos (solo para UI, no importa el ID del cliente)
    setAppointments([...appointments, newAppointment]);
    resetForms();
    setShowSuccess('Turno creado exitosamente');
    setTimeout(() => setShowSuccess(''), 3000);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    toast.error(errorMessage);
  }
};


const handleUpdateAppointment = async () => {
  try {
      const updatedAppointments = appointments.map((appointment) => {
    if (appointment._id === editingAppointment) {
      const datetime = new Date(`${appointmentForm.date_time}T${appointmentForm.time}`);
      return {
        ...appointment,
        date_time: datetime,
        state: appointmentForm.state,
        notes: appointmentForm.notes ? [appointmentForm.notes] : appointment.notes
      };
    }
    return appointment;
  });

  // Encontrar el turno editado y preparar el objeto limpio para el backend
  const updatedAppointment = updatedAppointments.find(a => a._id === editingAppointment);

  if (!updatedAppointment) {
    toast.error('Error al actualizar el turno: turno no encontrado');
    return;
  }

  const appointmentToSend = {
    ...updatedAppointment,
    client_id: updatedAppointment.client_id._id,
    service_id: updatedAppointment.service_id._id,
    hairdresser_id: updatedAppointment.hairdresser_id._id
  };

  await updateAppointment(editingAppointment as unknown as IdMongo, appointmentToSend as unknown as Partial<Appointment>);

  setAppointments(updatedAppointments);
  resetForms();
  setShowSuccess('Turno actualizado exitosamente');
  setTimeout(() => setShowSuccess(''), 3000);
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
  }

};


const handleCancelAppointment = async (appointmentId: string) => {
  try {
    // Llamar a la API para eliminar el turno
    await deleteAppointment(appointmentId as unknown as string);
    
    // Actualizar el estado local removiendo el turno eliminado
    const updatedAppointments = appointments.filter(appointment => 
      appointment._id !== appointmentId
    );
    
    setAppointments(updatedAppointments);
    setShowSuccess('Turno cancelado exitosamente');
    setTimeout(() => setShowSuccess(''), 3000);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    toast.error(`Error al cancelar el turno: ${errorMessage}`);
    console.error('Error canceling appointment:', error);
  }
};


  const handleEditAppointment = async (appointment: Appointment) => {
    try {
          const date = new Date(appointment.date_time);
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().split(' ')[0].substring(0, 5);

    setAppointmentForm({
      client_id: appointment.client_id._id || '',
      date_time: dateStr,
      time: timeStr,
      service_id: appointment.service_id._id,
      state: appointment.state,
      notes: appointment.notes?.[0] || ''
    });

    setEditingAppointment(appointment._id!);
    setClientMode('select');
    setShowCreateModal(true);
    } catch (error) {
      console.error(error)
    }

  };

  const resetForms = () => {
    setShowCreateModal(false);
    setEditingAppointment(null);
    setClientMode('select');
    setAppointmentForm({
      client_id: '',
      date_time: '',
      time: '',
      service_id: '',
      state: 'Pendiente',
      notes: ''
    });
    setNewClientForm({
      firstname: '',
      lastname: '',
      email: '',
      age: '',
      dni: '',
      phone: ''
    });
  };

  const filteredAppointments = filterAppointments();

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#333'
      }}>
        <div>Cargando turnos...</div>
      </div>
    );
  }

  // Mostrar error si no se pudieron cargar los datos
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '2rem',
        color: '#333'
      }}>
        <div style={{ color: '#dc2626', fontSize: '1.1rem' }}>
          ⚠️ {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Recargar página
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      color: '#333',
      animation: 'fadeIn 0.6s ease-out',
      padding: '0 1rem'
    }}>
      <h1 className="appointments-title">Mis Turnos</h1>

      {showSuccess && (
        <div className="success-message">
          ✅ {showSuccess}
        </div>
      )}

      <section className="appointments-section">
        <div className="appointments-header">
          <span>Turnos ({filteredAppointments.length})</span>
          
          <div className="appointments-controls">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterDate === 'today' ? 'active' : ''}`}
                onClick={() => setFilterDate('today')}
              >
                Hoy
              </button>
              <button 
                className={`filter-btn ${filterDate === 'week' ? 'active' : ''}`}
                onClick={() => setFilterDate('week')}
              >
                Esta Semana
              </button>
              <button 
                className={`filter-btn ${filterDate === 'month' ? 'active' : ''}`}
                onClick={() => setFilterDate('month')}
              >
                Este Mes
              </button>
              <button 
                className={`filter-btn ${filterDate === 'all' ? 'active' : ''}`}
                onClick={() => setFilterDate('all')}
              >
                Todos
              </button>
            </div>
            
            <button className="create-btn" onClick={() => setShowCreateModal(true)}>
              ➕ Crear Turno
            </button>
          </div>
        </div>

        <div>
          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <h3>No hay turnos</h3>
              <p>No se encontraron turnos para el filtro seleccionado.</p>
            </div>
          ) : (
            filteredAppointments.map(appointment => {
              const stateColor = getStateColor(appointment.state);
              return (
                <div key={appointment._id} className="appointment-item">
                  <div className="appointment-info">
                    <div className="appointment-client">
                      {appointment.client_id.firstname} {appointment.client_id.lastname}
                      <span 
                        className="state-badge" 
                        style={{ 
                          backgroundColor: stateColor.bg, 
                          color: stateColor.color,
                          marginLeft: '0.5rem'
                        }}
                      >
                        {appointment.state}
                      </span>
                    </div>
                    <div className="appointment-service">
                      {appointment.service_id.name}
                    </div>
                    <div className="appointment-datetime">
                      <span>📅 {formatDate(new Date(appointment.date_time))}</span>
                      <span>⏰ {formatTime(new Date(appointment.date_time))}</span>
                    </div>
                    <div className="appointment-price">
                      {formatPrice(appointment.service_id.price)}
                    </div>
                  </div>

                  <div className="appointment-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditAppointment(appointment)}
                      disabled={appointment.state === 'Completado' || appointment.state === 'Cancelado'}
                    >
                      ✏️ Editar
                    </button>
                    
                    <button
                      className="action-btn cancel"
                      onClick={() => {
                        if (appointment._id) {
                          handleCancelAppointment(appointment._id);
                        }
                      }}
                      disabled={
                        !canCancelAppointment(new Date(appointment.date_time)) ||
                        appointment.state === 'Completado' ||
                        appointment.state === 'Cancelado'
                      }
                    >
                      ❌ Cancelar
                    </button>
                    
                    <a
                      href={generateWhatsAppUrl(appointment)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn whatsapp"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Modal para crear/editar turno */}
      {showCreateModal && (
        <div className={`modal-overlay ${!showCreateModal ? 'hidden' : ''}`} onClick={resetForms}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editingAppointment ? 'Editar Turno' : 'Crear Nuevo Turno'}
            </h2>
            
            {!editingAppointment && (
              <div className="client-mode-selector">
                <button
                  className={`mode-btn ${clientMode === 'select' ? 'active' : ''}`}
                  onClick={() => setClientMode('select')}
                >
                  Cliente Existente
                </button>
                <button
                  className={`mode-btn ${clientMode === 'create' ? 'active' : ''}`}
                  onClick={() => setClientMode('create')}
                >
                  Nuevo Cliente
                </button>
              </div>
            )}

            {clientMode === 'select' ? (
              <div className="form-group">
                <label className="form-label">Cliente</label>
                <select
                  className="form-select"
                  value={appointmentForm.client_id}
                  onChange={(e) => setAppointmentForm({...appointmentForm, client_id: e.target.value})}
                  disabled={!!editingAppointment}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.firstname} {client.lastname} - {client.phone}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newClientForm.firstname}
                      onChange={(e) => setNewClientForm({...newClientForm, firstname: e.target.value})}
                      placeholder="Juan"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newClientForm.lastname}
                      onChange={(e) => setNewClientForm({...newClientForm, lastname: e.target.value})}
                      placeholder="Pérez"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({...newClientForm, email: e.target.value})}
                    placeholder="juan@email.com"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Edad</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newClientForm.age}
                      onChange={(e) => setNewClientForm({...newClientForm, age: e.target.value})}
                      placeholder="25"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">DNI</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newClientForm.dni}
                      onChange={(e) => setNewClientForm({...newClientForm, dni: e.target.value})}
                      placeholder="12345678"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({...newClientForm, phone: e.target.value})}
                    placeholder="1234567890"
                  />
                </div>
              </>
            )}

            {/* Campos comunes del turno */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-input"
                  value={appointmentForm.date_time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, date_time: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  className="form-input"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Servicio</label>
              <select
                className="form-select"
                value={appointmentForm.service_id}
                onChange={(e) => setAppointmentForm({...appointmentForm, service_id: e.target.value})}
              >
                <option value="">Seleccionar servicio...</option>
                {services.map(service => (
                  <option key={service._id} value={service._id}>
                    {service.name} - {formatPrice(service.price)} ({service.duration} min)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={appointmentForm.state}
                onChange={(e) => setAppointmentForm({...appointmentForm, state: e.target.value as appointmentState})}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Solicitado">Solicitado</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notas (opcional)</label>
              <textarea
                className="form-textarea"
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                placeholder="Notas adicionales..."
                rows={3}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={resetForms}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={editingAppointment ? handleUpdateAppointment : handleCreateAppointment}
                disabled={
                  !appointmentForm.date_time || 
                  !appointmentForm.time || 
                  !appointmentForm.service_id || 
                  (clientMode === 'select' && !appointmentForm.client_id) ||
                  (clientMode === 'create' && (!newClientForm.firstname || !newClientForm.lastname || !newClientForm.email || !newClientForm.age || !newClientForm.dni || !newClientForm.phone))
                }
              >
                {editingAppointment ? 'Actualizar' : 'Crear'} Turno
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default MisTurnos;