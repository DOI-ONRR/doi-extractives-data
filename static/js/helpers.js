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

function text_money(f){
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
                function(d){return d["Company Name"]; },
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



