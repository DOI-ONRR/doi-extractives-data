var dash_bar_rev_by_commodity = dc.barChart("#dashboard-bar-rev-by-commodity");
//var dash_bar_rev_by_other = dc.barChart("#dashboard-bar-rev-by-other");
var dash_bar_by_rev_source = dc.barChart("#dashboard-bar-rev-source")
var dash_bar_avg_by_rev_source = dc.barChart('#dashboard-bar-avg-by-rev-source');
var dash_bar_avg_by_commodity = dc.barChart('#dashboard-bar-avg-by-commodity');
//var barChartTwo = dc.pieChart("#dashboard-bar-chart-two");
var dashTable = dc.dataTable("#dashboard-table");
var dashTotalsTable = dc.dataTable("#dashboard-totals-table")
var companyDimension; //dimension on company name
var companyDimensionGroup;
var typeDimension; //dimension on commodity type
var typeDimensionHelper; //Extra commodity dimension for use by helper functions. Allows it to be filter on by other things
var ndx; //crossfilter object
//var typeDimension;
//d3.csv("https://docs.google.com/spreadsheet/pub?key=0AjPWVMj9wWa6dGw3b1c3ZHRSMW92UTJlNXRLTXZ0RUE&single=true&gid=0&output=csv",function(resource_data){

