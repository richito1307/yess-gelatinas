# Yess Gelatinas — Sistema de Gestión

Sistema de ventas y gestión de inventario para Yess Gelatinas.

## Requisitos (instalar una sola vez)

| Software | Versión | Descarga |
|----------|---------|----------|
| Java JDK | 21+ | https://adoptium.net |
| Node.js  | 20+ | https://nodejs.org |
| MySQL    | 8.0  | https://dev.mysql.com/downloads/mysql/ |
| Git      | cualquiera | https://git-scm.com |

## Instalación

```
1. Clonar el repositorio:
   git clone https://github.com/richito1307/yess-gelatinas.git

2. Doble click en:  INSTALAR.bat

3. Doble click en:  INICIAR_SISTEMA.bat
```

## Uso diario

- **Iniciar:** doble click en `INICIAR_SISTEMA.bat`
- **Cerrar:** cerrar las ventanas "Yess - Backend" y "Yess - Frontend"
- **Actualizar:** doble click en `ACTUALIZAR.bat` → luego `INICIAR_SISTEMA.bat`

## Acceso

- **Computadora:** http://localhost:5173
- **Celular (misma WiFi):** ver IP en `frontend/.env.local`
- **Usuario:** admin
- **Contraseña:** yess2024

## Backup

Los backups se crean automáticamente todos los días a las 2 AM en `C:\YessBackups\`.
Para backup manual: ir a **Configuración** en el sistema y hacer clic en "Crear backup ahora".

## Cambiar contraseña

Editar `sistema-yess/src/main/resources/application.properties`:
```
app.security.password=NUEVA_CONTRASEÑA
```
Reiniciar el sistema para que tome efecto.
