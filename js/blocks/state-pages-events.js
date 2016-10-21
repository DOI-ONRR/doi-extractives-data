(function(exports) {
  'use strict';

  var eitiDataMaps = d3.selectAll('eiti-data-map');

  var cropMaps = function () {
      eitiDataMaps.each(function () {
        this.cropMap();
      });
    };

  d3.select(window).on('resize.crop', cropMaps);
})(window);

