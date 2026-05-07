@echo off
REM Vault Finance - Local Development Startup Script
REM This script starts both the backend and frontend in development mode

echo.
echo ================================
echo Vault Finance - Development Server
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js detected
echo.

REM Check if MongoDB is configured
echo Before starting, ensure MongoDB is running:
echo.
echo Option 1: Local MongoDB
echo   Run: mongod
echo   Or: Connect using MongoDB Compass
echo.
echo Option 2: MongoDB Atlas
echo   Update backend\.env with connection string
echo   (connection string from https://www.mongodb.com/cloud/atlas)
echo.

REM Create two terminal windows
echo Starting development servers...
echo.

REM Start backend in a new window
echo [Backend] Starting Express server on port 3001...
start "Vault Finance - Backend" cmd /k "cd backend && npm run dev"

REM Start frontend in a new window
echo [Frontend] Starting React dev server on port 5173...
start "Vault Finance - Frontend" cmd /k "npm run dev"

echo.
echo ✓ Both servers started in new windows
echo.
echo Frontend:  http://localhost:5173/Vault-Finance/
echo Backend:   http://localhost:3001
echo Health:    http://localhost:3001/health
echo.
echo Press Ctrl+C in each window to stop servers
echo.
pause
