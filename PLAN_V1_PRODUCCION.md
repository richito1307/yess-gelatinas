# Plan V1 Producción — Sistema Yess Gelatinas

---

## Problema 1 — CORS error en login (BLOQUEANTE)

### Causa raíz

Spring Security intercepta el **OPTIONS preflight** del browser antes de que llegue al filtro CORS.
La regla `.anyRequest().authenticated()` rechaza el preflight con 401 → browser reporta CORS error.

### Fix (1 archivo, 3 líneas)

`SecurityConfig.java` → agregar permiso a OPTIONS antes de la regla general:

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
    .anyRequest().authenticated()
)
```

### Problema adicional para celular

El celular en la misma red WiFi accede por IP local (`192.168.x.x`), no `localhost`.
El CORS actual solo permite `localhost:5173` → desde celular: CORS error igual.

Fix CORS para red local: aceptar cualquier origen local (patrón de IP privada) O listar la IP del router.
Mejor solución: usar `setAllowedOriginPatterns` en lugar de `setAllowedOrigins`:

```java
config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://192.168.*.*:*", "http://10.*.*.*:*", "http://172.*.*.*:*"));
```

### Frontend — API_BASE para celular

El frontend tiene hardcodeado `http://localhost:8080/api`. Desde el celular esto no funciona.
Fix: usar variable de entorno Vite (`.env`) para que el API_BASE sea configurable:

```
# frontend/.env.local
VITE_API_BASE=http://192.168.1.X:8080/api
```

Y en `client.ts`: `const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api'`

### Vite --host para exponer en red local

El dev server de Vite solo escucha en localhost por defecto.
Fix en `package.json` scripts:

```json
"dev": "vite --host"
```

Esto expone el frontend en `http://192.168.1.X:5173` accesible desde el celular en la misma WiFi.

---

## Problema 2 — Seguridad de datos al actualizar el sistema

### Comportamiento de `ddl-auto=update`

| Operación                            | ¿Qué hace Hibernate?                     | ¿Datos en riesgo?                      |
| ------------------------------------ | ---------------------------------------- | -------------------------------------- |
| Agregar nueva tabla                  | Crea la tabla                            | No                                     |
| Agregar columna nullable             | `ALTER TABLE ADD COLUMN NULL`            | No                                     |
| Agregar columna NOT NULL con default | `ALTER TABLE ADD COLUMN DEFAULT X`       | No                                     |
| Agregar columna NOT NULL sin default | **Falla al arrancar**                    | App no levanta                         |
| Renombrar campo Java                 | Crea columna nueva, deja vieja con datos | Sí (datos en columna vieja sin migrar) |
| Cambiar tipo de columna              | Intenta ALTER, puede fallar              | Posible                                |
| Eliminar campo Java                  | No hace nada (columna queda en BD)       | No                                     |
| Eliminar tabla Java                  | No hace nada (tabla queda en BD)         | No                                     |

**Conclusión:** `update` nunca borra datos. El único riesgo real es renombrar campos Java (los datos quedan huérfanos en la columna vieja).

### Reglas para futuras modificaciones

1. **NUNCA renombrar** un campo Java que ya tiene datos — agregar campo nuevo y migrar manualmente
2. **Siempre** dar valor default a columnas NOT NULL nuevas: `columnDefinition = "VARCHAR(X) DEFAULT 'valor'"`
3. **Siempre** hacer backup antes de reiniciar con una nueva versión

### Proceso de deploy seguro (para cada nueva versión)

```
1. Crear backup manual (botón en /configuracion o ejecutar backup.bat)
2. Cerrar el sistema (cerrar ventana del backend)
3. Reemplazar archivos del proyecto con la nueva versión
4. Iniciar sistema con INICIAR_SISTEMA.bat
5. Verificar que levante sin errores
6. Si hay errores: restaurar backup desde C:\YessBackups\
```

### Protección adicional: validar mysqldump path

El backup automático puede fallar silenciosamente si mysqldump no está en PATH.
Fix: agregar a `application.properties` la ruta completa de mysqldump:

```properties
app.backup.mysqldump-path=C:/Program Files/MySQL/MySQL Server 8.0/bin/mysqldump
```

---

## Problema 3 — Responsive para Android

### Áreas que fallan en móvil

| Componente                       | Problema                             | Fix                                         |
| -------------------------------- | ------------------------------------ | ------------------------------------------- |
| Sidebar                          | 240px siempre visible, come pantalla | Drawer con hamburger                        |
| Tablas (Productos, Ventas, etc.) | Se cortan                            | `overflow-x-auto` wrapper                   |
| NuevaVenta                       | Grid 3 columnas                      | Stack vertical, carrito como panel inferior |
| Dashboard cards                  | 4 col puede estar apretado           | 2 col en sm, 4 en lg                        |
| Dialogs                          | Ya son `max-w-md`, OK en móvil       | -                                           |
| Formularios                      | Grid 2 col colapsa solo              | -                                           |

