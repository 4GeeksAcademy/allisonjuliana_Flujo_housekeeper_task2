from flask_sqlalchemy import SQLAlchemy

# Inicializamos la instancia de SQLAlchemy
db = SQLAlchemy()

# Definición del modelo User
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)  # Mejor no hacer unique en contraseñas
    is_active = db.Column(db.Boolean(), default=True, nullable=False)  # Default a True para usuario activo
    theme = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.id}>'

    def serialize(self):
        """Método de serialización, omite la contraseña por razones de seguridad"""
        return {
            "id": self.id,
            "email": self.email,
            # No se debe serializar la contraseña por razones de seguridad
        }

class Hoteles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    
    def __repr__(self):
        return f'<Hoteles {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "password": self.password
        }
    
class Theme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<Theme {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
        }

class HotelTheme(db.Model):
    __tablename__ = 'hoteltheme'
    id = db.Column(db.Integer, primary_key=True)
    id_hoteles = db.Column(db.Integer, db.ForeignKey('hoteles.id'), nullable=True)
    id_theme = db.Column(db.Integer, db.ForeignKey('theme.id'), nullable=True)

    hoteles = db.relationship('Hoteles', backref='hoteltheme')
    theme = db.relationship('Theme', backref='hoteltheme')

    def __repr__(self):
        return f'<HotelTheme {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "id_hoteles": self.id_hoteles,
            "id_theme": self.id_theme
        }

# Definición del modelo Category
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<Category {self.nombre}>'
            # do not serialize the password, its a security breach
    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre
        }
    
class Branches(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    direccion = db.Column(db.String(120), nullable=False)
    longitud = db.Column(db.Float, nullable=False)
    latitud = db.Column(db.Float, nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hoteles.id'), nullable=False)

    hotel = db.relationship("Hoteles")
    
    def __repr__(self):
        return f'<Branches {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "direccion": self.direccion,
            "longitud": self.longitud,
            "latitud": self.latitud,
            "hotel_id": self.hotel_id
        }
      
class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'),nullable=False)
    branch = db.relationship("Branches")

    def __repr__(self):
        return f'<Room {self.nombre}>'
            # do not serialize the password, its a security breach
        
    def serialize(self):
            return {
                'id': self.id,
                'nombre': self.nombre,
                'branch_id': self.branch_id,
                'branch': self.branch.nombre if self.branch else None  # Se asume que la relación 'branch' tiene un campo 'nombre'
        }

class Maintenance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hoteles.id'), nullable=True)
    
    hotel = db.relationship('Hoteles')

    def __repr__(self):
        return f'<Maintenance {self.nombre}>'
      
    def serialize(self):
      return {
          "id": self.id,
          "nombre": self.nombre,
          "email": self.email,
          "password": self.password,
          "hotel_id": self.hotel_id
        }
      
class HouseKeeper(db.Model):
    __tablename__ = 'housekeeper'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    id_branche = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=True)

    branches = db.relationship('Branches', backref='housekeeper')

    def __repr__(self):
        return f'<HouseKeeper {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "password": self.password,
            "id_branche": self.id_branche
        }
    
class HouseKeeperTask(db.Model):
    __tablename__ = 'housekeepertask'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    photo = db.Column(db.String(120), unique=True, nullable=False)
    condition = db.Column(db.String(80), unique=False, nullable=False)
    assignment_date = db.Column(db.String(80), unique=False, nullable=False)
    submission_date = db.Column(db.String(80), unique=False, nullable=False)
    id_room = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=True)
    id_housekeeper = db.Column(db.Integer, db.ForeignKey('housekeeper.id'), nullable=True)

    room = db.relationship('Room', backref='housekeepertask')
    housekeeper = db.relationship('HouseKeeper', backref='housekeepertask')

    def __repr__(self):
        return f'<HouseKeeperTask {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "photo": self.photo,
            "condition": self.condition,
            "assignment_date": self.assignment_date,
            "submission_date": self.submission_date,
            "id_room": self.id_room,
            "room_nombre": self.room.nombre if self.room else None,
            "id_housekeeper": self.id_housekeeper
        }
    
class MaintenanceTask(db.Model):
    __tablename__ = 'maintenancetask'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    photo = db.Column(db.String(255), nullable=True)
    condition = db.Column(db.String(120), nullable=True)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    maintenance_id = db.Column(db.Integer, db.ForeignKey('maintenance.id'), nullable=False)
    housekeeper_id = db.Column(db.Integer, db.ForeignKey('housekeeper.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

    # Relaciones
    room = db.relationship('Room')
    maintenance = db.relationship('Maintenance')
    housekeeper = db.relationship('HouseKeeper')
    category = db.relationship('Category')

    def __repr__(self):
        return f'<MaintenanceTask {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            # "branch_id": self.branch_id
        # }
            "photo": self.photo,
            "condition": self.condition,
            "room": self.room.serialize() if self.room else None,  # Detalles de la habitación
            "maintenance": self.maintenance.serialize() if self.maintenance else None,  # Detalles del mantenimiento
            "housekeeper": self.housekeeper.serialize() if self.housekeeper else None,  # Detalles del housekeeper
            "category": self.category.serialize() if self.category else None,  # Detalles de la categoría
        }
    
class IncidentMaintenanceTask(db.Model):
    __tablename__ = 'incidentmaintenancetask'  # Nombre de la tabla actualizado
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    housekeeper_id = db.Column(db.Integer, db.ForeignKey('housekeeper.id'), nullable=False)

    room = db.relationship('Room')
    housekeeper = db.relationship('HouseKeeper')

    def __repr__(self):
        return f'<IncidentMaintenanceTask {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "room_id": self.room_id,
            "housekeeper_id": self.housekeeper_id,
            # "room": self.room.serialize() if self.room else None,  # Detalles de la habitación
            # "housekeeper": self.housekeeper.serialize() if self.housekeeper else None,  # Detalles del housekeeper
        }
