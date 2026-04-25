# Plan de Mejoras — Sistema Yess Gelatinas

> Estado base: backend Spring Boot 3.4 + frontend React/Vite funcionales.

---

## 1. Diseño de Base de Datos

### 1.1 Problema central: ventas sobre recetas + recetas como productos

**Situación actual:**
- `DetalleVenta.producto_id` → solo vende `Productos` (materias primas)
- `Receta` es solo una ficha técnica, no se vende directamente

**Modelo mental correcto para una gelatería:**
- **Producto** = materia prima / ingrediente (azúcar, gelatina en polvo, leche)
- **Receta** = postre terminado que se vende (gelatina de mosaico, gelatina de fresa)
- Ambos pueden aparecer en una venta

**Solución elegida: discriminador por tipo en DetalleVenta**

Mínima disrupción, máxima claridad. `DetalleVenta` pasa a ser polimórfico:

```
DetalleVenta
├── venta_id       FK → Ventas
├── tipo           ENUM('receta', 'producto')   ← NUEVO
├── receta_id      INT NULL FK → Recetas         ← NUEVO
├── producto_id    INT NULL FK → Productos       ← era NOT NULL, pasa a NULL
├── cantidad       DECIMAL(10,2)
└── precio_unitario DECIMAL(10,2)

REGLA: exactamente uno de receta_id / producto_id debe tener valor.
```

Con `ddl-auto=update` Hibernate aplica los cambios automáticamente al arrancar.

---

### 1.2 Nuevas tablas: Clientes y Direcciones

```sql
-- Clientes (personas que compran)
Clientes
├── id              INT PK AUTO_INCREMENT
├── nombre          VARCHAR(100) NOT NULL
├── telefono        VARCHAR(20)  NULL
├── email           VARCHAR(100) NULL
├── notas           TEXT         NULL       ← alergias, preferencias, etc.
└── fecha_registro  TIMESTAMP DEFAULT NOW()

-- Direcciones (una persona puede tener varias)
Direcciones
├── id              INT PK AUTO_INCREMENT
├── cliente_id      INT NOT NULL FK → Clientes (ON DELETE CASCADE)
├── alias           VARCHAR(50)  NULL    ← "Casa", "Trabajo", etc.
├── calle           VARCHAR(200) NOT NULL
├── colonia         VARCHAR(100) NULL
├── ciudad          VARCHAR(100) NOT NULL
├── estado          VARCHAR(100) NULL
├── codigo_postal   VARCHAR(10)  NULL
├── referencias     TEXT         NULL    ← "portón azul, entre..."
└── es_principal    BOOLEAN DEFAULT FALSE
```

### 1.3 Venta registra cliente

```
Ventas
├── id          INT PK
├── fecha       TIMESTAMP
├── total       DECIMAL(10,2)
└── cliente_id  INT NULL FK → Clientes  ← NUEVO (nullable = venta anónima OK)
```

---

### 1.4 Diagrama del nuevo esquema

```
Clientes ──┬── Direcciones
           │
           └── Ventas ──── DetalleVenta ──┬── Recetas ──── IngredienteReceta
                                          │                      │
                                          └── Productos ─────────┘
                                                  │
                                              UnidadMedida
```

---

## 2. Cambios en el Backend

### 2.1 Modelos nuevos (crear archivos)

| Archivo | Descripción |
|---------|-------------|
| `model/Cliente.java` | Entidad @Entity tabla Clientes |
| `model/Direccion.java` | Entidad @Entity tabla Direcciones, @ManyToOne Cliente |
| `repository/ClienteRepository.java` | JpaRepository + findByNombreContainingIgnoreCase |
| `repository/DireccionRepository.java` | JpaRepository + findByClienteId |
| `service/ClienteService.java` | CRUD + @Transactional |
| `service/DireccionService.java` | CRUD + @Transactional |
| `controller/ClienteController.java` | GET/POST/PUT/DELETE + GET /{id}/direcciones |
| `controller/DireccionController.java` | GET/POST/PUT/DELETE |

### 2.2 Modelos modificados

**`model/DetalleVenta.java`**
- Agregar campo `tipo` (Enum: RECETA, PRODUCTO)
- Agregar `@ManyToOne Receta receta` (nullable)
- Hacer `producto` nullable (`nullable = false` → `nullable = true`)

**`model/Venta.java`**
- Agregar `@ManyToOne Cliente cliente` (nullable)

### 2.3 Servicios/Controladores modificados

**`DetalleVentaService`**
- Método `update` actualiza también receta/tipo
- Validación: uno y solo uno de receta_id/producto_id presente

**`VentaController`**
- POST acepta `clienteId` opcional en el body

### 2.4 Enum nuevo

```java
// model/TipoItemVenta.java
public enum TipoItemVenta { RECETA, PRODUCTO }
```

---

## 3. Cambios en el Frontend

### 3.1 Paleta de colores — tema gelatería/postres

**Problema actual:** emerald (verde) no comunica "postres y gelatinas".

**Nueva paleta — Rose + Violet (colores de gelatinas):**

