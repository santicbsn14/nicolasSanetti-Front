// NotificationTemplatesConfig.tsx
import React, { useEffect, useState } from 'react';
import '../Css/Notificaciones.css';
import dayjs from 'dayjs'; // asegurate de tenerlo al principio del archivo
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getNotificationTemplate, updateNotificationTemplate } from '../../../Services-Api/NotificationTemplate';
import type { IdMongo } from '../../../Services-Api/Hairdresser';
type NotificationTemplate = {
  _id: string;
  name: string;
  message: string;
  updatedAt: string;
};



const NotificationTemplatesConfig: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError('');
        const notificationTemplates = await getNotificationTemplate();
        setTemplates(notificationTemplates.notificationTemplate)
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(error);
        toast.error(errorMessage);
      }finally{
        setLoading(false)
      }
    };

    loadAppointments();
  }, []);
  const handleEdit = (id: string, value: string) => {
    setEditing((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: IdMongo , message:string) => {
    try {
      const messageUpdated = {message: message, updatedAt: dayjs()}
      await updateNotificationTemplate(id, messageUpdated)
      setTemplates((prevTemplates) =>
  prevTemplates.map((template) =>
    template._id === String(id)
      ? { ...template, message, updatedAt: dayjs().toISOString() }
      : template
  )
);
      toast.success('El mensaje de la notificacion se ha actualizado con exito!') 
    } catch (error) {
         const errorMessage = error instanceof Error ? error.message : String(error);
        toast.error(errorMessage);
    }finally{
      setLoading(false)
    }
    
  };
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#64748b'
      }}>
        Cargando plantillas de notificaciones...
      </div>
    );
  }
  return (
    <div className="ntc-container">
      <h2 className="ntc-title">Configuración de Notificaciones</h2>
      {templates.map((template) => (
        <div className="ntc-card" key={template._id}>
          <div className="ntc-row">
            <label className="ntc-label">Nombre:</label>
            <input className="ntc-input" type="text" value={template.name} readOnly />
          </div>
          <div className="ntc-row">
            <label className="ntc-label">Mensaje HTML:</label>
            <textarea
              className="ntc-textarea"
              value={editing[template._id] ?? template.message}
              onChange={(e) => handleEdit(template._id, e.target.value)}
            />
          </div>
          <div className="ntc-actions">
            <button className="ntc-button" onClick={() => handleSave(template._id as unknown as IdMongo, editing[template._id] ?? template.message)}>
              Guardar
            </button>
          </div>
          <p className="ntc-timestamp">
            Última actualización: {new Date(template.updatedAt).toLocaleString()}
          </p>
        </div>
      ))}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default NotificationTemplatesConfig;
