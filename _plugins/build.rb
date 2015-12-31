`npm install`

production = ENV['BRANCH'] == 'master' or ENV['BRANCH'] == 'staging'

ENV['NODE_ENV'] = if production then 'prod' else 'dev' end

`npm webpack`
