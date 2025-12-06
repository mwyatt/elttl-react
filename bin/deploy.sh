#!/bin/bash

SERVER_IP="$1"

if [[ -z "$SERVER_IP" ]]; then
  echo "❌ Please provide the server IP address as the first argument."
  exit 1
fi

echo "⚠️  Are you sure you want to proceed deployment to the LIVE server ($SERVER_IP)? (y/n)"
read -r confirm

if [[ "$confirm" != "y" ]]; then
  echo "❌ Operation cancelled."
  exit 1
fi

echo "🚀 Proceeding with deployment..."

ssh root@"$SERVER_IP" 'pm2 stop standalone'
rsync -a --delete /home/martin/Sites/elttl-react/.next/standalone/ root@"$SERVER_IP":/var/www/elttl-standalone/
rsync -a --delete /home/martin/Sites/elttl-react/.next/static root@"$SERVER_IP":/var/www/elttl-standalone/.next/
rsync -a --delete /home/martin/Sites/elttl-react/public root@"$SERVER_IP":/var/www/elttl-standalone/
ssh root@"$SERVER_IP" 'pm2 start standalone'
