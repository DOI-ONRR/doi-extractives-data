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
	dc.renderAll();
	graphCustomizations();
}

function text_filter(dim,q){
	dashTable.filterAll();
	var re = new RegExp(q,"i")
	if (q!='')
	{
		dim.filter(function(d){
			if (d.search(re)==0)
				return d;
		});
	}
	dc.redrawAll();
	graphCustomizations();
}