# Sugerencia de Stack Frontend — Sistema Yess

## Stack Recomendado

**React + Vite + TypeScript + Tailwind CSS + shadcn/ui**

Este es el stack que Claude Code domina mejor. Mayor cantidad de ejemplos en entrenamiento, mejores sugerencias de código, menos errores al generar componentes.

---

## Por qué este stack

### React + Vite
- React: librería más usada en el mundo, Claude lo conoce a la perfección
- Vite: build tool moderno, arranque en <500ms, hot reload instantáneo
- TypeScript: errores en compilación antes de ejecutar, autocompletado completo

### Tailwind CSS
- CSS utility-first: estilos directamente en el componente, sin archivos .css separados
- Claude genera clases de Tailwind de forma muy precisa
- Fácil de mantener para alguien sin experiencia en CSS avanzado

### shadcn/ui
- Componentes pre-construidos (tablas, formularios, modales, botones, etc.)
- Se instalan como código fuente (no es una librería negra), Claude puede leerlos y modificarlos
- Accesibles y bien diseñados sin esfuerzo
- Componentes clave para este sistema:
  - `Table` → lista de productos, ventas, recetas
  - `Dialog` → formularios de creación/edición
  - `Form` + `Input` → ingreso de datos con validación
  - `Toast` → notificaciones de éxito/error
  - `Card` → resumen de ventas del día

---

## Estructura sugerida del proyecto

```
frontend/
├── src/
│   ├── api/           # Funciones para llamar al backend (fetch/axios)
│   │   ├── productos.ts
│   │   ├── ventas.ts
│   │   └── ...
│   ├── components/    # Componentes reutilizables (tablas, formularios)
│   ├── pages/         # Páginas completas (Productos, Ventas, Recetas, etc.)
│   ├── types/         # Tipos TypeScript que espejo el backend
│   └── App.tsx        # Router principal
├── package.json
└── vite.config.ts
```

---

## Páginas necesarias

| Página | Descripción |
|--------|-------------|
| `/productos` | Lista con búsqueda, botón crear, editar, eliminar |
| `/recetas` | Lista de recetas con sus ingredientes |
| `/ventas` | Registro de ventas y historial |
| `/ventas/nueva` | Formulario de venta (seleccionar productos, cantidades) |
| `/inventario` | Vista de stock actual con alertas de cantidad baja |
| `/backup` | Botón para triggear backup manual |

---

## Cómo se conecta con el backend

El backend corre en `http://localhost:8080`. El frontend en `http://localhost:5173` (Vite default).

CORS ya está configurado en el backend para aceptar `localhost:5173`.

Autenticación: HTTP Basic. El frontend envía las credenciales en cada request:

```typescript
const API_BASE = 'http://localhost:8080/api';
const CREDENTIALS = btoa('admin:yess2024'); // Base64 de usuario:contraseña

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Basic ${CREDENTIALS}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || 'Error del servidor');
  }
  return res.json();
}
```

---

## Instalación rápida

```bash
# Desde la carpeta raíz del proyecto
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui
npx shadcn@latest init
# Instalar componentes que se van necesitando:
npx shadcn@latest add table dialog form input button toast card
```

---

## Alternativas descartadas

| Stack | Por qué no |
|-------|-----------|
| Next.js | SSR innecesario para app local; agrega complejidad sin beneficio |
| Angular | Curva de aprendizaje alta; Claude tiene menos ejemplos precisos |
| Vue.js | Buena opción, pero Claude es más sólido con React |
| Electron | Innecesario; la app ya corre local en el browser |

---

## Resumen

> **React + Vite + TypeScript + Tailwind + shadcn/ui** es el punto óptimo entre productividad, calidad de código generado por Claude, y facilidad de mantenimiento futuro.
