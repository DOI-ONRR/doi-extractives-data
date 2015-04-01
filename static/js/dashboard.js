var Dashboard = (function(){
    var pubs = {};
    //Vars
    pubs.bar_charts =[];
    pubs.inner_bar_charts = [];
    pubs.tables = [];
    pubs.dimensions = [];
    pubs.groups = [];
    pubs.dataSet = {};
    //Settings
    pubs.barchart_centerBar = false;
    pubs.barchart_elasticY = true;
    pubs.barchart_brushOn = false;
    pubs.barchart_turnOnControls = true;
    pubs.graphs_width = 350;
    pubs.graphs_height = 360;
    pubs.graphs_margins = {top:10, right: -2, bottom: 75, left:45};
    pubs.graphs_gap = false;
    pubs.graphs_gap_width = 40;
    pubs.graph_xaxis_format = {
        'Rents':'rent',
        'Royalties':'royalty',
        'Bonus':'bonus',
        "Other Revenues":"other revenues",
        'Other':"other commodities",
        'Coal':'coal',
        "Oil & Gas":"oil & gas",
        'Renewables':'renewables'};

    //Registers Bar charts
    pubs.set_barchart = set_barchart;
    function set_barchart(chart) {
        var newChart = dc.barChart(chart);
        pubs.bar_charts.push(newChart)
        return newChart; 
    }
    //Loads Data from CSV with D3
    pubs.loadData = loadData;
    function loadData(csv){
        d3.csv(csv, function(data){
            pubs.dataSet = data;
        });
    }
    //Default Settings for Barchart
    pubs.default_barchart_settings = default_barchart_settings;
    function default_barchart_settings(chart){
        chart
            .width(pubs.graphs_width).height(pubs.graphs_height)
            .centerBar(pubs.barchart_centerBar)
            .gap(pubs.graphs_gap_width)
            .elasticY(pubs.barchart_elasticY)
            .brushOn(pubs.barchart_brushOn)
            .turnOnControls(pubs.barchart_turnOnControls)
            .xUnits(dc.units.ordinal)
            .x(d3.scale.ordinal())
            .y(d3.scale.log().nice().domain([1, 12500000000]))
            .margins(pubs.graphs_margins)
            .yAxis().tickFormat(function(v){return text_money(v,false,true)});

        chart.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});
        chart.filter = function(){};//disables filter on bar select
        chart.xAxis().tickFormat(formatXAxis);
        
    }
    //Private function used by default bar chart settings to format x values
    function formatXAxis(value){
        return pubs.graph_xaxis_format[value] || value;
    }
    /*********************************
    graphCustomizations
    Function: Performs post processing
        on graphs to add styling and 
        other effects, rollovers
    **********************************/
    pubs.graphCustomizations = graphCustomizations;
    function graphCustomizations() {
        d3.selectAll("g.x text")
            .attr("class", "campusLabel")
            .style("text-anchor", "middle")

        d3.selectAll("g.x line")
            .style("stroke", "#272727")

        d3.selectAll("g.x path")
            .style("stroke", "#272727")

        d3.selectAll("g.y line")
            .style("stroke", "#272727")

        d3.selectAll("g.y path")
            .style("stroke", "#272727")

        d3.selectAll("#dashboard-bar-rev-by-commodity-group .bar").call(resources_barTip);
        
        var commodityBars = d3.selectAll("#dashboard-bar-rev-by-commodity-group .bar")
            .attr('tabindex',function(d){if (d.y != 0) return '0'; else return '-1';})
            .attr('aria-label',function(d){
                return d.x + " " + d.layer + " revenues of " + d.y;
            })
            .on('mouseover', resources_barTip.show)
            .on('mouseout', resources_barTip.hide)
            .on('focus',resources_barTip.show)
            .on('blur',resources_barTip.hide);

        var a=['#dashboard-bar-rev-by-revenue-type-oil-and-gas',
                '#dashboard-bar-rev-by-revenue-type-renewables',
                '#dashboard-bar-rev-by-revenue-type-coal',
                '#dashboard-bar-rev-by-revenue-type-other'];
        for (var i=0;i<a.length;i++){
             d3.selectAll(a[i]+" .bar").call(commodities_barTip);
             d3.selectAll(a[i]+" .bar")
                .attr('tabindex',function(d){if (d.y != 0) return '0'; else return '-1';})
                .attr('aria-label',function(d){
                    return d.x + " " + d.layer + " revenues of " + d.y;
                })
                .on('mouseover', commodities_barTip.show)
                .on('mouseout', commodities_barTip.hide)
                .on('focus',resources_barTip.show)
                .on('blur',resources_barTip.hide);
        }
        var splitColors = ['#b6bf38','#798025'];
        d3.select('#dashboard-bar-rev-by-revenue-type-renewables .dc-legend .dc-legend-item')
            .append('polygon')
                .attr('points','0,0 12,0 0,12')
                .attr('fill','#798025');
        d3.select('#dashboard-bar-rev-by-revenue-type-renewables .dc-legend .dc-legend-item:nth-child(2)')
            .append('polygon')
                .attr('points','0,0 12,0 0,12')
                .attr('fill','#b6bf38');
    };

    /*********************************
    update_graph_options
    Function: Updates graph selections
    based on checkboxes
    **********************************/
    
    pubs.update_graph_options = update_graph_options;
    function update_graph_options(elem,dimension,graphOptions){
        var a=[];
        if (elem.each)
        {
            elem.each(function(){
                if ($(this).is(':checked')){
                    a.push($(this).val());
                }
                else if($(this).attr('aria-checked')=='true'){
                    if ($(this).attr('data-value') == 'Other Revenues')
                        a = a.concat(dash_config.other_revenue_types);
                    else
                        a.push($(this).attr('data-value'));
                }
            }); 
        }
        else
        {
            a = elem;
        }
        
        dimension.filterAll();
        dimension.filter(function(d){
                if (a.indexOf(d) > -1)
                {
                    return true;
                }
                else
                    return false;
        });


        draw_totals_table();
        dc.redrawAll();
        graphCustomizations();
    }

    return pubs;
})();