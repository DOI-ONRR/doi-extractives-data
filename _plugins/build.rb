# TODO: remove "federalist-js" before merge
production_branches = ["master", "staging", "federalist-js"]
branch = ENV["BRANCH"]

if production_branches.include?(branch)
  puts "[build.rb] webpacking for production"
  ENV["NODE_ENV"] = "production"
  `(npm install; npm run webpack) &> build.log`
end
