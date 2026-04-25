@echo off
title Yess - Backend
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0sistema-yess"
echo JAVA_HOME=%JAVA_HOME%
echo Iniciando servidor backend...
mvnw.cmd spring-boot:run
pause
