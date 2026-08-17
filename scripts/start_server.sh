#!/bin/bash

set -e

export HOME=/root

cd /var/www/expense-tracker

echo "Starting Expense Tracker backend..."

if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

pm2 delete expense-tracker || true

pm2 start dist/server.cjs --name expense-tracker

pm2 save

echo "Application started."

# Increased sleep to 10 seconds to allow Node.js to fully boot and connect to RDS
sleep 10

echo "Checking backend..."

# Changed port from 5000 to 3000
curl -f http://localhost:3000/health

echo "Backend health check passed."
