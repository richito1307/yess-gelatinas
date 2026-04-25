-- =============================================================
--  V1 — Schema inicial de YessGelatinas
--  Instalaciones nuevas: Flyway crea todas las tablas desde aquí.
--  Instalaciones existentes: se usan como baseline (ya tienen tablas).
-- =============================================================

CREATE TABLE IF NOT EXISTS unidades_medida (
    id                INT          NOT NULL AUTO_INCREMENT,
    nombre            VARCHAR(20)  NOT NULL,
    tipo              VARCHAR(20)  NOT NULL,
    factor_conversion DECIMAL(10,6) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS imagenes (
    id           INT      NOT NULL AUTO_INCREMENT,
    imagen       LONGBLOB NOT NULL,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clientes (
    id             INT          NOT NULL AUTO_INCREMENT,
    nombre         VARCHAR(100) NOT NULL,
    telefono       VARCHAR(20)  DEFAULT NULL,
    email          VARCHAR(100) DEFAULT NULL,
    notas          TEXT         DEFAULT NULL,
    fecha_registro DATETIME(6)  NOT NULL DEFAULT NOW(6),
    activo         BIT(1)       NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS recetas (
    id           INT          NOT NULL AUTO_INCREMENT,
    nombre_postre VARCHAR(100) NOT NULL,
    descripcion  TEXT         DEFAULT NULL,
    precio       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    imagen_id    INT          DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_recetas_imagen FOREIGN KEY (imagen_id) REFERENCES imagenes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS productos (
    id                INT           NOT NULL AUTO_INCREMENT,
    nombre            VARCHAR(100)  NOT NULL,
    cantidad          DECIMAL(10,2) NOT NULL,
    unidad_medida_id  INT           NOT NULL,
    precio            DECIMAL(10,2) NOT NULL,
    fecha_actualizacion DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    imagen_id         INT           DEFAULT NULL,
    receta_id         INT           DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_productos_unidad   FOREIGN KEY (unidad_medida_id) REFERENCES unidades_medida(id),
    CONSTRAINT fk_productos_imagen   FOREIGN KEY (imagen_id)        REFERENCES imagenes(id)        ON DELETE SET NULL,
    CONSTRAINT fk_productos_receta   FOREIGN KEY (receta_id)        REFERENCES recetas(id)         ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ventas (
    id         INT           NOT NULL AUTO_INCREMENT,
    fecha      DATETIME      DEFAULT CURRENT_TIMESTAMP,
    total      DECIMAL(10,2) NOT NULL,
    cliente_id INT           DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_ventas_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS detalle_venta (
    id             INT           NOT NULL AUTO_INCREMENT,
    venta_id       INT           NOT NULL,
    tipo           VARCHAR(10)   NOT NULL DEFAULT 'PRODUCTO',
    receta_id      INT           DEFAULT NULL,
    producto_id    INT           DEFAULT NULL,
    cantidad       DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_detalle_venta    FOREIGN KEY (venta_id)    REFERENCES ventas(id)    ON DELETE CASCADE,
    CONSTRAINT fk_detalle_receta   FOREIGN KEY (receta_id)   REFERENCES recetas(id),
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ingredientes_receta (
    id               INT           NOT NULL AUTO_INCREMENT,
    receta_id        INT           NOT NULL,
    producto_id      INT           NOT NULL,
    cantidad         DECIMAL(10,2) NOT NULL,
    unidad_medida_id INT           NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_ing_receta   FOREIGN KEY (receta_id)        REFERENCES recetas(id)        ON DELETE CASCADE,
    CONSTRAINT fk_ing_producto FOREIGN KEY (producto_id)      REFERENCES productos(id)      ON DELETE CASCADE,
    CONSTRAINT fk_ing_unidad   FOREIGN KEY (unidad_medida_id) REFERENCES unidades_medida(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS productos_historial (
    id              INT           NOT NULL AUTO_INCREMENT,
    producto_id     INT           NOT NULL,
    precio_anterior DECIMAL(10,2) NOT NULL,
    precio_nuevo    DECIMAL(10,2) NOT NULL,
    fecha_cambio    DATETIME      DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_historial_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS direcciones (
    id            INT          NOT NULL AUTO_INCREMENT,
    cliente_id    INT          NOT NULL,
    alias         VARCHAR(50)  DEFAULT NULL,
    calle         VARCHAR(200) NOT NULL,
    colonia       VARCHAR(100) DEFAULT NULL,
    ciudad        VARCHAR(100) NOT NULL,
    estado        VARCHAR(100) DEFAULT NULL,
    codigo_postal VARCHAR(10)  DEFAULT NULL,
    referencias   TEXT         DEFAULT NULL,
    es_principal  BIT(1)       NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_direcciones_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
