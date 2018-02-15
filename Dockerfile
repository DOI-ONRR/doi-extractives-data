# use an image with ruby and node installed
FROM circleci/ruby:2.2-node

# switch back to root, circle sets us to a different user
USER root

WORKDIR /doi

RUN apt-get update && \
    apt-get install -y sqlite3

ENV PATH "$PATH:./node_modules/.bin"
