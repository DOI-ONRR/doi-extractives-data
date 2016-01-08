Jekyll::Hooks.register :site, :pre_render do |site|
    # TODO: remove 'js-optimization' before merge
    production_branches = ['master', 'staging', 'js-optimization']
    branch = ENV['BRANCH']

    if production_branches.include?(branch)
        puts '[build.rb] webpacking for production'
        `npm install && npm run webpack`
    else
        puts '[build.rb] not webpacking'
    end
end
