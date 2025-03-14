import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginHouseKeeper = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor ingresa tu email y contraseña');
      return;
    }

    console.log('Email:', email);
    console.log('Password:', password);

    try {
      const response = await fetch(`${backendUrl}api/loginHouseKeeper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/privateHouseKeeper');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Algo salió mal. Intenta nuevamente.'}`);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un error al intentar iniciar sesión, por favor intenta más tarde.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center mb-4">Iniciar sesión</h1>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo electrónico"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Iniciar sesión
        </button>
        <div className="mt-3 text-center">
          <button className="btn btn-link" onClick={() => navigate('/signupHouseKeeper')}>
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginHouseKeeper;