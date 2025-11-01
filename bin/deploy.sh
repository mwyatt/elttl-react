ssh root@144.126.233.12 'pm2 stop standalone'
rsync -av --delete /home/martin/Sites/elttl-react/.next/standalone/ root@144.126.233.12:/var/www/elttl-standalone/
rsync -av --delete /home/martin/Sites/elttl-react/.next/static root@144.126.233.12:/var/www/elttl-standalone/.next/
rsync -av --delete /home/martin/Sites/elttl-react/public root@144.126.233.12:/var/www/elttl-standalone/
ssh root@144.126.233.12 'pm2 start standalone'
