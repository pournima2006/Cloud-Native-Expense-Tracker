#!/bin/bash
# Install production dependencies and set permissions
cd /var/www/expense-tracker
npm install --omit=dev
chmod -R 755 /var/www/expense-tracker