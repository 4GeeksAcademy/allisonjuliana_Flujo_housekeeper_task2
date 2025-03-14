import os
from flask_admin import Admin
from .models import db, User, Hoteles, Theme, Category, HotelTheme, Branches, Maintenance, HouseKeeper, HouseKeeperTask, Room, MaintenanceTask
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    # Configuración de la clave secreta y la interfaz de administración
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample_key')  # Usamos un valor predeterminado 'sample_key' si no está definida
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'  # Define el tema de la interfaz de administración
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    
    
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Hoteles, db.session))
    admin.add_view(ModelView(Theme, db.session))
    admin.add_view(ModelView(HotelTheme, db.session))
    admin.add_view(ModelView(Category, db.session))
    admin.add_view(ModelView(Branches, db.session))
    admin.add_view(ModelView(Maintenance, db.session))
    admin.add_view(ModelView(HouseKeeper, db.session))
    admin.add_view(ModelView(HouseKeeperTask, db.session))
    admin.add_view(ModelView(MaintenanceTask, db.session))
    admin.add_view(ModelView(Room, db.session))
    # Aquí puedes agregar más modelos a la interfaz de administración si lo necesitas
    # admin.add_view(ModelView(YourModelName, db.session, name='YourModelName'))