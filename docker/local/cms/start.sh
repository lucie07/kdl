#!/bin/sh
set -ea

npm run bootstrap
npx nodemon --exec npm run start
