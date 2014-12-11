var dash_bar_rev_by_commodity_group = dc.barChart("#dashboard-bar-rev-by-commodity-group");
var dash_bar_rev_by_revenue_type_oil_and_gas = dc.barChart("#dashboard-bar-rev-by-revenue-type-oil-and-gas");
var dash_bar_rev_by_revenue_type_renewables = dc.barChart('#dashboard-bar-rev-by-revenue-type-renewables');
var dash_bar_rev_by_revenue_type_coal = dc.barChart('#dashboard-bar-rev-by-revenue-type-coal');
var dash_bar_rev_by_revenue_type_other = dc.barChart('#dashboard-bar-rev-by-revenue-type-other');
var dashTable;
var dashTotalsTable;
var companyDimension; //dimension on company name
var companyDimensionGroup;
var typeDimension; //dimension on commodity type
var typeGroupDimension;
var typeDimensionHelper; //Extra commodity dimension for use by helper functions. Allows it to be filter on by other things
var revDimension;
var revDimensionHelper;
var ndx; //crossfilter object
var companyPage =  QueryString.company ? true : false;//Boolean: if this is a company specific dashboard or not. 
if (!companyPage)
{
    dashTable = dc.dataTable("#dashboard-table");
    dashTotalsTable = dc.dataTable("#dashboard-totals-table");
}

