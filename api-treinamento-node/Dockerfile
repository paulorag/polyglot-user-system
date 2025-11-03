FROM node:18-alpine

RUN apk add curl

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npx prisma generate && npm run dev"]