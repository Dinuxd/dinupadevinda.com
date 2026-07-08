@echo off
set "PORTFOLIO_ROOT=%~dp0"
set "XDG_CONFIG_HOME=%PORTFOLIO_ROOT%.tmp\xdg"
cd /d "%PORTFOLIO_ROOT%portfolio-chat-worker"
echo Starting portfolio chat Worker at http://127.0.0.1:8787/chat
echo Keep this window open while testing the chat.
pnpm.cmd dev --port 8787
pause
