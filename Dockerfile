FROM python:3.6.7

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y nodejs
RUN apt-get clean -y

COPY . app/

WORKDIR app/

RUN pip install -r server/personalised_query/requirements.txt

RUN cd frontend && npm install && npm audit fix && npm rebuild node-sass && cp -rf ./node_modules_override/. ./node_modules

EXPOSE 3000 3001