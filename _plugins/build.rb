# npm install

production = ENV["BRANCH"] === 'master' or ENV["BRANCH"] === 'staging'

if production
	ENV["NODE_ENV"] = 'prod'
else
	ENV["NODE_ENV"] = 'dev'
end

# npm run webpack
`npm run webpack`
