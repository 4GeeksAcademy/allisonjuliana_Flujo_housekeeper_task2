import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Importa jwtDecode correctamente

const PrivateHouseKeeper = () => {
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
  const [selectedRoomId, setSelectedRoomId] = useState(null); // Estado para almacenar el id de la habitación seleccionada
  const [isRoomSelected, setIsRoomSelected] = useState(false); // Estado para controlar si se seleccionó una habitación
  const [nombre, setNombre] = useState(''); // Estado para el nombre de la tarea de mantenimiento
  const navigate = useNavigate();
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  // Función para obtener las tareas de housekeeper
  const handleFetchTasks = async () => {
    try {
      const response = await fetch(`${backendUrl}api/housekeeper_tasks`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      setTasks(data); // Guardamos las tareas en el estado
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      alert('Error al obtener las tareas, por favor intente más tarde.');
    }
  };

  // Llamada a la función cuando el componente se monta
  useEffect(() => {
    handleFetchTasks();
  }, []);

  // Función para manejar el clic en la habitación y seleccionar el id
  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId); // Establecer el id de la habitación seleccionada
    setIsRoomSelected(true); // Establecer que una habitación ha sido seleccionada
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/loginHouseKeeper');
  };

  // Función para volver a mostrar todos los botones de habitaciones
  const handleBackToRooms = () => {
    setIsRoomSelected(false); // Restablecemos el estado para mostrar los botones de habitaciones
    setSelectedRoomId(null); // Limpiamos el id de la habitación seleccionada
  };

  // Función para crear una nueva tarea de mantenimiento
  const createMaintenanceTask = async () => {
    const token = localStorage.getItem('token');
    let housekeeperId = null;

    if (token) {
      try {
        const decoded = jwtDecode(token);  // Decodificar el token
        housekeeperId = decoded.housekeeper_id; // Obtener el ID del housekeeper
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        alert('Hubo un error al obtener el ID del housekeeper');
        return;
      }
    }

    const taskData = {
      nombre: nombre || undefined,
      room_id: selectedRoomId,  // Incluye el ID de la habitación seleccionada
      housekeeper_id: housekeeperId  // Incluye el ID del housekeeper
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

  // Agrupar las tareas por id_room para que se muestre un solo botón por habitación
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.id_room]) {
      acc[task.id_room] = [];
    }
    acc[task.id_room].push(task);
    return acc;
  }, {});

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">Tareas de Housekeeper</h2>

        {/* Mostrar los botones de habitaciones si no se ha seleccionado una habitación */}
        {!isRoomSelected && Object.keys(groupedTasks).length > 0 ? (
          Object.keys(groupedTasks).map((roomId) => {
            const roomTasks = groupedTasks[roomId];
            return (
              <div key={roomId} className="mb-3">
                <button
                  className="btn btn-primary mt-3 px-3 py-2"
                  onClick={() => handleRoomClick(roomId)} // Seleccionamos el id de la habitación
                >
                  <h5>Habitación: {roomTasks[0].room_nombre}</h5> {/* Mostrar el nombre de la habitación (del primer task) */}
                </button>
              </div>
            );
          })
        ) : null}

        {/* Mostrar la información de la habitación seleccionada */}
        {isRoomSelected && (
          <div className="mt-4">
            {groupedTasks[selectedRoomId] && groupedTasks[selectedRoomId].map((task) => (
              <div key={task.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <p><strong>Habitación:</strong> {task.room_nombre}</p>
                  <p><strong>Tarea asignada:</strong> {task.nombre}</p>
                  <p><strong>Condición:</strong> {task.condition}</p>
                  <p><strong>Fecha de Asignación:</strong> {task.assignment_date}</p>
                  <p><strong>Fecha de Entrega:</strong> {task.submission_date}</p>
                  <div className="mt-3">
                    <strong>Foto: </strong>
                    {task.photo ? (
                      <img src={task.photo} alt="Tarea" style={{ maxWidth: '100px', borderRadius: '5px' }} />
                    ) : (
                      <span>Sin foto</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Formulario para crear tareas de mantenimiento */}
            <div className="card shadow-lg">
              <div className="card-body">
                <h5 className="card-title text-primary">Tarea de Mantenimiento</h5>
                <form>
                  <div className="form-group mb-3">
                    {/* <label htmlFor="nombre">Nombre</label> */}
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingresa la tarea de mantenimiento..."
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

            <div className="mt-3">
              <button
                className="btn btn-primary w-100"
                onClick={handleBackToRooms}
              >
                Volver a ver todas las habitaciones
              </button>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary mt-3 px-5 py-2"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateHouseKeeper;
