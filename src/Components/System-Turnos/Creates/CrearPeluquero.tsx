import React, { useEffect, useState } from 'react';
import { getUsers } from '../../../Services-Api/Users';
import '../Css/CrearPeluquero.css';
import { getServices, type IService } from '../../../Services-Api/Services';
import { createHairdresser } from '../../../Services-Api/Hairdresser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interfaces TypeScript
interface LimitServices {
  day: number;
  max: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface HairdresserFormData {
  user_id: string;
  services: string[];
  state: 'Disponible' | 'No disponible' | 'Vacaciones' | 'Feriado';
  limit_services: LimitServices[];
}



const daysOfWeek = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

const CreateHairdresserForm: React.FC = () => {
  const [formData, setFormData] = useState<HairdresserFormData>({
    user_id: '',
    services: [],
    state: 'Disponible',
    limit_services: [],
  });

  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  // @ts-expect-error TS6133: showSuccessMessage no se lee, pero lo necesitamos para el setter
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const [usersResponse, servicesResponse] = await Promise.all([
        getUsers(),
        getServices(),
      ]);

      setUsers(usersResponse.users); // Ajustar si el nombre del campo cambia
      setServices(servicesResponse.services); // Ajustar si el nombre del campo cambia
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  fetchInitialData();
}, []);


  const handleInputChange = (field: keyof HairdresserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleLimitServiceChange = (index: number, field: 'day' | 'max', value: number) => {
    setFormData(prev => ({
      ...prev,
      limit_services: prev.limit_services.map((limit, i) =>
        i === index ? { ...limit, [field]: value } : limit
      )
    }));
  };

  const addLimitService = () => {
    setFormData(prev => ({
      ...prev,
      limit_services: [...prev.limit_services, { day: 0, max: 0 }]
    }));
  };

  const removeLimitService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      limit_services: prev.limit_services.filter((_, i) => i !== index)
    }));
  };

const handleSubmit = async () => {
  try {
    await createHairdresser(formData);
    toast.success('¡Peluquero creado exitosamente!');
    
    // Reset form
    setFormData({
      user_id: '',
      services: [],
      state: 'Disponible',
      limit_services: []
    });
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
  }
};

  return (
    <div className="container">
      <h1 className="hairdresser-title">Gestión de Peluqueros</h1>

      {showSuccessMessage && (
        <div className="success-message">
          ¡Peluquero creado exitosamente!
        </div>
      )}

      <div className="hairdresser-section">
        <div className="hairdresser-header">Crear Nuevo Peluquero</div>

        <div className="form-content">
          {/* Selección de Usuario */}
          <div className="form-group">
            <label className="form-label">Usuario *</label>
            <select
              className="form-select"
              value={formData.user_id}
              onChange={(e) => handleInputChange('user_id', e.target.value)}
              required
            >
              <option value="">Seleccionar usuario</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="form-group">
            <label className="form-label">Estado *</label>
            <div className="state-selector">
              {(['Disponible', 'No disponible', 'Vacaciones', 'Feriado'] as const).map(state => (
                <button
                  key={state}
                  type="button"
                  className={`state-btn ${formData.state === state ? 'active' : ''}`}
                  onClick={() => handleInputChange('state', state)}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Servicios */}
          <div className="form-group">
            <label className="form-label">Servicios *</label>
            <div className="services-grid">
  {services.map(service => (
    <label
      key={service._id as unknown as string}
      className={`service-checkbox ${formData.services.includes(service._id as unknown as string) ? 'selected' : ''}`}
    >
      <input
        type="checkbox"
        checked={formData.services.includes(service._id as unknown as string)}
        onChange={() => handleServiceToggle(service._id  as unknown as string)}
      />
      {service.name}
    </label>
  ))}
            </div>
          </div>

          {/* Límites de Servicios */}
          <div className="form-group">
            <label className="form-label">Límites de Servicios por Día</label>
            <div className="limit-services-section">
              {formData.limit_services.map((limit, index) => (
                <div key={index} className="limit-service-item">
                  <select
                    value={limit.day}
                    onChange={(e) => handleLimitServiceChange(index, 'day', parseInt(e.target.value))}
                    className="limit-input"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    placeholder="Máximo servicios"
                    value={limit.max}
                    onChange={(e) => handleLimitServiceChange(index, 'max', parseInt(e.target.value) || 0)}
                    className="limit-input"
                  />
                  <button
                    type="button"
                    onClick={() => removeLimitService(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLimitService}
                className="add-limit-btn"
              >
                + Agregar Límite
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary">
              Cancelar
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={!formData.user_id || formData.services.length === 0}
              onClick={handleSubmit}
            >
              Crear Peluquero
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

    </div>
  );
};

export default CreateHairdresserForm;