d3.csv("../static/data/CY13_Revenues_by_Company.csv",function(resource_data){
    
    resource_data.forEach(function(d){
        d["Revenue"] = clean_monetary_float(d["Revenue"]);
        d["GroupName"] = (function(d){
            var commodity = d["Commodity"]; 
            if (commodity == "Gas" || commodity == "Oil" || commodity == "Oil & Gas")
                return "Oil & Gas";
            else if (commodity == "Wind" || commodity == "Geothermal")
                return "Renewables";
            else if (commodity == "Clay" || commodity == "Gilsonite" || commodity == "Phosphate" || commodity == "Copper" || commodity == "Hardrock" || commodity == "Sodium" || commodity == "Potassium" || commodity == "Oil Shale" || commodity == "Sulfur" || commodity == "Other Commodities")
                return "Other";
            else if (commodity == 'Coal')
                return "Coal";
        })(d);
    });

    ndx = crossfilter(resource_data);


    //Dimensions 
    companyDimension = ndx.dimension(function(d) {
        return d["Company Name"];
    });
    
    if (companyPage)
        {
            companyDimension.filter(function(d){
            if (d == QueryString.company)
                return true;
            else 
                return false;
            });
        }

    typeDimension = ndx.dimension(function(d) {
        return d["Commodity"];
    });
    typeGroupDimension = ndx.dimension(function(d){
        return d["GroupName"];
    });

    typeDimensionHelper = ndx.dimension(function(d) {
        return d["Commodity"];
    });

    var otherTypeDimension = ndx.dimension(function(d) {
        return d["Commodity"];
    })
    revDimension = ndx.dimension(function(d){
        return d["Revenue Type"];
    })
    revDimensionHelper = ndx.dimension(function(d){
        return d["Revenue Type"];
    });

    var revDimensionGroup = revDimension.group().reduceSum(function(d) {
        return d["Revenue"]
    });

    var all = ndx.groupAll().reduce(
        //add
        function(p,v){
            p.sum += v["Revenue"];
            p.count++;
            if (v["Company Name"] in p.companies)
            {
                p.companies[v["Company Name"]]++;

            }
            else
            {
                p.companies[v["Company Name"]]=1
                p.company_count++;
            }
                

            p.average = p.sum/p.company_count;
            return p;
        },
        //remove
        function(p,v){
            p.sum -=v["Revenue"];
            p.count--;
            p.companies[v["Company Name"]]--;
            if (p.companies[v["Company Name"]] === 0)
            {
                p.company_count--;
                delete p.companies[v["Company Name"]];
            }
            if (p.company_count>0)
                p.average = p.sum/p.company_count;
            else
                p.average = 0;
            return p;
        },
        //int
        function(p,v){
            return {average : 0, sum : 0, count : 0, company_count:0, companies:{}}
        }
    );

    companyDimensionGroup = companyDimension.group().reduce(
        //add
        function(p,v){
            p.name = v["Company Name"];
            p.sum += v["Revenue"];
            p.count++;
            p.average = p.sum/p.count;
            var rs = v["Revenue Type"];
            var r = parseFloat(v["Revenue"]);
            var c = v["Commodity"];
            if (rs == "Bonus")
                p.bonus_rev     = parseFloat((p.bonus_rev + r).toFixed(2));
            if (rs == "Rents")
                p.rent_rev      = parseFloat((p.rent_rev + r).toFixed(2));
            if (rs == "Royalties")
                p.royalties_rev = parseFloat((p.royalties_rev + r).toFixed(2));
            if (rs == "Other Revenues")
                p.other_rev     = parseFloat((p.other_rev + r).toFixed(2));
            if (c in p.revenue_types)
            {
                p.revenue_types[c] = (parseFloat(p.revenue_types[c])+parseFloat(r)).toFixed(2);
            }
            else
            {
                p.revenue_types[c] = parseFloat(r).toFixed(2);
            }

            return p;
        },
        //remove
        function(p,v){
            p.name = v["Company Name"]
            p.sum -=v["Revenue"];
            p.count--;
            p.average = p.sum/p.count;
            var rs = v["Revenue Type"];
            var r = parseFloat(v["Revenue"]);
            var c = v["Commodity"];
            if (rs == "Bonus")
                p.bonus_rev     = parseFloat((p.bonus_rev - r).toFixed(2));
            if (rs == "Rents")
                p.rent_rev      = parseFloat((p.rent_rev - r).toFixed(2));
            if (rs == "Royalties")
                p.royalties_rev = parseFloat((p.royalties_rev - r).toFixed(2));
            if (rs == "Other Revenues")
                p.other_rev     = parseFloat((p.other_rev - r).toFixed(2));

            p.revenue_types[c] = (parseFloat(p.revenue_types[c])-parseFloat(r)).toFixed(2);
            if(p.revenue_types[c] === 0.00)
            {
                delete p.revenue_types[c];
            }

            return p;
        },
        //int
        function(p,v){
            return {name:"",average : 0, sum : 0, count : 0, revenue_types:{}}
        }
    );

    var revDimension_allGroup = revDimension.group().reduce(
            //add
            function(p,v){
                var rs = v["Revenue Type"];
                var r = parseFloat(v["Revenue"]);

                p.name = v["Company Name"];
                p.revenue = v["Revenue"];
                p.type = v["Commodity"];
                p.revenueSource = v["Revenue Type"];
                p.count++;
                p.sum= parseFloat((p.sum + v["Revenue"]).toFixed(2));
                p.average = p.sum/p.count;
                
                if (rs == "Bonus")
                    p.bonus_rev     = parseFloat((p.bonus_rev + r).toFixed(2));
                if (rs == "Rents")
                    p.rent_rev      = parseFloat((p.rent_rev + r).toFixed(2));
                if (rs == "Royalties")
                    p.royalties_rev = parseFloat((p.royalties_rev + r).toFixed(2));
                if (rs == "Other Revenues")
                    p.other_rev     = parseFloat((p.other_rev + r).toFixed(2));
                if (p.type == "Oil")
                    p.oil_rev = parseFloat((p.oil_rev + r).toFixed(2));
                if (p.type == "Gas")
                    p.gas_rev = parseFloat((p.gas_rev + r).toFixed(2));
                if (p.type == "Oil & Gas")
                    p.oilandgas_rev = parseFloat((p.oilandgas_rev + r).toFixed(2));
                if (p.type == "Geothermal")
                    p.geo_rev = parseFloat((p.geo_rev + r).toFixed(2));
                if (p.type == "Wind")
                    p.wind_rev = parseFloat((p.wind_rev + r).toFixed(2));
                if (p.type == "Other Commodities")
                    p.other_com_rev = parseFloat((p.other_com_rev + r).toFixed(2));
                if (p.type == "Coal")
                    p.coal_rev = parseFloat((p.coal_rev + r).toFixed(2));
                return p;
            },
            //remove
            function(p,v){
                p.name = v["Company Name"];
                p.revenue = v["Revenue"];
                p.type = v["Commodity"]
                p.revenueSource = v["Revenue Type"];
                p.count--;
                p.sum= parseFloat((p.sum - v["Revenue"]).toFixed(2));
                p.average = p.sum/p.count;
                var rs = v["Revenue Type"];
                var r = parseFloat(v["Revenue"]);
                if (rs == "Bonus")
                    p.bonus_rev     = parseFloat((p.bonus_rev - r).toFixed(2));
                if (rs == "Rents")
                    p.rent_rev      = parseFloat((p.rent_rev - r).toFixed(2));
                if (rs == "Royalties")
                    p.royalties_rev = parseFloat((p.royalties_rev - r).toFixed(2));
                if (rs == "Other Revenues")
                    p.other_rev     = parseFloat((p.other_rev - r).toFixed(2));
                if (p.type == "Oil")
                    p.oil_rev = parseFloat((p.oil_rev - r).toFixed(2));
                if (p.type == "Gas")
                    p.gas_rev = parseFloat((p.gas_rev - r).toFixed(2));
                if (p.type == "Oil & Gas")
                    p.oilandgas_rev = parseFloat((p.oilandgas_rev - r).toFixed(2));
                if (p.type == "Geothermal")
                    p.geo_rev = parseFloat((p.geo_rev - r).toFixed(2));
                if (p.type == "Wind")
                    p.wind_rev = parseFloat((p.wind_rev - r).toFixed(2));
                if (p.type == "Other Commodities")
                    p.other_com_rev = parseFloat((p.other_com_rev - r).toFixed(2));
                if (p.type == "Coal")
                    p.coal_rev = parseFloat((p.coal_rev - r).toFixed(2));


                return p;
            },
            //init
            function(p,v){
                return {name : "", revenue : 0.00, type : "", revenueSource : "", 
                    count: 0, sum: 0.00, average: 0, bonus_rev : 0.00, rent_rev : 0.00, 
                    royalties_rev : 0.00, other_rev : 0.00, 
                    oil_rev: 0.00, gas_rev: 0.00, oilandgas_rev: 0.00, geo_rev: 0.00, wind_rev: 0.00,
                    other_com_rev: 0.00, coal_rev: 0.00};
            }
        );

    var typeGroupDimension_allGroup = typeGroupDimension.group().reduce(
            //add
            function(p,v){
                var rs = v["Revenue Type"];
                var r = parseFloat(v["Revenue"]);

                p.name = v["Company Name"];
                p.revenue = v["Revenue"];
                p.type = v["Commodity"];
                p.revenueSource = v["Revenue Type"];
                p.count++;
                p.sum= parseFloat((p.sum + v["Revenue"]).toFixed(2));
                p.average = p.sum/p.count;
                
                if (rs == "Bonus")
                    p.bonus_rev     = parseFloat((p.bonus_rev + r).toFixed(2));
                if (rs == "Rents")
                    p.rent_rev      = parseFloat((p.rent_rev + r).toFixed(2));
                if (rs == "Royalties")
                    p.royalties_rev = parseFloat((p.royalties_rev + r).toFixed(2));
                if (rs == "Other Revenues")
                    p.other_rev     = parseFloat((p.other_rev + r).toFixed(2));
                return p;
            },
            //remove
            function(p,v){
                p.name = v["Company Name"];
                p.revenue = v["Revenue"];
                p.type = v["Commodity"]
                p.revenueSource = v["Revenue Type"];
                p.count--;
                p.sum= parseFloat((p.sum - v["Revenue"]).toFixed(2));
                p.average = p.sum/p.count;
                var rs = v["Revenue Type"];
                var r = parseFloat(v["Revenue"]);
                if (rs == "Bonus")
                    p.bonus_rev     = parseFloat((p.bonus_rev - r).toFixed(2));
                if (rs == "Rents")
                    p.rent_rev      = parseFloat((p.rent_rev - r).toFixed(2));
                if (rs == "Royalties")
                    p.royalties_rev = parseFloat((p.royalties_rev - r).toFixed(2));
                if (rs == "Other Revenues")
                    p.other_rev     = parseFloat((p.other_rev - r).toFixed(2));


                return p;
            },
            //init
            function(p,v){
                return {name : "", revenue : 0.00, type : "", revenueSource : "", 
                    count: 0, sum: 0.00, average: 0, bonus_rev : 0.00, rent_rev : 0.00, royalties_rev : 0.00, other_rev : 0.00};
            }
        );

    /****************************
    Graph:Bar Graph, by commodity
    *****************************/
    //Graph Constants
    var graphs_width = 350,
        graphs_height = 360,
        graphs_margins = {top:10, right: -2, bottom: 75, left:45},
        graphs_gap = false;

    dash_bar_rev_by_commodity_group
        .width(graphs_width).height(graphs_height)
        .dimension(typeGroupDimension)
        .group(typeGroupDimension_allGroup, "Rent")
        .valueAccessor(function(d) {
            return d.value.rent_rev;
        })
        .stack(typeGroupDimension_allGroup, "Bonus", function(d) {
            return d.value.bonus_rev
        })
        .stack(typeGroupDimension_allGroup, "Royalties", function(d) {
            return d.value.royalties_rev
        })
        .stack(typeGroupDimension_allGroup, "Other Revenues", function(d) {
            return d.value.other_rev
        })
        //.legend(dc.legend().x(470).y(100))
        .centerBar(false)
        .gap(40)
        .elasticY(true)
        .brushOn(false)
        .turnOnControls(true)
        .xAxisLabel("Commodities",30)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .y(d3.scale.log().nice().domain([1, 12500000000]))
        .margins(graphs_margins)
        .yAxis().tickFormat(function(v){return text_money(v,false,true)});
    dash_bar_rev_by_commodity_group.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});
    /*****************************
    End: dash_bar_rev_by_commodity
    *****************************/


    /*****************************
    Start: Special Commodity graphs
    *****************************/
    dash_bar_rev_by_revenue_type_oil_and_gas
        .width(graphs_width).height(graphs_height)
        .dimension(revDimension)
        .group(revDimension_allGroup, 'oil')
        .valueAccessor(function(d) {
            return d.value.oil_rev;
        })
        .stack(revDimension_allGroup, 'gas',function(d){
            return d.value.gas_rev;
        })
        .stack(revDimension_allGroup,'Oil and Gas', function(d){
            return d.value.oilandgas_rev;
        })
        .legend(dc.legend().x(50).y(0))
        .centerBar(false)
        .gap(40)
        .elasticY(true)
        .brushOn(false)
        .turnOnControls(true)
        .xAxisLabel("Oil & Gas",30)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .y(d3.scale.log().nice().domain([1, 12500000000]))
        .margins(graphs_margins)
        .yAxis().tickFormat(function(v){return text_money(v,false,true)});
    dash_bar_rev_by_revenue_type_oil_and_gas.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});

    dash_bar_rev_by_revenue_type_renewables
        .width(graphs_width).height(graphs_height)
        .dimension(revDimension)
        .group(revDimension_allGroup, 'geothermal')
        .valueAccessor(function(d) {
            return d.value.geo_rev;
        })
        .stack(revDimension_allGroup, 'wind',function(d){
            return d.value.wind_rev;
        })
        .legend(dc.legend().x(50).y(0))
        .centerBar(false)
        .gap(40)
        .elasticY(true)
        .brushOn(false)
        .turnOnControls(true)
        .xAxisLabel('Renewables',30)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .y(d3.scale.log().nice().domain([1, 12500000000]))
        .margins(graphs_margins)
        .yAxis().tickFormat(function(v){return text_money(v,false,true)});

    dash_bar_rev_by_revenue_type_coal
        .width(graphs_width).height(graphs_height)
        .dimension(revDimension)
        .group(revDimension_allGroup, 'coal')
        .valueAccessor(function(d) {
            return d.value.coal_rev;
        })
        .centerBar(false)
        .gap(40)
        .elasticY(true)
        .brushOn(false)
        .turnOnControls(true)
        .xAxisLabel('Coal',30)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .y(d3.scale.log().nice().domain([1, 12500000000]))
        .margins(graphs_margins)
        .yAxis().tickFormat(function(v){return text_money(v,false,true)});

    dash_bar_rev_by_revenue_type_other
        .width(graphs_width).height(graphs_height)
        .dimension(revDimension)
        .group(revDimension_allGroup, 'other')
        .valueAccessor(function(d) {
            return d.value.other_com_rev;
        })
        .centerBar(false)
        .gap(40)
        .elasticY(true)
        .brushOn(false)
        .turnOnControls(true)
        .xAxisLabel('Other Commodities',30)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .y(d3.scale.log().nice().domain([1, 12500000000]))
        .margins(graphs_margins)
        .yAxis().tickFormat(function(v){return text_money(v,false,true)});
        
    
    dash_bar_rev_by_revenue_type_renewables.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});
   
    /*****************************
    Graph: Format xAxis for inner graphs
    *****************************/

    var formatxAxisForInnerGraphs = function(v){
        var s=v;
            switch(v){
                case 'Rents':
                    s = 'rent';
                    break;
                case 'Royalties':
                    s = 'royalty';
                    break;
                case 'Bonus':
                    s = 'bonus';
                    break;
                case 'Other Revenues':
                    s = 'other revenues';
                    break;
                case 'Other':
                    s = 'other commodities';
                    break;
                case 'Coal':
                    s = 'coal';
                    break;
                case 'Oil & Gas':
                    s = 'oil & gas';
                    break;
                case 'Renewables':
                    s = 'renewables';
                    break;
            }
            return s;
    }
    dash_bar_rev_by_commodity_group.xAxis().tickFormat(formatxAxisForInnerGraphs);
    dash_bar_rev_by_revenue_type_renewables.xAxis().tickFormat(formatxAxisForInnerGraphs);
    dash_bar_rev_by_revenue_type_oil_and_gas.xAxis().tickFormat(formatxAxisForInnerGraphs);
    dash_bar_rev_by_revenue_type_coal.xAxis().tickFormat(formatxAxisForInnerGraphs);
    dash_bar_rev_by_revenue_type_other.xAxis().tickFormat(formatxAxisForInnerGraphs);

    
    /*******************************************************************
    Main Table Setup
    Setups table with company name, commodity, revenue, and revenue type
    *******************************************************************/
    if (!companyPage)
    {
        dashTable.width(800).height(800)
            .dimension(companyDimension)
            .group(function(d) {
                return "List of all Selected Companies";
            })
            .size(1774)
            .columns([
                    function(d){ 
                        var company = d["Company Name"]
                        var s = "<a href=\"javascript:$('input#table-search').val('"+company
                            +"');text_filter(companyDimension,'"+company+"');$('div.table-search-reset a').show();\">"
                            +company
                            +"</a>";
                        return s;
                    },
                    function(d){return d["Revenue Type"];},
                    function(d){return d["Commodity"];},
                    function(d){return "$"+parseFloat(d["Revenue"]).formatMoney(0,'.',',');}
                ])
            .sortBy(function(d){return d["Company Name"]})
            .order(d3.ascending);
    }
    
    /****************************
    End: Main Table Setup
    ****************************/

    /*********************************************************************************
    Table related Facts (Averages, Totals, etc)
    These items are tied to the dashTable so they will be updated when it is updated
    *********************************************************************************/
    dash_bar_rev_by_commodity_group
        .renderlet(function(d){
            d3.select("#total_revenue").html('$' +parseFloat(all.value().sum.toFixed(0)).formatMoney(0,'.',','));
        });
    dash_bar_rev_by_commodity_group
        .renderlet(function(d){
            d3.select("#average_revenue").html('$' +parseFloat(all.value().average.toFixed(0)).formatMoney(0,'.',','));
        });
    dash_bar_rev_by_commodity_group
        .renderlet(function(d){
            d3.select("#company_count").html(all.value().company_count);
        })
    
    /***************************
    End Table Related Functions
    ***************************/


    /****************************************************
    Set up special table for company grouping by revenue
    ****************************************************/
    if(!companyPage)
    {
        draw_totals_table();
        dashTotalsTable
            .sortBy(function(d){return d["Company Name"]})
            .order(d3.ascending);
       
        
        for (var i = 0; i < dc.chartRegistry.list().length; i++) {
            var chartI = dc.chartRegistry.list()[i];
            chartI.on("filtered", draw_totals_table);
        }    
    }
    
    /***************************
    End: Special Table Set up
    ***************************/

   dc.renderAll();
   graphCustomizations();
   
   /***************************
   Setup Graph switching
   ***************************/
   (function(){
        $('#dashboard-bar-rev-by-commodity-group svg g g.x g.tick text').each(function(){
            $(this).click(function(){
                $('#dashboard-bar-rev-by-commodity-group').toggle();
                if($(this).text().toLowerCase() == 'oil & gas')
                {
                    $('#dashboard-bar-rev-by-revenue-type-oil-and-gas').toggle();
                    update_graph_options(['Oil','Oil & Gas','Gas'],typeDimension);
                }
               if($(this).text().toLowerCase() == 'renewables')
               {
                    $('#dashboard-bar-rev-by-revenue-type-renewables').toggle();
                    update_graph_options(['Wind','Geothermal'],typeDimension);
               }
               if($(this).text().toLowerCase() == 'other commodities')
               {
                    $('#dashboard-bar-rev-by-revenue-type-other').toggle();
                    update_graph_options(['Other Commodities'],typeDimension);
               }
               if($(this).text().toLowerCase() == 'coal')
               {
                    $('#dashboard-bar-rev-by-revenue-type-coal').toggle();
                    update_graph_options(['Coal'],typeDimension);
               } 
            });
        });
       
            var a=[$('#dashboard-bar-rev-by-revenue-type-oil-and-gas'),
                    $('#dashboard-bar-rev-by-revenue-type-renewables'),
                    $('#dashboard-bar-rev-by-revenue-type-other'),
                    $('#dashboard-bar-rev-by-revenue-type-coal')];
            for (var i=0;i<a.length;i++)
            {
                   var $newDiv = $('<div class="dashboard-chart-back">');
                   var $link = $('<a href="javascript:void(0);">◀ back</a>');
                   $link.click(function(){
                        typeDimension.filterAll();
                        draw_totals_table();
                        dc.redrawAll();
                        graphCustomizations();
                        $('#dashboard-bar-rev-by-commodity-group').toggle();
                        $(this).parents('div.dc-chart').hide();
                   });
                   $newDiv.append($link);
                   a[i].append($newDiv);
            }
       
   })();

});
/****************************
End: d3 csv
****************************/

