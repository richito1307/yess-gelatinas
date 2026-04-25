@echo off
title Yess Gelatinas - Iniciando...

echo ================================
echo   Yess Gelatinas - Sistema
echo ================================
echo.
echo Iniciando backend y frontend...
echo.

start "Yess - Backend" "%~dp0start-backend.bat"

echo Esperando que el servidor arranque (15 segundos)...
timeout /t 15 /nobreak >nul

start "Yess - Frontend" "%~dp0start-frontend.bat"

timeout /t 5 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo Sistema iniciado.
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo.
echo Esta ventana se puede cerrar.
timeout /t 3 /nobreak >nul
