d3.csv("/static/data/disbursement-summary-data.csv",function(disbursement_data){
    var onshoreX = crossfilter(disbursement_data);
    var offshoreX = crossfilter(disbursement_data);

    var onshoreYearDim = onshoreX.dimension(function(d){
        return d["Year"]
    });
    onshoreYearDim.filter(function(d){
        if (d == '2012')
            return true;
    })

    var offshoreYearDim = offshoreX.dimension(function(d){
       return d["Year"]
    });

    offshoreYearDim.filter(function(d){
        if (d == '2012')
            return true;
    });

    var onshoreShoreDim = onshoreX.dimension(function(d){
        return d["Offshore/Onshore"]
    });

    onshoreShoreDim.filter(function(d){
        if (d == 'Onshore')
            return true;
    });

    var offshoreShoreDim = offshoreX.dimension(function(d){
        return d["Offshore/Onshore"]
    });

    offshoreShoreDim.filter(function(d){
        if (d == 'Offshore')
            return true;
    });

    console.log("Offshore data");
    print_filter(offshoreYearDim.top(Infinity));

    var w = 500;
    var h = 500;

    // var offShoreSVG = d3.select(".stats-offshore")
    //                     .append("svg")
    //                     .attr("width",w)
    //                     .attr("height",h);
    // offShoreSVG.selectAll("circle")
    //            .data(offshoreYearDim.top(Infinity))
    //            .enter()
    //            .append("circle")
    //            .attr("r",function(d){
    //                 return restrict_size(d["Total"],.00000005,50,300);
    //            });

    d3.select(".stats-offshore").selectAll("div")
        .data(offshoreYearDim.top(Infinity))
        .enter()
        .append("div")
        .attr("class", "disbursement_bubble statsOffshore")
        .style("height", function(d) {
            //return d["Total"]*.00000005 + "px";
            return restrict_size(d["Total"],.00000005,50,300);
        })
        .style("width",function(d){
            return restrict_size(d["Total"],.00000005,50,300);
        })
        .html(function(d){
            return "<div class='disbursement_bubble_content'>" + d["Bubble Name"] +"</div>"
                    +"<div class='disbursement_bubble_rollover'>Total: $"+parseFloat(d["Total"]).formatMoney(2,'.',',')+"</div>";
        });

    d3.select(".stats-onshore").selectAll("div")
        .data(onshoreShoreDim.top(Infinity))
        .enter()
        .append("div")
        .attr("class", "disbursement_bubble statsOnshore")
        .style("height", function(d) {
            return restrict_size(d["Total"],.00000005,50,300);
        })
        .style("width",function(d){
            return restrict_size(d["Total"],.00000005,50,300);
        })
        .html(function(d){
            return "<div class='disbursement_bubble_content'>" + d["Bubble Name"] +"</div>"
                    +"<div class='disbursement_bubble_rollover'>Total: $"+parseFloat(d["Total"]).formatMoney(2,'.',',')+"</div>";
        });

    var circleTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "$"+parseFloat(d["Total"]).formatMoney(2, '.', ',');
        });

    // var svg = d3.selectAll(".disbursement > div")
    //             .append("svg")
    //             .attr("width",50)
    //             .attr("height",50)
    //             .attry("style","position:absolute")
    //             .data(offshoreYearDim.top(Infinity))
    //             .enter();
    // svg.selectAll("circle")
    //    .data(offshoreYearDim.top(Infinity))
    //    .enter()
    //    .append("circle")
    //    .attr("r",function(d){
    //         return restrict_size(d["Total"],.00000005,50,300);
    //    });
    // d3.selectAll(".disbursement div").call(circleTip);
    // d3.selectAll(".disbursement div").on('mouseover', circleTip.show)
    //     .on('mouseout', circleTip.hide);

    function restrict_size(d,s,min,max){
        var n = d*s;
        n=n*3;
        
        if (n>max)
            return max+"px";
        if (n<min)
            return (min+n)+"px";
        return n+"px";
    };
    //displays the disbursement_bubble_rollover div
    $(".disbursement_bubble").on('mouseover',function(){
        $('div.disbursement_bubble_rollover', this).toggle();
    });
    //hides the disbursement_bubble_rollover div
    $(".disbursement_bubble").on('mouseout',function(){
        $('div.disbursement_bubble_rollover', this).toggle();
    });
    //Click Functionality for the bubble divs
    $(".disbursement_bubble").click(function(){
        var newSize = 500;//new size of circle
        var dTime = 500; //duration time for the animation
        var thisClass = $(this).hasClass('statsOffshore') ? 'statsOffshore' : 'statsOnshore';//Figures out if the bubble is offshore or onshore
        var thisContentDiv = $('div.disbursement_bubble_content',this);//Gets the content div of the bubble
        var thisRel = typeof( $(this).attr('rel') ) != 'undefined' ? $(this).attr('rel') : findRel($(this),thisClass,thisContentDiv.html(), where_stats_data);//gets rel attribute of bubble, sets if not found
        
        //This checks the json object for Img3 to determine which object variables to access.
        //There is probably a better way of doing this.
        var thisDetail = where_stats_data[thisClass][thisRel]['Content']['Img3'] ? 
                            where_stats_data[thisClass][thisRel]['Content']+
                            where_stats_data[thisClass][thisRel]['Img1']+
                            where_stats_data[thisClass][thisRel]['Img2']+
                            where_stats_data[thisClass][thisRel]['Img3'] 
                            :
                            where_stats_data[thisClass][thisRel]['Content']+
                            where_stats_data[thisClass][thisRel]['Img1']+
                            where_stats_data[thisClass][thisRel]['Img1Cap']+
                            where_stats_data[thisClass][thisRel]['Img2']+
                            where_stats_data[thisClass][thisRel]['Img2Cap'];

        var thisName = where_stats_data[thisClass][thisRel]['Title'];//Get the name of the bubble, IE the text for the content div when the bubble is shrunk
        
        //setting a special attribute called prevSize so I can reset the bubble to its original side without accessing the data again
        if (!$(this).attr('prevSize'))
            $(this).attr('prevSize', $(this).width());

        //This is called to shrink all the other bubbles when a different bubble is clicked. So you don't end up with multiple expanded bubbles
        $(this).siblings(".disbursement_bubble").each(function(){
            if ($(this).attr('prevSize'))
            {
                $('div.disbursement_bubble_content',this).html(where_stats_data[thisClass][$(this).attr('rel')]['Title']);
                $(this).animate(
                {
                    width: $(this).attr('prevSize'),
                    height: $(this).attr('prevSize')
                },
                {
                    duration: dTime,
                    complete: function(){

                    }
                })
            }
        })

        //The size isn't exactly the new size because of padding and margin, add some buffer (-10) and grow it to the new size with an animate call
        if ($(this).width() < newSize-10)//Grow bubble on click
        {
            $(this).animate(
            {
                width: newSize,
                height: newSize,
            }, 
            {
                duration: dTime,
                complete: function(){
                   thisContentDiv.html(thisDetail)//after the animation is done, insert the new text into the content div
                }
            })
        }
        else//Shrink clicked bubble 
        {
            thisContentDiv.html(thisName)
            $(this).animate(
            {
                width: $(this).attr('prevSize'),
                height:$(this).attr('prevSize'),   
            },
            {
                duration: dTime,
                complete: function(){
                   //Placeholder, may want to call another function after the animation has shrunk the bubble
                }
            });
        }
    });

});

