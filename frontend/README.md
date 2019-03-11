# rpa-frontend

## Installation

- npm install

## Test

- npm test

## Run

- npm run start-local
- NODE_ENV=local PORT=3000 REACT_APP_apiUrl=http://localhost:1337 node pm2/apa.js

## Docker

### Docker build

docker-compose build

### Docker run

- export PORT=3001
- export BACKEND_PORT=1338
- export REACT_APP_apiUrl=http://localhost:${BACKEND_PORT:-1337}
- docker run -p \${PORT:-3001}:3000 -e REACT_APP_apiUrl -it frontend_rpa-frontend:latest /bin/bash
