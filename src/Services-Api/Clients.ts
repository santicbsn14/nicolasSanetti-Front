import axios from 'axios';
import { getAuth } from 'firebase/auth';
import {handleError} from '../Utils/ErrorManager'

export const getClients= async () => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.get(
      'http://localhost:8080/api/clients',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const clients = response.data?.clients || [];
    

    
    return clients

  } catch (error) {
    const errorhandler = handleError(error);
    throw Error(errorhandler);
  }
};