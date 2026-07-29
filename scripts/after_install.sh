#!/bin/bash

set -e

cd /var/www/expense-tracker

echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

echo "Setting permissions..."
chmod -R 755 /var/www/expense-tracker

echo "Build completed successfully."
