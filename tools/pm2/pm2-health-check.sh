#!/bin/bash

# Load NVM
export NVM_DIR="/home/nextjs/.nvm"
source "$NVM_DIR/nvm.sh"

# URL to check
URL="https://eastlancstt.org.uk/api/health"

# PM2 process name
APP="current"

# Timeout in seconds for curl
TIMEOUT=5

# Perform the request
STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$URL")

# If status is 504, restart the PM2 process
if [ "$STATUS" -eq 504 ]; then
    echo "$(date): Detected 504 from $URL — reloading PM2 process $APP" >> /var/log/pm2-health.log
    pm2 reload "$APP"
fi
