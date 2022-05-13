FROM node:16-slim as build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/build

COPY ./backend/package.json ./backend/yarn.lock /srv/build/

RUN yarn install && yarn cache clean

ENV PATH="/srv/build/node_modules/.bin:$PATH"

COPY ./backend /srv/build/

RUN yarn build

FROM node:16-slim as production

RUN apt-get update && apt-get install -y \
  tini \
  && rm -rf /var/lib/apt/lists/*

RUN addgroup --system kdl && \
  adduser --system --ingroup kdl kdl

USER kdl

WORKDIR /srv/app

COPY --from=build --chown=kdl:kdl /srv/build /srv/app

COPY ./docker/local/backend/start.sh /start.sh
RUN chmod +x /start.sh

ENV PATH="/srv/app/node_modules/.bin:$PATH"

EXPOSE 1337

ENTRYPOINT ["tini", "--"]

CMD ["node", "directus", "start"]
