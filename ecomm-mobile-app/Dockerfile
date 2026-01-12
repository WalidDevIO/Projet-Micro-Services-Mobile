FROM node:24-alpine
RUN npm install -g expo-cli
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENTRYPOINT ["npx", "expo", "start", "--non-interactive", "--port"]
CMD ["80"]