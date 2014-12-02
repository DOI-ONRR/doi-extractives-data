var dash_bar_rev_by_commodity_group = dc.barChart("#dashboard-bar-rev-by-commodity-group");
var dash_bar_rev_by_revenue_type_oil_and_gas = dc.barChart("#dashboard-bar-rev-by-revenue-type-oil-and-gas");
var dash_bar_rev_by_revenue_type_renewables = dc.barChart('#dashboard-bar-rev-by-revenue-type-renewables')
//var dash_pie_rev_by_commodity;
//var dash_bar_rev_by_other = dc.barChart("#dashboard-bar-rev-by-other");
// var dash_bar_by_rev_source = dc.barChart("#dashboard-bar-rev-source")
// var dash_bar_avg_by_rev_source = dc.barChart('#dashboard-bar-avg-by-rev-source');
// var dash_bar_avg_by_commodity = dc.barChart('#dashboard-bar-avg-by-commodity');
//var barChartTwo = dc.pieChart("#dashboard-bar-chart-two");
var dashTable;
var dashTotalsTable;
var companyDimension; //dimension on company name
var companyDimensionGroup;
var typeDimension; //dimension on commodity type
var typeGroupDimension;
var typeDimensionHelper; //Extra commodity dimension for use by helper functions. Allows it to be filter on by other things
var revDimension;
var ndx; //crossfilter object
var companyPage =  QueryString.company ? true : false;//Boolean: if this is a company specific dashboard or not. 
if (!companyPage)
{
    dashTable = dc.dataTable("#dashboard-table");
    dashTotalsTable = dc.dataTable("#dashboard-totals-table");
}
else
{
   // dash_pie_rev_by_commodity = dc.pieChart('#dashboard-pie-rev-by-commodity')
}
//var typeDimension;
//d3.csv("https://docs.google.com/spreadsheet/pub?key=0AjPWVMj9wWa6dGw3b1c3ZHRSMW92UTJlNXRLTXZ0RUE&single=true&gid=0&output=csv",function(resource_data){



