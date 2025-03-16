import React, { useState, useEffect } from 'react';

const PrivateHouseKeeper = () => {
  const [nombre, setNombre] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  // Crear una nueva tarea de mantenimiento
  const createMaintenanceTask = async () => {
    const taskData = {
      nombre: nombre || undefined,
    };

    try {
      const response = await fetch(`${backendUrl}api/maintenancetasks`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Tarea de mantenimiento creada con éxito');
        resetForm();  // Restablecer el formulario
      } else {
        const errorData = await response.json();
        console.error('Error al crear la tarea de mantenimiento:', errorData.message);
        alert('Error al crear la tarea de mantenimiento: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error al crear la tarea de mantenimiento:', error);
      alert('Hubo un problema al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  // Restablecer el formulario después de la creación
  const resetForm = () => {
    setNombre('');
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Gestión de Tareas de Mantenimiento</h1>

      <div className="card shadow-lg p-4">
        <div className="card-body">
          <h5 className="card-title text-primary">Crear Tarea de Mantenimiento</h5>
          <form>
            <div className="form-group mb-3">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={createMaintenanceTask}  // Llamar la función para crear la tarea de mantenimiento
            >
              Crear Tarea
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateHouseKeeper;
