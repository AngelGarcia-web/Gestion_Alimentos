CREATE DATABASE IF NOT EXISTS gestion_alimentosdb_in5bm;
USE gestion_alimentosdb_in5bm;

-- 1. Tabla Roles
CREATE TABLE IF NOT EXISTS roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Tabla Usuarios (Incluye foto_url para la foto de perfil)
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_institucion VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  foto_url LONGTEXT NOT NULL,
  id_rol INT NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT
);

-- 3. Tabla Categorias
CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

-- 4. Tabla Publicaciones de Alimentos
CREATE TABLE IF NOT EXISTS publicaciones_alimentos (
  id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  cantidad DECIMAL(10,2) NOT NULL,
  unidad_medida VARCHAR(20) NOT NULL, -- Ej: kg, unidades, cajas, litros
  fecha_vencimiento DATE NOT NULL,
  estado ENUM('disponible', 'reservado', 'entregado', 'vencido') DEFAULT 'disponible',
  id_usuario_donante INT NOT NULL,
  id_categoria INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario_donante) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
);

-- 5. Tabla Solicitudes
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

-- 6. Tabla Historial de Entregas (Trazabilidad)
CREATE TABLE IF NOT EXISTS historial_entregas (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  id_solicitud INT NOT NULL,
  fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observaciones TEXT,
  confirmado_por_beneficiario TINYINT(1) DEFAULT 0,
  FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud) ON DELETE CASCADE
);

-- Inserts iniciales de prueba
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

ALTER TABLE usuarios ADD COLUMN foto_url LONGTEXT;