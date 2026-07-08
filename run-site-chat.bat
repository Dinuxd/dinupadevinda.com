@echo off
cd /d "%~dp0"
set "PORT=%~1"
if "%PORT%"=="" set "PORT=3000"
set "NEXT_PUBLIC_CHAT_API_URL=http://127.0.0.1:8787/chat"
echo Starting Dinupa Devinda portfolio at http://127.0.0.1:%PORT%
echo Chat endpoint: %NEXT_PUBLIC_CHAT_API_URL%
echo Keep this window open while viewing the site.
pnpm.cmd dev -p %PORT%
pause
