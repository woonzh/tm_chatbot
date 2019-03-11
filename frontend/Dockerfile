FROM node:10.12-alpine

ADD . /usr/src/app/
RUN cd /usr/src/app && npm install && npm audit fix && npm rebuild node-sass && cp -rf ./node_modules_override/. ./node_modules

EXPOSE 3000
WORKDIR /usr/src/app
ENTRYPOINT ["sh", "-c", "npm run start-tm"]