if(companyPage)
{
    $('.dashboard-search').hide();
    $('#average-revenue-h1').hide();
    $('#number-of-companies-h1').hide();
    $('#company-name').prepend('<a href="./">Back</a>');
    $('#company-name > h1').html(QueryString.company);
}


/*****************************
Creates d3 tip for bar graphs
*****************************/
var resources_barTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        if (typeof(d.data.value) == "object") //bonus_rev : 0, rent_rev : 0, royalties_rev : 0, other_rev : 0
        {
            var s = "";
            if (d.data.value.bonus_rev != 0)
                s += "<br /><div style='float:left'>bonus revenue:</div><div style='float:right'><span style='color:#d54740'>$" + parseFloat(d.data.value.bonus_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.rent_rev != 0)
                s += "<br /><div style='float:left'>rent revenue:</div><div style='float:right'><span style='color:#d54740'>$" + parseFloat(d.data.value.rent_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.royalties_rev != 0)
                s += "<br /><div style='float:left'>royalty revenue:</div><div style='float:right'><span style='color:#d54740'>$" + parseFloat(d.data.value.royalties_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.other_rev != 0)
                s+= "<br /><div style='float:left'>other revenue:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.other_rev).formatMoney(2,'.',',')+"</span></div>";
            s+= "<hr>";
            s+= "<div style='float:left'>total revenue:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.sum).formatMoney(2,'.',',')+"</span></div>";

            return s;
        }
    });
