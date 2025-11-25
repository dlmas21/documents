#!/bin/bash

# Скрипт для ручного деплоя на продакшн сервер

set -e

echo "🚀 Starting deployment..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Переменные (можно передать через аргументы или использовать по умолчанию)
SSH_HOST=${1:-"your-server.com"}
SSH_USER=${2:-"root"}
SSH_PORT=${3:-22}
DEPLOY_PATH="/var/documents"

echo -e "${YELLOW}📦 Building application...${NC}"
NODE_OPTIONS='--max-old-space-size=3072' npm run build:prod

echo -e "${YELLOW}📤 Uploading files to server...${NC}"
# Создаем архив для передачи
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='.env.local' \
    -czf deploy.tar.gz .

# Копируем на сервер
scp -P $SSH_PORT deploy.tar.gz $SSH_USER@$SSH_HOST:/tmp/

# Выполняем деплой на сервере
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST << EOF
  set -e
  cd $DEPLOY_PATH
  
  echo "📥 Extracting files..."
  tar -xzf /tmp/deploy.tar.gz -C $DEPLOY_PATH
  
  echo "📦 Installing dependencies..."
  npm ci --production
  
  echo "🔨 Building application..."
  NODE_OPTIONS='--max-old-space-size=3072' npm run build:prod
  
  echo "🔄 Reloading PM2..."
  pm2 reload ecosystem.config.js --update-env
  pm2 save
  
  echo "✅ Deployment completed!"
  
  # Очистка
  rm /tmp/deploy.tar.gz
EOF

# Очистка локально
rm deploy.tar.gz

echo -e "${GREEN}✅ Deployment successful!${NC}"


