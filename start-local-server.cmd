@echo off
set "ROOT=%~dp0"
set "NODE=C:\Users\Xiaotong\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "SERVER=C:\Users\Xiaotong\Documents\Codex\2026-06-14\where-is-the-sandbox-location\work\journal-server.js"
cd /d "%ROOT%"
"%NODE%" "%SERVER%" 4174
pause
