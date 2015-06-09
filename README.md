# US EITI v2
This is the development branch of the v2 [US EITI](https://useiti.doi.gov) site.

## Getting Started
1. Get [Node.js](https://nodejs.org).
2. Install the dependencies with `npm install`
3. Run the web server with `npm start`.

# Data!
This branch was originally created for data collection and transformation.
These tools also use [Node](https://nodejs.org/), and the dependencies are
managed with [npm](https://www.npmjs.com/). To rebuild the files, run:

```
make -B
```

Check out the [Makefile](Makefile) and the [bin directory](bin/) if you want to
see how the sausage is made.

## Tests
To run the tests:

```sh
npm install --dev
npm test
```

See [this issue](https://github.com/18F/doi-extractives-data/issues/493) for
some background on what we're aiming to do here. Progress on importing all of
the data we need is tracked in
[this issue](https://github.com/18F/doi-extractives-data/issues/496).