/***************************
/Function: findRel
/Description: Finds the array position in the JSON object and sets the elements rel value to that index
***************************/
function findRel(that,thatClass,searchTerm,obj){
    rel = '';
    for (var i =0; i<obj[thatClass].length; i++)
    {
       
        if (obj[thatClass][i]['Title'] == searchTerm)
        {
            rel = i;
            i +=obj[thatClass].length;
        }
            
    }
    console.log("rel="+rel)
    that.attr('rel',rel);
    return rel;
}

//JSON content
var where_stats_data = { 
    //More info on click 
    "statsOffshore" : [ 
        //Remember that the count starts at zero 
        //NOTE: img links are currently hard coded to gh pages site -- fix later -- figure out how to make these relative given that Jekyll won't parse JS files and so can't use {{ site.url }} 
        { 
            //Array ID -> 0 
            "Title" : "U.S. Treasury", 
            "Content" : "Some offshore revenue goes into the U.S. General Fund, which is the same place that money from individual and corporate income taxes go. The General Fund pays for roughly two-thirds of all federal expenditures, including:", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\"><h3>U.S. Military</h3>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\"><h3>U.S. Parks</h3>",
            "Img3" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_1567.svg\" alt=\"Book and test tube\"><h3>U.S. Schools</h3>"
        }, 
        {   
            //Array ID -> 1 
            "Title" : "States", 
            "Content" : "Offshore revenues go to states in several different ways. If the revenues are from leases the 8(g) region, they go straight to states. If they are in the GOMESA region, some of these funds go directly to 'Coastal Political Subdivions' such as counties and parishes. It is up to the county, parish or state to decide how to use the revenues.", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_4572.svg\" alt=\"Dogtags\"><h3><a href=\"http\://statistics.onrr.gov/PDF/FAQs.pdf\">Learn about 8(g) &#8594;</a></h3>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_8676.svg\" alt=\"Coast\"><h3><a href=\"http\://www.boem.gov/Oil-and-Gas-Energy-Program/Energy-Economics/Revenue-Sharing/Index.aspx\">Learn about GOMESA &#8594;</a></h3>",
            "Img3" : "<h3></h3>"
        }, 
        {   
            //Array ID -> 2
            "Title" : "Historic Preservation Fund", 
            "Content" : "The <a href=\"http\://www.nps.gov/history/hpg/\">Historic Preservation Fund</a> helps preserve U.S. historical and archaeological sites and cultural heritage through grants to State and Tribal Historic Preservation Offices. Some examples of activities include:", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_1566.svg\" alt=\"City buildings\"><h3><a href=\"http\://www.michiganmodern.org/\">Survey Modernist Architecture, Michigan</a></h3>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_10119.svg\" alt=\"Schoolhouse\"><h3><a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">Restore Peoria Schoolhouse, Peoria Tribe of Indians, Oklahoma</a></h3>",
            "Img3" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_7038.svg\" alt=\"Video camera\"><h3><a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">Document Yup’ik Songs & Dances, Calista Elders Council of Alaska</a></h3>"
        },
        {   
            //Array ID -> 3
            "Title" : "Land &amp; Water Conservation Fund", 
            "Content" : "The <a href=\"http\://www.nps.gov/lwcf/\">Land & Water Conservation Fund</a> program provides matching grants to states and local governments for the acquisition and development of public outdoor recreation areas. </p><p>Here are a few places that were funded by LWCF grants:", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_16251.svg\" alt=\"Mountains\"><h3><a href=\"http\://www.emnrd.state.nm.us/SPD/eaglenestlakestatepark.html\">Eagle Nest Lake State Park, New Mexico</a></h3>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_26235.svg\" alt=\"Playground\"><h3><a href=\"http\://www.mitchellparkdc.org/history.html\">Mitchell Park, District of Columbia</a></h3>",
            "Img3" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_25079.svg\" alt=\"Baseball field\"><h3><a href=\"http\://www.ofallon.org/parks/pages/family-sports-park\">Family Sports Park, Illinois</a></h3>"
        },
        {   
            //Array ID -> 2
            "Title" : "BOEM/BSEE", 
            "Content" : "The <a href=\"http\://www.nps.gov/history/hpg/\">Historic Preservation Fund</a> helps preserve U.S. historical and archaeological sites and cultural heritage through grants to State and Tribal Historic Preservation Offices. Some examples of activities include:", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_1566.svg\" alt=\"City buildings\"><h3><a href=\"http\://www.michiganmodern.org/\">Survey Modernist Architecture, Michigan</a></h3>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_10119.svg\" alt=\"Schoolhouse\"><h3><a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">Restore Peoria Schoolhouse, Peoria Tribe of Indians, Oklahoma</a></h3>",
            "Img3" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_7038.svg\" alt=\"Video camera\"><h3><a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">Document Yup’ik Songs & Dances, Calista Elders Council of Alaska</a></h3>"
        }, 
    ],

    "statsOnshore" : [ 
        //Remember that the count starts at zero 
        //NOTE: img links are currently hard coded to gh pages site -- fix later -- figure out how to make these relative given that Jekyll won't parse JS files and so can't use {{ site.url }} 
        { 
            //Array ID -> 0 
            "Title" : "States", 
            "Content" : "The state share of onshore revenues go to two different places. Revenue from geothermal resources goes directly to counties. The rest goes to states. It's up to each county and state to decide how to use the revenue.", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_2070.svg\" alt=\"Geothermal energy plant\">", 
            "Img1Cap" : "<h3>Geothermal Energy Revenues</h3><p>...go directly to counties</p>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_38222.svg\" alt=\"U.S. States\">", 
            "Img2Cap" : "<h3>Other Resource Revenues</h3><p>...go to states</p>"
        }, 
        {   
            //Array ID -> 1 
            "Title" : "Reclamation Fund", 
            "Content" : "The Reclamation Fund is a special fund established by the United States Congress under the Reclamation Act of 1902 to pay for Bureau of Reclamation projects. </p><p>What does this help pay for?", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_18711.svg\" alt=\"Farm\">",
            "Img1Cap" : "<h3>Irrigation water</h3><p> for 10 million acres of farmland</p>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_265.svg\" alt=\"Dam\">", 
            "Img2Cap" : "<h3>Hydroelectric power</h3><p> for XYZ number of people</p>"
        }, 
        {   
            //Array ID -> 2
            "Title" : "U.S. Treasury", 
            "Content" : "10% of onshore revenue goes into the U.S. General Fund, which is the same place that money from individual and corporate income taxes go. The General Fund pays for roughly two-thirds of all federal expenditures, including:", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\">",
            "Img1Cap" : "<h3>U.S. Military</h3>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\">",
            "Img2Cap" : "<h3>U.S. Parks</h3>"
        },
        {   
            //Array ID -> 2
            "Title" : "American Indian Tribes", 
            "Content" : "10% of onshore revenue goes into the U.S. General Fund, which is the same place that money from individual and corporate income taxes go. The General Fund pays for roughly two-thirds of all federal expenditures, including:", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\">",
            "Img1Cap" : "<h3>U.S. Military</h3>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\">",
            "Img2Cap" : "<h3>U.S. Parks</h3>"
        },
        {   
            //Array ID -> 2
            "Title" : "Other Funds", 
            "Content" : "10% of onshore revenue goes into the U.S. General Fund, which is the same place that money from individual and corporate income taxes go. The General Fund pays for roughly two-thirds of all federal expenditures, including:", 
            "Img1" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\">",
            "Img1Cap" : "<h3>U.S. Military</h3>",
            "Img2" : "<img src=\"http://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\">",
            "Img2Cap" : "<h3>U.S. Parks</h3>"
        }
    ]  
}


