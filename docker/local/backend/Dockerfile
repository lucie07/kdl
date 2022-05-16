FROM node:lts-slim as build

ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/build

COPY ./backend/package.json /srv/build/

RUN npm install && npm cache clean --force

FROM node:lts-slim as local
RUN apt-get update && apt-get install -y \
  libsqlite3-mod-spatialite \
  sendmail \
  && rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/app

VOLUME /srv/app

COPY --from=build /srv/build/node_modules /srv/app/node_modules

ENV PATH="/srv/app/node_modules/.bin:$PATH"

COPY ./docker/local/backend/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8055

CMD ["/start.sh"]
