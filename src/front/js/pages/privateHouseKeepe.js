import React, { useState, useEffect } from 'react';

const PrivateHouseKeeper = () => {
  const [nombre, setNombre] = useState('');
  const [photo, setPhoto] = useState('');
  const [condition, setCondition] = useState('');
  const [idRoom, setIdRoom] = useState('');
  const [idMaintenance, setIdMaintenance] = useState('');
  const [idHousekeeper, setIdHousekeeper] = useState('');
  const [idCategory, setIdCategory] = useState('');
  const [rooms, setRooms] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [housekeepers, setHousekeepers] = useState([]);
  const [categories, setCategories] = useState([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  // Cargar las habitaciones, mantenimientos, housekeepers y categorías
  const loadOptions = async () => {
    try {
      const [roomsResponse, maintenancesResponse, housekeepersResponse, categoriesResponse] = await Promise.all([
        fetch(`${backendUrl}api/rooms`),
        fetch(`${backendUrl}api/maintenance`),
        fetch(`${backendUrl}api/housekeepers`),
        fetch(`${backendUrl}api/categories`),
      ]);

      if (roomsResponse.ok && maintenancesResponse.ok && housekeepersResponse.ok && categoriesResponse.ok) {
        const roomsData = await roomsResponse.json();
        const maintenancesData = await maintenancesResponse.json();
        const housekeepersData = await housekeepersResponse.json();
        const categoriesData = await categoriesResponse.json();

        setRooms(roomsData);
        setMaintenances(maintenancesData);
        setHousekeepers(housekeepersData);
        setCategories(categoriesData);
      } else {
        console.error('Error al obtener las opciones:', roomsResponse.status);
      }
    } catch (error) {
      console.error('Error al obtener las opciones:', error);
    }
  };

  // Crear una nueva tarea de mantenimiento
  const createMaintenanceTask = async () => {
    // Verificar que todos los campos estén llenos
    if (!nombre || !photo || !condition || !idRoom || !idMaintenance || !idHousekeeper || !idCategory) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/maintenancetasks`, { // Usamos esta URL para crear tareas de mantenimiento
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          photo,
          condition,
          room_id: idRoom,
          maintenance_id: idMaintenance,
          housekeeper_id: idHousekeeper,
          category_id: idCategory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Si la respuesta es correcta, puedes agregar el nuevo mantenimiento a tu lista (si es necesario)
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
    setPhoto('');
    setCondition('');
    setIdRoom('');
    setIdMaintenance('');
    setIdHousekeeper('');
    setIdCategory('');
  };

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <div className="container">
      <h1>Gestión de Tareas de Mantenimiento</h1>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Crear Tarea de Mantenimiento</h5>
          <form>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Foto</label>
              <input
                type="text"
                className="form-control"
                id="photo"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condición</label>
              <input
                type="text"
                className="form-control"
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="idRoom">Habitación</label>
              <select
                className="form-control"
                id="idRoom"
                value={idRoom}
                onChange={(e) => setIdRoom(e.target.value)}
              >
                <option value="">Selecciona una habitación</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="idMaintenance">Mantenimiento</label>
              <select
                className="form-control"
                id="idMaintenance"
                value={idMaintenance}
                onChange={(e) => setIdMaintenance(e.target.value)}
              >
                <option value="">Selecciona un mantenimiento</option>
                {maintenances.map((maintenance) => (
                  <option key={maintenance.id} value={maintenance.id}>
                    {maintenance.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="idHousekeeper">Housekeeper</label>
              <select
                className="form-control"
                id="idHousekeeper"
                value={idHousekeeper}
                onChange={(e) => setIdHousekeeper(e.target.value)}
              >
                <option value="">Selecciona un housekeeper</option>
                {housekeepers.map((housekeeper) => (
                  <option key={housekeeper.id} value={housekeeper.id}>
                    {housekeeper.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="idCategory">Categoría</label>
              <select
                className="form-control"
                id="idCategory"
                value={idCategory}
                onChange={(e) => setIdCategory(e.target.value)}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary"
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
