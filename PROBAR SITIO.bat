@echo off
title Fosque - probador local del paquete FTP
cd /d "%~dp0"
node scripts/probar-ftp.mjs
pause