| Variable | Color | Valor oklch | Referencia visual |
|----------|-------|-------------|-------------------|
| `--primary` | Rose-500 | `oklch(0.645 0.246 16.4)` | gelatina de fresa |
| `--accent` | Fuchsia/Violet | `oklch(0.59 0.283 322.9)` | gelatina de uva |
| `--background` | Warm white | `oklch(0.99 0.008 16.0)` | crema batida |
| `--secondary` | Rose-50 | `oklch(0.97 0.016 16.0)` | wafer rosado |

El resultado: UI cálida, femenina, directamente asociada a postres. Cambio solo en `index.css`.

### 3.2 Páginas nuevas

| Página | Ruta | Descripción |
|--------|------|-------------|
| Clientes | `/clientes` | Tabla + CRUD + gestión de direcciones inline |
| Unidades de Medida | `/unidades-medida` | Tabla + CRUD (backend ya listo) |

### 3.3 Páginas modificadas

**Nueva Venta (`/ventas/nueva`)**
- Catálogo dividido en dos tabs: **Postres** (recetas) y **Productos**
- Selector de cliente al inicio (buscador, opcional — "venta rápida" sin cliente)
- El `DetalleVenta` enviado incluye `tipo` + `recetaId` o `productoId` según corresponda

**Historial de Ventas (`/ventas`)**
- Columna "Cliente" en la tabla (muestra nombre o "Anónimo")
- Filtro por cliente
- Detalle expandido muestra distingue entre recetas y productos vendidos

**Dashboard (`/`)**
- Card nuevo: "Receta más vendida esta semana"
- Card nuevo: "Cliente más frecuente del mes"

**Sidebar**
- Agregar links: Clientes (icono Users), Unidades de Medida (icono Ruler)

### 3.4 Componentes de Clientes

- Tabla: nombre, teléfono, email, # de compras
- Botón "Ver/Editar" abre panel lateral (sheet) con:
  - Datos del cliente (editable inline)
  - Lista de direcciones con botón editar/eliminar
  - Formulario para agregar nueva dirección

---

## 4. Otras Mejoras Identificadas

### 4.1 Funcionalidad
- **Costo de receta automático**: calcular costo basado en ingredientes × precio de cada Producto (ingrediente)
- **Margen de ganancia**: en cada receta, mostrar `precio_venta - costo_ingredientes`
- **Stock configurable**: el threshold de "stock bajo" debe ser editable por unidad (no hardcodeado en 5)
- **Productos que se venden directo**: badge visual en Productos indicando si es "vendible directamente" o solo "ingrediente"
- **Historial de compras por cliente**: en el perfil del cliente, listar sus ventas anteriores
- **Búsqueda en ventas**: buscar por cliente, rango de fecha, o monto

### 4.2 UX / Visual
- **Modo de venta rápida**: en NuevaVenta, opción de venta sin seleccionar cliente (flujo más rápido)
- **Confirmación de venta con ticket**: resumen imprimible/guardable del ticket de venta (ventana separada o PDF)
- **Indicadores de stock en catálogo de venta**: al vender un Producto directamente, mostrar stock disponible en el catálogo
- **Imagen en catálogo de venta**: mostrar imagen de la receta/producto en las cards del POS

### 4.3 Datos
- **Soft delete en Clientes**: campo `activo` para no eliminar clientes con historial
- **Índice de búsqueda**: `ClienteRepository.findByNombreContainingIgnoreCase()` para el buscador

---

## 5. Orden de Implementación

```
Paso 1  — Paleta de colores (index.css) ← cambio aislado, 0 riesgo
Paso 2  — Backend: modelos Cliente + Direccion
Paso 3  — Backend: modificar DetalleVenta + Venta
Paso 4  — Frontend: tipos TypeScript + API layer actualizados
Paso 5  — Frontend: página Clientes (CRUD + direcciones)
Paso 6  — Frontend: página Unidades de Medida
Paso 7  — Frontend: NuevaVenta con tabs Postres/Productos + selector cliente
Paso 8  — Frontend: Historial Ventas con columna cliente
Paso 9  — Frontend: Dashboard con cards nuevos
Paso 10 — Sidebar: nuevos links
```

---

## 6. Archivos afectados (resumen)

### Backend — crear
```
model/Cliente.java
model/Direccion.java
model/TipoItemVenta.java (enum)
repository/ClienteRepository.java
repository/DireccionRepository.java
service/ClienteService.java
service/DireccionService.java
controller/ClienteController.java
controller/DireccionController.java
```

### Backend — modificar
```
model/Venta.java          (+ cliente FK nullable)
model/DetalleVenta.java   (+ tipo enum, + receta FK, producto → nullable)
service/DetalleVentaService.java
controller/VentaController.java
```

### Frontend — crear
```
src/pages/Clientes.tsx
src/pages/UnidadesMedida.tsx
src/api/clientes.ts
src/api/direcciones.ts
```

### Frontend — modificar
```
src/index.css             (paleta rose/violet)
src/App.tsx               (rutas nuevas)
src/components/Sidebar.tsx (links nuevos)
src/pages/NuevaVenta.tsx  (tabs + cliente selector)
src/pages/Ventas.tsx      (columna cliente)
src/pages/Dashboard.tsx   (cards nuevos)
src/types/index.ts        (tipos nuevos)
src/api/ventas.ts         (cliente en venta)
```
