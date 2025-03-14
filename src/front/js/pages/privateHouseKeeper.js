import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateHouseKeeper = () => {
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
  const [rooms, setRooms] = useState([]); // Estado para almacenar los nombres de las habitaciones
  const [selectedRoomId, setSelectedRoomId] = useState(null); // Estado para almacenar el id de la habitación seleccionada
  const [isRoomSelected, setIsRoomSelected] = useState(false); // Estado para controlar si se seleccionó una habitación
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

  // Función para obtener los nombres de las habitaciones
  const handleFetchRooms = async () => {
    try {
      const response = await fetch(`${backendUrl}api/rooms`);  // Esta es la nueva llamada API que devuelve las habitaciones
      if (!response.ok) {
        throw new Error('Error al obtener los nombres de las habitaciones');
      }
      const data = await response.json();
      setRooms(data); // Guardamos los nombres de las habitaciones en el estado
    } catch (error) {
      console.error('Error al obtener las habitaciones:', error);
      alert('Error al obtener los nombres de las habitaciones, por favor intente más tarde.');
    }
  };

  // Llamada a las funciones cuando el componente se monta
  useEffect(() => {
    handleFetchTasks();
    handleFetchRooms(); // Llamamos a esta función para obtener los nombres de las habitaciones
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

  // Función para obtener el nombre de la habitación basado en el id_room
  // const getRoomNameById = (id) => {
  //   const room = rooms.find((room) => room.id === id);
  //   return room ? room.name : 'Habitación no encontrada';
  // };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">Tareas de Housekeeper</h2>

        {/* Mostrar los botones de habitaciones si no se ha seleccionado una habitación */}
        {!isRoomSelected && tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="mb-3">
              <button
                className="btn btn-primary mt-3 px-3 py-2"
                onClick={() => handleRoomClick(task.id_room)} // Seleccionamos el id de la habitación
              >
                <h5>Habitación: {task.id_room}</h5> {/* Mostrar el nombre de la habitación */}
              </button>
            </div>
          ))
        ) : null}

        {/* Mostrar la información de la habitación seleccionada */}
        {isRoomSelected && (
          <div className="mt-4">
            {/* <h4 className="text-center mb-4">Detalles de la Habitación</h4> */}

            {tasks
              .filter((task) => task.id_room === selectedRoomId)
              .map((task) => (
                <div key={task.id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    {/* <h5 className="card-title">Tarea asignada: {task.nombre}</h5> */}
                    <p><strong>Tarea asignada::</strong> {task.nombre}</p>
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
                    <div className="mt-3">
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleBackToRooms}
                      >
                        Volver a ver todas las habitaciones
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Cerrar sesión */}
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
