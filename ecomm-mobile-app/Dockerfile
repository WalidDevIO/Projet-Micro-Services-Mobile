FROM node:18-alpine
RUN npm install -g expo-cli
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "expo", "start", "--tunnel"]