FROM ubuntu:bionic

RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

RUN apt-get install -y libnss3 \
                       libxss1 \
                       libasound2 \
                       graphicsmagick \
                       ghostscript \
                       cron

COPY powercut-cron /etc/cron.d/powercut-cron
RUN chmod 0644 /etc/cron.d/powercut-cron
RUN crontab /etc/cron.d/powercut-cron

RUN npx playwright install-deps
RUN npx playwright install chromium
WORKDIR /usr/src/app


COPY package*.json /usr/src/app/

RUN npm install

COPY production/ /usr/src/app

CMD printenv | grep -v "no_proxy" >> /etc/environment ; cron -f





