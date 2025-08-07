import React, { useState, useEffect } from 'react';
import '../Css/CrearUsuario.css'
import { createUser, type IUser } from '../../../Services-Api/Users';
import { getRoles } from '../../../Services-Api/Roles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interfaces TypeScript
interface Role {
  _id: string;
  name: string;
  description?: string;
}
interface RolesResponse {
  roles: Role[];
}
interface UserFormData {
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  dni: number;
  phone: number;
  role: string;
  password: string;
}

const CreateUserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    firstname: '',
    lastname: '',
    email: '',
    age: 0,
    dni: 0,
    phone: 0,
    role: '',
    password: ''
  });

  const [roles, setRoles] = useState<RolesResponse>({ roles: [] });
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  // Cargar roles al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar los roles';
        toast.error(errorMessage);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);
  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    // Validaciones
    if (!formData.firstname.trim()) newErrors.firstname = 'Nombre es requerido';
    if (!formData.lastname.trim()) newErrors.lastname = 'Apellido es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no es válido';
    }
    if (!formData.age || formData.age < 1) newErrors.age = 'Edad debe ser mayor a 0' as unknown as number;
    if (!formData.dni || formData.dni.toString().length < 7) newErrors.dni = 'DNI debe tener al menos 7 dígitos' as unknown as number;
    if (!formData.phone || formData.phone.toString().length < 10) newErrors.phone = 'Teléfono debe tener al menos 10 dígitos' as unknown as number;
    if (!formData.role) newErrors.role = 'Rol es requerido';
    if (!formData.password.trim() || formData.password.length < 6) {
      newErrors.password = 'Contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      // Crear objeto usuario con el _id del rol seleccionado
      const userData: IUser = {
        ...formData,
        role: formData.role // Ya contiene el _id del rol seleccionado
      } as IUser;

      // Llamada a la API para crear usuario
      await createUser(userData);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Reset form
      toast.success('Se ha creado el usuario con exito')
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        age: 0,
        dni: 0,
        phone: 0,
        role: '',
        password: ''
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
    }
  };

  const handleReset = () => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      age: 0,
      dni: 0,
      phone: 0,
      role: '',
      password: ''
    });
    setErrors({});
  };

  return (
    <div className="container">
      <h1 className="user-title">Gestión de Usuarios</h1>

      {showSuccessMessage && (
        <div className="success-message">
          ¡Usuario creado exitosamente!
        </div>
      )}

      <div className="user-section">
        <div className="user-header">
          Crear Nuevo Usuario
        </div>

        <div className="form-content">
          {/* Información Personal */}
          <div className="form-section">
            <div className="form-section-title">Información Personal</div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Nombre</label>
                <input
                  type="text"
                  className={`form-input ${errors.firstname ? 'error' : ''}`}
                  value={formData.firstname}
                  onChange={(e) => handleInputChange('firstname', e.target.value)}
                  placeholder="Ingrese el nombre"
                />
                {errors.firstname && <div className="error-message">{errors.firstname}</div>}
              </div>

              <div className="form-group">
                <label className="form-label required">Apellido</label>
                <input
                  type="text"
                  className={`form-input ${errors.lastname ? 'error' : ''}`}
                  value={formData.lastname}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  placeholder="Ingrese el apellido"
                />
                {errors.lastname && <div className="error-message">{errors.lastname}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Edad</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className={`form-input ${errors.age ? 'error' : ''}`}
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese la edad"
                />
                {errors.age && <div className="error-message">{errors.age}</div>}
              </div>

              <div className="form-group">
                <label className="form-label required">DNI</label>
                <input
                  type="number"
                  className={`form-input ${errors.dni ? 'error' : ''}`}
                  value={formData.dni || ''}
                  onChange={(e) => handleInputChange('dni', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese el DNI"
                />
                {errors.dni && <div className="error-message">{errors.dni}</div>}
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="form-section">
            <div className="form-section-title">Información de Contacto</div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Email</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ejemplo@email.com"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label required">Teléfono</label>
                <input
                  type="number"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', parseInt(e.target.value) || 0)}
                  placeholder="1123456789"
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
            </div>
          </div>

          {/* Información de Acceso */}
          <div className="form-section">
            <div className="form-section-title">Información de Acceso</div>
            
            <div className="form-group">
              <label className="form-label required">Contraseña</label>
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label required">Rol del Usuario</label>
              {loadingRoles ? (
                <div className="loading-message">Cargando roles...</div>
              ) : (
                <div className="role-selector">
                  {roles.roles.map(role => (
                    <div
                      key={role._id}
                      className={`role-option ${formData.role === role._id ? 'selected' : ''}`}
                      onClick={() => handleInputChange('role', role._id)}
                    >
                      <div className="role-name">{role.name}</div>
                      {role.description && (
                        <div className="role-description">{role.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {errors.role && <div className="error-message">{errors.role}</div>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Limpiar
            </button>
            <button 
              type="button" 
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loadingRoles}
            >
              Crear Usuario
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default CreateUserForm;