FROM node:gallium-alpine3.15

WORKDIR /RSVPsWebsite
COPY package.json .
RUN npm install
COPY . .
CMD npm start