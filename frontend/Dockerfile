FROM node:22-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости (включая dev)
RUN npm install

# Копируем исходный код
COPY . .

# Открываем порт для Vite dev server
EXPOSE 3000

# Запускаем dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