d3.csv("../static/data/Updated_Consolidated_Revenue_Data_with_Fake_Names.csv",function(resource_data){
    
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
            else
                console.log(commodity);
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

    //Groups
    // var typeDimensionEnergyGroup = typeDimension.group().reduceSum(function(d) {
    //     //var c = d["Commodity"];
    //     // if (c=="Oil" || c=="Oil & Gas" || c=="Coal" || c=="Gas" || c=="Other Commodities")
    //     return d["Revenue"];
    // });
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
                if (p.type == "Oil & Gas")
                    p.oilandgas_rev = parseFloat((p.oilandgas_rev + r).toFixed(2));
                if (p.type == "Geothermal")
                    p.geo_rev = parseFloat((p.oilandgas_rev + r).toFixed(2));
                if (p.type == "Wind")
                    p.wind_rev = parseFloat((p.oilandgas_rev + r).toFixed(2));
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
                    p.geo_rev = parseFloat((p.oilandgas_rev - r).toFixed(2));
                if (p.type == "Wind")
                    p.wind_rev = parseFloat((p.oilandgas_rev - r).toFixed(2));


                return p;
            },
            //init
            function(p,v){
                return {name : "", revenue : 0.00, type : "", revenueSource : "", 
                    count: 0, sum: 0.00, average: 0, bonus_rev : 0.00, rent_rev : 0.00, 
                    royalties_rev : 0.00, other_rev : 0.00, 
                    oil_rev: 0.00, gas_rev: 0.00, oilandgas_rev: 0.00, geo_rev: 0.00, wind_rev: 0.00};
            }
        );

    // var typeDimension_allGroup = typeDimension.group().reduce(
    //         //add
    //         function(p,v){
    //             var rs = v["Revenue Type"];
    //             var r = parseFloat(v["Revenue"]);

    //             p.name = v["Company Name"];
    //             p.revenue = v["Revenue"];
    //             p.type = v["Commodity"];
    //             p.revenueSource = v["Revenue Type"];
    //             p.count++;
    //             p.sum= parseFloat((p.sum + v["Revenue"]).toFixed(2));
    //             p.average = p.sum/p.count;
                
    //             p.oilGroup = (p.type == "Gas" || p.type == "Oil" || p.type == "Oil & Gas") ? p.oilGroup+r.toFixed(2) : p.oilGroup;
    //             p.coalGroup = (p.type == "Coal") ? p.coalGroup+r.toFixed(2) : p.coalGroup;
    //             p.renewableGroup = (p.type == "Wind" || p.type == "Geothermal") ? p.renewableGroup+r.toFixed(2) : p.renewableGroup;
    //             p.otherGroup = (p.type == "Clay" || p.type == "Gilsonite" || p.type == "Phosphate" || p.type == "Copper" || p.type == "Hardrock" || p.type == "Sodium" || p.type == "Potassium" || p.type == "Oil Shale" || p.type == "Sulfur" || p.type == "Other Commodities") ? p.otherGroup+r.toFixed(2) : p.otherGroup;
                
    //             if (rs == "Bonus")
    //                 p.bonus_rev     = parseFloat((p.bonus_rev + r).toFixed(2));
    //             if (rs == "Rents")
    //                 p.rent_rev      = parseFloat((p.rent_rev + r).toFixed(2));
    //             if (rs == "Royalties")
    //                 p.royalties_rev = parseFloat((p.royalties_rev + r).toFixed(2));
    //             if (rs == "Other Revenues")
    //                 p.other_rev     = parseFloat((p.other_rev + r).toFixed(2));
    //             return p;
    //         },
    //         //remove
    //         function(p,v){
    //             p.name = v["Company Name"];
    //             p.revenue = v["Revenue"];
    //             p.type = v["Commodity"]
    //             p.revenueSource = v["Revenue Type"];
    //             p.count--;
    //             p.sum= parseFloat((p.sum - v["Revenue"]).toFixed(2));
    //             p.average = p.sum/p.count;
    //             var rs = v["Revenue Type"];
    //             var r = parseFloat(v["Revenue"]);
    //             if (rs == "Bonus")
    //                 p.bonus_rev     = parseFloat((p.bonus_rev - r).toFixed(2));
    //             if (rs == "Rents")
    //                 p.rent_rev      = parseFloat((p.rent_rev - r).toFixed(2));
    //             if (rs == "Royalties")
    //                 p.royalties_rev = parseFloat((p.royalties_rev - r).toFixed(2));
    //             if (rs == "Other Revenues")
    //                 p.other_rev     = parseFloat((p.other_rev - r).toFixed(2));


    //             return p;
    //         },
    //         //init
    //         function(p,v){
    //             return {name : "", revenue : 0.00, type : "", revenueSource : "", 
    //                 count: 0, sum: 0.00, average: 0, bonus_rev : 0.00, rent_rev : 0.00, royalties_rev : 0.00, other_rev : 0.00};
    //         }
    //     );
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
    dash_bar_rev_by_commodity_group
        .width(350).height(400)
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
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .y(d3.scale.log().nice().domain([1, 12500000000]))
        .margins({top: 10, right: -2, bottom: 75, left:45})
        .yAxis().tickFormat(function(v){return text_money(v,false,true)});
    dash_bar_rev_by_commodity_group.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});
    /*****************************
    End: dash_bar_rev_by_commodity
    *****************************/
    dash_bar_rev_by_revenue_type_oil_and_gas
        .width(350).height(400)
        .dimension(revDimension)
        .group(revDimension_allGroup, 'Oil')
        .valueAccessor(function(d) {
            return d.value.oil_rev;
        })
        .stack(revDimension_allGroup, 'Gas',function(d){
            return d.value.gas_rev;
        })
        .stack(revDimension_allGroup,'Oil and Gas', function(d){
            return d.value.oilandgas_rev;
        })
        //.legend(dc.legend().x(470).y(100))
        .centerBar(false)
        .gap(40)
        .elasticY(true)
        .brushOn(false)
        .turnOnControls(true)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .y(d3.scale.log().nice().domain([1, 12500000000]))
        .margins({top: 10, right: -2, bottom: 75, left:45})
        .yAxis().tickFormat(function(v){return text_money(v,false,true)});
    dash_bar_rev_by_revenue_type_oil_and_gas.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});

    dash_bar_rev_by_revenue_type_renewables
        .width(350).height(400)
        .dimension(revDimension)
        .group(revDimension_allGroup, 'Geothermal')
        .valueAccessor(function(d) {
            return d.value.oil_rev;
        })
        .stack(revDimension_allGroup, 'Wind',function(d){
            return d.value.gas_rev;
        })
        .stack(revDimension_allGroup,'Oil and Gas', function(d){
            return d.value.oilandgas_rev;
        })
        //.legend(dc.legend().x(470).y(100))
        .centerBar(false)
        .gap(40)
        .elasticY(true)
        .brushOn(false)
        .turnOnControls(true)
        .xUnits(dc.units.ordinal)
        .x(d3.scale.ordinal())
        .y(d3.scale.log().nice().domain([1, 12500000000]))
        .margins({top: 10, right: -2, bottom: 75, left:45})
        .yAxis().tickFormat(function(v){return text_money(v,false,true)});
    dash_bar_rev_by_revenue_type_renewables.on("filtered", function (chart) {
                dc.events.trigger(function () {
                });});

    /*****************************
    Graph: Pie Graph, by commodity
    *****************************/
    // if (companyPage)
    // {
    //     dash_pie_rev_by_commodity.width(300)
    //        // .colors(d3.scale.ordinal().range(["#815678","#70D4C4","#F96161","#ADAA97","#6D9DC8"]))
    //         .height(300)
    //         .transitionDuration(750)
    //         .radius(105)
    //         .dimension(typeDimension)
    //         .group(typeDimensionEnergyGroup)
    //         //.legend(dc.legend().x(280).y(70).itemHeight(13).gap(5))
    //         .renderLabel(true)
    //         //.minAngleForLabel(0)
    //         //.label(function(d) { return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)"; })
    //         .renderlet(function(d){
    //             d3.select("#pie-chart-center-text h4").html('Total:<br /> $' +text_money(all.value()));
    //         });
    // }
    /******************************
    End: Pie Graph by commodity
    ******************************/
    

    
    /****************************************
    Alternate graphs not currently being used
    *****************************************/
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

    // dash_bar_by_rev_source
    //     .width(300).height(400)
    //     .group(revDimensionGroup)
    //     .dimension(revDimension)
    //     .centerBar(false)
    //     .elasticY(true)
    //     .brushOn(false)
    //     .renderHorizontalGridLines(true)
    //     .xUnits(dc.units.ordinal)
    //         .x(d3.scale.ordinal())
    //     .margins({
    //         top: 10,
    //         right: 10,
    //         bottom: 75,
    //         left: 100
    //     })
    //     .yAxis().tickFormat(function(v) {
    //         return "$" + parseFloat(v).formatMoney(0, '.', ',')
    //     });
    // dash_bar_by_rev_source.on("filtered", function(chart) {
    //     dc.events.trigger(function() {});
    // });

    // dash_bar_avg_by_rev_source
    //     .width(300).height(400)
    //     .group(revDimension_allGroup)
    //     .dimension(revDimension)
    //     .centerBar(false)
    //     .elasticY(true)
    //     .brushOn(false)
    //     .renderHorizontalGridLines(true)
    //     .valueAccessor(function(p) {
    //         return p.value.average;
    //     })
    //     .xUnits(dc.units.ordinal)
    //     .x(d3.scale.ordinal())
    //     .margins({
    //         top: 10,
    //         right: 10,
    //         bottom: 75,
    //         left: 100
    //     })
    //     .yAxis().tickFormat(function(v) {
    //         return "$" + parseFloat(v).formatMoney(0, '.', ',')
    //     });
    // dash_bar_avg_by_rev_source.on("filtered", function(chart) {
    //     dc.events.trigger(function() {});
    // });

    // dash_bar_avg_by_commodity
    //     .width(600).height(400)
    //     .group(typeDimension_allGroup)
    //     .dimension(typeDimension)
    //     .centerBar(false)
    //     .elasticY(true)
    //     .brushOn(false)
    //     .renderHorizontalGridLines(true)
    //     .valueAccessor(function(p) {
    //         return p.value.average;
    //     })
    // .xUnits(dc.units.ordinal)
    //     .x(d3.scale.ordinal())
    //     .margins({
    //         top: 10,
    //         right: 10,
    //         bottom: 75,
    //         left: 100
    //     })
    //     .yAxis().tickFormat(function(v) {
    //         return "$" + parseFloat(v).formatMoney(0, '.', ',')
    //     });
    // dash_bar_avg_by_commodity.on("filtered", function(chart) {
    //     dc.events.trigger(function() {});
    // });




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
                        return '<a href="./?company='+
                                d["Company Name"]+
                                '">'+
                                d["Company Name"]+
                                '</a>' ;
                    },
                    function(d){return d["Revenue Type"];},
                    function(d){return d["Commodity"];},
                    function(d){return "$test"+parseFloat(d["Revenue"]).formatMoney(0,'.',',');}
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
            $(this).on('click',function(){
                $('#dashboard-bar-rev-by-commodity-group').toggle();
                if($(this).text()== 'Oil & Gas')
                {
                    $('#dashboard-bar-rev-by-revenue-type-oil-and-gas').toggle();
                    update_graph_options(['Oil','Oil & Gas','Gas'],typeDimension);
                }
               if($(this).text()== 'Renewables')
               {
                    $('#dashboard-bar-rev-by-revenue-type-renewables').toggle();
                    update_graph_options(['Wind','Geothermal'],typeDimension);
               } 
            });
        });
       var $newDiv = $('<div>');
       var $link = $('<a href="javascript:void(0);">back</a>');
       $link.click(function(){
            typeDimension.filterAll();
            draw_totals_table();
            dc.redrawAll();
            graphCustomizations();
            $('#dashboard-bar-rev-by-commodity-group').toggle();
            $('#dashboard-bar-rev-by-revenue-type-oil-and-gas').hide();
            $('#dashboard-bar-rev-by-revenue-type-renewables').hide();
       });
       $newDiv.append($link);
       $('#dashboard-bar-rev-by-revenue-type-renewables').append($newDiv);

       var $newDiv = $('<div>');
       var $link = $('<a href="javascript:void(0);">back</a>');
       $link.click(function(){
            typeDimension.filterAll();
            draw_totals_table();
            dc.redrawAll();
            graphCustomizations();
            $('#dashboard-bar-rev-by-commodity-group').toggle();
            $('#dashboard-bar-rev-by-revenue-type-oil-and-gas').hide();
            $('#dashboard-bar-rev-by-revenue-type-renewables').hide();
       });
       $newDiv.append($link);
       $('#dashboard-bar-rev-by-revenue-type-oil-and-gas').append($newDiv);
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
                s += "<br /><div style='float:left'>Oil revenue:</div><div style='float:right'><span style='color:#d54740'>$" + parseFloat(d.data.value.oil_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.gas_rev != 0)
                s += "<br /><div style='float:left'>Gas revenue:</div><div style='float:right'><span style='color:#d54740'>$" + parseFloat(d.data.value.gas_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.oilandgas_rev != 0)
                s += "<br /><div style='float:left'>Oil & Gas revenue:</div><div style='float:right'><span style='color:#d54740'>$" + parseFloat(d.data.value.oilandgas_rev).formatMoney(2, '.', ',') + "</span></div>";
            if (d.data.value.geo_rev != 0)
                s+= "<br /><div style='float:left'>Geothermal revenue:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.geo_rev).formatMoney(2,'.',',')+"</span></div>";
            if (d.data.value.wind_rev != 0)
                s+= "<br /><div style='float:left'>Wind revenue:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.wind_rev).formatMoney(2,'.',',')+"</span></div>";
            s+= "<hr>";
            s+= "<div style='float:left'>total revenue:</div><div style='float:right'><span style='color:#d54740'>$"+parseFloat(d.data.value.sum).formatMoney(2,'.',',')+"</span></div>";

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

    d3.selectAll("#dashboard-bar-rev-by-commodity-group .bar").call(resources_barTip);
    d3.selectAll("#dashboard-bar-rev-by-commodity-group .bar").on('mouseover', resources_barTip.show)
        .on('mouseout', resources_barTip.hide);
    d3.selectAll("#dashboard-bar-rev-by-revenue-type-oil-and-gas .bar").call(commodities_barTip);
    d3.selectAll("#dashboard-bar-rev-by-revenue-type-oil-and-gas .bar").on('mouseover', commodities_barTip.show)
        .on('mouseout', commodities_barTip.hide);
    d3.selectAll("#dashboard-bar-rev-by-revenue-type-renewables .bar").call(commodities_barTip);
    d3.selectAll("#dashboard-bar-rev-by-revenue-type-renewables .bar").on('mouseover', commodities_barTip.show)
        .on('mouseout', commodities_barTip.hide);
};
/************************
End: graphCustomizations
************************/

$(document).ready(function(){
    $('#OptionsList a').on('click',function(){
       // var label = $("label[for='"+$(this).attr('id')+"']");
        if ($(this).attr('aria-checked')=='true')
            $(this).attr('aria-checked','false');
        else
            $(this).attr('aria-checked','true'); 

        $('div > i',$(this)).toggleClass('fa-check');
        update_graph_options($('#OptionsList a'), revDimension);
    });
})

