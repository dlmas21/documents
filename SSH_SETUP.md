# Настройка SSH для автодеплоя

## Текущая ситуация

Вы создали SSH ключ на сервере. Теперь нужно:

1. Добавить публичный ключ в `authorized_keys` на сервере
2. Скопировать приватный ключ для GitHub Secrets

## Шаг 1: Добавление публичного ключа на сервер

Подключитесь к серверу и выполните:

```bash
# Создайте директорию .ssh если её нет
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Добавьте публичный ключ в authorized_keys
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Проверьте содержимое
cat ~/.ssh/authorized_keys
```

## Шаг 2: Получение приватного ключа для GitHub

На сервере выполните:

```bash
# Выведите приватный ключ (скопируйте весь вывод)
cat ~/.ssh/github_actions_deploy
```

**Важно:** Скопируйте весь вывод, включая строки:

```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

## Шаг 3: Настройка GitHub Secrets

1. Перейдите в ваш репозиторий на GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret** и добавьте:

### SSH_HOST

```
212.193.24.244
```

или

```
dev-dateh.ru
```

(если у вас настроен домен)

### SSH_USER

```
root
```

### SSH_PRIVATE_KEY

Вставьте весь приватный ключ, который скопировали на шаге 2:

```
-----BEGIN OPENSSH PRIVATE KEY-----
[весь ключ]
-----END OPENSSH PRIVATE KEY-----
```

### SSH_PORT

```
22
```

## Шаг 4: Проверка доступа

Для проверки, что всё настроено правильно, можно временно протестировать подключение:

```bash
# На вашем локальном компьютере создайте тестовый файл с ключом
# (скопируйте приватный ключ с сервера)
nano ~/.ssh/test_deploy_key
# Вставьте приватный ключ, сохраните

chmod 600 ~/.ssh/test_deploy_key

# Попробуйте подключиться
ssh -i ~/.ssh/test_deploy_key root@212.193.24.244
```

## Альтернативный вариант (рекомендуется)

Если хотите создать ключ на локальной машине (более безопасно):

### На вашем компьютере:

```bash
# Создайте ключ локально
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy

# Скопируйте публичный ключ на сервер
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@212.193.24.244

# Или вручную:
cat ~/.ssh/github_actions_deploy.pub | ssh root@212.193.24.244 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Затем добавьте в GitHub Secrets:

- `SSH_PRIVATE_KEY` - содержимое `~/.ssh/github_actions_deploy` (приватный ключ)

## Проверка работы

После настройки всех секретов:

1. Сделайте коммит и пуш в ветку `main`
2. Перейдите в **Actions** вкладку на GitHub
3. Увидите запущенный workflow "Deploy to Production"
4. Проверьте логи выполнения

## Troubleshooting

### Ошибка: Permission denied (publickey)

1. Проверьте, что публичный ключ добавлен в `~/.ssh/authorized_keys`
2. Проверьте права доступа:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

### Ошибка: Host key verification failed

Добавьте опцию в workflow для пропуска проверки (не рекомендуется для продакшна, но для теста можно):

```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    port: ${{ secrets.SSH_PORT || 22 }}
    script_stop: true
    script: |
      # ваш скрипт
```

