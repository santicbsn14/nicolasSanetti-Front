import axios from "axios";
import { handleError } from '../Utils/ErrorManager';
import { getAuth } from "firebase/auth";
import { Dayjs } from "dayjs";
import type { IdMongo } from "./Hairdresser";

export interface NotificationTemplate {
  _id?: IdMongo;
  name: string;
  message: string;
  updatedAt?: Dayjs;
}

const API_BASE = 'https://nicolas-sanetti-system-misc.onrender.com/api/notificationTemplate';

export const getNotificationTemplate = async () => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.get(API_BASE, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const updateNotificationTemplate = async (
  id: IdMongo,
  templateData: Partial<NotificationTemplate>
) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.put(
      `${API_BASE}/${id}`,
      templateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
