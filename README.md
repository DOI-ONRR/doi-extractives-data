# EITI Data Collection
This branch is for data collection and transformation. Everything here uses
[Node](https://nodejs.org/), and the dependencies are managed with
[npm](https://www.npmjs.com/). To get started, run:

```sh
npm install
```

This will install all the data collection and transformation dependencies. To
rebuild the files, run:

```
make -B
```

Take a look at the [Makefile](Makefile) and the [bin directory](bin/) if you
want to see how the sausage is made.

## Tests
If you wish to run the [tests](test/), run:

```sh
npm install --dev
npm test
```

See [this issue](https://github.com/18F/doi-extractives-data/issues/493) for
some background on what we're aiming to do here. Progress on importing all of
the data we need is tracked in
[this issue](https://github.com/18F/doi-extractives-data/issues/496).
