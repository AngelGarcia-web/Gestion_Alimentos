DROP DATABASE IF EXISTS gestion_alimentosdb_in5bm;
CREATE DATABASE IF NOT EXISTS gestion_alimentosdb_in5bm;
USE gestion_alimentosdb_in5bm;

CREATE TABLE IF NOT EXISTS roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_institucion VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  foto_url LONGTEXT,
  id_rol INT NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS publicaciones_alimentos (
  id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  cantidad DECIMAL(10,2) NOT NULL,
  unidad_medida VARCHAR(20) NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado ENUM('disponible', 'reservado', 'entregado', 'vencido') DEFAULT 'disponible',
  id_usuario_donante INT NOT NULL,
  id_categoria INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario_donante) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS solicitudes (
  id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
  id_publicacion INT NOT NULL,
  id_usuario_solicitante INT NOT NULL,
  mensaje TEXT,
  estado ENUM('pendiente', 'aprobada', 'rechazada', 'completada') DEFAULT 'pendiente',
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_publicacion) REFERENCES publicaciones_alimentos(id_publicacion) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario_solicitante) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historial_entregas (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  id_solicitud INT NOT NULL,
  fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observaciones TEXT,
  confirmado_por_beneficiario TINYINT(1) DEFAULT 0,
  FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud) ON DELETE CASCADE
);

INSERT IGNORE INTO roles (id_rol, nombre) VALUES 
(1, 'Donante'), 
(2, 'Beneficiario'), 
(3, 'Administrador');

INSERT IGNORE INTO categorias (id_categoria, nombre, descripcion) VALUES 
(1, 'Frutas y Verduras', 'Productos frescos perecederos'),
(2, 'Enlatados y Conservas', 'Larga duración'),
(3, 'Granos y Cereales', 'Arroz, frijoles, lentejas, etc.'),
(4, 'Lácteos', 'Leche, queso, yogur'),
(5, 'Panadería y Repostería', 'Panes, galletas y harinas');

INSERT IGNORE INTO usuarios (id_usuario, nombre_institucion, email, password, telefono, direccion, foto_url, id_rol) VALUES
(1, 'Supermercado El Sol', 'donante1@correo.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '213913810293', 'Zona 1, Ciudad', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58', 1),
(2, 'Restaurante Gourmet', 'donante2@correo.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '5551234567', 'Zona 10, Ciudad', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5', 1),
(3, 'Fundación Esperanza', 'beneficiario1@correo.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '5559876543', 'Zona 4, Ciudad', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c', 2),
(4, 'Comedor Comunitario Luz', 'beneficiario2@correo.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '5554567890', 'Zona 6, Ciudad', 'https://images.unsplash.com/photo-1593113598332-cd288d649433', 2),
(5, 'Admin Central', 'admin1@correo.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '5550000001', 'Oficina Central', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', 3),
(6, 'Gestor Operativo', 'admin2@correo.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '5550000002', 'Oficina Norte', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7', 3);

INSERT IGNORE INTO publicaciones_alimentos (id_publicacion, titulo, descripcion, cantidad, unidad_medida, fecha_vencimiento, estado, id_usuario_donante, id_categoria) VALUES
(1, 'Cajas de Tomate Fresco', 'Excedente de cosecha en buen estado general', 15.00, 'cajas', '2026-10-10', 'reservado', 1, 1),
(2, 'Lote de Pan Artesanal', 'Pan horneado esta mañana, perfectamente consumible', 50.00, 'unidades', '2026-10-05', 'reservado', 2, 5),
(3, 'Yogurt de Fresa 1L', 'Lote cercano a fecha de vencimiento, empaques sellados', 30.00, 'unidades', '2026-10-08', 'reservado', 1, 4),
(4, 'Sacos de Arroz y Lentejas', 'Bolsas de granos con empaque secundario dañado pero intactas', 100.00, 'kg', '2027-01-15', 'reservado', 1, 3),
(5, 'Porciones de Menú Ejecutivo', 'Excedente de platos preparados al almuerzo, refrigerados', 25.00, 'unidades', '2026-10-04', 'entregado', 2, 1);

INSERT IGNORE INTO solicitudes (id_solicitud, id_publicacion, id_usuario_solicitante, mensaje, estado) VALUES
(1, 1, 3, 'Necesitamos para el comedor de niños', 'aprobada'),
(2, 2, 4, 'Requerido para entrega semanal', 'aprobada'),
(3, 3, 3, 'Para refrigerio escolar', 'aprobada'),
(4, 5, 3, 'Solicitud aprobada y entregada con éxito', 'completada');

INSERT IGNORE INTO historial_entregas (id_solicitud, observaciones, confirmado_por_beneficiario) VALUES
(4, 'Solicitud aprobada y entregada con éxito.', 1);