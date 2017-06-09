## Welcome
We’re glad you’re thinking about contributing to an 18F open source project! If you’re unsure about anything, ask us — or submit the issue or pull request anyway. The worst that can happen is that we’ll politely ask you to change something.

We love all friendly contributions, and we welcome your ideas about how to make USEITI’s online presence more user friendly, accessible, and elegant.

To ensure a welcoming environment for our projects, our staff follows the [18F Code of Conduct](https://github.com/18F/code-of-conduct/blob/master/code-of-conduct.md); contributors should do the same. Please also check out the [18F Open Source Policy]( https://github.com/18f/open-source-policy).

* [Running and testing the site](#running-and-testing-the-site)
    - [Data and database](#data-and-database)
    - [Deployment](#deployment)
    - [Styleguide](#styleguide)
    - [Tests](#tests)
    - [Code style](#code-style)
* [Process and workflow](#process-and-workflow)
    - [Issues](#issues)
    - [Pull requests](#pull-requests)
* [Public domain](#public-domain)

## Running and testing the site

This site is made with [Jekyll]. To run it locally, clone this repository then:

1. Get [Jekyll] and the necessary dependencies: `bundle install`
1. Install all node dependencies: `npm install`
1. Package js files with webpack: `webpack --watch`
1. Run the web server: `./serve`. **Note:** If you are working on a core layout page, you can speed up this process by running `./serve-fast`. This runs an incomplete version of the site that might be ideal for certain tasks.
1. Visit the local site at [http://localhost:4000/site/](http://localhost:4000/site/)

## Troubleshooting

Sometimes the site doesn't build properly. Likely this is an issue with the built version of the site (`_site`). To attempt to fix this, consider running one of the following commands:
- `./re-serve`: removes `_site` and runs `./serve`
- `./re-serve-fast`: removes `_site` and runs `./serve-fast`

### Data and database
The [data catalog](https://github.com/18F/doi-extractives-data/wiki/Data-Catalog) explains what most of the data is and where it came from. See the [data](data/) directory for more detailed info and instructions on updating the data.

Data for the site is populated via data files in the `_data` directory. These are primarily `yml` files that are generated from commands in the [`Makefile`](Makefile).

To create the database locally, make sure that you have `sqlite` and run `make db`.

If you would like to query the local database instance:

1. Open a new terminal shell and run `sqlite3`
2. Run `.open data.db`
3. You can now run sqlite queries from the local instance.
4. Run `.tables` to see the available tables you can query.

To update site data, run `make site-data`.

### Deployment
This site is deployed on [Federalist](https://federalist.fr.cloud.gov/) whenever a commit it pushed to GitHub. Changes are deployed automatically to the production site when commits are pushed to the `master` branch.

If deploying the site to a production environment, make sure to minify the JS files:

1. Set the $NODE_ENV to `prod`: `export NODE_ENV=prod`
1. Package js files with webpack: `webpack --watch`
1. Re-run the web server: `bundle exec jekyll serve`

### Styleguide
```sh
npm install --dev
npm run init-styleguide
cd styleguide-template && npm install
cd ..
npm run watch-styleguide
```

### Tests

#### JavaScript

The JavaScript tests currently cover all datasets. You can run them with [Node]:

```sh
npm install --dev
npm test
```

#### Jekyll filters
We have created a set of [custom Jekyll filters](https://jekyllrb.com/docs/plugins/#liquid-filters) that can be used for templating. The filters in _plugins/eiti_*.rb are tested with [rubydoctest](https://github.com/tslocke/rubydoctest).

##### Testing filters

You can run the unit tests as follows:

```sh
npm test-ruby
```

##### Writing filters

As the following example demonstrates, test cases are written in comment blocks immediately preceding a testable function. The test description is on the first line, with an empty comment block below it. Use `>>` syntax to invoke a test case, and follow it with hash rocket syntax, `=>`, to define the expected outcome of the invocation.

Inline unit test for `to_i`:

```ruby
# attempt to look up a term in a hash, and return the value if that
# key exists; otherwise, return the key
#
# >> EITI::Data.lookup('hi', {'hi' => 'hello'})
# => 'hello'
# >> EITI::Data.lookup('yo', {'hi' => 'hello'})
# => 'yo'
def lookup(term, hash)
  hash.key?(term) ? hash[term] : term
end
```

#### Continuous integration
We are using [CircleCI](https://circleci.com/) to test our code as we push it to Github.

As specified in our [circle.yml](circle.yml) configuration file, we are running our JavaScript and Jekyll filter tests to ensure that functions are working as expected.

### Code style
We use [Hound CI](https://houndci.com/) to enforce SCSS and JavaScript
formatting conventions on new commits. You can run both of the linters with:

```sh
npm run lint
```

This runs both of the linters below in series.

##### JavaScript linting
Hound uses [jshint](http://jshint.com/), which you can install as part of the
npm package's `devDependencies` with:

```sh
npm install --dev
```

Or you can install it globally with `npm i -g jshint`. Then, to lint the
JavaScript, run:

```sh
npm run lint-js
```

##### SCSS linting
Hound uses [scss-lint](https://github.com/brigade/scss-lint), which you can
install with `gem install scss_lint` if you haven't already run `bundle
install` to get Jekyll and its dependencies. To lint the SCSS files, run:

```sh
bundle exec scss-lint -c .scss-lint.yml
```

or simply:

```sh
npm run lint-scss
```


## Process and workflow

### Issues
When you open an issue, fill out all relevant fields in the issue template and include links to any prior related pull requests or issues.

### Pull requests
* Create pull requests for all commits, even typo fixes. This helps us track work and increase visibility into current work going on.
* When you open a pull request, complete the template to make sure reviewers have all the information they need.
- Use `cc @username` to notify a specific team member to review a pull request.
- While working, submit `[WIP]` [pull requests](CONTRIBUTING.md#pull-requests) liberally.
- Anyone may informally review a pull request and make comments or suggestions.
* Don’t merge your own pull request. Ask a colleague to review your code and merge. This helps ensure that at least two people have verified the quality of the code and/or content.

## Public domain
By submitting a pull request, you agree to comply with the policies on our [LICENSE](LICENSE.md) page:

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
