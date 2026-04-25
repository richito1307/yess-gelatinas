# Estado del Proyecto — Sistema Yess

> Fecha de análisis: 2026-04-25  
> Sistema de gestión para Yess Gelatinas

---

## Resumen Ejecutivo

Backend REST API en Spring Boot 3.4 para gestión de gelatería. CRUD completo en 8 dominios. Sin frontend, sin autenticación, sin tests reales. Estado: **funcional pero no production-ready**.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Lenguaje | Java 17 |
| Framework | Spring Boot 3.4.2 |
| ORM | Spring Data JPA / Hibernate |
| Base de datos | MySQL (localhost:3306/YessGelatinas) |
| Build | Maven (con wrapper `mvnw`) |
| Utilidades | Lombok 1.18.36 |
| Testing | JUnit 5 (spring-boot-starter-test) |

---

## Estructura del Proyecto

```
sistema-yess/
└── sistema-yess/
    └── src/main/java/com/YessGelatinas/sistema_yess/
        ├── SistemaYessApplication.java     # Entry point
        ├── controller/                     # 8 controladores REST
        ├── service/                        # 8 servicios de negocio
        ├── model/                          # 8 entidades JPA
        └── repository/                     # 8 repositorios JPA
    └── src/main/resources/
        ├── application.properties          # Config DB y Spring
        ├── static/                         # VACÍO (sin frontend)
        └── templates/                      # VACÍO (sin UI)
```

---

## Dominos / Módulos

### 1. Productos
- CRUD completo
- Soporte de imagen (upload multipart)
- Vinculación con Receta y UnidadMedida
- Historial de cambios de precio

### 2. Recetas
- CRUD completo
- Nombre del postre, descripción, precio, imagen
- Vinculación con Ingredientes

### 3. Ingredientes de Receta
- Relación Receta ↔ Producto ↔ UnidadMedida
- Cantidad por ingrediente

### 4. Unidades de Medida
- Tipo: `masa` o `volumen`
- Factor de conversión entre unidades

### 5. Ventas
- Registro de venta con fecha y total
- Detalle de venta (líneas de items)
- Precio unitario al momento de la venta

### 6. Imágenes
- Almacenamiento como `LONGBLOB` en DB
- Upload via multipart o JSON base64
- Vinculadas a Productos y Recetas

### 7. Historial de Precios (ProductoHistorial)
- Precio anterior y nuevo
- Timestamp del cambio

---

## Esquema de Base de Datos

```
Productos ──────────┬── UnidadMedida
     │               └── Imagen
     │               └── Receta ──── Imagen
     │
     ├── ProductoHistorial
     │
DetalleVenta ────── Productos
     └───────────── Ventas

IngredienteReceta ─ Receta
     ├───────────── Productos
     └───────────── UnidadMedida
```

**DDL mode:** `validate` — la base de datos debe existir antes de arrancar. Spring no crea ni modifica tablas.

---

## API REST — Endpoints Disponibles

| Recurso | Base Path | Métodos |
|---------|-----------|---------|
| Productos | `/api/productos` | GET, POST, DELETE |
| Recetas | `/api/recetas` | GET, POST, DELETE |
| Ventas | `/api/ventas` | GET, POST, DELETE |
| Detalle Venta | `/api/detalle-venta` | GET, POST, DELETE |
| Imágenes | `/api/imagenes` | GET, POST, DELETE |
| Unidades de Medida | `/api/unidades-medida` | GET, POST, DELETE |
| Ingredientes Receta | `/api/ingredientes-receta` | GET, POST, DELETE |
| Historial Precios | `/api/productos-historial` | GET, POST, DELETE |

> Ningún endpoint tiene PUT/PATCH — no hay actualización parcial implementada.

---

