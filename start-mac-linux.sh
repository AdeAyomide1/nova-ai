#!/bin/bash
set -e

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║        NOVA AI — STARTING UP         ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo "  [ERROR] Node.js not found. Install from https://nodejs.org"
  exit 1
fi

# Check .env
if [ ! -f backend/.env ]; then
  echo "  [WARN] No .env found. Copying from .env.example..."
  cp backend/.env.example backend/.env
  echo "  [ACTION] Edit backend/.env and add your ANTHROPIC_API_KEY, then re-run."
  if command -v nano &> /dev/null; then nano backend/.env; fi
  exit 1
fi

# Install deps
if [ ! -d backend/node_modules ]; then
  echo "  [INFO] Installing dependencies..."
  cd backend && npm install && cd ..
fi

# Start backend
echo "  [OK] Starting NOVA backend on :3001..."
cd backend && node server.js &
BACKEND_PID=$!
cd ..

sleep 1

# Open frontend
echo "  [OK] Opening NOVA HUD..."
if command -v xdg-open &> /dev/null; then
  xdg-open frontend/index.html
elif command -v open &> /dev/null; then
  open frontend/index.html
else
  echo "  [INFO] Open frontend/index.html in Chrome or Edge manually."
fi

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║   NOVA is running! Speak to begin.   ║"
echo "  ╚══════════════════════════════════════╝"
echo ""
echo "  Press Ctrl+C to stop."
wait $BACKEND_PID
