// File: /Componentes/System-Turnos/Pages/LoginProfesional.tsx
import * as React from 'react'
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import '../Css/LoginProfessional.css'
import type { userLoginSucces } from '../../../Types/User';
import { auth } from '../../../Services-Api/Auth';
const LoginProfesional = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
      const [errorMessage, setErrorMessage] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
  const handleLogin = async (e: React.FormEvent) => {
    try {
          e.preventDefault();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
        const accessToken = await firebaseUser.getIdToken(); // 🔑 obtenemos el token

    const user: userLoginSucces = {
      accessToken,
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '' // por si email es null
    };
    // Simulamos login exitoso (esto luego se reemplaza con lógica real)
        if (user.accessToken) {
          setErrorMessage('')
          toast.success('¡Login exitoso! Redirigiendo...')
          setSuccessMessage('¡Login exitoso! Redirigiendo...');
          setTimeout(() => {
            navigate(`/turnos/professional/dashboard`);
          }, 2000);;
        }
    } catch (error) {
        toast.error('Error en el login: ' + error);
        setErrorMessage('Error en el login: ' + error);
    }
  };

  return (
    <div className="login-profesional-wrapper">
      <div className="login-profesional-box">
        <h2 className="login-title">Ingreso de Profesionales</h2>
        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{color:'red'}}>{errorMessage}</p>}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginProfesional;
