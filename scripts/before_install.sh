#!/bin/bash
# Stop existing PM2 process and ensure target directory exists
export HOME=/root
mkdir -p /var/www/expense-tracker
if command -v pm2 &> /dev/null; then
    pm2 stop expense-tracker || true
fi