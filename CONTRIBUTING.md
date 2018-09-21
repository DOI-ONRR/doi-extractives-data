## Welcome

We’re glad you’re thinking about contributing to this open source project! If you’re unsure about anything, ask us — or submit the issue or pull request anyway. The worst that can happen is that we’ll politely ask you to change something.

We welcome all friendly contributions, and we welcome your ideas about how to make our online presence more user friendly, accessible, and elegant.

* [Running and testing the site with Docker](#running-and-testing-the-site-with-Docker)
    - [Troubleshooting](#troubleshooting)
    - [Data and database](#data-and-database)
    - [Deployment](#deployment)
    - [Styleguide and pattern library](#styleguide-and-pattern-library)
    - [Tests](#tests)
    - [Code style](#code-style)
* [Process and workflow](#process-and-workflow)
  * [Issues](#issues)
  * [Pull requests](#pull-requests)
* [Public domain](#public-domain)

## Running and testing the site

### Using Docker


#### Setting up Docker Toolbox for Windows 7 - (Windows Only instructions)

##### Prerequisites
1. Have Docker Toolbox installed, which includes Oracle VM
1. You will need admin rights to setup the docker environment. A registry key can disable the admin rights check. Ask IT to disable.
1. Open Oracle Virtualbox and verify you only have 1 Host Only Adapter
    1. In the Oracle Virtualbox, select Global Tools
    2. Select Host Network Manager
    3. You should be in the Properties view.
    4. Verify only 1 or 0 adapters are listed.
    5. if more than 1 disable extra adapters. You should only have 1 enabled to avoid potential errors later.
1. Also install 'bash' by installing git for Windows.
1. Clone the repo to a directory in C:\Users. This is automatically shared by Docker.

##### Windows 7 specific steps
1. Launch Docker Quick Start which should be a shortcut on the Desktop
2. Once launched switch to your source code directory. "doi-extractives-data"
3. Although Quick start creates a VM we are going to create our own.
    * On windows the initial machine usually results in errors. Such as a certificate errors.
    * Also the machine is not very powerful.
    * Sometimes the docker terminal crashes. Just restart it if it does.
4. Make sure you are in your source code directory and run the following commands

```
docker-machine rm default
docker-machine ls   # lists all machines, verify default is not listed
docker-machine create --driver virtualbox --virtualbox-cpu-count 2 --virtualbox-memory 4046  default
eval "$(docker-machine env default)"
docker-machine ls   # Note your IP address
```
5. Your docker-machine should now be ready to setup the development environment

 * If you get a certificate error run this command from your source code directory

```
docker-machine regenerate-certs default
```

##### Docker Development Environment Setup
Instead of installing dependencies yourself and running different commands
in separate terminal sessions, you should use Docker, which
only requires installing [Docker Community Edition][docker]
and running one command in one terminal window.

Start by installing [Docker Community Edition][docker].

If you are on Windows, you'll also need `bash`, which you can probably
get most easily by installing [git for Windows][].

To get up and running with Docker, run the following in the project directory.

```
docker-compose build
docker-compose run --rm jekyll bash scripts/update-deps.sh
docker-compose up
```

Then visit http://localhost:4000/ in your browser. On Windows machines the URL is generally http://192.168.99.100:4000/.

Whenever you make changes to any files, the proper static assets
will be rebuilt, and your changes will show up on the site.

##### Errors when starting up

We sometimes observe a behavior where `docker-compose up` will result in an error the first time it is run, but will work the second time.

<details>
  <summary>The error usually looks like this (expand to see): </summary>

```
jekyll_1      | module.js:540
jekyll_1      |     throw err;
jekyll_1      |     ^
jekyll_1      |
jekyll_1      | Error: Cannot find module 'to-regex'
jekyll_1      |     at Function.Module._resolveFilename (module.js:538:15)
jekyll_1      |     at Function.Module._load (module.js:468:25)
jekyll_1      |     at Module.require (module.js:587:17)
jekyll_1      |     at require (internal/module.js:11:18)
jekyll_1      |     at Object.<anonymous> (/doi/node_modules/chokidar/node_modules/braces/index.js:7:15)
jekyll_1      |     at Module._compile (module.js:643:30)
jekyll_1      |     at Object.Module._extensions..js (module.js:654:10)
jekyll_1      |     at Module.load (module.js:556:32)
jekyll_1      |     at tryModuleLoad (module.js:499:12)
jekyll_1      |     at Function.Module._load (module.js:491:3)
doiextractivesdata_jekyll_1 exited with code 1
```

</details>

If you run into this error, then you should:

1. Use `Control-C` to bring down the docker containers
1. Make sure everything is turned off with `docker-compose down`
1. Use `docker-compose up` again

#### What Docker is doing

Docker is used for local development but not for production. Docker will run containers for `jekyll` and `webpack` and will start a small ExpressJS web server to make all of the URLs resolve as they would on production.

We have a difference in the process between local/development builds and production builds because the latter occurs on Federalist in a predictable order and does not need to be set up to watch files and rebuild on changes. However, we do want a development set up that does watch for changes and runs the relevant build process.

#### Running commands via Docker

If you want to run commands like `npm`, `make`, or `sqlite3`, the easiest
way to do this is by running a shell inside the main container:

```
docker-compose run jekyll bash
```

Once you do this, you'll be in an interactive shell within the main
container, and can run any commands you need.

#### Updating the Docker container

Whenever you update the repository using e.g. `git pull`, run
`docker-compose build jekyll` again to rebuild the Docker container and
fetch any new dependencies. Building a single `-compose.yml` service at first caches all of the build steps and makes it faster to build the remaining services.

#### Uninstalling or resetting the Docker container

If you decide that Docker isn't for you, or if your Docker setup somehow
becomes broken and you're not sure how to fix it, run
`docker-compose down -v`.

### Data and database

The [data catalog](https://github.com/onrr/doi-extractives-data/wiki/Data-Catalog) explains what most of the data is and where it came from. See the [data](data/) directory for more detailed info and instructions on updating the data.

Data for the site is populated via data files in the `_data` directory. These are primarily `yml` files that are generated from commands in the [`Makefile`](Makefile).

To create the database locally, make sure that you have `sqlite` and run `make db`.

If you would like to query the local database instance:

1. Open a new terminal shell and run `sqlite3`
2. Run `.open data.db`
3. You can now run sqlite queries from the local instance.
4. Run `.tables` to see the available tables you can query.

To update site data, run `make site-data`.


### Gatsby gotchas

[Gatsby](https://www.gatsbyjs.org/) is a JavaScript framework for building
static websites. We're currently migrating from Jekyll to Gatsby. The migration
is over a long time span, and there are some gotchas about making Jekyll and
Gatsby work together.

Our approach is to replace Jekyll pages with Gatsby pages in batches. Since
Jekyll is happy to take static pages and assets and copy them over to the
`_site` build directory, Gatsby can output compiled pages and then we just drop
them in the right location in the Jekyll source. E.g. for the about page, after
Gatsby builds it, we copy the about.html to the Jekyll source directory and then
the Jekyll build will pick it up.

Gatsby expects to own the entire website, so ...


#### Path prefix

Gatsby supports a [path prefix](https://www.gatsbyjs.org/docs/path-prefix/)
which we use for the Federalist build previews. Gatsby expects to be the entire
site.


### Deployment

This site is deployed on [Federalist](https://federalist.fr.cloud.gov/) whenever a commit it pushed to GitHub. Changes are deployed automatically to the production site when commits are pushed to the `master` branch.

If deploying the site to a production environment, make sure to minify the JS files:

1. Set the $NODE_ENV to `prod`: `export NODE_ENV=prod`
1. Package js files with webpack: `webpack --watch`
1. Re-run the web server: `bundle exec jekyll serve`


### Styleguide and Pattern Library

_We are currently moving our [Fractal](https://fractal.build/) Styleguide to
a [Gatsby-based](https://www.gatsbyjs.org/) Pattern Library._

Any new components should be implemented in the Pattern Library. The Fractal
Styleguide should be considered read-only and removed once content is migrated.


#### Fractal styleguide

Setup the docker environment with the steps from above. Then run the styleguide
container to start the styleguide server.

```sh
docker-compose up styleguide
```

Open your web browser to [localhost:3000](http://localhost:3000).


#### Gatsby pattern library

Setup the docker environment with the steps from above. Then run the styleguide
container to start the styleguide server.

```sh
docker-compose up patterns
```

Open your web browser to [localhost:8000](http://localhost:8000).


##### Native development

The pattern library lives in `/pattern-library`, but the project-level
`package.json` contains npm scripts to run the pattern library.

Install the dependencies and do an initial build.

```sh
npm run release-patterns
```

Now you can run the development server.

```sh
npm run patterns
```

And open your web browser to [localhost:8000](http://localhost:8000).


### Tests

#### JavaScript

The JavaScript tests currently cover all datasets. You can run them with [Node]:

```sh
npm install --dev
npm test
```

#### Jekyll filters

We have created a set of [custom Jekyll filters](https://jekyllrb.com/docs/plugins/#liquid-filters) that can be used for templating. The filters in _plugins/eiti_\*.rb are tested with [rubydoctest](https://github.com/tslocke/rubydoctest).

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
install with `gem install scss_lint` if you haven't already run `bundle install` to get Jekyll and its dependencies. To lint the SCSS files, run:

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

#### Open-source contributions

We welcome contributions from the open source community! If you would like to contribute, please direct your pull requests to the [`contribution`](https://github.com/onrr/doi-extractives-data/tree/contribution) branch (instead of the default `dev` branch). This enables us to create a preview link for your contribution.

#### Creating a pull request

* Create pull requests for all commits, even typo fixes. This helps us track work and increase visibility into current work going on.
* When you open a pull request, complete the template to make sure reviewers have all the information they need.

- Assign reviewers to notify specific team members who should review a pull request.
- While working, submit `[WIP]` [pull requests](CONTRIBUTING.md#pull-requests) liberally.

#### Reviewing a pull request

- Anyone may informally review a pull request and make comments or suggestions.
- For more about how to responsibly review pull requests, see [How to review a PR](https://github.com/onrr/doi-extractives-data/wiki/How-to-review-a-pull-request)

#### Merging a pull request

* Don’t merge your own pull request. Ask a colleague to review your code and merge. This helps ensure that at least two people have verified the quality of the code and content.

## Public domain

By submitting a pull request, you agree to comply with the policies on our [LICENSE](LICENSE.md) page:

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

[docker]: https://www.docker.com/community-edition
[git for windows]: https://git-for-windows.github.io/
