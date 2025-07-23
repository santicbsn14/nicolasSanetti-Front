import axios from "axios";
import { handleError } from '../Utils/ErrorManager';
import { getAuth } from "firebase/auth";

const API_BASE = 'https://nicolas-sanetti-system.onrender.com/api/roles';

export const getRoles = async () => {
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
