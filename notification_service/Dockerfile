FROM node:20-slim

RUN apt-get update && apt-get install -y openssl netcat-traditional && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm ci && npm run build

EXPOSE 3003

CMD ["node", "dist/main.js"]