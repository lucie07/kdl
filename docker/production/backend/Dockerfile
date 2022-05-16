FROM node:16-slim as build

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/build

COPY ./backend/package.json ./backend/package-lock.json /srv/build/

RUN npm ci && npm cache clean --force

COPY ./backend /srv/build/

FROM node:16-slim as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

RUN apt-get update && apt-get install -y \
  libsqlite3-mod-spatialite \
  sendmail \
  tini \
  && rm -rf /var/lib/apt/lists/*

RUN addgroup --system kdl && \
  adduser --system --ingroup kdl kdl

USER kdl

WORKDIR /srv/app

COPY --from=build --chown=kdl:kdl /srv/build/node_modules /srv/app/node_modules

ENV PATH="/srv/app/node_modules/.bin:$PATH"

COPY ./docker/production/backend/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8055

ENTRYPOINT ["tini", "--"]

CMD ["/start.sh"]
