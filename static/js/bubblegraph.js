var diameter = 760,
    format = d3.format(",d"),
    color = d3.scale.category20c()
    color_offshore = "#3397C2"
    color_onshore = "#9FA730";
var bubbles = [];

bubbles['2012'] = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter-300])
        .padding(1.5);
bubbles['2013'] = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter-300])
        .padding(1.5);
bubbles_svg = [];

//SVG in document is setup here
bubbles_svg['2012'] = d3.select("#disbursement_2012").append("svg")
.attr("width", diameter)
.attr("height", diameter-300)
.attr("class", "bubble");

bubbles_svg['2013'] = d3.select("#disbursement_2013").append("svg")
.attr("width", diameter)
.attr("height", diameter-300)
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
            .attr("r",function(d){return d.r; })
            .attr("fill",function(d){ if(d.shore == 'Onshore') return color_onshore; else return color_offshore;});

        //Controls text on circle    
        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { if (d.className)
                                return d.className.substring(0, d.r / 3);
                                else 
                                {
                                    console.log(d)
                                    return "No name";
                                } 
                            });    
    }
    $("section.bubbles svg text").tipsy({ 
        gravity: 'n', 
        html: true, 
        trigger: "manual",
        opacity:"1.0",
        offset:20,
        title: function() {
          var rev = text_money(this.__data__.value);
          var year = this.__data__.year;
          var shore = this.__data__.shore;
          return '<h3>'+rev+'</h3>'+
            '<p>'+year+ ' '+shore+' revenue,<br />helped fund</p><div id="disbursement_content"><div class="sub">'+
            where_stats_data[shore][this.__data__.className].images +'</div>'+
            '<div class="full" style="display:none;">'+
            where_stats_data[shore][this.__data__.className].content +'</div>'+
            '</div>'+
            '<p><a href="javascript:" id="disbursement_link">Show More</a></p>'; 
        }
      });

    $("section.bubbles svg circle").on("mouseover",function(){
        $('section.bubbles svg text').each(function(){
            $(this).tipsy('hide');
        });
        $(this).siblings('text').tipsy('show');
        var that = $(this).siblings('text');
        $('a#disbursement_link').click(function(){
            $(this).html(function(){
                var n = $(this).html() == "Show More" ?  "Show Less" : "Show More";
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
        "Offshore": {
            //Remember that the count starts at zero
            //NOTE: img links are currently hard coded to gh pages site -- fix later -- figure out how to make these relative given that Jekyll won't parse JS files and so can't use {{ site.url }}
            
                //Array ID -> 0
                "U.S. Treasury" : {
                    content : "<div class=\"disbursement_bubble_details\" style=\"padding-top: 20px;\"><h1>U.S. Treasury</h1><p>Some offshore revenue goes into the <a href=\"http://www.gasb.org/cs/ContentServer?pagename=GASB/GASBContent_C/UsersArticlePage&cid=1176156735732\">U.S. General Fund</a>, which is the same place that money from individual and corporate income taxes go. A general fund is a government's basic operating fund and accounts for everything not accounted for in another fund. The U.S. General Fund pays for roughly two-thirds of all federal expenditures, including:</p><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\"><h2>U.S. Military</h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\"><h2>U.S. Parks</h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1567.svg\" alt=\"Book and test tube\"><h2>U.S. Schools</h2></div></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1567.svg\" alt=\"Book and test tube\">"
                } 
            , 
                //Array ID -> 1
                "States" : {
                    content : "<div class=\"disbursement_bubble_details\" style=\"padding-top: 20px;\"><h1>States</h1><p>Offshore revenues go to states in several different ways. If the revenues are from leases the <a href=\"http\://statistics.onrr.gov/PDF/FAQs.pdf\">8(g) region</a>, they go straight to states. If they are in the <a href=\"http\://www.boem.gov/Oil-and-Gas-Energy-Program/Energy-Economics/Revenue-Sharing/Index.aspx\">GOMESA region</a>, some of these funds go directly to 'Coastal Political Subdivions' such as counties and parishes. It is up to the county, parish or state to decide how to use the revenues.</p><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_4572.svg\" alt=\"Offshore oil rig\"><h2><a href=\"http\://statistics.onrr.gov/PDF/FAQs.pdf\">Learn about 8(g) &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_8676.svg\" alt=\"Coast\"><h2><a href=\"http\://www.boem.gov/Oil-and-Gas-Energy-Program/Energy-Economics/Revenue-Sharing/Index.aspx\">Learn about GOMESA &#8594;</a></h2></div></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_4572.svg\" alt=\"Offshore oil rig\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_8676.svg\" alt=\"Coast\">"
                }
            ,
                //Array ID -> 2
                "Historic Preservation Fund" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>Historic Preservation Fund</h1><p>The <a href=\"http\://www.nps.gov/history/hpg/\">Historic Preservation Fund</a> helps preserve U.S. historical and archaeological sites and cultural heritage through grants to State and Tribal Historic Preservation Offices. Some examples of activities include:</p><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1566.svg\" alt=\"City buildings\"><h2><a href=\"http\://www.michiganmodern.org/\">Survey Modernist Architecture, Michigan &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_10119.svg\" alt=\"Schoolhouse\"><h2><a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">Restore Peoria Schoolhouse, Peoria Tribe of Indians, Oklahoma &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_7038.svg\" alt=\"Video camera\"><h2><a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">Document Yup’ik Songs & Dances, Calista Elders Council of Alaska &#8594;</a></h2></div></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1566.svg\" alt=\"City buildings\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_10119.svg\" alt=\"Schoolhouse\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_7038.svg\" alt=\"Video camera\">"
                }
            ,
                //Array ID -> 3
                "Land & Water Conservation Fund" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>Land &amp; Water Conservation Fund</h1><p>The <a href=\"http\://www.nps.gov/lwcf/\">Land & Water Conservation Fund</a> provides matching grants to states and local governments to buy and develop public outdoor recreation areas. It has supported projects in all 50 states and U.S. territories, creating community parks and trails and protecting clean water sources. Here are a few places that were funded by the LWCF:</p><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_16251.svg\" alt=\"Mountains\"><h2><a href=\"http\://www.emnrd.state.nm.us/SPD/eaglenestlakestatepark.html\">Eagle Nest Lake State Park, New Mexico &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_26235.svg\" alt=\"Playground\"><h2><a href=\"http\://www.mitchellparkdc.org/history.html\">Mitchell Park, District of Columbia &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_25079.svg\" alt=\"Baseball field\"><h2><a href=\"http\://www.ofallon.org/parks/pages/family-sports-park\">Family Sports Park, Illinois &#8594;</a></h2></div></div>"
                    ,
                    images :"<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_16251.svg\" alt=\"Mountains\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_26235.svg\" alt=\"Playground\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_25079.svg\" alt=\"Baseball field\">"
            }   
            ,
                //Array ID -> 2
                "Other Funds" : {
                    content : "<div class=\"disbursement_bubble_details\" style=\"padding-top: 20px;\"><h1>Other Funds</h1><p>Some revenue from offshore locations returns to the Federal agency that manages the area.</p><div class=\"disbursement_bubble_details_images\"><h2><a href=\"http://www.boem.gov/\">Bureau of Ocean Energy Management &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><h2><a href=\"http://www.bsee.gov/\">Bureau of Safety and Environmental Enforcement &#8594;</a></h2></div></div>"
                    ,
                    images : ""
                }
            
        },

        "Onshore": {
            //Remember that the count starts at zero
            //NOTE: img links are currently hard coded to gh pages site -- fix later -- figure out how to make these relative given that Jekyll won't parse JS files and so can't use {{ site.url }}
            
                //Array ID -> 0
                "States" : {
                    content : "<div class=\"disbursement_bubble_details\"><h1>States</h1><p>The state share of onshore revenues mostly go directly to states, with percentages going to several other funds and state entities. For example, some revenue from geothermal resources goes directly to counties; some revenue from Federal land management agencies returns to each; some is used for flood control. It's up to each county and state to decide how to use the revenue.</p><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_2070.svg\" alt=\"Geothermal energy plant\"><h2><a href=\"http://www.blm.gov/wo/st/en/prog/energy/geothermal.html\">Some geothermal energy revenues go directly to counties &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_38222.svg\" alt=\"U.S. States\"><h2><a href=\"http://statistics.onrr.gov/\">Other resource revenues go to states &#8594;</a></h2></div></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_2070.svg\" alt=\"Geothermal energy plant\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_38222.svg\" alt=\"U.S. States\">"
                }
            , 
                //Array ID -> 1
                "Reclamation Fund" : {
                    content : "<div class=\"disbursement_bubble_details\" style=\"padding-top: 20px;\"><h1>Reclamation Fund</h1><p><a href=\"http://www.nps.gov/nr/travel/ReclamationDamsAndWaterProjects/Mission_of_the_Bureau_of_Reclamation.html\">The Reclamation Fund</a> is a special fund established by the United States Congress under the Reclamation Act of 1902 to pay for Bureau of Reclamation projects. The Bureau of Reclamation is best known for its dams and power plants which provide:</p><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_18711.svg\" alt=\"Farm\"><h2><a href=\"http://www.usbr.gov/facts.html\">Irrigation water for 10 million acres of farmland &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_265.svg\" alt=\"Dam\"><h2><a href=\"http://www.usbr.gov/facts.html\">40 billion kilowatt hours of energy produced from hydroelectric power &#8594;</a></h2></div></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_18711.svg\" alt=\"Farm\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_265.svg\" alt=\"Dam\">"
                }
            , 
                //Array ID -> 2
                "U.S. Treasury" : {
                    content : "<div class=\"disbursement_bubble_details\" style=\"padding-top: 20px;\"><h1>U.S. Treasury</h1><p>Some offshore revenue goes into the <a href=\"http://www.gasb.org/cs/ContentServer?pagename=GASB/GASBContent_C/UsersArticlePage&cid=1176156735732\">U.S. General Fund</a>, which is the same place that money from individual and corporate income taxes go. A general fund is a government's basic operating fund and accounts for everything not accounted for in another fund. The U.S. General Fund pays for roughly two-thirds of all federal expenditures, including:</p><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\"><h2>U.S. Military</h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\"><h2>U.S. Parks</h2></div><div class=\"disbursement_bubble_details_images\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1567.svg\" alt=\"Book and test tube\"><h2>U.S. Schools</h2></div></div>"
                    ,
                    images : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\"><img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1567.svg\" alt=\"Book and test tube\">"
                }
            , 
                //Array ID -> 2
                "American Indian Tribes" : {
                    content : "<div class=\"disbursement_bubble_details\" style=\"padding-top: 20px;\"><h1>American Indian Tribes</h1><p>Information coming soon!</p></div>"
                    ,
                    images : ""
                }
            , 
                //Array ID -> 2
                "Other Funds" : {
                    content : "<div class=\"disbursement_bubble_details\" style=\"padding-top: 20px;\"><h1>Other Funds</h1><p>Some revenue from onshore locations returns to the Federal agency that manages the land. In addition, $50 million dollars each go to two legislated funds, the <a href=\"http://energy.gov/fe/science-innovation/oil-gas/ultra-deepwater-and-unconventional-natural-gas-and-other-petroleum\">Ultra-Deepwater Research Program</a> and the <a href=\"http://www.bia.gov/WhoWeAre/RegionalOffices/Navajo/What/index.htm\">Mescal Settlement Agreement</a>.</p><div class=\"disbursement_bubble_details_images\"><h2><a href=\"http://www.blm.gov/\">Bureau of Land Management &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><h2><a href=\"http://www.fws.gov/\">U.S. Fish & Wildlife Service &#8594;</a></h2></div><div class=\"disbursement_bubble_details_images\"><h2><a href=\"http://www.fs.fed.us/\">U.S. Forest Service &#8594;</a></h2></div></div>"
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
        });
    });
});

