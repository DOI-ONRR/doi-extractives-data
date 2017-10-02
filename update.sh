#! /bin/bash

set -e

if ! which bundler > /dev/null; then
  gem install bundler
fi

: ${NPM_CMD:=npm}

${NPM_CMD} install
bundle install

cd styleguide-template
${NPM_CMD} install
