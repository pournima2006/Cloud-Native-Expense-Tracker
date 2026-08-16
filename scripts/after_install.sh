#!/bin/bash

set -e

cd /var/www/expense-tracker

echo "Installing dependencies..."
npm install

echo "Setting permissions..."
chmod -R 755 /var/www/expense-tracker

echo "AfterInstall completed successfully."
