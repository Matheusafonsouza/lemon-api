FROM node:18-alpine

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
ADD package.json package-lock.json /app/
ADD . /app

CMD ["npm", "run", "dev"]
