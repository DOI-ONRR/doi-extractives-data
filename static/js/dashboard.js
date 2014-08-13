

var dash_bar_rev_by_commodity = dc.barChart("#dashboard-bar-rev-by-commodity");
//var dash_bar_rev_by_other = dc.barChart("#dashboard-bar-rev-by-other");
var dash_bar_by_rev_source = dc.barChart("#dashboard-bar-rev-source")
var dash_bar_avg_by_rev_source = dc.barChart('#dashboard-bar-avg-by-rev-source');
var dash_bar_avg_by_commodity = dc.barChart('#dashboard-bar-avg-by-commodity');
//var barChartTwo = dc.pieChart("#dashboard-bar-chart-two");
var dashTable   = dc.dataTable("#dashboard-table");
var companyDimension; //dimension on company name
var typeDimension; //dimension on commodity type
var typeDimensionHelper; //Extra commodity dimension for use by helper functions. Allows it to be filter on by other things
var ndx; //crossfilter object
//var typeDimension;
//d3.csv("https://docs.google.com/spreadsheet/pub?key=0AjPWVMj9wWa6dGw3b1c3ZHRSMW92UTJlNXRLTXZ0RUE&single=true&gid=0&output=csv",function(resource_data){
d3.csv("../static/data/uni_dummySet_apr17.csv",function(resource_data){
    
    resource_data.forEach(function(d){
        d["Revenue"] = clean_monetary_float(d["Revenue"]);
    });

    ndx = crossfilter(resource_data);


    //Dimensions 
    companyDimension = ndx.dimension(function(d){
        return d["Company Name"];
    });
    typeDimension = ndx.dimension(function(d){
        return d["Commodity"];
    });

    typeDimensionHelper = ndx.dimension(function(d){
        return d["Commodity"];
    });

    var otherTypeDimension = ndx.dimension(function(d){
        return d["Commodity"];
    })
    var revDimension = ndx.dimension(function(d){
        return d["Revenue Source"];
    })

    //Groups
    var typeDimensionEnergyGroup = typeDimension.group().reduceSum(function(d){
        //var c = d["Commodity"];
       // if (c=="Oil" || c=="Oil & Gas" || c=="Coal" || c=="Gas" || c=="Other Commodities")
            return d["Revenue"];
    });
    // var typeDimensionOtherGroup = otherTypeDimension.group().reduceSum(function(d){
    //     var c = d["Commodity"];
    //     if (c!="Oil" & c!="Oil & Gas" & c!="Coal" & c!="Gas" & c!="Other Commodities" & c!="n/a" & c!="Geothermal"  & c!="Wind")
    //         return d["Revenue"];
    // });

    var revDimensionGroup = revDimension.group().reduceSum(function(d){
        return d["Revenue"]
    });

    var all=ndx.groupAll().reduceSum(function(d){return d["Revenue"];});

    var revDimension_allGroup = revDimension.group().reduce(
            //add
            function(p,v){
                p.name = v["Company Name"];
                p.revenue = v["Revenue"];
                p.type = v["Commodity"]
                p.revenueSource = v["Revenue Source"];
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
                p.revenueSource = v["Revenue Source"];
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
                p.revenueSource = v["Revenue Source"];
                p.count++;
                p.sum+= v["Revenue"];
                p.average = p.sum/p.count;
                var rs = v["Revenue Source"];
                var r = v["Revenue"];
                if (rs == "Bonus")
                    p.bonus_rev += r;
                if (rs == "Rents")
                    p.rent_rev += r;
                if (rs == "Royalties")
                    p.royalties_rev += r;
                if (rs == "Other Revenues")
                    p.other_rev += r;
                return p;
            },
            //remove
            function(p,v){
                p.name = v["Company Name"];
                p.revenue = v["Revenue"];
                p.type = v["Commodity"]
                p.revenueSource = v["Revenue Source"];
                p.count--;
                p.sum-= v["Revenue"];
                p.average = p.sum/p.count;
                var rs = v["Revenue Source"];
                var r = v["Revenue"];
                if (rs == "Bonus")
                    p.bonus_rev -= r;
                if (rs == "Rents")
                    p.rent_rev -= r;
                if (rs == "Royalties")
                    p.royalties_rev -= r;
                if (rs == "Other Revenues")
                    p.other_rev -= r;
                return p;
            },
            //init
            function(p,v){
                return {name : "", revenue : 0, type : "", revenueSource : "", 
                    count: 0, sum: 0, average: 0, bonus_rev : 0, rent_rev : 0, royalties_rev : 0, other_rev : 0};
            }
        );

    //Graphs
    dash_bar_rev_by_commodity
        .width(600).height(400)
        .group(typeDimension_allGroup, "Rent")
        .dimension(typeDimension)
        .valueAccessor(function (d){
            return d.value.rent_rev;
        })
        .stack(typeDimension_allGroup, "Bonus", function(d){return d.value.bonus_rev})
        .stack(typeDimension_allGroup, "Royalties", function(d){return d.value.royalties_rev})
        .stack(typeDimension_allGroup, "Other Revenues", function(d){return d.value.other_rev})
        .legend(dc.legend().x(500).y(100))
        .centerBar(false)       
        .elasticY(true)
        .brushOn(false)
        .turnOnControls(true)
        //.x(d3.time.scale().domain([minDate,maxDate]))
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal().domain(["Coal", "Gas", "Oil & Gas", "Oil", "Other Commodities", "Clay", "Geothermal", "Copper", "Gilsonite", "Hardrock", "Oil Shale", "Phosphate", "Sodium", "Potassium", "Wind", "n/a"]))
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
        .x(d3.scale.ordinal())//.domain(["Coal","Gas","Oil & Gas","Oil"]))
        .margins({top: 10, right: 10, bottom: 75, left:100})
        .yAxis().tickFormat(function(v){return "$"+ parseFloat(v).formatMoney(0,'.',',')});
    dash_bar_by_rev_source.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});

    dash_bar_avg_by_rev_source
        .width(300).height(400)
        .group(revDimension_allGroup)
        .dimension(revDimension)
        .centerBar(false)       
        .elasticY(true)
        .brushOn(false)
        .renderHorizontalGridLines(true)
        .valueAccessor(function (p) {
                return p.value.average;
            })
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .margins({top: 10, right: 10, bottom: 75, left:100})
        .yAxis().tickFormat(function(v){return "$"+ parseFloat(v).formatMoney(0,'.',',')});
    dash_bar_avg_by_rev_source.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});

    dash_bar_avg_by_commodity
        .width(600).height(400)
        .group(typeDimension_allGroup)
        .dimension(typeDimension)
        .centerBar(false)       
        .elasticY(true)
        .brushOn(false)
        .renderHorizontalGridLines(true)
        .valueAccessor(function(p){
            return p.value.average;
        })
        //.x(d3.time.scale().domain([minDate,maxDate]))
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .margins({top: 10, right: 10, bottom: 75, left:100})
        .yAxis().tickFormat(function(v){return "$"+ parseFloat(v).formatMoney(0,'.',',')});
    dash_bar_avg_by_commodity.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});

    //dash_bar_rev_by_energy.y(d3.scale.sqrt().nice().domain([0.0,7000000000.0]));
    //dash_bar_rev_by_other.y(d3.scale.sqrt().nice().domain([-5000,28000000.0]));

        


    //Table
