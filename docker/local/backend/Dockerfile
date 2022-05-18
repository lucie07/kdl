FROM node:lts-slim as build

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/build

COPY ./backend/package.json /srv/build/

RUN npm install && npm cache clean --force

FROM node:lts-slim as local

RUN \
  apt-get update && apt-get install -y \
  sendmail \
  && rm -rf /var/lib/apt/lists/*

RUN echo "update-notifier=false" >> ~/.npmrc

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

USER node

WORKDIR /srv/app
VOLUME /srv/app

COPY --from=build --chown=node:node /srv/build/node_modules /srv/app/node_modules

ENV PATH="/srv/app/node_modules/.bin:$PATH"

COPY --chown=node:node ./docker/local/backend/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8055

CMD ["/start.sh"]
