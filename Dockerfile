# Node.js application
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --if-present
EXPOSE 3000
ENV PORT=3000
CMD ["node", "dist/main.js"]
