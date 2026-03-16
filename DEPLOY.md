# Руководство по развёртыванию на Astra Linux

## Требования

- Astra Linux с установленным Node.js 18+ и npm/pnpm
- MariaDB 10.5+
- Git (опционально)

## Шаг 1: Настройка MariaDB

### 1.1 Установка MariaDB (если не установлена)

```bash
sudo apt update
sudo apt install mariadb-server mariadb-client
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

### 1.2 Настройка безопасности

```bash
sudo mysql_secure_installation
```

### 1.3 Создание базы данных и пользователя

```bash
sudo mysql -u root -p
```

В MySQL/MariaDB консоли:

```sql
-- Создание пользователя для приложения
CREATE USER 'practice_user'@'localhost' IDENTIFIED BY 'ваш_надёжный_пароль';

-- Предоставление прав
GRANT ALL PRIVILEGES ON practice_tracker.* TO 'practice_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1.4 Создание таблиц

```bash
# Из директории проекта
mysql -u root -p < scripts/001-create-tables.sql
```

### 1.5 (Опционально) Загрузка тестовых данных

```bash
mysql -u root -p practice_tracker < scripts/002-seed-data.sql
```

## Шаг 2: Установка Node.js

### Через NodeSource (рекомендуется)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Проверка установки

```bash
node --version  # должна быть 18.x или выше
npm --version
```

## Шаг 3: Настройка приложения

### 3.1 Клонирование/копирование проекта

```bash
cd /var/www
git clone <url-репозитория> practice-tracker
cd practice-tracker
```

Или скопируйте файлы проекта вручную.

### 3.2 Установка зависимостей

```bash
npm install
# или
pnpm install
```

### 3.3 Создание файла конфигурации

```bash
cp .env.example .env.local
nano .env.local
```

Заполните переменные:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=practice_user
DATABASE_PASSWORD=ваш_надёжный_пароль
DATABASE_NAME=practice_tracker

# Сгенерируйте секретный ключ:
# openssl rand -base64 32
JWT_SECRET=ваш_сгенерированный_секретный_ключ

NEXT_PUBLIC_APP_URL=http://ваш-ip-адрес:3000
```

### 3.4 Сборка приложения

```bash
npm run build
```

## Шаг 4: Запуск приложения

### Вариант A: Напрямую через Node.js

```bash
npm run start
```

Приложение будет доступно по адресу `http://localhost:3000`

### Вариант B: Через PM2 (рекомендуется для production)

```bash
# Установка PM2
sudo npm install -g pm2

# Запуск приложения
pm2 start npm --name "practice-tracker" -- start

# Автозапуск при перезагрузке
pm2 startup
pm2 save

# Просмотр логов
pm2 logs practice-tracker

# Перезапуск
pm2 restart practice-tracker
```

## Шаг 5: Настройка Nginx (опционально)

Для проксирования запросов и работы на стандартном порту 80:

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/practice-tracker
```

Конфигурация Nginx:

```nginx
server {
    listen 80;
    server_name ваш-домен-или-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активация конфигурации:

```bash
sudo ln -s /etc/nginx/sites-available/practice-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Шаг 6: Первый вход в систему

1. Откройте браузер и перейдите по адресу `http://ваш-ip:3000`
2. Нажмите "Регистрация" и создайте аккаунт руководителя
3. После регистрации вы автоматически войдёте в систему

## Устранение неполадок

### Ошибка подключения к базе данных

```bash
# Проверьте статус MariaDB
sudo systemctl status mariadb

# Проверьте подключение
mysql -u practice_user -p -e "SELECT 1"
```

### Приложение не запускается

```bash
# Проверьте логи PM2
pm2 logs practice-tracker

# Или запустите в режиме разработки для отладки
npm run dev
```

### Порт 3000 занят

```bash
# Найдите процесс
lsof -i :3000

# Или измените порт
PORT=3001 npm run start
```

## Обновление приложения

```bash
cd /var/www/practice-tracker
git pull origin main  # если используете Git
npm install
npm run build
pm2 restart practice-tracker
```

## Резервное копирование базы данных

```bash
# Создание бэкапа
mysqldump -u practice_user -p practice_tracker > backup_$(date +%Y%m%d).sql

# Восстановление из бэкапа
mysql -u practice_user -p practice_tracker < backup_20240315.sql
```
