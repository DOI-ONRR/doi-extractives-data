const Database = require('better-sqlite3');
const etl = require('etl');
const BATCH=10000;
const db = new Database('./ONRR.db',{ verbose: console.log});

let period_lookup={};
let commodity_lookup={};
let location_lookup={};

const main = () => {

	commodity_table();
	location_table();
	period_table();
	revenue_table();
	
}

const revenue_table = () => {

    const create=db.prepare('CREATE TABLE revenue( location_id integer, period_id integer, commodity_id integer, revenue real)') ;
    create.run();
    const insert = db.prepare('insert into revenue( location_id, period_id, commodity_id, revenue) values (? , ? , ? , ? )');
    
    
    etl.file('./downloads/csv/revenue/fiscal_year_revenue.csv')
	.pipe(etl.csv()).pipe(etl.collect(BATCH)).promise().then( (data) => {

	    data.map((rows,index) => {
		rows.map( (row, index) => {
		    let trim=/[\s,\$\)]/g;
		    let revenue=row[' Revenue '];
		    revenue=revenue.replace(trim, '');
		    let neg=/\(/g;
		    revenue=revenue.replace(neg, '-');
		    revenue=Number(revenue);
		    let period_id=row['﻿Fiscal Year'];
		    let key=row['FIPS Code']+'-'+row.State+'-'+row.County+'-'+row['Land Category']+'-'+row['Offshore Region']+'-'+row['Offshore Planning Area']+'-'+row['Offshore Block']+'-'+row['Offshore Protraction'];
		    let location_id=location_lookup[key][0];
		    key=row.Product+'-'+row.Commodity+'-'+row['Revenue Type']+'-'+row['Mineral Lease Type'];
		    let commodity_id=commodity_lookup[key][0];
		    console.debug(index);
		    
		    insert.run([location_id,period_id,commodity_id, revenue])
		});
	    });

	    const sql=db.prepare('select "revenue: ", count(*) from revenue');
	    sql.all().map( (row, i) => {
		    console.log(row);
	    });
	    
	});
}

const period_table = () => {

    const create=db.prepare('CREATE TABLE period(id varchar(5), period varchar(255), year integer, month integer, month_long)');
    create.run();
    const insert = db.prepare('insert into period( id, period, year, month, month_long) values (? , ? , ? , ? , ? )');    

    etl.file('./downloads/csv/revenue/fiscal_year_revenue.csv')
	.pipe(etl.csv()).pipe(etl.collect(BATCH)).promise().then( (data) => {
	    period_deduplicate(data,period_lookup);
	    Object.keys(period_lookup).sort().map( (key,index)=> {
		console.debug(index);
		insert.run(period_lookup[key]);
		
	    });

	    const sql=db.prepare('select "period:", count(*) from period');
	    sql.all().map((rows,i) => {
		console.log(rows);
	    });
	    
	});
    
    
    
    
}


const period_deduplicate = ( data, lookup ) => {

    data.map((d,index) => {d.map((row,i) => {
	if( row['﻿Fiscal Year'] ) { 
	    key=row['﻿Fiscal Year']+'-Yearly-'+row['﻿Fiscal Year']+'-'+'-';
	    lookup[key]=[row['﻿Fiscal Year'], 'Yearly',row['﻿Fiscal Year'] ,null,null];
	} else {
	    console.log(row['﻿Fiscal Year']);
	}
    })});
    
}


const commodity_table = () => {
    
    
    const create=db.prepare('CREATE TABLE commodity(id varchar(5), product varchar(255), mineral_lease_type varchar(255),  commodity_name varchar(255),  revenue_type varchar(255))');
    create.run();
    const insert = db.prepare('insert into commodity( id, product, mineral_lease_type, commodity_name, revenue_type) values (? , ? , ? , ? , ? )');
    
    
    etl.file('./downloads/csv/revenue/fiscal_year_revenue.csv')
	.pipe(etl.csv()).pipe(etl.collect(BATCH)).promise().then( (data) => {
	    commodity_deduplicate(data,commodity_lookup);
	    Object.keys(commodity_lookup).sort().map( (key,index)=> {
		commodity_lookup[key].unshift(index);
		console.debug(index);
		insert.run(commodity_lookup[key]);
	    });
	    
	    let sql=db.prepare('select "commodity:", count(*) from commodity');
	    sql.all().map((row) => {
		console.log(row);
		
	    });
	});
    

    


}

const commodity_deduplicate = ( data, lookup ) => {
    data.map((d,index) => {d.map((row,i) => {
	let key=row.Product+'-'+row.Commodity+'-'+row['Revenue Type']+'-'+row['Mineral Lease Type'];
	lookup[key]=[row.Product, row['Mineral Lease Type'], row.Commodity,row['Revenue Type']];
    })});
    
}

const location_table = () => {

    const create=db.prepare('CREATE TABLE location(id integer not null, fips_code  varchar(5), state varchar(2),  county varchar(255),  land_category varchar(255) , offshore_region varchar(255), offshore_planning_area varchar(255),offshore_planning_area_code varhcar(3), offshore_block varchar(255), offshore_protraction)');
    create.run();
    const insert = db.prepare('insert into location( id,	fips_code, state,county,land_category, offshore_region, offshore_planning_area, offshore_planning_area_code, offshore_block,offshore_protraction) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?,?)'); 

    etl.file('./downloads/csv/revenue/fiscal_year_revenue.csv')
	.pipe(etl.csv()).pipe(etl.collect(BATCH)).promise().then( (data) => {
	    location_deduplicate(data,location_lookup);
	    Object.keys(location_lookup).sort().map( (key,index)=> {
		location_lookup[key].unshift(index);
		console.debug(index);
		insert.run(location_lookup[key]);
	    });
	    
	    
	    let sql=db.prepare('select "location:",  count(*) from location');
	    sql.all().map((row) => {
		console.log(row);
	    });
    });
}

const offshore_planning_area={
    "Aleutian Arc":"ALA",
    "Aleutian Basin":"ALB",
    "Beaufort Sea":"BFT",
    "Bowers Basin":"BOW",
    "Chukchi Sea":"CHU",
    "Cook Inlet":"COK",
    "St. George Basin":"GEO",
    "Gulf of Alaska":"GOA",
    "Hope Basin":"HOP",
    "Kodiak":"KOD",
    "St. Matthew-Hall":"MAT",
    "North Aleutian Basin":"NAL",
    "Navarin Basin":"NAV",
    "Norton Basin":"NOR",
    "Shumagin":"SHU",
    "Florida Straits":"FLS",
    "Mid Atlantic":"MDA",
    "North Atlantic":"NOA",
    "South Atlantic":"SOA",
    "Western Gulf of Mexico":"WGM",
    "Central Gulf of Mexico":"CGM",
    "Eastern Gulf of Mexico":"EGM",
    "Central California":"CEC",
    "Northern California":"NOC",
    "Southern California":"SOC",
    "Washington-Oregon":"WAO"
}

const location_deduplicate = (data, lookup) => {
    data.map((d,index) => {d.map((row,i) => {


	
	let key=row['FIPS Code']+'-'+row.State+'-'+row.County+'-'+row['Land Category']+'-'+row['Offshore Region']+'-'+row['Offshore Planning Area']+'-'+row['Offshore Block']+'-'+row['Offshore Protraction'];
	lookup[key]=[row['FIPS Code'],row.State,row.County, row['Land Category'],row['Offshore Region'],row['Offshore Planning Area'],offshore_planning_area[row['Offshore Planning Area']], row['Offshore Block'],row['Offshore Protraction'] ];
    })
			  });
}

main();
