cd first-ecommerce-backend
git pull origin master
/home/ubuntu/.nvm/versions/node/v22.14.0/bin/npm install
/home/ubuntu/.nvm/versions/node/v22.14.0/bin/pm2 stop 0
/home/ubuntu/.nvm/versions/node/v22.14.0/bin/pm2 start index.js
