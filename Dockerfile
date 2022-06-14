FROM jrottenberg/ffmpeg:4.1-ubuntu
FROM ubuntu:bionic

RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# playwright chromium deps
RUN apt-get install -y libnss3 \
                       libxss1 \
                       libasound2 \
                       graphicsmagick \
                       ghostscript

RUN npx playwright install-deps
RUN npx playwright install chromium
WORKDIR /usr/src/app


COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

CMD [ "node", "server" ]