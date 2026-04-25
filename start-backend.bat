@echo off
title Yess - Backend
chcp 65001 >nul

echo Buscando Java...

REM 1. Si JAVA_HOME ya esta definida en el sistema
if defined JAVA_HOME goto :verificar

REM 2. Oracle JDK 21
for /d %%d in ("C:\Program Files\Java\jdk-21*") do set "JAVA_HOME=%%d"
if defined JAVA_HOME goto :verificar

REM 3. Adoptium / Eclipse Temurin 21
for /d %%d in ("C:\Program Files\Eclipse Adoptium\jdk-21*") do set "JAVA_HOME=%%d"
if defined JAVA_HOME goto :verificar

REM 4. Microsoft JDK 21
for /d %%d in ("C:\Program Files\Microsoft\jdk-21*") do set "JAVA_HOME=%%d"
if defined JAVA_HOME goto :verificar

REM 5. Amazon Corretto 21
for /d %%d in ("C:\Program Files\Amazon Corretto\jdk21*") do set "JAVA_HOME=%%d"
if defined JAVA_HOME goto :verificar

REM 6. Oracle JDK 17
for /d %%d in ("C:\Program Files\Java\jdk-17*") do set "JAVA_HOME=%%d"
if defined JAVA_HOME goto :verificar

REM 7. Adoptium JDK 17
for /d %%d in ("C:\Program Files\Eclipse Adoptium\jdk-17*") do set "JAVA_HOME=%%d"
if defined JAVA_HOME goto :verificar

REM 8. Detectar desde java.exe en PATH
for /f "delims=" %%i in ('where java 2^>nul') do (
    if not defined JAVA_HOME set "_JEXE=%%i"
)
if defined _JEXE (
    for %%i in ("%_JEXE%") do set "_JBIN=%%~dpi"
    for %%i in ("%_JBIN:~0,-1%") do set "JAVA_HOME=%%~dpi"
    set "JAVA_HOME=%JAVA_HOME:~0,-1%"
    goto :verificar
)

goto :no_java

:verificar
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] La ruta de Java no es valida: %JAVA_HOME%
    set "JAVA_HOME="
    goto :no_java
)
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo [OK] Java: %JAVA_HOME%
goto :run

:no_java
echo.
echo [ERROR] No se encontro Java 17 o superior.
echo.
echo Instala Java 21 desde: https://adoptium.net
echo Elige: Temurin 21 - Windows x64 .msi
echo Luego cierra esta ventana y ejecuta INICIAR_SISTEMA.bat de nuevo.
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
