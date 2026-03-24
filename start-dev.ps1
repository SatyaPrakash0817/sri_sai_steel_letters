# start-dev.ps1
# Starts the backend in a background process and runs Vite bound to the LAN (0.0.0.0).

# Start backend
Write-Host "Starting backend server..."
Start-Process -FilePath node -ArgumentList 'server/index.js' -WindowStyle Hidden

# Give backend a moment to start
Start-Sleep -Seconds 1

Write-Host "Starting Vite (accessible on the LAN)..."
npm run dev -- --host
