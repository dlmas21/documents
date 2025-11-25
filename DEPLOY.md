# Инструкция по настройке автодеплоя

## Вариант 1: GitHub Actions (Рекомендуется)

### Шаг 1: Настройка SSH ключей на сервере

1. На сервере создайте пользователя для деплоя (если еще нет):
```bash
adduser deploy
usermod -aG sudo deploy
```

2. Создайте SSH ключ для GitHub Actions:
```bash
# На вашем локальном компьютере
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
```

3. Скопируйте публичный ключ на сервер:
```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub deploy@your-server.com
```

4. Проверьте доступ:
```bash
ssh -i ~/.ssh/github_actions_deploy deploy@your-server.com
```

### Шаг 2: Настройка GitHub Secrets

1. Перейдите в ваш репозиторий на GitHub
2. Settings → Secrets and variables → Actions
3. Добавьте следующие секреты:

- `SSH_HOST` - IP адрес или домен вашего сервера (например: `192.168.1.1` или `dev-dateh.ru`)
- `SSH_USER` - пользователь для SSH (например: `deploy` или `root`)
- `SSH_PRIVATE_KEY` - содержимое приватного ключа (`~/.ssh/github_actions_deploy`)
- `SSH_PORT` - порт SSH (обычно `22`)

### Шаг 3: Настройка сервера

1. Убедитесь, что на сервере установлены:
   - Node.js >= 20
   - npm
   - PM2
   - Git

2. Клонируйте репозиторий на сервер:
```bash
cd /var
git clone https://github.com/your-username/your-repo.git documents
cd documents
npm install
```

3. Настройте PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Следуйте инструкциям для автозапуска
```

4. Настройте переменные окружения:
```bash
# Создайте .env файл с необходимыми переменными
nano /var/documents/.env
```

### Шаг 4: Настройка workflow

Отредактируйте `.github/workflows/deploy.yml`:
- Измените `branches: - main` на вашу основную ветку, если она другая
- Проверьте путь деплоя `/var/documents`

### Шаг 5: Тестирование

1. Сделайте коммит и пуш в ветку `main`:
```bash
git add .
git commit -m "Setup auto-deploy"
git push origin main
```

2. Проверьте статус деплоя в GitHub:
   - Перейдите в Actions вкладку
   - Увидите запущенный workflow

## Вариант 2: Ручной деплой через скрипт

### Использование deploy.sh

1. Сделайте скрипт исполняемым:
```bash
chmod +x deploy.sh
```

2. Запустите деплой:
```bash
./deploy.sh your-server.com deploy 22
```

Параметры:
- `your-server.com` - адрес сервера
- `deploy` - пользователь SSH
- `22` - порт SSH

## Вариант 3: Улучшенный GitHub Actions с rsync

Если хотите использовать rsync вместо git pull (быстрее и надежнее), можно использовать альтернативный workflow:

```yaml
# .github/workflows/deploy-rsync.yml
name: Deploy with rsync

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build:prod
      
      - name: Deploy via rsync
        uses: burnett01/rsync-deployments@7.0.1
        with:
          switches: -avzr --delete
          path: ./
          remote_path: /var/documents
          remote_host: ${{ secrets.SSH_HOST }}
          remote_user: ${{ secrets.SSH_USER }}
          remote_key: ${{ secrets.SSH_PRIVATE_KEY }}
          remote_port: ${{ secrets.SSH_PORT }}
      
      - name: Restart PM2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/documents
            npm ci --production
            npm run build:prod
            pm2 reload ecosystem.config.js --update-env
```

## Troubleshooting

### Проблема: Permission denied
```bash
# На сервере проверьте права доступа
sudo chown -R deploy:deploy /var/documents
```

### Проблема: PM2 не запускается
```bash
# Проверьте статус PM2
pm2 status
pm2 logs

# Перезапустите
pm2 restart ecosystem.config.js
```

### Проблема: Build падает с ошибкой памяти
Убедитесь, что в `package.json` используется `build:prod` с увеличенной памятью.

### Проблема: Порт занят
```bash
# Проверьте, что порт 8082 свободен
sudo lsof -i :8082

# Или измените порт в ecosystem.config.js
```

## Полезные команды PM2

```bash
# Статус приложений
pm2 status

# Логи
pm2 logs documents-app

# Перезапуск
pm2 restart documents-app

# Остановка
pm2 stop documents-app

# Мониторинг
pm2 monit
```


