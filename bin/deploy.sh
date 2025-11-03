echo "⚠️  Are you sure you want to proceed deployment to the LIVE server? (y/n)"
read -r confirm

if [[ "$confirm" != "y" ]]; then
  echo "❌ Operation cancelled."
  exit 1
fi

echo "🚀 Proceeding with deployment..."

ssh root@144.126.233.12 'pm2 stop standalone'
rsync -a --delete /home/martin/Sites/elttl-react/.next/standalone/ root@144.126.233.12:/var/www/elttl-standalone/
rsync -a --delete /home/martin/Sites/elttl-react/.next/static root@144.126.233.12:/var/www/elttl-standalone/.next/
rsync -a --delete /home/martin/Sites/elttl-react/public root@144.126.233.12:/var/www/elttl-standalone/
ssh root@144.126.233.12 'pm2 start standalone'
