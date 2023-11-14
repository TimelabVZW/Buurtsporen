FROM node:21-alpine3.18
LABEL authors="Thomas Weyn"

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

CMD ["yarn", "start:prod"]

#ENTRYPOINT ["top", "-b"]
