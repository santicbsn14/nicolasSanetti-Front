import { useEffect, useState } from 'react';
import '../Css/MisServicios.css';
import { createService, getServices, updateService } from '../../../Services-Api/Services';
import type { IService } from '../../../Services-Api/Services';
import { getHairdresserByUserId, updateHairdresser } from '../../../Services-Api/Hairdresser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth, type MongoUser } from '../../Contexts/AuthContext';
import type { IdMongo } from '../../../Services-Api/Hairdresser';

type ServiceForm = {
  name: string;
  description: string;
  price: string;
  duration: string;
  limit: boolean;
  enabled: boolean;
  images_galery: string[];
};

const GestionServicios = () => {
  const [userRole, setUserRole] = useState<'Admin' | 'hairdresser' | MongoUser['role'] | 'Admin' | 'Hairdresser'>('Admin');
  const [services, setServices] = useState<IService[]>([]);
  const [hairdresserServices, setHairdresserServices] = useState<string[]>([]);
  const [currentHairdresserId, setCurrentHairdresserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState('');
  const [showError, setShowError] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState<boolean>(true)
  const [serviceForm, setServiceForm] = useState<ServiceForm>({
    name: '',
    description: '',
    price: '',
    duration: '',
    limit: false,
    enabled: true,
    images_galery: []
  });
  const { mongoUser } = useAuth()
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const fetched = await getServices();
        setServices(fetched.services);
        const roleName = mongoUser?.role?.name;
        if (roleName === 'Admin' || roleName === 'hairdresser') {
          setUserRole(roleName);
        } else {
          // Si no es un literal válido, no lo setees o asigná un valor por defecto válido
          setUserRole('Hairdresser');
        }
        
        // Si es peluquero, obtener sus servicios actuales
        if (roleName == 'Hairdresser' ) {
          const hairdresser  = await getHairdresserByUserId(mongoUser?._id as unknown as IdMongo)
          setCurrentHairdresserId(hairdresser._id as string);
          setHairdresserServices(hairdresser.services || []);
        }
        
        setLoading(false)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast.error(errorMessage);
        setLoading(false);
      }
    };
    fetchServices();
  }, [mongoUser]);

  const filteredServices = services.filter(service => {
    if (filterActive === 'active') return service.enabled;
    if (filterActive === 'inactive') return !service.enabled;
    return true;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? (mins > 0 ? `${hours}h ${mins}min` : `${hours}h`) : `${mins}min`;
  };

  const resetForm = (): ServiceForm => ({
    name: '',
    description: '',
    price: '',
    duration: '',
    limit: false,
    enabled: true,
    images_galery: []
  });

  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'upload_test');
    formData.append('cloud_name', 'ds8ilvysp');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/ds8ilvysp/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error('Error al subir imagen: ' + errorMessage);
      return null;
    }
  };

  const generateMockImages = (): string[] => {
    // Generamos algunas URLs de ejemplo para simular imágenes
    const mockImageUrls = [
      'https://example.com/images/service1.jpg',
      'https://example.com/images/service2.jpg',
      'https://example.com/images/default-service.jpg'
    ];
    // Devolvemos 1-3 imágenes aleatorias
    const numImages = Math.floor(Math.random() * 3) + 1;
    return mockImageUrls.slice(0, numImages);
  };

  const handleCreateService = async () => {
    try {
      // Preparamos el objeto para enviar a la API (sin _id)
      const serviceToCreate = {
        name: serviceForm.name,
        description: serviceForm.description,
        price: parseInt(serviceForm.price),
        duration: parseInt(serviceForm.duration),
        enabled: serviceForm.enabled,
        images_galery: serviceForm.images_galery.length > 0 ? serviceForm.images_galery : generateMockImages(),
        ...(serviceForm.limit && { limit: serviceForm.limit }) // Solo incluimos limit si es true
      };

      console.log('Enviando servicio:', serviceToCreate);

      // Llamamos a la API
      await createService(serviceToCreate);

      // Refrescamos la lista de servicios
      const fetchedServices = await getServices();
      setServices(fetchedServices.services);

      // Limpiamos el formulario y cerramos el modal
      setServiceForm(resetForm());
      setShowCreateModal(false);
      setShowSuccess('Servicio creado exitosamente');
      setTimeout(() => setShowSuccess(''), 3000);

    } catch (error) {
      console.error('Error al crear servicio:', error);
      setShowError('Error al crear el servicio');
      setTimeout(() => setShowError(''), 3000);
    }
  };

  const handleEditService = (service: IService) => {
    setEditingService(service._id as unknown as string);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      limit: service.limit || false,
      enabled: service.enabled,
      images_galery: service.images_galery || []
    });
    setShowCreateModal(true);
  };

  const handleUpdateService = async () => {
    try {
      const updatedServices = services.map(service =>
        service._id?.toString() === editingService
          ? {
            ...service,
            ...serviceForm,
            price: parseInt(serviceForm.price),
            duration: parseInt(serviceForm.duration)
          }
          : service
      );
      const serviceUpdated = { ...serviceForm, price: parseInt(serviceForm.price), duration: parseInt(serviceForm.duration) }
      await updateService(editingService as unknown as IdMongo, serviceUpdated as unknown as IService)
      setServices(updatedServices);
      setServiceForm(resetForm());
      setShowCreateModal(false);
      setEditingService(null);
      setShowSuccess('Servicio actualizado exitosamente');
      setTimeout(() => setShowSuccess(''), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
    }

  };

  const toggleServiceForHairdresser = async (serviceId: string) => {
    try {
      if (!currentHairdresserId) {
        toast.error('Error: No se pudo identificar el peluquero');
        return;
      }

      const updatedServices = hairdresserServices.includes(serviceId)
        ? hairdresserServices.filter(id => id !== serviceId)
        : [...hairdresserServices, serviceId];

      // Llamar a la API para actualizar el hairdresser
      await updateHairdresser(currentHairdresserId as unknown as IdMongo, {
        services: updatedServices
      });

      // Actualizar el estado local solo si la API fue exitosa
      setHairdresserServices(updatedServices);
      setShowSuccess('Servicios actualizados');
      setTimeout(() => setShowSuccess(''), 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error('Error al actualizar servicios: ' + errorMessage);
    }
  };

  const toggleServiceEnabled = (serviceId: string) => {
    const updatedServices = services.map(service =>
      service._id?.toString() === serviceId ? { ...service, enabled: !service.enabled } : service
    );
    setServices(updatedServices);
    setShowSuccess('Estado del servicio actualizado');
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const removeMockImage = (index: number) => {
    const updatedImages = serviceForm.images_galery.filter((_, i) => i !== index);
    setServiceForm({
      ...serviceForm,
      images_galery: updatedImages
    });
  };
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#333'
      }}>
        <div>Cargando servicios...</div>
      </div>
    );
  }
  
  return (
    <div className="services-wrapper">
      <h1 className="services-title">{userRole === 'Admin' ? 'Gestión de Servicios' : 'Mis Servicios'}</h1>

      {showSuccess && <div className="success-message">✅ {showSuccess}</div>}
      {showError && <div className="error-message">❌ {showError}</div>}

      <section className="services-section">
        <div className="services-header">
          <span>
            {userRole === 'hairdresser' && 'Servicios Disponibles'}
            {userRole === 'Admin' && `Servicios (${filteredServices.length})`}
          </span>
          <div className="services-controls">
            {userRole === 'Admin' && (
              <>
                <div className="filter-buttons">
                  {['all', 'active', 'inactive'].map(status => (
                    <button
                      key={status}
                      className={`filter-btn ${filterActive === status ? 'active' : ''}`}
                      onClick={() => setFilterActive(status as typeof filterActive)}
                    >
                      {status === 'all' ? 'Todos' : status === 'active' ? 'Activos' : 'Inactivos'}
                    </button>
                  ))}
                </div>
                <button className="create-btn" onClick={() => setShowCreateModal(true)}>
                  ➕ Crear Servicio
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          {filteredServices.map(service => (
            <div
              key={service._id as unknown as string}
              className={`service-item ${!service.enabled ? 'inactive' : ''}`}
            >
              <div className="service-info">
                <div className="service-name">
                  {service.name}
                  <span className={`service-badge ${service.limit ? 'limit' : 'no-limit'}`}>
                    {service.limit ? 'Con límite' : 'Sin límite'}
                  </span>
                  {!service.enabled && (
                    <span className="service-badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                      Inactivo
                    </span>
                  )}
                  {service.enabled && (
                    <span className="service-badge" style={{ backgroundColor: '#166534', color: 'white' }}>
                      Activo
                    </span>
                  )}
                </div>
                <div className="service-description">{service.description}</div>
                <div className="service-details">
                  <span className="service-price">{formatPrice(service.price)}</span>
                  <span>•</span>
                  <span>{formatDuration(service.duration)}</span>
                  {service.images_galery && service.images_galery.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{service.images_galery.length} imagen(es)</span>
                    </>
                  )}
                </div>
              </div>

              <div className="service-actions">
                {userRole === 'Hairdresser'  && service.enabled && (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="service-checkbox"
                      checked={hairdresserServices.includes(service._id as unknown as string)}
                      onChange={() => toggleServiceForHairdresser(service._id as unknown as string)}
                    />
                    <span style={{color:'#64748b'}} className="checkbox-text">Lo ofrezco</span>
                  </label>
                )}
                {userRole === 'Admin' && (
                  <>
                    <button className="action-btn edit" onClick={() => handleEditService(service)}>
                      ✏️ Editar
                    </button>
                    <button
                      className={`action-btn toggle ${!service.enabled ? 'activate' : ''}`}
                      onClick={() => toggleServiceEnabled(service._id?.toString() || '')}
                    >
                      {service.enabled ? '❌ Desactivar' : '✅ Activar'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</h2>

            <div className="form-group">
              <label className="form-label">Nombre del Servicio</label>
              <input
                type="text"
                className="form-input"
                value={serviceForm.name}
                onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="Ej: Corte de Cabello"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-textarea"
                value={serviceForm.description}
                onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Descripción del servicio..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={serviceForm.price}
                  onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duración (min)</label>
                <input
                  type="number"
                  className="form-input"
                  value={serviceForm.duration}
                  onChange={e => setServiceForm({ ...serviceForm, duration: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Imágenes del Servicio</label>
              <div className="images-section">
                {serviceForm.images_galery.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Preview ${index}`} style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeMockImage(index)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadImageToCloudinary(file);
                      if (url) {
                        setServiceForm((prev) => ({
                          ...prev,
                          images_galery: [...prev.images_galery, url]
                        }));
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="limit-checkbox"
                  checked={serviceForm.limit}
                  onChange={e => setServiceForm({ ...serviceForm, limit: e.target.checked })}
                />
                <label htmlFor="limit-checkbox" className="form-label">Tiene límite diario</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="enabled-checkbox"
                  checked={serviceForm.enabled}
                  onChange={e => setServiceForm({ ...serviceForm, enabled: e.target.checked })}
                />
                <label htmlFor="enabled-checkbox" className="form-label">Servicio activo</label>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingService(null);
                  setServiceForm(resetForm());
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={editingService ? handleUpdateService : handleCreateService}
                disabled={!serviceForm.name || !serviceForm.price || !serviceForm.duration}
              >
                {editingService ? 'Actualizar' : 'Crear'} Servicio
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default GestionServicios;