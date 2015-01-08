

var barChart = dc.barChart("#sector-revenue-bar-chart"),
	pieChart = dc.pieChart("#sector-revenue-pie-chart");

d3.csv("static/data/2003-2013-royalty-data.csv",function(resource_data){
	

	var ndx = crossfilter(resource_data),
		parseDate = d3.time.format("%Y").parse;

	resource_data.forEach(function(d){
		d["Royalty"]		= clean_monetary_float(d["Royalty"]);
	});

	var yearDimension = ndx.dimension(function(d){
		return d["Year"];
	});
	var typeDimension = ndx.dimension(function(d){
		return d["Commodity"];
	})
	var totalByYear = yearDimension.group().reduceSum(function(d){
		return d["Royalty"];
	});

	var totalByType = typeDimension.group().reduceSum(function(d){
		return d["Royalty"];
	});
	var all=ndx.groupAll().reduceSum(function(d){return d["Royalty"];});


	var minDate = yearDimension.bottom(1)[0]['Year'];
	var maxDate = yearDimension.top(1)[0]["Year"];

	var barTip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "total royalties<br/> <span style='color:#d54740'>$"+parseFloat(d.data.value).formatMoney(2,'.',',')+"</span>";
	  });
	var pieTip = d3.tip()
		.attr('class','d3-tip')
		.offset([-10,0])
		.html(function (d) {
			if (!d.name) 
				return d.data.key + " royalties<br/><span style='color:#d54740'> $" + parseFloat(d.data.value).formatMoney(2,'.',',') + "</span>";
			return d.name + " royalties<br/><span style='color:#d54740'> $" + parseFloat(d.data).formatMoney(2,'.',',') + "</span>";
		});


	
	barChart
		.width(400).height(130)
		.group(totalByYear)
		.dimension(yearDimension)
		.centerBar(false)
		.gap(15)
		.colors(["#9B9B9B"])		
		.elasticY(true)
		.brushOn(false)
		.xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal().domain(["2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013"]))
		.margins({top: 10, right: -2, bottom: 20, left:-2})
		.yAxis().tickFormat(function(v){return "";});
	barChart.renderlet(function(d){
			d3.selectAll('#sector-revenue-bar-chart .bar')
			  .attr('aria-label',function(d){
			  	var barChartFilters = barChart.filters();
			  	var filters = barChartFilters.length != 0 ? barChart.filters() : "2003 to 2013";
			  	var filterInOut = barChartFilters.indexOf(d.x) != -1 ? "Select to remove " + d.x + " from the filter." : "Select to add " + d.x + " to the filter.";
			  	return  filterInOut
			  			+ " Revenue = $"
			  			+ d.y.formatMoney(2,'.',',') 
			  			+ " Total Revenue = "
			  			+ text_money(all.value())
			  			+ " Current selected years = "
			  			+ filters;
			  })
		});

	pieChart.width(300)
		.colors(d3.scale.ordinal().range(["#d54740","#3397c2","#865daa","#9fa731","#5a5a5a"]))
		.height(300)
		.transitionDuration(750)
		.radius(130)
		.dimension(typeDimension)
		.group(totalByType)
		.legend(dc.legend().x(300).y(30).itemHeight(13).gap(10))
		.renderLabel(false)
		.renderlet(function(d){
			d3.select("#pie-chart-center-text h1").html('Total Royalties<br /> <span>$' + text_money(all.value()) + '</span>');
			sectorsPie508(d);
		});

	
	var addToolTips = function(){
		d3.selectAll(".bar").call(barTip);
		d3.selectAll(".bar").on('mouseover', barTip.show)
			.on('mouseout', barTip.hide)
			.on('focus',barTip.show)
			.on('blur',barTip.hide);
		d3.selectAll(".pie-slice").call(pieTip);
		d3.selectAll(".pie-slice").on('mouseover', pieTip.show).on('mouseout', pieTip.hide);	
	};
	var lastSelectedPieSection='';
	var sectorsPie508 = function(d){
		d3.selectAll(".dc-legend-item text").call(pieTip);
		d3.selectAll(".dc-legend-item text")
			.on('focus',pieTip.show)
			.on('blur',pieTip.hide)
			.attr('aria-label',function(d){
				var pieChartFilters = pieChart.filters(),
					filters = pieChartFilters.length != 0 ? pieChartFilters : 'coal, gas, geothermal, oil, other',
					filterInOut = pieChartFilters.indexOf(d.name) != -1 ? "Select to remove " + d.name + " from the filter." : "Select to add " + d.name + " to the filter."; 
				return  filterInOut
			  			+ " Revenue = $"
			  			+ d.data.formatMoney(2,'.',',') 
			  			+ " Total Revenue = "
			  			+ text_money(all.value())
			  			+ " Current selected commodities = "
			  			+ filters;
			});

		$('#sector-revenue-pie-chart .dc-legend text').each(function(){
			var that = $(this);
			that.attr('tabindex','0');
			that.attr('id','#sector-revenue-pie-chart-'+that.text());
			if (lastSelectedPieSection == that.text())
			{
				lastSelectedPieSection='';
				that.focus();
			}
			that.keypress(function(event){
                if (event.charCode == 13 || event.charCode == 32)
                {
                	lastSelectedPieSection = that.text();
                	pieChart.filter(that.text())
                	dc.redrawAll();
                }
            });
		});
	};
	var lastSelectedBarSection='';
	var sectorsBar508 = function(){
		d3.selectAll('#sector-revenue-bar-chart .bar')
			.attr('id',function(d){
				lastSelectedBarSection = d.x;
				return '#sector-revenue-bar-chart-'+d.x;
			})
			.attr('tabindex',0)
			.attr('data-year',function(d){return d.x});
		
		$('#sector-revenue-bar-chart .bar').each(function(){
			$(this).keypress(function(event){
				if (event.charCode == 13 || event.charCode == 32)
                {
         
                	lastSelectedBarSection = $(this).attr('data-year');
                	barChart.filter(lastSelectedBarSection);
                	dc.redrawAll();
                }
			});
		});

	};
	var sectors_rev_drawn = false;
    $(document).ready(function(){
    	$(window).scroll(function (event) {
	          if (sectors_rev_drawn)
	            return;
	          if (isScrolledIntoView('#sector-revenue-bar-chart')) {
	              sectors_rev_drawn = true;
	              setTimeout(function(){
	              	dc.renderAll();
	             	addToolTips();
	              }, 200);
	          }
	      });
	    (function(){
	      if (isScrolledIntoView('#sector-revenue-bar-chart')) {
	              sectors_rev_drawn = true;
	              dc.renderAll();
	              addToolTips();
	              sectorsPie508();
	              sectorsBar508();
	      }
	    })();
    })
    

	
});

  /********************************************************************************************
  *Via: http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
  *********************************************************************************************/
  function isScrolledIntoView(elem)
  {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();

      var elemTop = $(elem).offset().top;
      var elemBottom = elemTop + $(elem).height();
      if ($(elem).offset().top < $(window).scrollTop() + 10)
        return true;
      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }


