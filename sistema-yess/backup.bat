@echo off
setlocal

REM ============================================================
REM  Backup manual de YessGelatinas
REM  Ejecutar este archivo para crear un respaldo de la BD
REM ============================================================

set DB_NAME=YessGelatinas
set DB_USER=root
set DB_PASSWORD=root
set BACKUP_FOLDER=C:\YessBackups

REM Si mysqldump no esta en PATH, descomentar y ajustar:
REM set MYSQLDUMP=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe
set MYSQLDUMP=mysqldump

if not exist "%BACKUP_FOLDER%" mkdir "%BACKUP_FOLDER%"

REM Formato de fecha: YYYY-MM-DD
for /f "tokens=1-3 delims=/" %%a in ("%date%") do (
    set DIA=%%a
    set MES=%%b
    set ANIO=%%c
)
REM Formato de hora: HH-MM
for /f "tokens=1-2 delims=: " %%a in ("%time%") do (
    set HORA=%%a
    set MIN=%%b
)

set FILENAME=%BACKUP_FOLDER%\yess_backup_%ANIO%-%MES%-%DIA%_%HORA%-%MIN%.sql

echo Creando backup en: %FILENAME%
"%MYSQLDUMP%" -u %DB_USER% -p%DB_PASSWORD% --databases %DB_NAME% --result-file="%FILENAME%"

if %ERRORLEVEL% == 0 (
    echo.
    echo Backup exitoso: %FILENAME%
    echo.
    echo RECUERDA: Copia este archivo a Google Drive o una USB para tener respaldo externo.
) else (
    echo.
    echo ERROR: El backup fallo. Verifica que MySQL este corriendo y que mysqldump este en PATH.
)

pause
