FROM node:16-slim as build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/build

COPY ./cms/package.json ./cms/package-lock.json /srv/build/

RUN npm ci && npm cache clean --force

COPY ./cms /srv/build/

FROM node:16-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apt-get update && apt-get install -y \
  sendmail \
  tini \
  && rm -rf /var/lib/apt/lists/*

USER node

RUN echo "update-notifier=false" >> ~/.npmrc

WORKDIR /srv/app

COPY --from=build --chown=node:node /srv/build /srv/app

ENV PATH="/srv/app/node_modules/.bin:$PATH"

COPY --chown=node:node ./docker/production/cms/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8055

ENTRYPOINT ["tini", "--"]

CMD ["/start.sh"]
