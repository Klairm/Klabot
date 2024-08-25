# slim is more small
FROM node:19.7.0-bullseye-slim
RUN mkdir /klabot
WORKDIR /klabot

# most of these are requirements to install sodium
RUN apt-get update
RUN apt-get install dumb-init libsodium-dev libtool-bin python3 g++ make ffmpeg -y

# npm
ADD package.json package.json
RUN npm install

# start with dumb-init for easy ctrl-c
ADD . .
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index"]
