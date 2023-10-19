export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.8.0/bin

cd first-ecommerce-backend
git pull origin master
npm install
pm2 stop 0
pm2 start index.js
