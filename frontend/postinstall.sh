#!/bin/sh

npm rebuild node-sass
npm audit fix
cp -rf ./node_modules_override/. ./node_modules
