import axios from 'axios';
import { type Appointment } from '../Components/System-Turnos/Pages/MisTurnos';
import { handleError } from '../Utils/ErrorManager';
import { getAuth } from 'firebase/auth';
import type { IdMongo } from './Hairdresser';

const API_BASE = 'https://nicolas-sanetti-system.onrender.com/api/appointments';

export const makeAppointment = async (appointmentData: Appointment) => {
  try {
    const response = await axios.post(
      `${API_BASE}/byclient`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getAppointments = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const updateAppointment = async (
  id: string | IdMongo,
  data: Partial<Appointment>
) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    const response = await axios.put(
      `${API_BASE}/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const bulkAppointments = async (data: Appointment[]) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');
    const response = await axios.post(
      `${API_BASE}/bulkAppointments`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const makeAppointmentByPatient = async (data: Appointment) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');
    const response = await axios.post(
      `${API_BASE}/byclient`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteAppointment = async (id: string) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');
    return axios.delete(
      `${API_BASE}/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    throw new Error(handleError(error));
  }
};
