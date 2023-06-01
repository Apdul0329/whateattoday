FROM node
WORKDIR /usr/src/app
COPY package*.json ./
COPY .env ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node", "app.js"]  