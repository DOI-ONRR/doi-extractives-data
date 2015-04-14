# geographic data inputs

Files:
* `offshore/*.json` generated in the [eiti-maps](https://github.com/18F/eiti-maps/tree/master/tilemill/offshore/data) repo
* `states.csv` imported from [EPA](http://www.epa.gov/envirofw/html/codes/state.html)
* `us-10m.json` US counties and states in
  [TopoJSON](https://github.com/mbostock/topojson/wiki) format, generated from [us-atlas](https://github.com/mbostock/us-atlas):

    ```sh
    git clone https://github.com/mbostock/us-atlas.git
    cd us-atlas
    make topo/us-10m.json
    ```
