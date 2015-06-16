# EITI Data
This directory contains all of the input data, scripts for parsing and
transforming them, and the resulting "output" files. These tools also use
[Node](https://nodejs.org/), and the dependencies are managed with
[npm](https://www.npmjs.com/) in the parent directory's
[package.json](../package.json). To rebuild the files, run:

```sh
make -B
```

Check out the [Makefile](Makefile) and the [bin directory](bin/) if you want to
see how the sausage is made.

## Tests
To run the tests, make sure the dev dependencies are installed from the parent
directory:

```sh
cd ..
npm install --dev
```

Then, in this directory, run:

```sh
npm test
```

See [this issue](https://github.com/18F/doi-extractives-data/issues/493) for
some background on what we're aiming to do here. Progress on importing all of
the data we need is tracked in
[this issue](https://github.com/18F/doi-extractives-data/issues/496).
