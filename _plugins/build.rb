`npm install`

production = ENV['BRANCH'] == 'master' or ENV['BRANCH'] == 'staging' or ENV['BRANCH'] == 'js-optimization'

ENV['NODE_ENV'] = if production then 'prod' else 'dev' end

`npm webpack`
