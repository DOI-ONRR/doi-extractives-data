#!/bin/bash
# 
# Sets up the Federalist build for Jekyll 
# Federalist already does this, but not until right before running jekyll. we
# need to run jekyll as part of the npm setup because gatsby has to be built
# after the jekyll build

project_dir=$(dirname $(dirname $0))

# Setup RVM for ruby
source /usr/local/rvm/scripts/rvm

# Set these after rvm to avoid them applying to the rvm function
set -o errexit
set -o pipefail
set -o nounset
set -x

# Install the correct version of ruby
read ruby_version < "$project_dir/.ruby-version"
rvm install "$ruby_version"

ruby -v

# Install ruby dependencies
gem install bundler
bundle install

# Append Federalist configuration to Jekyll config
cat <EOF >> "$project_dir/_config.yml"
baseurl: "$BASEURL"
branch: "$BRANCH"
EOF

bundle exec jekyll build