## Configuración

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/YessGelatinas?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```

---

## Problemas Críticos

### Seguridad
| # | Problema | Riesgo |
|---|---------|--------|
| 1 | Credenciales hardcodeadas (`root/root`) en `application.properties` | ALTO |
| 2 | Sin autenticación ni autorización (todos los endpoints son públicos) | ALTO |
| 3 | `allowPublicKeyRetrieval=true` + `useSSL=false` (MySQL sin cifrado) | MEDIO |
| 4 | Sin validación de inputs (no hay `@NotNull`, `@NotBlank`, etc.) | MEDIO |
| 5 | Sin HTTPS configurado | MEDIO |

### Calidad de Código
| # | Problema |
|---|---------|
| 1 | `System.out.println` en lugar de SLF4J |
| 2 | Manejo de errores inconsistente (`RuntimeException` en algunos, `ResponseStatusException` en otros) |
| 3 | Sin handler global de excepciones (`@ControllerAdvice`) |
| 4 | Dos endpoints POST en ProductoController con la misma ruta (conflicto potencial) |
| 5 | Sin paginación en GETs — carga todo en memoria |

### Diseño
| # | Problema |
|---|---------|
| 1 | Sin `@Transactional` en operaciones de Venta (Venta + DetalleVenta deben ser atómicas) |
| 2 | Sin índices en claves foráneas |
| 3 | Sin restricciones únicas (nombres duplicados posibles) |
| 4 | Sin soft deletes — borrado es irreversible |
| 5 | Sin versionado de API (`/api/v1/`) |

---

## Estado de Testing

| Tipo | Estado |
|------|--------|
| Tests unitarios (servicios) | Ausente |
| Tests de integración | Ausente |
| Tests de repositorio | Ausente |
| Context load test | Presente (1 test) |

**Cobertura efectiva: ~0%** del código de negocio.

---

## Lo que Falta

### Funcionalidad
- [ ] **Frontend** — `static/` y `templates/` completamente vacíos
- [ ] **PUT/PATCH** — sin actualización de ninguna entidad
- [ ] **Filtrado/búsqueda** en listas (por nombre, fecha, etc.)
- [ ] **Paginación** en todos los GETs
- [ ] **Autenticación** (Spring Security + JWT recomendado)

### Infraestructura
- [ ] **Docker / docker-compose** — sin containerización
- [ ] **CI/CD** — sin GitHub Actions, Jenkins, ni similar
- [ ] **Variables de entorno** — sin `.env` ni perfiles Spring (`dev`/`prod`)
- [ ] **README** — sin instrucciones de instalación o uso

### Calidad
- [ ] **Swagger/OpenAPI** — sin documentación de API
- [ ] **Tests reales** — cobertura mínima necesaria
- [ ] **Logging** — migrar a SLF4J + configurar niveles por ambiente
- [ ] **Exception handler global** — respuestas de error consistentes

---

## Lo que Funciona Bien

- Arquitectura limpia: Controller → Service → Repository (separación de capas correcta)
- Uso correcto de Lombok (reduce boilerplate)
- Modelos JPA bien definidos con relaciones correctas
- Soporte de imágenes como BLOB funcional
- Historial de precios (auditoría parcial)
- Maven wrapper incluido (build reproducible)

---

## Cómo Arrancar

```bash
# Prerequisito: MySQL corriendo en localhost:3306
# Crear base de datos: CREATE DATABASE YessGelatinas;
# Aplicar schema manualmente (ddl-auto=validate, no autocrea)

cd sistema-yess
./mvnw spring-boot:run

# API disponible en: http://localhost:8080
```

---

## Prioridades Recomendadas

1. **Inmediato:** Mover credenciales a variables de entorno
2. **Corto plazo:** Agregar Spring Security (autenticación básica o JWT)
3. **Corto plazo:** Agregar `@Transactional` en servicio de Ventas
4. **Medio plazo:** Validación de inputs + exception handler global
5. **Medio plazo:** Tests unitarios para servicios críticos
6. **Largo plazo:** Frontend o documentación Swagger + paginación