d3.csv("../static/data/Updated_Consolidated_Revenue_Data_with_Fake_Names.csv",function(resource_data){
    
    resource_data.forEach(function(d){
        d["Revenue"] = clean_monetary_float(d["Revenue"]);
    });

    ndx = crossfilter(resource_data);


    //Dimensions 
    companyDimension = ndx.dimension(function(d) {
        return d["Company Name"];
    });
    typeDimension = ndx.dimension(function(d) {
        return d["Commodity"];
    });

    typeDimensionHelper = ndx.dimension(function(d) {
        return d["Commodity"];
    });

    var otherTypeDimension = ndx.dimension(function(d) {
        return d["Commodity"];
    })
    var revDimension = ndx.dimension(function(d){
        return d["Revenue Type"];
    })

    //Groups
    var typeDimensionEnergyGroup = typeDimension.group().reduceSum(function(d) {
        //var c = d["Commodity"];
        // if (c=="Oil" || c=="Oil & Gas" || c=="Coal" || c=="Gas" || c=="Other Commodities")
        return d["Revenue"];
    });
    // var typeDimensionOtherGroup = otherTypeDimension.group().reduceSum(function(d){
    //     var c = d["Commodity"];
    //     if (c!="Oil" & c!="Oil & Gas" & c!="Coal" & c!="Gas" & c!="Other Commodities" & c!="n/a" & c!="Geothermal"  & c!="Wind")
    //         return d["Revenue"];
    // });

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
                p.name = v["Company Name"];
                p.revenue = v["Revenue"];
                p.type = v["Commodity"]
                p.revenueSource = v["Revenue Type"];
                p.count++;
                p.sum+= v["Revenue"];
                p.average = p.sum/p.count;
                return p;
            },
            //remove
            function(p,v){
                p.name = v["Company Name"];
                p.revenue = v["Revenue"];
                p.type = v["Commodity"]
                p.revenueSource = v["Revenue Type"];
                p.count--;
                p.sum-= v["Revenue"];
                p.average = p.sum/p.count;
                return p;
            },
            //init
            function(p,v){
                return {name : "", revenue : 0, type : "", revenueSource : "", count: 0, sum: 0, average: 0};
            }
        );

    var typeDimension_allGroup = typeDimension.group().reduce(
            //add
            function(p,v){
                p.name = v["Company Name"];
                p.revenue = v["Revenue"];
                p.type = v["Commodity"]
                p.revenueSource = v["Revenue Type"];
                p.count++;
                p.sum= parseFloat((p.sum + v["Revenue"]).toFixed(2));
                p.average = p.sum/p.count;
                var rs = v["Revenue Type"];
                var r = parseFloat(v["Revenue"]);
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

    //Graphs
    dash_bar_rev_by_commodity
        .width(600).height(400)
        .group(typeDimension_allGroup, "Rent")
        .dimension(typeDimension)
        .valueAccessor(function(d) {
            return d.value.rent_rev;
        })
        .stack(typeDimension_allGroup, "Bonus", function(d) {
            return d.value.bonus_rev
        })
        .stack(typeDimension_allGroup, "Royalties", function(d) {
            return d.value.royalties_rev
        })
        .stack(typeDimension_allGroup, "Other Revenues", function(d) {
            return d.value.other_rev
        })
        .legend(dc.legend().x(500).y(100))
        .centerBar(false)
        .elasticY(true)
        .brushOn(false)
        .turnOnControls(true)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .margins({top: 10, right: 10, bottom: 75, left:100})
        .yAxis().tickFormat(function(v){return "$"+ parseFloat(v).formatMoney(0,'.',',')});
    dash_bar_rev_by_commodity.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});
    

    // dash_bar_rev_by_other
    //     .width(600).height(400)
    //     .group(typeDimensionOtherGroup)
    //     .dimension(otherTypeDimension)
    //     .centerBar(false)       
    //     .elasticY(true)
    //     .brushOn(false)
    //     .renderHorizontalGridLines(true)
    //     //.x(d3.time.scale().domain([minDate,maxDate]))
    //     .xUnits(dc.units.ordinal)
    //     .x(d3.scale.ordinal().domain(["Clay","Copper","Gilsonite","Hardrock","Oil Shale","Phosphate","Sodium",'Potassium']))//.domain(["Coal","Gas","Oil & Gas","Oil"]))
    //     .margins({top: 10, right: 10, bottom: 75, left:100})
    //     .yAxis().tickFormat(function(v){return "$"+ v;});
    // dash_bar_rev_by_other.on("filtered", function (chart) {
    //             dc.events.trigger(function () {
    //             });});

    dash_bar_by_rev_source
        .width(300).height(400)
        .group(revDimensionGroup)
        .dimension(revDimension)
        .centerBar(false)
        .elasticY(true)
        .brushOn(false)
        .renderHorizontalGridLines(true)
    //.x(d3.time.scale().domain([minDate,maxDate]))
    .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal()) //.domain(["Coal","Gas","Oil & Gas","Oil"]))
    .margins({
        top: 10,
        right: 10,
        bottom: 75,
        left: 100
    })
        .yAxis().tickFormat(function(v) {
            return "$" + parseFloat(v).formatMoney(0, '.', ',')
        });
    dash_bar_by_rev_source.on("filtered", function(chart) {
        dc.events.trigger(function() {});
    });

    dash_bar_avg_by_rev_source
        .width(300).height(400)
        .group(revDimension_allGroup)
        .dimension(revDimension)
        .centerBar(false)
        .elasticY(true)
        .brushOn(false)
        .renderHorizontalGridLines(true)
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .margins({
            top: 10,
            right: 10,
            bottom: 75,
            left: 100
        })
        .yAxis().tickFormat(function(v) {
            return "$" + parseFloat(v).formatMoney(0, '.', ',')
        });
    dash_bar_avg_by_rev_source.on("filtered", function(chart) {
        dc.events.trigger(function() {});
    });

    dash_bar_avg_by_commodity
        .width(600).height(400)
        .group(typeDimension_allGroup)
        .dimension(typeDimension)
        .centerBar(false)
        .elasticY(true)
        .brushOn(false)
        .renderHorizontalGridLines(true)
        .valueAccessor(function(p) {
            return p.value.average;
        })
    //.x(d3.time.scale().domain([minDate,maxDate]))
    .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .margins({
            top: 10,
            right: 10,
            bottom: 75,
            left: 100
        })
        .yAxis().tickFormat(function(v) {
            return "$" + parseFloat(v).formatMoney(0, '.', ',')
        });
    dash_bar_avg_by_commodity.on("filtered", function(chart) {
        dc.events.trigger(function() {});
    });

    //dash_bar_rev_by_energy.y(d3.scale.sqrt().nice().domain([0.0,7000000000.0]));
    //dash_bar_rev_by_other.y(d3.scale.sqrt().nice().domain([-5000,28000000.0]));




    //Table
    dashTable.width(800).height(800)
        .dimension(companyDimension)
        .group(function(d) {
            return "List of all Selected Companies";
        })
        .size(1774)
        .columns([
                function(d){return d["Company Name"]; },
                function(d){return d["Revenue Type"];},
                function(d){return d["Commodity"];},
                function(d){return "$"+parseFloat(d["Revenue"]).formatMoney(0,'.',',');}
            ])
        .sortBy(function(d){return d["Company Name"]})
        .order(d3.ascending);
    //Table related Facts (Averages, Totals, etc)
    //These items are tied to the dashTable so they will be updated when it is updated
    dashTable
        .renderlet(function(d){
            d3.select("#total_revenue").html('$' +parseFloat(all.value().sum.toFixed(0)).formatMoney(0,'.',','));
        });
    dashTable
        .renderlet(function(d){
            d3.select("#average_revenue").html('$' +parseFloat(all.value().average.toFixed(0)).formatMoney(0,'.',','));
        });
    dashTable
        .renderlet(function(d){
            d3.select("#company_count").html(all.value().company_count);
            //print_filter(companyDimensionGroup);
        })
    //var dcGroupTable = new DCGroupTable("Company Name", "Total Revenue", 'sum');
    //dcGroupTable.draw(companyDimensionGroup)
   //dcGroupTable.drawTable();
   //console.log(companyDimensionGroup.top(Infinity));
   draw_totals_table();
   dashTotalsTable
    .sortBy(function(d){return d["Company Name"]})
    .order(d3.ascending);
   
    
    for (var i = 0; i < dc.chartRegistry.list().length; i++) {
        var chartI = dc.chartRegistry.list()[i];
        chartI.on("filtered", draw_totals_table);
    }

   dc.renderAll();
   graphCustomizations();




});

var barTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        if (typeof(d.data.value) == "object") //bonus_rev : 0, rent_rev : 0, royalties_rev : 0, other_rev : 0
        {
            var s = "";
            if (d.data.value.bonus_rev != 0)
                s += "<br /><div style='float:left'><strong>Bonus Revenue:</strong></div><div style='float:right'><span style='color:red'>$" + parseFloat(d.data.value.bonus_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.rent_rev != 0)
                s += "<br /><div style='float:left'><strong>Rent Revenue:</strong></div><div style='float:right'><span style='color:red'>$" + parseFloat(d.data.value.rent_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.royalties_rev != 0)
                s += "<br /><div style='float:left'><strong>Royalties Revenue:</strong></div><div style='float:right'><span style='color:red'>$" + parseFloat(d.data.value.royalties_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.other_rev != 0)
                s+= "<br /><div style='float:left'><strong>Other Revenue:</strong></div><div style='float:right'><span style='color:red'>$"+parseFloat(d.data.value.other_rev).formatMoney(2,'.',',')+"</span></div>";
            s+= "<hr>";
            s+= "<div style='float:left'><strong>Total Revenue:</strong></div><div style='float:right'><span style='color:red'>$"+parseFloat(d.data.value.sum).formatMoney(2,'.',',')+"</span></div>";

            return s;
        }
    });

var graphCustomizations = function() {
    d3.selectAll("g.x text")
        .attr("class", "campusLabel")
        .style("text-anchor", "end")
        .attr("transform", "translate(-10,0)rotate(315)");

    d3.selectAll(".bar").call(barTip);
    d3.selectAll(".bar").on('mouseover', barTip.show)
        .on('mouseout', barTip.hide);

    //d3.selectAll(".bar").attr("tabindex",0);
};
