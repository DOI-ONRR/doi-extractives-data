/***********************************************
Random Helper function for formating
************************************************/
var insertLinebreaks = function (d) {
            var el = d3.select(this);
            var words = d.className.replace('Funds','').replace('Fund','').split(' ');
            el.text('');

            for (var i = 0; i < words.length; i++) {
                var tspan = el.append('tspan').text(words[i]);
                if (i > 0)
                    tspan.attr('x', 0).attr('dy', '15');
            }
        }; 
/***********************************************
***********************************************/

var diameter = 620,
    format = d3.format(",d"),
    color = d3.scale.category20c()
    color_offshore = "#3397c2"
    color_onshore = "#9fa731";
var bubbles = [];

bubbles['2012'] = d3.layout.pack()
        .sort(d3.ascending)
        .size([diameter-15, diameter-15])
        .padding(25);
bubbles['2013'] = d3.layout.pack()
        .sort(d3.ascending)
        .size([diameter-15, diameter-15])
        .padding(25);
bubbles_svg = [];

//SVG in document is setup here
bubbles_svg['2012'] = d3.select("#disbursement_2012").append("svg")
.attr("width", diameter-15)
.attr("height", diameter-15)
.attr("class", "bubble");

bubbles_svg['2013'] = d3.select("#disbursement_2013").append("svg")
.attr("width", diameter-15)
.attr("height", diameter-15)
.attr("class", "bubble");

