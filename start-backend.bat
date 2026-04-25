@echo off
title Yess - Backend
chcp 65001 >nul

echo Buscando Java JDK...

REM Necesitamos JDK (no JRE) -- verificamos con javac.exe, no java.exe

REM 1. JAVA_HOME del sistema -- validar que sea JDK real
if defined JAVA_HOME (
    if exist "%JAVA_HOME%\bin\javac.exe" goto :run
)
set "JAVA_HOME="

REM 2. Oracle / OpenJDK 21
for /d %%d in ("C:\Program Files\Java\jdk-21*") do (
    if exist "%%d\bin\javac.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 3. Adoptium Temurin 21
for /d %%d in ("C:\Program Files\Eclipse Adoptium\jdk-21*") do (
    if exist "%%d\bin\javac.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 4. Microsoft JDK 21
for /d %%d in ("C:\Program Files\Microsoft\jdk-21*") do (
    if exist "%%d\bin\javac.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 5. Amazon Corretto 21
for /d %%d in ("C:\Program Files\Amazon Corretto\jdk21*") do (
    if exist "%%d\bin\javac.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 6. Oracle / OpenJDK 17
for /d %%d in ("C:\Program Files\Java\jdk-17*") do (
    if exist "%%d\bin\javac.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 7. Adoptium Temurin 17
for /d %%d in ("C:\Program Files\Eclipse Adoptium\jdk-17*") do (
    if exist "%%d\bin\javac.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 8. Cualquier JDK en C:\Program Files\Java (JDK 11, 17, 21, etc.)
for /d %%d in ("C:\Program Files\Java\jdk*") do (
    if exist "%%d\bin\javac.exe" set "JAVA_HOME=%%d"
)
if defined JAVA_HOME goto :run

REM 9. Buscar via PowerShell -- sube dos niveles desde javac.exe
for /f "delims=" %%i in ('powershell -nologo -command "try{$j=(Get-Command javac -EA Stop).Source;Split-Path(Split-Path $j)}catch{}" 2^>nul') do (
    if not defined JAVA_HOME (
        if exist "%%i\bin\javac.exe" set "JAVA_HOME=%%i"
    )
)
if defined JAVA_HOME goto :run

REM Tiene java.exe (JRE) pero no javac.exe (JDK)?
where java >nul 2>&1
if %ERRORLEVEL%==0 (
    echo.
    echo [ERROR] Java esta instalado pero es solo JRE, no JDK.
    echo         Maven necesita el JDK completo para compilar.
) else (
    echo.
    echo [ERROR] Java no encontrado.
)
echo.
echo Instala Java 21 JDK desde: https://adoptium.net
echo Elige: Temurin 21 - Windows x64 .msi
echo.
echo IMPORTANTE: Al instalar, marca la opcion
echo "Set JAVA_HOME variable" si aparece.
echo.
pause
exit /b 1

:run
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo [OK] Java JDK: %JAVA_HOME%
cd /d "%~dp0sistema-yess"
echo.
echo Iniciando servidor backend...
echo.
mvnw.cmd spring-boot:run
pause
