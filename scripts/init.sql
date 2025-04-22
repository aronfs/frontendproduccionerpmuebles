-- Crear tablas con IF NOT EXISTS

CREATE TABLE IF NOT EXISTS rol (
    idrol SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu (
    idmenu SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    icono VARCHAR(50),
    url VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS menurol (
    idmenurol SERIAL PRIMARY KEY,
    idmenu INTEGER REFERENCES menu(idmenu),
    idrol INTEGER REFERENCES rol(idrol)
);

CREATE TABLE IF NOT EXISTS usuario (
    idusuario SERIAL PRIMARY KEY,
    nombrecompleto VARCHAR(100),
    correo VARCHAR(40) UNIQUE,
    idrol INTEGER REFERENCES rol(idrol),
    clave VARCHAR(40),
    foto VARCHAR(255),
    esactivo BOOLEAN DEFAULT TRUE,
    fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categoria (
    idcategoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    esactivo BOOLEAN DEFAULT TRUE,
    fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS producto (
    idproducto SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    idcategoria INTEGER REFERENCES categoria(idcategoria),
    stock INTEGER,
    precio DECIMAL(10,2),
    foto VARCHAR(255),
    esactivo BOOLEAN DEFAULT TRUE,
    fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS numerodocumento (
    idnumerodocumento SERIAL PRIMARY KEY,
    ultimo_numero INTEGER NOT NULL,
    fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venta (
    idventa SERIAL PRIMARY KEY,
    numerodocumento VARCHAR(40),
    tipopago VARCHAR(50),
    total DECIMAL(10,2),
    fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detalleventa (
    iddetalleventa SERIAL PRIMARY KEY,
    idventa INTEGER REFERENCES venta(idventa),
    idproducto INTEGER REFERENCES producto(idproducto),
    cantidad INTEGER,
    precio DECIMAL(10,2),
    total DECIMAL(10,2)
);

-- Insertar datos seguros con ON CONFLICT

INSERT INTO rol (nombre) VALUES
('Administrador'),
('Empleado'),
('Supervisor')
ON CONFLICT DO NOTHING;

INSERT INTO usuario (nombrecompleto, correo, idrol, clave, foto) VALUES 
('FABRICIO', 'fabrICIO@outlook.com', 2, 'fabri', 'https://i.ibb.co/ycC9gg5M/person2.png'),
('gol d roger', 'gol@gmail.com', 2, '123456', 'https://i.ibb.co/7tKbfRZt/1000002864.jpg'),
('aron viracocha', 'gqu1wl@yahoo.com', 1, 'SuperAron.com1999', 'https://i.ibb.co/gM6WqRJZ/person3.png'),
('aron', 'aron@superMVPCEO.com', 1, 'Barry.com34', 'https://i.ibb.co/gM6WqRJZ/person3.png'),
('aron', 'aron@outlook.com', 2, '123456', 'https://i.ibb.co/7tKbfRZt/1000002864.jpg'),
('Super Aaron', 'jhon@gmail.com', 2, 'Barry.com34', 'https://i.ibb.co/GfTrtS2s/person1.png'),
('aron', 'aron@outlook.com', 2, '123456', 'https://i.ibb.co/GfTrtS2s/person1.png')
ON CONFLICT (correo) DO NOTHING;

INSERT INTO categoria (nombre, esactivo) VALUES
('Laptops', TRUE),
('Monitores', TRUE),
('Teclados', TRUE),
('Auriculares', TRUE),
('Memorias', TRUE),
('Accesorios', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO producto (nombre, idcategoria, stock, precio, esactivo, foto) VALUES
('laptop hp', 1, NULL, 210.00, true, 'https://i.ibb.co/5WV9zjKJ/laptop-Hp.png'),
('Celular', 6, 3, 1200.00, true, 'https://i.ibb.co/4ZzvFrXp/smartphone.png'),
('laptop hp zero', 1, 51, 230.00, true, 'https://i.ibb.co/zWZphmK9/1000003002.jpg'),
('laptop Pro Gamer', 1, NULL, 200.00, true, 'https://i.ibb.co/gM9SHnf5/laptop-Gamer.png'),
('SHARK Cellphone', 6, 12, 120.00, true, 'https://i.ibb.co/R4bn1nmx/1000002854.jpg'),
('Super celular pro spark', 6, -32, 200.00, true, 'https://i.ibb.co/TxQ1pD9v/fba01e31-e72d-42a4-a0bf-017a0da22de2-1-all-3071.jpg')
ON CONFLICT DO NOTHING;

INSERT INTO menu (nombre, icono, url) VALUES
('DashBoard', 'dashboard', '/pages/dashboard'),
('Usuarios', 'group', '/pages/usuarios'),
('Productos', 'collections_bookmark', '/pages/productos'),
('Venta', 'currency_exchange', '/pages/venta'),
('Historial Ventas', 'edit_note', '/pages/historial_venta'),
('Reportes', 'receipt', '/pages/reportes')
ON CONFLICT DO NOTHING;

-- Este no tiene clave única, así que se puede duplicar. O puedes hacer un filtro con NOT EXISTS si prefieres.

INSERT INTO menurol (idmenu, idrol)
SELECT * FROM (VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1),
(4, 2), (5, 2),
(3, 3), (4, 3), (5, 3), (6, 3)
) AS tmp(idmenu, idrol)
WHERE NOT EXISTS (
  SELECT 1 FROM menurol WHERE menurol.idmenu = tmp.idmenu AND menurol.idrol = tmp.idrol
);

-- También podrías verificar si ya existe
INSERT INTO numerodocumento (ultimo_numero, fecharegistro)
SELECT 0, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM numerodocumento);
