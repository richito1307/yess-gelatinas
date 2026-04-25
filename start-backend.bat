@echo off
title Yess - Backend
chcp 65001 >nul

echo Buscando Java...

REM 1. JAVA_HOME ya definida en el sistema
if defined JAVA_HOME (
    if exist "%JAVA_HOME%\bin\java.exe" goto :run
)
set "JAVA_HOME="

REM 2. Oracle / OpenJDK 21
for /d %%d in ("C:\Program Files\Java\jdk-21*") do (
    if exist "%%d\bin\java.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 3. Adoptium Temurin 21
for /d %%d in ("C:\Program Files\Eclipse Adoptium\jdk-21*") do (
    if exist "%%d\bin\java.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 4. Microsoft JDK 21
for /d %%d in ("C:\Program Files\Microsoft\jdk-21*") do (
    if exist "%%d\bin\java.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 5. Amazon Corretto 21
for /d %%d in ("C:\Program Files\Amazon Corretto\jdk21*") do (
    if exist "%%d\bin\java.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 6. Oracle / OpenJDK 17
for /d %%d in ("C:\Program Files\Java\jdk-17*") do (
    if exist "%%d\bin\java.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 7. Adoptium Temurin 17
for /d %%d in ("C:\Program Files\Eclipse Adoptium\jdk-17*") do (
    if exist "%%d\bin\java.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 8. Cualquier JDK en C:\Program Files\Java
for /d %%d in ("C:\Program Files\Java\jdk*") do (
    if exist "%%d\bin\javac.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 9. Ultimo recurso: derivar desde java.exe en PATH via PowerShell
for /f "delims=" %%i in ('powershell -nologo -command "try{$j=(Get-Command java -EA Stop).Source;Split-Path(Split-Path $j)}catch{}" 2^>nul') do (
    if not defined JAVA_HOME set "JAVA_HOME=%%i"
)
if defined JAVA_HOME goto :run

echo.
echo [ERROR] No se encontro Java 17 o superior.
echo.
echo Instala Java 21 desde: https://adoptium.net
echo Elige: Temurin 21 - Windows x64 .msi
echo Reinicia despues de instalar.
echo.
pause
exit /b 1

:run
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo [OK] Java: %JAVA_HOME%
cd /d "%~dp0sistema-yess"
echo.
echo Iniciando servidor backend...
echo.
mvnw.cmd spring-boot:run
pause
