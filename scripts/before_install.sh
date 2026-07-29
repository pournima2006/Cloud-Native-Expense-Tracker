#!/bin/bash

set -e

export HOME=/root

echo "Stopping existing application..."

if command -v pm2 &> /dev/null; then
    pm2 delete expense-tracker || true
fi

mkdir -p /var/www/expense-tracker

echo "BeforeInstall completed."
