FROM node:14.11.0-alpine3.12

RUN mkdir /app
WORKDIR /app

COPY ./package.json .
# RUN npm i  module-alias
RUN npm install  --production

#COPY ./env ./env/ 
COPY ./dist/ ./dist/

CMD [ "npm", "start"]