dashTable.width(800).height(800)
        .dimension(companyDimension)
        .group(function(d){
            return "List of all Selected Companies";
        })
        .size(1774)
        .columns([
                function(d){return d["Company Name"]; },
                function(d){return d["Revenue Source"];},
                function(d){return d["Commodity"];},
                function(d){return "$"+parseFloat(d["Revenue"]).formatMoney(0,'.',',');}
            ])
        .sortBy(function(d){return d["Company Name"]})
        .order(d3.ascending);
dashTable
    .renderlet(function(d){
            d3.select("#totals span").html('$' +all.value().formatMoney(0,'.',','));
        });


    
    dc.renderAll();
    graphCustomizations();

    
    

});

var barTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        if (typeof(d.data.value)=="object" )//bonus_rev : 0, rent_rev : 0, royalties_rev : 0, other_rev : 0
        {
            var s = "";
            if (d.data.value.bonus_rev != 0)
                s+= "<br /><div style='float:left'><strong>Bonus Revenue:</strong></div><div style='float:right'><span style='color:red'>$"+parseFloat(d.data.value.bonus_rev).formatMoney(2,'.',',')+"</span></div>";
            if (d.data.value.rent_rev != 0)
                s+= "<br /><div style='float:left'><strong>Rent Revenue:</strong></div><div style='float:right'><span style='color:red'>$"+parseFloat(d.data.value.rent_rev).formatMoney(2,'.',',')+"</span></div>";
            if (d.data.value.royalties_rev != 0)
                s+= "<br /><div style='float:left'><strong>Royalties Revenue:</strong></div><div style='float:right'><span style='color:red'>$"+parseFloat(d.data.value.royalties_rev).formatMoney(2,'.',',')+"</span></div>";
            if (d.data.value.other_rev != 0)
                s+= "<br /><div style='float:left'><strong>Rent Revenue:</strong></div><div style='float:right'><span style='color:red'>$"+parseFloat(d.data.value.other_rev).formatMoney(2,'.',',')+"</span></div>";
            s+= "<hr>";
            s+= "<div style='float:left'><strong>Total Revenue:</strong></div><div style='float:right'><span style='color:red'>$"+parseFloat(d.data.value.sum).formatMoney(2,'.',',')+"</span></div>";

            return s;
        }
      });

var graphCustomizations = function(){
        d3.selectAll("g.x text")
        .attr("class", "campusLabel")
        .style("text-anchor", "end") 
        .attr("transform", "translate(-10,0)rotate(315)");

        d3.selectAll(".bar").call(barTip);
        d3.selectAll(".bar").on('mouseover', barTip.show)
        .on('mouseout', barTip.hide);

        //d3.selectAll(".bar").attr("tabindex",0);
    };