d3.json("static/data/disbursement-summary-data.json",function(error,root){
    for (var k in bubbles)
    {
        var node = bubbles_svg[k].selectAll(".node")
        .data(bubbles[k].nodes(classes(root,k))
            .filter(function(d) { return !d.children; }))
        .enter().append("g")
        .attr("class","node")
        .attr("transform",function(d){ return "translate(" + d.x + "," + d.y + ")"; });
        console.log(color_onshore);
        node.append("circle")
            .attr("r",function(d)
                {
                    //Adjusting the bubble size to at least the size of the largest word. 
                    var words = d.className.split(' ');
                    var maxLegnth=0;
                    for(var i=0;i<words.length;i++)
                    {
                        if (maxLegnth < words[i].length)
                            maxLegnth = words[i].length;
                    }
                    if (maxLegnth*4 > d.r)
                        return maxLegnth*4;
                    else 
                        return d.r; 
                })
            .attr("fill",function(d){ if(d.shore == 'onshore') return color_onshore; else return color_offshore;})
            .attr("stroke",function(d){ if(d.shore == 'onshore') return color_onshore; else return color_offshore;})
            .attr("stroke-width","3");

        //Controls text on circle    
        node.append("text")
            .attr("dy", ".2em")
            .attr("x", "0")
            .attr("y", "0")
            .attr("fill", "#ffffff")
            .style("text-anchor", "middle")
            .style("pointer-events","none")
            .style("font-weight", "300")
            .attr('data-id',function(d){
                return d.className+d.shore+d.year;
            })
            .text(function(d) { 
                    return d.className.replace('Funds','').replace('Fund','');//.substring(0, d.r / 4); 
            });
        node.selectAll("g text").each(insertLinebreaks);
    }
    $("section.bubbles svg text").tipsy({ 
        gravity: 'w', 
        html: true, 
        trigger: "manual",
        opacity:"1.0",
        offset:20,
        title: function() {
          var rev = text_money(this.__data__.value,'monetary_amount');
          var year = this.__data__.year;
          var shore = this.__data__.shore;
          return '<h1> $'+rev+'</h1>'+
            '<p>'+year+ ' '+shore+' revenue<br />helped fund:</p><div id="disbursement_content"><div class="sub">'+
            where_stats_data[shore][this.__data__.className].images +'</div>'+
            '<div class="full" style="display:none;">'+
            where_stats_data[shore][this.__data__.className].content +'</div>'+
            '</div>'+
            '<p class="tipsy-more"><a href="javascript:" id="disbursement_link">more <i class="fa fa-angle-down"></i></a></p>'; 
        }
      });

    $("section.bubbles svg circle").on("mouseover",function(){
        $('section.bubbles svg text').each(function(){
            $(this).tipsy('hide');
            var fill = $(this).siblings('circle').attr('fill');
            $(this).siblings('circle').attr('stroke',fill);
        });
        $(this).attr('stroke','white');
        $(this).siblings('text').tipsy('show');
        var that = $(this).siblings('text');
        $('a#disbursement_link').click(function(){
            $(this).html(function(){
                var n = $(this).html() == "more <i class=\"fa fa-angle-down\"></i>" ?  "less <i class=\"fa fa-angle-up\"></i>" : "more <i class=\"fa fa-angle-down\"></i>";
                return n;
            });
            $('#disbursement_content div.sub').toggle();
            $('#disbursement_content div.full').toggle();
        });
    });
    
    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root, year) {
      var classes = [];

      function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
        else if (node.year == year) classes.push({packageName: name, className: node.name, value: node.total, shore: node.shore, year: node.year});
      }

      recurse(null, root);
      return {children: classes};
    }
    

    d3.select(self.frameElement).style("height", diameter + "px");


    var where_stats_data = {
        //More info on click
        "offshore": {
            //Remember that the count starts at zero
            //NOTE: img links are currently hard coded to gh pages site -- fix later -- figure out how to make these relative given that Jekyll won't parse JS files and so can't use {{ site.url }}
            
                //Array ID -> 0
                "U.S. Treasury" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>U.S. Treasury</h1><p>Some offshore revenue goes into the <a href=\"http://www.gasb.org/cs/ContentServer?pagename=GASB/GASBContent_C/UsersArticlePage&cid=1176156735732\">U.S. General Fund</a>, which is the same place that money from individual and corporate income taxes go. A general fund is a government's basic operating fund and accounts for everything not accounted for in another fund. The U.S. General Fund pays for roughly two-thirds of all federal expenditures, including the U.S. military, parks and schools.</p></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1567.svg\" alt=\"Book and test tube\">"
                } 
            , 
                //Array ID -> 1
                "States" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>States</h1><p>Revenues from the offshore (outer continental shelf, or OCS) locations are shared with states in two ways. One, 27% of revenues from leases in the 8(g) zone are shared with states. The 8(g) zone is made up of the first three nautical miles of the OCS. 8(g) refers to Section 8(g) of the <a href=\"http://www.epw.senate.gov/ocsla.pdf\">Outer Continental Shelf Lands Act (OCSLA)</a>. Two, 37.5% of revenues from certain leases in the Gulf of Mexico are shared with four Gulf Coast States (Alabama, Louisiana, Mississippi, and Texas) and their Coastal Political Subdivisions (CPS), such as counties and parishes, through the <a href=\"http://www.boem.gov/Oil-and-Gas-Energy-Program/Energy-Economics/Revenue-Sharing/Index.aspx\">Gulf of Mexico Energy Security Act (GOMESA)</a>. Each state and CPS decides how to use the revenue, as long as the expenditure supports coastal protection or restoration, mitigation of damage to marine wildlife or natural resources, implementation of marine or coastal management plans, mitigation of OCS activities, or related administration costs.</p></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_4572.svg\" alt=\"Offshore oil rig\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_8676.svg\" alt=\"Coast\">"
                }
            ,
                //Array ID -> 2
                "Historic Preservation Fund" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>Historic Preservation Fund</h1><p>The <a href=\"http\://www.nps.gov/history/hpg/\">Historic Preservation Fund</a> helps preserve U.S. historical and archaeological sites and cultural heritage through grants to State and Tribal Historic Preservation Offices. Some examples of activities include a <a href=\"http\://www.michiganmodern.org/\">survey of modernist architecture</a> in Michigan, <a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">restoration of the Peoria Schoolhouse</a> by the Peoria Tribe of Indians of Oklahoma and <a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">documenting Yup’ik Songs & Dances</a> by the Calista Elders Council of Alaska.</p></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1566.svg\" alt=\"City buildings\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_10119.svg\" alt=\"Schoolhouse\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_7038.svg\" alt=\"Video camera\">"
                }
            ,
                //Array ID -> 3
                "Land & Water Conservation Fund" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>Land &amp; Water Conservation Fund</h1><p>The <a href=\"http\://www.nps.gov/lwcf/\">Land & Water Conservation Fund</a> provides matching grants to states and local governments to buy and develop public outdoor recreation areas. It has supported projects in all 50 states and U.S. territories, creating community parks and trails and protecting clean water sources. A few places that were funded by the LWCF include <a href=\"http\://www.emnrd.state.nm.us/SPD/eaglenestlakestatepark.html\">Eagle Nest Lake State Park, New Mexico</a>, <a href=\"http\://www.mitchellparkdc.org/history.html\">Mitchell Park, District of Columbia</a>, and <a href=\"http\://www.ofallon.org/parks/pages/family-sports-park\">Family Sports Park, Illinois</a>.</p></div>"
                    ,
                    images :"<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_16251.svg\" alt=\"Mountains\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_26235.svg\" alt=\"Playground\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_25079.svg\" alt=\"Baseball field\">"
            }   
            ,
                //Array ID -> 2
                "Other Funds" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>Other Funds</h1><p>Some revenue from offshore locations returns to the Federal agency that manages the area. For offshore locations, these are the <a href=\"http://www.boem.gov/\">Bureau of Ocean Energy Management</a> and the <a href=\"http://www.bsee.gov/\">Bureau of Safety and Environmental Enforcement</a>. These revenues are used to fund the operations of these agencies, and reduces the amount of Federal funding they receive from Congress.</p></div>"
                    ,
                    images : ""
                }
            
        },

        "onshore": {
            //Remember that the count starts at zero
            //NOTE: img links are currently hard coded to gh pages site -- fix later -- figure out how to make these relative given that Jekyll won't parse JS files and so can't use {{ site.url }}
            
                //Array ID -> 0
                "States" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>States</h1><p>The state share of onshore revenues mostly go directly to states, with percentages going to several other funds and state entities. For example, <a href=\"http://www.blm.gov/wo/st/en/prog/energy/geothermal.html\">some revenue from geothermal resources goes directly to counties</a>. It's up to each county and state to decide how to use the revenue.</p></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_2070.svg\" alt=\"Geothermal energy plant\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_38222.svg\" alt=\"U.S. States\">"
                }
            , 
                //Array ID -> 1
                "Reclamation Fund" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>Reclamation Fund</h1><p><a href=\"http://www.nps.gov/nr/travel/ReclamationDamsAndWaterProjects/Mission_of_the_Bureau_of_Reclamation.html\">The Reclamation Fund</a> is a special fund established by the United States Congress under the Reclamation Act of 1902 to pay for Bureau of Reclamation projects. The Bureau of Reclamation is best known for its dams and power plants which provide <a href=\"http://www.usbr.gov/facts.html\">irrigation water for 10 million acres of farmland</a> and <a href=\"http://www.usbr.gov/facts.html\">40 billion kilowatt hours of energy produced from hydroelectric power</a>.</p></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_18711.svg\" alt=\"Farm\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_265.svg\" alt=\"Dam\">"
                }
            , 
                //Array ID -> 2
                "U.S. Treasury" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>U.S. Treasury</h1><p>Some onshore revenue goes into the <a href=\"http://www.gasb.org/cs/ContentServer?pagename=GASB/GASBContent_C/UsersArticlePage&cid=1176156735732\">U.S. General Fund</a>, which is the same place that money from individual and corporate income taxes go. A general fund is a government's basic operating fund and accounts for everything not accounted for in another fund. The U.S. General Fund pays for roughly two-thirds of all federal expenditures, including the U.S. military, parks and schools.</p></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1567.svg\" alt=\"Book and test tube\">"
                }
            , 
                //Array ID -> 2
                "American Indian Tribes" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>American Indian Tribes</h1><p>The Interior Department disburses 100 percent of the revenues received for energy and mineral production activities on Indian lands directly to the Tribes and individual Indian mineral owners. Tribes then distribute the revenues among all members or apply the revenues to health care, infrastructure, education and other critical community development programs, such as senior centers, public safety projects, and youth initiatives. Many individual Indian mineral owners use these revenues as a major source of income to support their families and communities.</p></div>"
                    ,
                    images : ""
                }
            , 
                //Array ID -> 2
                "Other Funds" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>Other Funds</h1><p>Some revenue from onshore locations returns to the Federal agency that manages the land. For onshore locations, these are the <a href=\"http://www.blm.gov/\">Bureau of Land Management</a>, the <a href=\"http://www.fws.gov/\">U.S. Fish & Wildlife Service</a>, and  <a href=\"http://www.fs.fed.us/\">U.S. Forest Service</a>. These revenues are used to fund the operations of these agencies, and reduces the amount of Federal funding they receive from Congress. In addition, $50 million dollars each go to two legislated funds, the <a href=\"http://energy.gov/fe/science-innovation/oil-gas/ultra-deepwater-and-unconventional-natural-gas-and-other-petroleum\">Ultra-Deepwater Research Program</a> and the <a href=\"http://www.bia.gov/WhoWeAre/RegionalOffices/Navajo/What/index.htm\">Mescal Settlement Agreement</a>.</p></div>"
                    ,
                    images : ""
                }
            }
        
    };
});

//Setup onclick for year tabs
$(document).ready(function(){
    $('div.bubble_tabs a').each(function(){
        $(this).click(function(){
            $('section.bubbles svg text').each(function(){
                $(this).tipsy('hide');
            });
            if(!$(this).hasClass('active'))
                $(this).addClass('active');
            $(this).siblings('a').removeClass('active');
        });
    });
});