### Plan de implementación responsive

**Paso 1 — Sidebar móvil (mayor impacto)**

- Instalar `Sheet` de shadcn
- `Layout.tsx`: en pantallas < lg, ocultar sidebar fija, mostrar botón hamburger en header
- El Sheet se abre desde el botón y contiene el mismo `Sidebar`
- Tailwind breakpoints: `hidden lg:flex` para sidebar, `flex lg:hidden` para hamburger

**Paso 2 — Tablas scrollables**

- Envolver cada `<Table>` en `<div className="overflow-x-auto -mx-4 px-4">`
- Columnas menos importantes ocultas en móvil: `hidden sm:table-cell`

**Paso 3 — NuevaVenta en móvil**

- Catálogo: ancho completo (ya es grid responsive)
- Carrito: en móvil, botón flotante con badge de cantidad → abre sheet inferior con el carrito
- Usar `Sheet` con `side="bottom"` para el carrito móvil

**Paso 4 — Header móvil**

- Agregar `MobileHeader.tsx` con botón hamburger + título de página
- Solo visible en < lg

---

## Problema 4 — Evaluación de v1 ¿Listo para usar?

### ✅ Funciona y está completo

- Login con usuario/contraseña
- Productos: CRUD completo + imagen + historial de precios
- Recetas: CRUD + ingredientes por receta
- Nueva Venta: postres + productos + selector de cliente
- Historial de ventas: filtros por fecha y cliente, detalle expandible
- Clientes: CRUD + direcciones inline
- Unidades de Medida: CRUD
- Dashboard: métricas del día + alertas de stock
- Backup automático diario (2 AM) + manual
- BD autocreada al primer arranque

### ❌ Bloqueantes antes de usar

1. **CORS** → no se puede hacer login → sistema inutilizable
2. **Responsive** → si se va a usar en celular, es necesario antes del primer uso

### ⚠️ No bloqueante pero importante

- Verificar ruta de mysqldump para backups (puede estar en ruta distinta en la PC de los papás)
- Cambiar contraseña por defecto (`yess2024` → algo personalizado en `application.properties`)
- Probar restaurar un backup antes de que sea necesario hacerlo en urgencia

---

## Orden de implementación

```
Paso 1  CORS fix (SecurityConfig.java — 3 líneas)           ← 5 min, desbloqueante
Paso 2  allowedOriginPatterns para red local                ← 10 min
Paso 3  VITE_API_BASE con variable de entorno               ← 10 min
Paso 4  Vite --host en package.json                         ← 2 min
Paso 5  Layout responsive: Sheet sidebar móvil              ← 1-2 horas
Paso 6  Tablas con overflow-x-auto + columnas ocultas       ← 30 min
Paso 7  NuevaVenta: carrito como Sheet bottom en móvil      ← 1 hora
Paso 8  Verificar mysqldump path + hacer test de backup      ← 15 min manual
Paso 9  Cambiar contraseña en application.properties         ← 2 min manual
```

**Tiempo total de desarrollo:** ~4 horas para dejar el sistema production-ready en móvil.

---

## Archivos a modificar

### Backend

```
src/main/java/.../config/SecurityConfig.java
  → permitir OPTIONS sin auth
  → cambiar setAllowedOrigins → setAllowedOriginPatterns

src/main/resources/application.properties
  → ruta correcta de mysqldump
```

### Frontend

```
frontend/.env.local                   ← nuevo (VITE_API_BASE)
frontend/package.json                 ← vite --host
frontend/src/api/client.ts            ← usar import.meta.env
frontend/src/components/Layout.tsx    ← agregar header móvil + trigger de sheet
frontend/src/components/MobileHeader.tsx ← nuevo
frontend/src/components/Sidebar.tsx   ← exportar contenido separado del wrapper
frontend/src/pages/NuevaVenta.tsx     ← carrito como sheet en móvil
frontend/src/pages/Productos.tsx      ← tabla overflow-x-auto
frontend/src/pages/Ventas.tsx         ← tabla overflow-x-auto
frontend/src/pages/Recetas.tsx        ← tabla overflow-x-auto
frontend/src/pages/UnidadesMedida.tsx ← tabla overflow-x-auto
```

---

## Problema 5 — Control de versiones + Instalación y actualizaciones fáciles

### Recomendación: Git + GitHub (repositorio privado)

**Sí, Git es la herramienta correcta para esto.** Es gratis, confiable, y el flujo de trabajo es exactamente lo que necesitas:

```
Tu laptop (desarrollo)          PC de tus papás (producción)
─────────────────────           ──────────────────────────────
1. Escribes código
2. git commit
3. git push → GitHub
                                4. Doble click en ACTUALIZAR.bat
                                   → git pull (baja cambios)
                                   → npm install (si hay nuevas deps)
                                   → listo, reinicia con INICIAR_SISTEMA.bat
```

