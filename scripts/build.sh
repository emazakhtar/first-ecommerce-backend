#!/bin/bash

# Delete existing build directory
rm -rf /build

# Build React code
cd ..
cd /react-ecommerce
rm -rf /build
npm run build

# Copy build directory to backend public directory
cp -R /build/* /path/to/backend/public

# Restart Node.js server
pm2 restart index
