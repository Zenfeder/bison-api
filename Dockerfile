FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["pm2", "start", "index.js", "--name", "bison-api"]