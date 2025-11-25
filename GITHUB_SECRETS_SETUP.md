# Настройка GitHub Secrets для автодеплоя

## Ошибка: "missing server host"

Эта ошибка означает, что секреты не настроены в GitHub. Выполните следующие шаги:

## Шаг 1: Перейдите в настройки репозитория

1. Откройте ваш репозиторий на GitHub
2. Нажмите **Settings** (в верхнем меню)
3. В левом меню выберите **Secrets and variables** → **Actions**

## Шаг 2: Добавьте необходимые секреты

Нажмите **New repository secret** и добавьте каждый секрет:

### 1. SSH_HOST
- **Name:** `SSH_HOST`
- **Value:** IP адрес или домен вашего сервера
  - Пример: `212.193.24.244`
  - Или: `dev-dateh.ru` (если настроен домен)

### 2. SSH_USER
- **Name:** `SSH_USER`
- **Value:** Имя пользователя для SSH подключения
  - Пример: `root`
  - Или: `deploy` (если создали отдельного пользователя)

### 3. SSH_PRIVATE_KEY
- **Name:** `SSH_PRIVATE_KEY`
- **Value:** Полный приватный SSH ключ (весь текст, включая заголовки)
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  [весь ключ]
  -----END OPENSSH PRIVATE KEY-----
  ```

### 4. SSH_PORT (опционально)
- **Name:** `SSH_PORT`
- **Value:** Порт SSH (по умолчанию 22)
  - Если порт стандартный (22), можно не добавлять
  - Если другой порт, укажите его (например: `2222`)

## Шаг 3: Получение приватного ключа

Если вы создали ключ на сервере (как в инструкции), выполните на сервере:

```bash
cat ~/.ssh/github_actions_deploy
```

Скопируйте весь вывод (включая `-----BEGIN OPENSSH PRIVATE KEY-----` и `-----END OPENSSH PRIVATE KEY-----`).

## Шаг 4: Проверка

После добавления всех секретов:

1. Перейдите в **Actions** вкладку
2. Выберите workflow "Deploy to Production"
3. Нажмите **Run workflow** → **Run workflow**
4. Проверьте выполнение

## Важные замечания

- ⚠️ **Никогда не коммитьте приватные ключи в репозиторий!**
- ✅ Секреты видны только в GitHub UI и используются только в workflows
- ✅ После добавления секрета его нельзя просмотреть (только изменить или удалить)
- ✅ Если забыли ключ, создайте новый и обновите секрет

## Troubleshooting

### Ошибка: "Permission denied (publickey)"

1. Убедитесь, что публичный ключ добавлен в `~/.ssh/authorized_keys` на сервере:
   ```bash
   cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

2. Проверьте права доступа:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

### Ошибка: "Host key verification failed"

Добавьте опцию в workflow (временно для теста):
```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    port: ${{ secrets.SSH_PORT || 22 }}
    script_stop: true  # Остановить при ошибке
```

### Проверка подключения вручную

На вашем локальном компьютере:
```bash
# Сохраните приватный ключ во временный файл
cat > /tmp/test_key << 'EOF'
[вставьте приватный ключ]
EOF

chmod 600 /tmp/test_key

# Попробуйте подключиться
ssh -i /tmp/test_key root@212.193.24.244

# Удалите ключ после проверки
rm /tmp/test_key
```

## Быстрая проверка секретов

После добавления секретов, workflow автоматически проверит их наличие. Если какой-то секрет отсутствует, вы увидите понятное сообщение об ошибке.

