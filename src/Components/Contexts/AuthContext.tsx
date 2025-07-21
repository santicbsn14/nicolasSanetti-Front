import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../Services-Api/Auth';
import { getUserByEmail } from '../../Services-Api/Users';

export interface MongoUser {
  _id: string;
  firstname: string;
  lastname: string;
  role: {
    name: string;
    permissions: string[];
  };
}

interface AuthContextType {
  user: User | null;
  mongoUser: MongoUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  resetInactivityTimer: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  mongoUser: null,
  loading: true,
  logout: async () => {},
  resetInactivityTimer: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
  inactivityTimeout?: number; // Tiempo en milisegundos (por defecto 30 minutos)
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  inactivityTimeout = 30 * 60 * 1000 // 30 minutos por defecto
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoggedInRef = useRef(false);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setMongoUser(null);
      isLoggedInRef.current = false;
      
      // Limpiar el timer de inactividad
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    // Solo resetear el timer si el usuario está logueado
    if (!isLoggedInRef.current || !user) return;

    // Limpiar el timer existente
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Establecer un nuevo timer
    inactivityTimerRef.current = setTimeout(() => {
      console.log('Usuario inactivo, cerrando sesión automáticamente...');
      logout();
    }, inactivityTimeout);
  }, [user, inactivityTimeout, logout]);

  // Eventos que indican actividad del usuario
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

  useEffect(() => {
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    // Agregar listeners de eventos solo si el usuario está logueado
    if (user && isLoggedInRef.current) {
      activityEvents.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });

      // Iniciar el timer de inactividad
      resetInactivityTimer();
    }

    // Cleanup function
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [user, resetInactivityTimer]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser?.email) {
        try {
          const response = await getUserByEmail(currentUser.email);
          setMongoUser({
            _id: response._id,
            firstname: response.firstname,
            lastname: response.lastname,
            role: {
              name: response.role.name,
              permissions: response.role.permissions,
            },
          });
          
          // Usuario logueado, habilitar tracking de inactividad
          isLoggedInRef.current = true;
        } catch (error) {
          console.error('Error fetching user data:', error);
          isLoggedInRef.current = false;
        }
      } else {
        setMongoUser(null);
        isLoggedInRef.current = false;
        
        // Limpiar el timer si el usuario se desloguea
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
        }
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
      // Limpiar el timer al desmontar el componente
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      mongoUser, 
      loading, 
      logout, 
      resetInactivityTimer 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);