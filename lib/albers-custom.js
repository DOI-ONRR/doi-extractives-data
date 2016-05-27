/* jshint node: true */
/* jshint -W008 */
/* jshint -W030 */
/* jshint -W101 */
(function(exports) {

  var d3 = exports.d3 || require('d3');

  var E = 1e-6;

  // A composite projection for the United States, configured by default for
  // 960×500. Also works quite well at 960×600 with scale 1285. The set of
  // standard parallels for each region comes from USGS, which is published here:
  // http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
  var albersCustom = function() {
    var lower48 = d3.geo.albers();

    // EPSG:3338
    var alaska = d3.geo.conicEqualArea()
        .rotate([154, 0])
        .center([-2, 58.5])
        .parallels([55, 65]);

    // ESRI:102007
    var hawaii = d3.geo.conicEqualArea()
        .rotate([157, 0])
        .center([-3, 19.9])
        .parallels([8, 18]);

    var point,
        pointStream = {point: function(x, y) { point = [x, y]; }},
        lower48Point,
        alaskaPoint,
        hawaiiPoint;

    // these are in unscaled screen coordinates
    var alaskaBounds = [
          [-.450, .104],
          [-.200, .274]
        ],
        alaskaScale = .35,
        alaskaTranslate = [-.295, .210],
        hawaiiBounds = [
          [-.179, .190],
          [-.080, .260]
        ],
        hawaiiTranslate = [-.170, .238],
        lowerBounds = [
          [-.455, -.238],
          [.455, .260]
        ];

    function albersUsa(coordinates) {
      var x = coordinates[0], y = coordinates[1];
      point = null;
      (lower48Point(x, y), point)
          || (alaskaPoint(x, y), point)
          || hawaiiPoint(x, y);
      return point;
    }

    function inBounds(x, y, bbox) {
      return y >= bbox[0][1] && y < bbox[1][1] && x >= bbox[0][0] && x < bbox[1][0];
    }

    albersUsa.invert = function(coordinates) {
      var k = lower48.scale(),
          t = lower48.translate(),
          x = (coordinates[0] - t[0]) / k,
          y = (coordinates[1] - t[1]) / k;
      return (inBounds(x, y, alaskaBounds) ? alaska
          : inBounds(x, y, hawaiiBounds) ? hawaii
          : lower48).invert(coordinates);
    };

    // A naïve multi-projection stream.
    // The projections must have mutually exclusive clip regions on the sphere,
    // as this will avoid emitting interleaving lines and polygons.
    albersUsa.stream = function(stream) {
      var lower48Stream = lower48.stream(stream),
          alaskaStream = alaska.stream(stream),
          hawaiiStream = hawaii.stream(stream);
      return {
        point: function(x, y) {
          lower48Stream.point(x, y);
          alaskaStream.point(x, y);
          hawaiiStream.point(x, y);
        },
        sphere: function() {
          lower48Stream.sphere();
          alaskaStream.sphere();
          hawaiiStream.sphere();
        },
        lineStart: function() {
          lower48Stream.lineStart();
          alaskaStream.lineStart();
          hawaiiStream.lineStart();
        },
        lineEnd: function() {
          lower48Stream.lineEnd();
          alaskaStream.lineEnd();
          hawaiiStream.lineEnd();
        },
        polygonStart: function() {
          lower48Stream.polygonStart();
          alaskaStream.polygonStart();
          hawaiiStream.polygonStart();
        },
        polygonEnd: function() {
          lower48Stream.polygonEnd();
          alaskaStream.polygonEnd();
          hawaiiStream.polygonEnd();
        }
      };
    };

    albersUsa.precision = function(_) {
      if (!arguments.length) {
        return lower48.precision();
      }
      lower48.precision(_);
      alaska.precision(_);
      hawaii.precision(_);
      return albersUsa;
    };

    albersUsa.scale = function(_) {
      if (!arguments.length) {
        return lower48.scale();
      }
      lower48.scale(_);
      alaska.scale(_ * alaskaScale);
      hawaii.scale(_);
      return albersUsa.translate(lower48.translate());
    };

    albersUsa.translate = function(_) {
      if (!arguments.length) {
        return lower48.translate();
      }
      var k = lower48.scale(), x = +_[0], y = +_[1];

      var p0 = lowerBounds[0],
          p1 = lowerBounds[1];
      lower48Point = lower48
        .translate(_)
        .clipExtent([
          [x + p0[0] * k, y + p0[1] * k],
          [x + p1[0] * k, y + p1[1] * k]
        ])
        .stream(pointStream).point;

      alaskaPoint = alaska
        .translate([x + alaskaTranslate[0] * k, y + alaskaTranslate[1] * k])
        .clipExtent([
          [x + alaskaBounds[0][0] * k + E, y + alaskaBounds[0][1] * k + E],
          [x + alaskaBounds[1][0] * k - E, y + alaskaBounds[1][1] * k - E]
        ])
        .stream(pointStream).point;

      hawaiiPoint = hawaii
        .translate([x + hawaiiTranslate[0] * k, y + hawaiiTranslate[1] * k])
        .clipExtent([
          [x + hawaiiBounds[0][0] * k + E, y + hawaiiBounds[0][1] * k + E],
          [x + hawaiiBounds[1][0] * k - E, y + hawaiiBounds[1][1] * k - E]
        ])
        .stream(pointStream).point;

      return albersUsa;
    };

    var size = [960, 670];
    albersUsa.size = function() {
      if (arguments.length) {
        throw new Error('The size of this projection is fixed.');
      }
      return size.slice();
    };

    return albersUsa
      .scale(1070)
      .translate([500, 300]);
  };

  module.exports = albersCustom;

})(this);
