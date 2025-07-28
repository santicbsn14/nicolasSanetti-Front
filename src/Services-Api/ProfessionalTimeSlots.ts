import axios from "axios";
import { handleError } from '../Utils/ErrorManager';
import { getAuth } from "firebase/auth";
import { Dayjs } from "dayjs";
import mongoose from 'mongoose';

export interface TimeSlot {
  start_time: Dayjs;
  end_time: Dayjs;
}

export interface DaySchedule {
  week_day: number; 
  time_slots: TimeSlot;
}

export interface ProfessionalTimeSlots {
  _id?: mongoose.Types.ObjectId;
  hairdresser_id: mongoose.Types.ObjectId | string;
  schedule: DaySchedule[];
}

const DAILY_API_BASE = 'https://nicolas-sanetti-system-misc.onrender.com/api/dailyHourAvailability';
const PRO_API_BASE   = 'https://nicolas-sanetti-system-misc.onrender.com/api/professionalTimeSlots';

export const createDailyHourAvailability = async (dailyData: unknown) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.post(
      DAILY_API_BASE,
      dailyData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(handleError(error));
  }
};

export const getDailyHourAvailability = async () => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.get(
      DAILY_API_BASE,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const createProfessionalTimeSlots = async (data: ProfessionalTimeSlots) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.post(
      PRO_API_BASE,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getProfessionalTimeSlots = async (id: string) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.get(
      `${PRO_API_BASE}/bypro/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data === null) throw new Error('Error al cargar los horarios');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const updateProfessionalTimeSlots = async (
  id: string,
  data: Partial<ProfessionalTimeSlots>
) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.put(
      `${PRO_API_BASE}/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
