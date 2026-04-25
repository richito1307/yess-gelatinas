# Roadmap Frontend — Sistema Yess Gelatinas

## Stack
React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui  
React Router v6 · TanStack Query v5 · react-hook-form + zod · lucide-react

---

## Paso 1 — Scaffold + Configuración base
- `npm create vite@latest frontend --template react-ts`
- Instalar todas las dependencias
- Configurar Tailwind CSS con tema personalizado (emerald como color primario)
- Configurar shadcn/ui (components.json + lib/utils)
- Configurar path alias `@/` en tsconfig + vite.config
- Inicializar TanStack Query en main.tsx

## Paso 2 — Tipos TypeScript
- Definir interfaces que espejo exacto del backend:
  - `Producto`, `Receta`, `Venta`, `DetalleVenta`
  - `UnidadMedida`, `IngredienteReceta`, `Imagen`, `ProductoHistorial`
  - `ErrorResponse`, `ProductImageResponse`

## Paso 3 — Capa API
- `api/client.ts` — fetch base con Authorization HTTP Basic, manejo de errores
- `api/productos.ts` — GET all/by-id, POST multipart, PUT multipart, DELETE
- `api/recetas.ts` — CRUD completo
- `api/ventas.ts` — CRUD completo
- `api/detalleVenta.ts` — CRUD completo
- `api/unidadesMedida.ts` — CRUD completo
- `api/ingredientesReceta.ts` — CRUD completo
- `api/historial.ts` — GET all, POST
- `api/imagenes.ts` — GET, POST uploadProductImage, DELETE
- `api/backup.ts` — POST trigger backup

## Paso 4 — Autenticación
- `AuthContext.tsx` — credenciales en localStorage, login/logout
- `Login.tsx` — formulario con validación, test de conexión al backend
- `PrivateRoute.tsx` — redirección si no autenticado

## Paso 5 — Layout y Navegación
- `Layout.tsx` — sidebar fijo + área de contenido principal
- `Sidebar.tsx` — logo + nav items con íconos + indicador activo
- `PageHeader.tsx` — título de página + breadcrumb opcional
- `ConfirmDialog.tsx` — modal de confirmación para eliminaciones
- `LoadingSpinner.tsx` — indicador de carga
- Componentes shadcn/ui: Button, Input, Label, Dialog, Select, Table, Toast, Card, Badge, Separator, AlertDialog, Textarea, Form

## Paso 6 — Dashboard
- Card: Total ventas del día (suma de ventas de hoy)
- Card: Número de ventas del día
- Card: Productos con stock bajo (cantidad < 5)
- Card: Total de productos activos
- Lista: Últimas 5 ventas con fecha y monto
- Acceso rápido: botón "Nueva Venta"

## Paso 7 — Gestión de Productos
- Tabla con: imagen thumbnail, nombre, precio, cantidad, unidad de medida
- Búsqueda en tiempo real por nombre
- Botón "Nuevo Producto" → modal con formulario
- Modal creación/edición:
  - Input: nombre, precio, cantidad
  - Select: unidad de medida
  - Upload de imagen (preview antes de guardar)
- Botón editar por fila → mismo modal pre-poblado
- Botón eliminar por fila → confirm dialog
- Historial de precios accesible por producto (sub-panel)

## Paso 8 — Gestión de Recetas
- Tabla con: nombre del postre, precio, descripción truncada
- Modal creación/edición de receta
- Vista detalle de receta con tabla de ingredientes
- Gestión de ingredientes dentro del modal:
  - Agregar ingrediente: select producto + cantidad + unidad
  - Eliminar ingrediente
- Upload de imagen para receta

## Paso 9 — Nueva Venta (flujo POS)
- Panel izquierdo: catálogo de productos con precios y stock disponible
- Click en producto → agrega al carrito
- Panel derecho: carrito con cantidades editables
- Botón +/- para ajustar cantidad
- Subtotal por producto
- Total calculado en tiempo real
- Botón "Confirmar Venta" → crea Venta + todos los DetalleVenta en una sola acción
- Confirmación con resumen y opción de nueva venta

## Paso 10 — Historial de Ventas
- Tabla con: fecha, total, número de items
- Filtro por rango de fechas
- Click en fila → panel lateral o modal con detalle completo
- Detalle: lista de productos vendidos con cantidad y precio unitario
- Opción de eliminar venta (con confirmación)

## Paso 11 — Configuración
- Sección Backup:
  - Botón "Crear Backup Ahora" → POST /api/backup → muestra ruta del archivo
  - Info sobre backup automático (diario a las 2 AM)
  - Instrucciones para sincronizar con Google Drive
- Sección Sistema:
  - Usuario actual
  - Info de conexión al backend
  - Versión del sistema

---

## Diseño Visual

### Paleta de colores
- **Primario**: emerald-600 `#059669` (fresco, comida, marca)
- **Fondo**: slate-50 `#F8FAFC`
- **Sidebar**: white con border-r slate-200
- **Texto principal**: slate-900
- **Texto secundario**: slate-500
- **Destructivo**: red-600

### Tipografía
- Inter (Google Fonts) o sistema

### Principios UX
- Acciones principales siempre visibles (no en menús ocultos)
- Confirmación antes de eliminar (nunca borrado accidental)
- Feedback inmediato en cada acción (toast de éxito/error)
- Estados vacíos claros con instrucción de acción
- Carga con esqueletos o spinner (nunca pantalla en blanco)
- Formularios con validación en tiempo real

---

## Estructura de archivos

```
frontend/src/
├── api/           # Una función por endpoint
├── components/
│   ├── ui/        # shadcn/ui components
│   └── ...        # componentes propios
├── contexts/
│   └── AuthContext.tsx
├── pages/         # Una carpeta/archivo por página
├── types/
│   └── index.ts   # Todos los tipos del dominio
├── lib/
│   └── utils.ts   # cn() utility de shadcn
├── App.tsx
├── main.tsx
└── index.css
```
