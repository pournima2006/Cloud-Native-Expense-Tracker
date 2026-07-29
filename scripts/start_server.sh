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

sleep 5

echo "Checking backend..."

curl -f http://localhost:5000/health

echo "Backend health check passed."
