//Javascript and JSON for 'where does the money go' rollover tree map

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
			"Img1" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\"><h3>U.S. Military</h3>",
			"Img2" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\"><h3>U.S. Parks</h3>",
			"Img3" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1567.svg\" alt=\"Book and test tube\"><h3>U.S. Schools</h3>"
		},
		{
			//Array ID -> 1
			"Title" : "States",
			"Content" : "Offshore revenues go to states in several different ways. If the revenues are from leases the 8(g) region, they go straight to states. If they are in the GOMESA region, some of these funds go directly to 'Coastal Political Subdivions' such as counties and parishes. It is up to the county, parish or state to decide how to use the revenues.",
			"Img1" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_4572.svg\" alt=\"Dogtags\"><h3><a href=\"http\://statistics.onrr.gov/PDF/FAQs.pdf\">Learn about 8(g) &#8594;</a></h3>",
			"Img2" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_8676.svg\" alt=\"Coast\"><h3><a href=\"http\://www.boem.gov/Oil-and-Gas-Energy-Program/Energy-Economics/Revenue-Sharing/Index.aspx\">Learn about GOMESA &#8594;</a></h3>",
			"Img3" : "<h3></h3>"
		},
		{
			//Array ID -> 2
			"Title" : "Historic Preservation Fund",
			"Content" : "The <a href=\"http\://www.nps.gov/history/hpg/\">Historic Preservation Fund</a> helps preserve U.S. historical and archaeological sites and cultural heritage through grants to State and Tribal Historic Preservation Offices. Some examples of activities include:",
			"Img1" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1566.svg\" alt=\"City buildings\"><h3><a href=\"http\://www.michiganmodern.org/\">Survey Modernist Architecture, Michigan</a></h3>",
			"Img2" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_10119.svg\" alt=\"Schoolhouse\"><h3><a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">Restore Peoria Schoolhouse, Peoria Tribe of Indians, Oklahoma</a></h3>",
			"Img3" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_7038.svg\" alt=\"Video camera\"><h3><a href=\"http\://ncptt.nps.gov/blog/tribal-heritage-grants/\">Document Yup’ik Songs & Dances, Calista Elders Council of Alaska</a></h3>"
		},
		{
			//Array ID -> 3
			"Title" : "Land & Water Conservation Fund",
			"Content" : "The <a href=\"http\://www.nps.gov/lwcf/\">Land & Water Conservation Fund</a> program provides matching grants to states and local governments for the acquisition and development of public outdoor recreation areas. </p><p>Here are a few places that were funded by LWCF grants:",
			"Img1" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_16251.svg\" alt=\"Mountains\"><h3><a href=\"http\://www.emnrd.state.nm.us/SPD/eaglenestlakestatepark.html\">Eagle Nest Lake State Park, New Mexico</a></h3>",
			"Img2" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_26235.svg\" alt=\"Playground\"><h3><a href=\"http\://www.mitchellparkdc.org/history.html\">Mitchell Park, District of Columbia</a></h3>",
			"Img3" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_25079.svg\" alt=\"Baseball field\"><h3><a href=\"http\://www.ofallon.org/parks/pages/family-sports-park\">Family Sports Park, Illinois</a></h3>"
		},
	],

	"statsOnshore" : [
		//Remember that the count starts at zero
		//NOTE: img links are currently hard coded to gh pages site -- fix later -- figure out how to make these relative given that Jekyll won't parse JS files and so can't use {{ site.url }}
		{
			//Array ID -> 0
			"Title" : "States",
			"Content" : "The state share of onshore revenues go to two different places. Revenue from geothermal resources goes directly to counties. The rest goes to states. It's up to each county and state to decide how to use the revenue.",
			"Img1" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_2070.svg\" alt=\"Geothermal energy plant\">",
			"Img1Cap" : "<h3>Geothermal Energy Revenues</h3><p>...go directly to counties</p>",
			"Img2" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_38222.svg\" alt=\"U.S. States\">",
			"Img2Cap" : "<h3>Other Resource Revenues</h3><p>...go to states</p>"
		},
		{
			//Array ID -> 1
			"Title" : "Reclamation Fund",
			"Content" : "The Reclamation Fund is a special fund established by the United States Congress under the Reclamation Act of 1902 to pay for Bureau of Reclamation projects. </p><p>What does this help pay for?",
			"Img1" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_18711.svg\" alt=\"Farm\">",
			"Img1Cap" : "<h3>Irrigation water</h3><p> for 10 million acres of farmland</p>",
			"Img2" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_265.svg\" alt=\"Dam\">",
			"Img2Cap" : "<h3>Hydroelectric power</h3><p> for XYZ number of people</p>"
		},
		{
			//Array ID -> 2
			"Title" : "U.S. Treasury",
			"Content" : "10% of onshore revenue goes into the U.S. General Fund, which is the same place that money from individual and corporate income taxes go. The General Fund pays for roughly two-thirds of all federal expenditures, including:",
			"Img1" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_1397.svg\" alt=\"Dogtags\">",
			"Img1Cap" : "<h3>U.S. Military</h3>",
			"Img2" : "<img src=\"https://meiqimichelle.github.io/d3-minihack/assets/img/icon_13130.svg\" alt=\"Park\">",
			"Img2Cap" : "<h3>U.S. Parks</h3>"
		},
	]
}


//Javascript for switching out the content depending on hover location
//Thanks to http://www.webappers.com/2009/07/13/create-a-content-rich-tooltip-with-json-and-jquery/
$(document).ready(function() {
	$('.stats-offshore > div').click(function(){

			//Get the ID of the current click div
			active_square = $(this).attr('rel');

			//Replace the HTML in the header with data from JSON array
			$('#offshore h2').html(where_stats_data.statsOffshore[active_square].Title);
			$('#offshore p').html(where_stats_data.statsOffshore[active_square].Content);
			$('#payimgs-off div:nth-child(1)').html(where_stats_data.statsOffshore[active_square].Img1);
			$('#payimgs-off div:nth-child(2)').html(where_stats_data.statsOffshore[active_square].Img2);
			$('#payimgs-off div:nth-child(3)').html(where_stats_data.statsOffshore[active_square].Img3);

		})
	$('.stats-onshore > div').click(function(){

			//Get the ID of the current click div
			active_square = $(this).attr('rel');

			//Replace the HTML in the header with data from JSON array
			$('#onshore h2').html(where_stats_data.statsOnshore[active_square].Title);
			$('#onshore p').html(where_stats_data.statsOnshore[active_square].Content);
			$('#payimgs-on1 div:nth-child(1)').html(where_stats_data.statsOnshore[active_square].Img1);
			$('#payimgs-on1 div:nth-child(2)').html(where_stats_data.statsOnshore[active_square].Img1Cap);
			$('#payimgs-on2 div:nth-child(1)').html(where_stats_data.statsOnshore[active_square].Img2Cap);
			$('#payimgs-on2 div:nth-child(2)').html(where_stats_data.statsOnshore[active_square].Img2);

		})
});