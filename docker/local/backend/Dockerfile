ARG NODE_ENV=development

FROM node:lts-slim as build

ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/build

COPY ./backend/package.json /srv/build/

RUN npm install && npm cache clean --force

FROM node:lts-slim as local

ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/app

VOLUME /srv/app

COPY --from=build /srv/build/node_modules /srv/node_modules

COPY ./docker/local/backend/start.sh /start.sh
RUN chmod +x /start.sh

ENV PATH="/srv/node_modules/.bin:$PATH"

EXPOSE 8055

CMD ["/start.sh"]
