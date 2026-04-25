@echo off
title Yess Gelatinas - Instalacion inicial
chcp 65001 >nul

echo ================================================
echo   Sistema Yess Gelatinas - Instalacion inicial
echo ================================================
echo.

REM Verificar Java
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Java no esta instalado.
    echo Descarga Java 21 desde: https://adoptium.net
    pause
    exit /b 1
)
echo [OK] Java encontrado.

REM Verificar Node.js
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo Descarga Node.js 20 desde: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js encontrado.

REM Verificar Git
git --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git no esta instalado.
    echo Descarga Git desde: https://git-scm.com
    pause
    exit /b 1
)
echo [OK] Git encontrado.

REM Verificar MySQL (mysqldump)
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [AVISO] mysqldump no encontrado en la ruta esperada.
    echo Verifica que MySQL 8.0 este instalado.
    echo El backup automatico puede no funcionar.
) else (
    echo [OK] MySQL encontrado.
)

echo.
echo Instalando dependencias del frontend...
cd /d "%~dp0frontend"
npm install --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Fallo npm install.
    pause
    exit /b 1
)
cd /d "%~dp0"

echo.
echo ================================================
echo   Instalacion completada
echo ================================================
echo.
echo PASOS SIGUIENTES (hacer una sola vez):
echo.
echo 1. Edita el archivo:
echo    sistema-yess\src\main\resources\application.properties
echo    - Cambia la contrasena de MySQL si es diferente a "root"
echo    - Cambia app.security.password por una contrasena personalizada
echo.
echo 2. Para usar desde el celular, crea el archivo:
echo    frontend\.env.local
echo    (copia frontend\.env.local.example y edita la IP)
echo    Para saber tu IP: abre CMD y escribe "ipconfig"
echo.
echo 3. Ejecuta INICIAR_SISTEMA.bat para arrancar.
echo.
pause
