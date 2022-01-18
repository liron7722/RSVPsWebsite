FROM node:16.13.2-alpine

WORKDIR /RSVPsWebsite
COPY package.json .
RUN npm install
COPY . .
CMD npm start