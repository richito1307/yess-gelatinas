@echo off
title Yess - Backend
chcp 65001 >nul

REM -------------------------------------------------------
REM  Auto-deteccion de JAVA_HOME
REM -------------------------------------------------------

REM 1. Si ya esta definida en el sistema, usarla directamente
if defined JAVA_HOME (
    echo [OK] JAVA_HOME del sistema: %JAVA_HOME%
    goto :verificar
)

REM 2. Buscar JDK 21 en rutas comunes (Oracle, Adoptium, Microsoft, Amazon)
for /d %%d in (
    "C:\Program Files\Java\jdk-21*"
    "C:\Program Files\Eclipse Adoptium\jdk-21*"
    "C:\Program Files\Microsoft\jdk-21*"
    "C:\Program Files\Amazon Corretto\jdk21*"
    "C:\Program Files\Java\jdk21*"
) do (
    if exist "%%~d\bin\java.exe" (
        set "JAVA_HOME=%%~d"
        echo [OK] Java 21 encontrado en: %%~d
        goto :verificar
    )
)

REM 3. Buscar cualquier JDK 17+ via comando java en PATH
for /f "delims=" %%i in ('where java 2^>nul') do (
    if not defined JAVA_HOME (
        set "_JAVA_EXE=%%i"
        goto :desde_path
    )
)
goto :no_java

:desde_path
REM Subir dos niveles: java.exe -> bin -> JDK
for %%i in ("%_JAVA_EXE%") do set "_BIN=%%~dpi"
for %%i in ("%_BIN:~0,-1%") do set "JAVA_HOME=%%~dpi"
set "JAVA_HOME=%JAVA_HOME:~0,-1%"
echo [OK] Java encontrado via PATH: %JAVA_HOME%

:verificar
REM Verificar que sea Java 17+
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] JAVA_HOME no tiene java.exe: %JAVA_HOME%
    goto :no_java
)
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo JAVA_HOME=%JAVA_HOME%
goto :run

:no_java
echo.
echo [ERROR] No se encontro Java 17 o superior.
echo.
echo Instala Java 21 desde: https://adoptium.net
echo Elige: Temurin 21 - Windows x64 .msi
echo.
echo Despues de instalar, cierra esta ventana y vuelve a ejecutar
echo INICIAR_SISTEMA.bat
echo.
pause
exit /b 1

:run
cd /d "%~dp0sistema-yess"
echo.
echo Iniciando servidor backend...
echo.
mvnw.cmd spring-boot:run
pause
