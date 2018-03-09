#! /bin/bash

set -e

docker-compose build
docker-compose run --rm jekyll bash update.sh