var commodities_barTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        if (typeof(d.data.value) == "object") //bonus_rev : 0, rent_rev : 0, royalties_rev : 0, other_rev : 0
        {
            var s = "";
            if (d.data.value.oil_rev != 0)
                s += "<br /><div style='float:left'>oil:</div><div style='float:right'><span style='color:#d54740'>$" + parseFloat(d.data.value.oil_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.gas_rev != 0)
                s += "<br /><div style='float:left'>gas:</div><div style='float:right'><span style='color:#d54740'>$" + parseFloat(d.data.value.gas_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.oilandgas_rev != 0)
                s += "<br /><div style='float:left'>oil & gas:</div><div style='float:right'><span style='color:#d54740'>$" + parseFloat(d.data.value.oilandgas_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.geo_rev != 0)
                s+= "<br /><div style='float:left'>geothermal:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.geo_rev).formatMoney(2,'.',',')+"</span></div>";
            if (d.data.value.wind_rev != 0)
                s+= "<br /><div style='float:left'>wind:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.wind_rev).formatMoney(2,'.',',')+"</span></div>";
            if (d.data.value.coal_rev != 0)
                s+= "<br /><div style='float:left'>coal:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.coal_rev).formatMoney(2,'.',',')+"</span></div>";
            if (d.data.value.other_com_rev != 0)
                s+= "<br /><div style='float:left'>other commodities:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.other_com_rev).formatMoney(2,'.',',')+"</span></div>";
            s+= "<hr>";
            s+= "<div style='float:left'>total:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.sum).formatMoney(2,'.',',')+"</span></div>";

            return s;
        }
    });
