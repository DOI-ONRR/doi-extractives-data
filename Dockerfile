FROM ruby:2.2.3

# https://nodejs.org/en/download/package-manager/

RUN apt-get update && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -y nodejs sqlite3

WORKDIR /

RUN npm install -g yarn

ENV PATH "$PATH:./node_modules/.bin"
