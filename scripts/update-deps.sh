#!/bin/sh
bundle install
npm install

# npm install for the pattern-library
npm run setup-patterns
