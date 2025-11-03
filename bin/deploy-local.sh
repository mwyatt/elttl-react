echo "⚠️  Are you sure you want to proceed deployment to the LOCAL server? (y/n)"
read -r confirm

if [[ "$confirm" != "y" ]]; then
  echo "❌ Operation cancelled."
  exit 1
fi

echo "🚀 Proceeding with deployment..."

rsync -a --delete /home/martin/Sites/elttl-react/.next/standalone/ /home/martin/Sites/local-elttl-react-deployment
rsync -a --delete /home/martin/Sites/elttl-react/.next/static /home/martin/Sites/local-elttl-react-deployment/.next/
rsync -a --delete /home/martin/Sites/elttl-react/public /home/martin/Sites/local-elttl-react-deployment
