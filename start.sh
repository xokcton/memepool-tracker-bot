#!/bin/bash

# Переходим в директорию, где лежит скрипт
cd "$(dirname "$0")"

# Проверка наличия Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js не установлен. Установите его: https://nodejs.org/"
    exit 1
fi

# Проверка наличия npm
if ! command -v npm &> /dev/null
then
    echo "❌ npm не установлен. Обычно он ставится вместе с Node.js."
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"

echo "🚀 Запуск проекта..."
npm start
