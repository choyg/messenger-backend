FROM node:alpine
RUN apk update && apk upgrade && apk add git openssh

COPY package*.json ./
RUN npm install

COPY bin ./bin
COPY functions functions
COPY public public
COPY routes routes
COPY views views
COPY app.js app.js
COPY firebaseAccount.json firebaseAccount.json

EXPOSE 3000
CMD ["npm", "start"]
