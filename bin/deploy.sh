#!/bin/bash

SERVER_IP="$1"
DEPLOYMENT_NAME="$2"
DATE_PREFIX=$(date +%d-%m-%Y-)
DEST_DIR="/home/nextjs/${DATE_PREFIX}${DEPLOYMENT_NAME}/"

if [[ -z "$SERVER_IP" ]]; then
  echo "❌ Please provide the server IP address as the first argument."
  exit 1
fi

if [[ -z "$DEPLOYMENT_NAME" ]]; then
  echo "❌ Please provide the deployment name as the second argument."
  exit 1
fi

echo "⚠️ Are you sure you want to proceed deployment to the LIVE server $SERVER_IP and destination dir $DEST_DIR? (y/n)"
read -r confirm

if [[ "$confirm" != "y" ]]; then
  echo "❌ Operation cancelled."
  exit 1
fi

echo "🚀 Proceeding with deployment..."

rsync -a --delete /home/martin/Sites/elttl-react/.next/standalone/ root@"$SERVER_IP":"$DEST_DIR"
rsync -a --delete /home/martin/Sites/elttl-react/.next/static root@"$SERVER_IP":"$DEST_DIR".next/
rsync -a --delete /home/martin/Sites/elttl-react/public root@"$SERVER_IP":"$DEST_DIR"
