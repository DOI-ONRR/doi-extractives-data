#! /bin/bash

set -e

if [ ! -f /usr/local/bundle/bin/bundler ]; then
  gem install bundler
fi

yarn
bundle install

cd styleguide-template
yarn
