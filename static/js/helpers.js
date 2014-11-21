//https://docs.google.com/spreadsheet/pub?key=0AjPWVMj9wWa6dGw3b1c3ZHRSMW92UTJlNXRLTXZ0RUE&single=true&gid=0&output=csv
function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
};

function clean_monetary_float (f){
	f = f.replace(/,/g , '');
	f= f.replace('(','-');
	f=f.replace(')','');
	return parseFloat(f.replace("$",""));
}

Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

 String.prototype.capitalize = function(){
 	return this.charAt(0).toUpperCase() + this.slice(1);
 }

function text_money(f,c){
	f = parseFloat(f);
	var s = f.formatMoney(2,'.',',');
	var t;
	if (s.length>19)//trillion
	{
		t="trillion"
	}
	else if (s.length>15)//Billions
	{
		t="billion"
	}
	else if (s.length>11)//Millions
	{
		t="million"
	}
	else if (s.length>7)//Thousands
	{
		t="thousand"
	}
	s=s.substring(0,s.search(',')+2);
	s=s.replace(",",".");
	if (c)
		return s+=" <span class='"+c + "'>"+t+"</span>";
	return s+=" "+t;
}

function sort_dataTable(dataTable, dataField, that)
{
	dataTable.sortBy(function(d){return d[dataField]});
	if (dataTable.order() == d3.ascending)
		dataTable.order(d3.descending);
	else
		dataTable.order(d3.ascending);
	dc.redrawAll();
	graphCustomizations();
}

function text_filter(dim,q){
	var re = new RegExp(q,"i")
	if (q != '') {
    dim.filter(function(d) {
        return 0 == d.search(re);
    });
	} else {
	    dim.filterAll();
	}

	draw_totals_table();
	dc.redrawAll();
	graphCustomizations();
}

function update_graph_options(elem,dimension){
	var a=[];
	elem.each(function(){
		if ($(this).is(':checked')){
			a.push($(this).val());
		}
	});
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

function download_data(dimension){
	var f=eval(dimension);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	f.reverse();
	//print_filter(f);
	//console.log(f[0]["Company Name"]);
	var keys = Object.keys(f[0]);
	if (keys.indexOf('')>-1)
		keys.splice(keys.indexOf('',1));
	if (keys.indexOf('undefined')>-1)
		keys.splice(keys.indexOf('undefined',1));
	if (keys.indexOf(' ')>-1)
		keys.splice(keys.indexOf(' ',1));
	//var csv="data:text/csv;charset=utf-8,";
	var csv ='';
	for (var i=0;i<keys.length;i++)
	{
			csv +=keys[i]+",";
	}

	csv += "\n";

	f.forEach(function(d){
		for (var n=0; n<keys.length;n++)
			csv += d[keys[n]]+",";
		csv+="\n";
	});
	var encodeUri = encodeURI(csv);
	var link=document.createElement("a");
	var blob = new Blob([csv],{type: 'text/csv;charset=utf-8'});
	var url = URL.createObjectURL(blob);
	link.href = url;
	link.setAttribute('download','filteredData.csv');
	link.click();
}

function download_map_data(data){
	data = alphabitizeGeoJson(data);
	var csv='Name,Coal,Gas,Oil,Other,Wind,Geothermal,Active Leases,Total Leases,\n';
	for (var i = 0; i<data.length; i++)
	{
		if (!data[i].hasOwnProperty('features'))
			continue;
		var featuresArray = data[i].features;
		for(var n = 0; n<featuresArray.length; n++)
		{
			if (featuresArray[n].hasOwnProperty('properties'))
				var obj=featuresArray[n].properties;
			else
				continue;
			var propArray = [];
			if (obj.name)
			{
				propArray.push(obj.name);
			}
			else
				propArray.push('');
			if(obj.hasOwnProperty('commodities'))
			{
				if(obj.commodities.hasOwnProperty('coal'))
					propArray.push(obj.commodities.coal.revenue);
				else
					propArray.push('');

				if(obj.commodities.gas)
					propArray.push(obj.commodities.gas.revenue);
				else
					propArray.push('');

				if(obj.commodities.oil)
					propArray.push(obj.commodities.oil.revenue);
				else
					propArray.push('');

				if(obj.commodities.other)
					propArray.push(obj.commodities.other.revenue);
				else
					propArray.push('');

				if(obj.commodities.wind)
					propArray.push(obj.commodities.wind.revenue);
				else
					propArray.push('');

				if(obj.commodities.geothermal)
					propArray.push(obj.commodities.geothermal.revenue);
				else
					propArray.push('');
			}
			else
				propArray.push('','','','','','')
			if(obj.hasOwnProperty('leases'))
			{
				if(obj.leases.active)
					propArray.push(obj.leases.active)
				else
					propArray.push('')
				if(obj.leases.total)
					propArray.push(obj.leases.total)
				else
					propArray.push('')
			}
			else
				propArray.push('','');

			for (var x = 0; x<propArray.length; x++)
			{
				csv+=propArray[x]+',';
			}
			csv+='\n';
		}
	}
	var encodeUri = encodeURI(csv);
	var link=document.createElement("a");
	var blob = new Blob([csv],{type: 'text/csv;charset=utf-8'});
	var url = URL.createObjectURL(blob);
	link.href = url;
	link.setAttribute('download','eiti_map_data.csv');
	link.click();

}

function draw_totals_table(){
	var jsonData =[];//will hold the new data structure

	//Create a new JSON Object with just the data currently filtered on companyDimension
	var tempData = companyDimension.top(Infinity);
	//Put this new JSON object in a crossfilter
	var tdx = crossfilter(tempData);
	var d = tdx.dimension(function(d){
		return d["Company Name"];
	});
	//Reduce this demension down to get a total some
	var g = d.group().reduceSum(function(d){
		return d["Revenue"]
	});
	//Get the data from the new group and assign to d
	var d = g.top(Infinity);

	//Take JSON in d and put in jsonData with new structure for ease of use
	d.forEach(function(d){
		if (d.value != 0)
			jsonData.push({"Company Name" : d.key, "Total Revenue" : d.value});
	});

	//Add jsonData to a crossfilter
	var jdx = crossfilter(jsonData);
	//Set dimension to Company Name
    var jdxDimension = jdx.dimension(function(d){
        return d["Company Name"];
    });
    //Render table
    dashTotalsTable.width(800).height(800)
        .dimension(jdxDimension)
        .group(function(d) {
            return "List of all Selected Companies Total Revenue";
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
                function(d){return "$"+parseFloat(d["Total Revenue"]).formatMoney(0,'.',',');}
            ]);
}

function toggle_divs(that, div1, div2, linkText1, linkText2){
	$(div1).toggle();
	$(div2).toggle();
	if ($(that).html()==linkText1)
		$(that).html(linkText2);
	else
		$(that).html(linkText1)
}


/********************************************************************************
From:
https://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
Used to get url paramaters
********************************************************************************/
var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  query = query.replace(/%20/g, ' ')
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
    return query_string;
} ();

