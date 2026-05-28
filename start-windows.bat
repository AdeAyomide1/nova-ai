@echo off
title NOVA AI — Launcher
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        NOVA AI — STARTING UP         ║
echo  ╚══════════════════════════════════════╝
echo.

:: Check Node
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo  [ERROR] Node.js not found. Download from https://nodejs.org
  pause
  exit /b
)

:: Check .env
if not exist backend\.env (
  echo  [WARN] No .env file found. Copying from .env.example...
  copy backend\.env.example backend\.env
  echo  [ACTION] Open backend\.env and add your ANTHROPIC_API_KEY then re-run this script.
  notepad backend\.env
  pause
  exit /b
)

:: Install deps if needed
if not exist backend\node_modules (
  echo  [INFO] Installing backend dependencies...
  cd backend
  npm install
  cd ..
)

echo  [OK] Starting NOVA backend on port 3001...
start "NOVA Backend" cmd /k "cd backend && node server.js"

timeout /t 2 /nobreak >nul

echo  [OK] Opening NOVA HUD in browser...
start "" frontend\index.html

echo.
echo  ╔══════════════════════════════════════╗
echo  ║   NOVA is running! Speak to begin.   ║
echo  ╚══════════════════════════════════════╝
echo.
pause
