@echo off
title Yess Gelatinas - Actualizando sistema
chcp 65001 >nul

echo ================================================
echo   Sistema Yess Gelatinas - Actualizacion
echo ================================================
echo.
echo IMPORTANTE: Haz un backup antes de continuar.
echo Si no lo has hecho, presiona Ctrl+C para cancelar.
echo.
pause

REM Cerrar instancias corriendo
echo Cerrando sistema actual...
taskkill /fi "WINDOWTITLE eq Yess - Backend" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq Yess - Frontend" /f >nul 2>&1
timeout /t 2 /nobreak >nul

REM Bajar cambios de GitHub
echo Descargando actualizaciones de GitHub...
cd /d "%~dp0"
git pull
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] No se pudo bajar actualizaciones.
    echo Verifica tu conexion a internet o contacta al desarrollador.
    pause
    exit /b 1
)
echo [OK] Codigo actualizado.

REM Actualizar dependencias del frontend si cambiaron
echo Actualizando dependencias del frontend...
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
echo   Sistema actualizado exitosamente
echo ================================================
echo.
echo Ejecuta INICIAR_SISTEMA.bat para arrancar.
echo.
pause
