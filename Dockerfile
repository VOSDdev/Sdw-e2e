FROM mcr.microsoft.com/playwright:v1.50.0-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Default: run bot
CMD ["npx", "tsx", "bot/telegram-bot.ts"]
