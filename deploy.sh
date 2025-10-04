echo "Deploying Hugo Site"
hugo
echo "Deploying to GitHub Pages"

sudo rsync -av --delete public/ /var/www/portfolio

echo "Deployed to /var/www/portfolio"