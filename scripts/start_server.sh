#!/bin/bash
# Start or restart backend server using PM2
export HOME=/root
cd /var/www/expense-tracker

if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

pm2 describe expense-tracker > /dev/null 2>&1
if [ $? -eq 0 ]; then
    pm2 restart expense-tracker
else
    pm2 start dist/server.cjs --name "expense-tracker"
fi

pm2 save