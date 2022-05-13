FROM node:16-alpine as build

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/build

COPY ./backend/package.json /srv/build/

RUN yarn install && yarn cache clean

ENV PATH="/srv/build/node_modules/.bin:$PATH"

FROM node:16-alpine as local

WORKDIR /srv/app

VOLUME /srv/app

COPY --from=build /srv/build/node_modules /srv/node_modules

COPY ./docker/local/backend/start.sh /start.sh
RUN chmod +x /start.sh

ENV PATH="/srv/node_modules/.bin:$PATH"

EXPOSE 1337

CMD ["/start.sh"]