/***********************************************************************************************
From: https://stackoverflow.com/questions/8732401/how-to-figure-out-all-colors-in-a-gradient
***********************************************************************************************/

function makeGradientColor(color1, color2, percent) {
    if (color1.search('#')!= -1)
    	color1 = hexToRGB(color1);
    if (color2.search('#')!=-1)
    	color2 = hexToRGB(color2);
    var newColor = {};

    function makeChannel(a, b) {
        return(a + Math.round((b-a)*(percent/100)));
    }

    function makeColorPiece(num) {
        num = Math.min(num, 255);   // not more than 255
        num = Math.max(num, 0);     // not less than 0
        var str = num.toString(16);
        if (str.length < 2) {
            str = "0" + str;
        }
        return(str);
    }

    newColor.r = makeChannel(color1.r, color2.r);
    newColor.g = makeChannel(color1.g, color2.g);
    newColor.b = makeChannel(color1.b, color2.b);
    newColor.cssColor = "#" +
                        makeColorPiece(newColor.r) +
                        makeColorPiece(newColor.g) +
                        makeColorPiece(newColor.b);
    return(newColor);
}
function hexToRGB(color){
	var newColor = {};
	newColor.r = hexToR(color);
	newColor.g = hexToG(color);
	newColor.b = hexToB(color);
	return newColor;

	function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
}

function getColorPercent(color,range1,range2){
	//console.log('Layer color='+color)
	color  = hexToRGB(color);
	range1 = hexToRGB(range1);
	range2 = hexToRGB(range2);
	//console.log('percent='+(color.r-range2.r)/(range1.r-range2.r))
	return (color.r-range2.r)/(range1.r-range2.r);
}
function alphabitizeGeoJson(geoJson){
  
  for (var i=0;i<geoJson.length;i++)
  {
  	geoJson[i].features.sort(function(a,b){
	  	if(a.properties.name < b.properties.name)
	  		return -1;
	  	if(a.properties.name > b.properties.name)
	  		return 1;
	  	else return 0;
	  });
  }
  
  
  return geoJson;
}