Repositorio privado en GitHub = nadie más puede ver el código. Gratis hasta 2,000 min de Actions/mes (no usarás).

---

### Flujo completo de versiones

**Primera vez (setup en PC de papás):**

```
1. Instalar prerequisitos (una sola vez):
   - Java 21 JDK  → adoptium.net
   - Node.js 20+  → nodejs.org
   - MySQL 8      → dev.mysql.com
   - Git          → git-scm.com

2. Clonar el repositorio:
   git clone https://github.com/TU_USUARIO/sistema-yess.git

3. Ejecutar INSTALAR.bat (instala dependencias)
4. Crear frontend\.env.local con la IP del servidor
5. Ejecutar INICIAR_SISTEMA.bat
```

**Cada actualización:**

```
1. Cerrar el sistema
2. Doble click en ACTUALIZAR.bat
3. Doble click en INICIAR_SISTEMA.bat
```

---

### Scripts a crear

#### `INSTALAR.bat` — Setup inicial (solo se ejecuta una vez)

```batch
- Set JAVA_HOME a JDK-21
- cd frontend && npm install --legacy-peer-deps
- Mostrar instrucciones de configuración (editar application.properties y .env.local)
```

#### `ACTUALIZAR.bat` — Bajar cambios y actualizar dependencias

```batch
- Cerrar procesos Java y Node corriendo
- git pull (baja cambios de GitHub)
- cd frontend && npm install --legacy-peer-deps (por si hay nuevas dependencias)
- Notificar que está listo para iniciar
```

---

### .gitignore — Qué NO subir a GitHub

```gitignore
# Java build (archivos compilados - no se necesitan)
sistema-yess/target/

# Frontend build y módulos (se regeneran con npm install)
frontend/node_modules/
frontend/dist/

# Config local (IP específica de cada red WiFi)
frontend/.env.local

# IDE
.idea/
*.iml
```

**¿Qué SÍ se sube?**

- Todo el código fuente
- `application.properties` (el repo es privado, está bien subir credenciales de la BD local)
- `frontend/.env.local.example` → plantilla que los papás copian y editan con su IP

**`frontend/.env.local.example`:**

```
# Copia este archivo como .env.local y edita la IP de tu servidor
VITE_API_BASE=http://192.168.1.X:8080/api
```

---

### Reglas del flujo Git

| Situación                       | Acción                                         |
| ------------------------------- | ---------------------------------------------- |
| Nueva feature pequeña           | commit directo a main                          |
| Feature grande / riesgosa       | rama separada → merge a main cuando esté lista |
| Fix urgente                     | commit directo a main                          |
| Antes de hacer push             | verificar que el backend compila localmente    |
| Antes de ACTUALIZAR en PC papás | **hacer backup de la BD primero**              |

---

### Orden de implementación (Problema 5)

```
Paso 10  Crear .gitignore                          ← 5 min
Paso 11  Crear frontend/.env.local.example         ← 2 min
Paso 12  Crear INSTALAR.bat                        ← 15 min
Paso 13  Crear ACTUALIZAR.bat                      ← 15 min
Paso 14  git init + primer commit + push a GitHub  ← 10 min (manual, tú lo haces)
Paso 15  Probar flujo completo en PC de papás      ← 30 min manual
```

---

### Orden global de implementación (todos los pasos)

```
Paso 1   CORS fix SecurityConfig (OPTIONS permitAll)          ← URGENTE, 5 min
Paso 2   CORS allowedOriginPatterns para red local            ← 10 min
Paso 3   VITE_API_BASE variable de entorno en client.ts       ← 10 min
Paso 4   Vite --host en package.json                          ← 2 min
Paso 5   Layout responsive: Sheet sidebar móvil               ← 1-2 horas
Paso 6   Tablas overflow-x-auto + columnas ocultas móvil      ← 30 min
Paso 7   NuevaVenta: carrito como Sheet bottom en móvil       ← 1 hora
Paso 8   Verificar ruta mysqldump + test backup               ← 15 min manual
Paso 9   Cambiar contraseña en application.properties         ← 2 min manual
Paso 10  .gitignore + .env.local.example                      ← 5 min
Paso 11  INSTALAR.bat                                         ← 15 min
Paso 12  ACTUALIZAR.bat                                       ← 15 min
Paso 13  git init + primer commit + push a GitHub             ← 10 min (tú)
```

**Tiempo estimado total:** ~5-6 horas de desarrollo para v1 production-ready completo.

cd C:\Users\richi\OneDrive\Documentos\sistema-yess
git init
git add .
git commit -m "feat: sistema yess v1"

# Crear repo privado en github.com, luego:

git remote add origin https://github.com/TU_USUARIO/sistema-yess.git
git push -u origin main