/*****************************
End: barTip()
*****************************/


/*********************************
graphCustomizations
Function: Performs post processing
    on graphs to add styling and 
    other effects, rollovers
**********************************/
var graphCustomizations = function() {
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
    d3.selectAll("#dashboard-bar-rev-by-commodity-group .bar").on('mouseover', resources_barTip.show)
        .on('mouseout', resources_barTip.hide);
    var a=['#dashboard-bar-rev-by-revenue-type-oil-and-gas',
            '#dashboard-bar-rev-by-revenue-type-renewables',
            '#dashboard-bar-rev-by-revenue-type-coal',
            '#dashboard-bar-rev-by-revenue-type-other'];
    for (var i=0;i<a.length;i++){
         d3.selectAll(a[i]+" .bar").call(commodities_barTip);
         d3.selectAll(a[i]+" .bar").on('mouseover', commodities_barTip.show)
            .on('mouseout', commodities_barTip.hide);
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

/************************
End: graphCustomizations
************************/

$(document).ready(function(){
    $('#OptionsList a').on('click',function(){
        if ($(this).attr('aria-checked')=='true')
            $(this).attr('aria-checked','false');
        else
            $(this).attr('aria-checked','true'); 

        $('div > i',$(this)).toggleClass('fa-check');
        update_graph_options($('#OptionsList a'), revDimensionHelper);
    });
});

/************************
Table More Link
************************/
$(document).ready(function(){
    $('div.dashboard-table-more').click(function(){
        toggle_divs('#toggleDivLink','#dashboard-totals-table','#dashboard-table','◀ less','more ▶');
        $('div.dashboard-table').toggleClass('dashboard-table-expand'); 
    });
});

/************************
Table Filter reset
************************/
$(document).ready(function(){
    $('#reset_text_filter').click(function(){
        $('input#table-search').val('');
        text_filter(companyDimension,'');
    });
});

/************************
Company search filter
*************************/

 $(document).ready(function(){
    $("#table-search").on('input',function(){
       text_filter(companyDimension,this.value);
       if($(this).val()!='')
            $('div.table-search-reset a').show();
       else 
            $('div.table-search-reset a').hide();
     });
    $('div.table-search-reset a').click(function(){
        $('input#table-search').val('');
        text_filter(companyDimension,'');
        $(this).hide();
    });
 })


