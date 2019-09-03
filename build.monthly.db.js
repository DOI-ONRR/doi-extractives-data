const Database = require('better-sqlite3');
const etl = require('etl');
const BATCH=10000;
const db = new Database('./ONRR.db',{ verbose: console.log});
const CSV="./downloads/csv/revenue/monthly_revenue.csv"
const CONSTANTS = require('./src/js/constants')



const main = () => {
    let period_lookup=initPeriod({});
    let commodity_lookup=initCommodity({});
    let location_lookup=initLocation({});
    etl.file(CSV)
	.pipe(etl.csv()).pipe(etl.collect(BATCH)).promise().then( (data) => {
	    data.map((rows,index) => {
		rows.map( (row, ii) => {
		    let period_id=addPeriod(row,period_lookup)[0];
		    let commodity_id=addCommodity(row,commodity_lookup)[0];
		    let location_id=addLocation(row,location_lookup)[0];
		    let raw_revenue=getRevenue(row);
		    let revenue=cleanRevenue(raw_revenue);
		    const insert = db.prepare('insert into revenue( location_id, period_id, commodity_id, revenue , raw_revenue) values (? , ? , ? , ? , ? )');
		    insert.run([location_id,period_id,commodity_id, revenue, raw_revenue])
		});
	    });
	});
    

    
}


const getRevenue = (row) => {
    let revenue=null;
    for ( let field in row) {
	switch (field) {
	case ' Revenue ':
	    revenue=row[field];
	    break;
	}
    }
    return revenue;

}

const cleanRevenue = (revenue) => {
    let trim=/[\s,\$\)]/g;
    let neg=/\(/g;
    revenue=revenue.replace(trim, '');
    revenue=revenue.replace(neg, '-');
    revenue=Number(revenue);
    if(isNaN(revenue)) {
	return null;
    } else {
	return revenue;
    }
}

const initLocation = (lookup) => {
    let sql=db.prepare('select * from location');
    sql.all().map( (row, i) => {
	let key=row.fips_code+'-'+row.state+'-'+row.county+'-'+row.land_class+'-'+row.land_category+'-'+row.offshore_region+'-'+row.offshore_planning_area+'-'+row.offshore_planning_area_code+'-'+row.offshore_block+'-'+row.offshore_protraction;
	lookup[key]=[row.location_id,row.fips_code,row.state,row.county,row.land_class,row.land_category,row.offshore_region,row.offshore_planning_area,row.offshore_planning_area_code,row.offshore_block,row.offshore_protraction];
    });
    return lookup
    

}

const addLocation=(row, lookup) => {

    let fips_code='' , state='' , county='' , land_class='' , land_category='' , offshore_region='' , offshore_planning_area='' , offshore_planning_area_code='' , offshore_block='' , offshore_protraction='';
    for( let field in row) {
	switch (field) {
	case 'FIPS Code':
	    fips_code=row[field];
	    break;
	case 'State':
	    state=row[field];
	    break;
	case 'County':
	    county=row[field];
	    break;
	case 'Land Class':
	    land_class=row[field];
	    break;
	case 'Land Category':
	    land_category=row[field];
	    if (land_category.toLowerCase === 'not tied to a lease' ||
		row["Revenue Type"] === 'Civil Penalities' ||
		row["Revenue Type"]  === 'Other Revenues') {
		if (row['Land Class'] !== CONSTANTS.NATIVE_AMERICAN &&
		    ! row['Offshore Region']) {
		    state = row['State'] || 'Not tied to a location'
		}
	    }
	    
	    break;
	case 'Offshore Region':
	   offshore_region=row[field];
	    break;
	case 'Offshore Planning Area':
	    offshore_planning_area=row[field];
	    break;
	case 'Offshore Block':
	    offshore_block=row[field];
	    break;
	case 'Offshore Protraction':
	    offshore_protraction=row[field];
	    break;
	    
	}
    }

    
    
    let key=fips_code+'-'+state+'-'+county+'-'+land_class+'-'+land_category+'-'+offshore_region+'-'+offshore_planning_area+'-'+offshore_planning_area_code+'-'+offshore_block+'-'+offshore_protraction;
    
    if(lookup[key]) {
	return lookup[key];
    } else {
	 const insert = db.prepare('insert into location( location_id,	fips_code, state,county,land_class,land_category, offshore_region, offshore_planning_area, offshore_planning_area_code, offshore_block,offshore_protraction) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)'); 

	rowid=insert.run([null, fips_code,state,county,land_class,land_category,offshore_region,offshore_planning_area,offshore_planning_area_code,offshore_block,offshore_protraction]);
	lookup[key]=[rowid.lastInsertRowid, fips_code,state,county,land_class,land_category,offshore_region,offshore_planning_area,offshore_planning_area_code,offshore_block,offshore_protraction];
	return lookup[key];
    }
}


const initCommodity = (lookup) => {
    let sql=db.prepare('select * from commodity');
    sql.all().map( (row, i) => {
	let key=row.product+'-'+row.commodity+'-'+row.revenue_type+'-'+row.mineral_lease_type;
	lookup[key]=[row.commodity_id, row.product, row.commodity, row.revenue_type, row.mineral_lease_type]
    });
    return lookup
    

}

const addCommodity=(row, lookup) => {
    let product='';
    let commodity='Not tied to a commodity';
    let revenue_type='';
    let revenue_category='';
    let mineral_lease_type='';
    for( let field in row) {
	switch (field) {
	case 'Product':
	    product=row[field];
	    break;
	case 'Commodity':
	    commodity=row[field];
	    break;
	case 'Revenue Type':
	    revenue_type=row[field];
	    break;
	case 'Mineral Lease Type':
	    mineral_lease_type=row[field];
	    break;
	    
	}
    }
    // add a revenue category based on land class and category otherwise  default
    revenue_category=LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[row["Land Class"]]
	&& LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY[row["Land Class"]][row["Land Category"]];
    
    if (revenue_category === undefined) {
	if (row["Land Class"] === CONSTANTS.NATIVE_AMERICAN) {
	    revenue_category = CONSTANTS.NATIVE_AMERICAN
	} else {
	    revenue_category = 'Not tied to a lease'
	}
    }

    let key=product+'-'+commodity+'-'+revenue_type+'-'+revenue_category+'-'+mineral_lease_type;
    
    if(lookup[key]) {
	return lookup[key];
    } else {
	
	const insert = db.prepare('insert into commodity( commodity_id, product,commodity, revenue_type, revenue_category,  mineral_lease_type) values (? , ? , ? , ? , ? , ? )');
	rowid=insert.run([null, product, commodity, revenue_type, revenue_category,  mineral_lease_type]);
	lookup[key]=[rowid.lastInsertRowid, product, commodity, revenue_type, revenue_category, mineral_lease_type];
	return lookup[key];
    }
}


const initPeriod = (lookup) => {
    
    
    let sql=db.prepare('select * from period');
    sql.all().map( (row, i) => {
	let key=row.period+'-'+row.calendar_year+'-'+row.fiscal_year+'-'+row.month+'-'+row.month_long+'-'+row.fiscal_month+'-'+row.period_date;
	lookup[key]=[row.period_id, row.calendar_year, row.fiscal_year, row.month, row.month_long, row.fiscal_month, row.period_date];
    });
    return lookup

}

const addPeriod=(row, lookup) => {
    let period='';
    let calendar_year='';
    let fiscal_year='';
    let month='';
    let month_long='';
    let fiscal_month='';
    let period_date='';
    for( let field in row) {
	switch (field) {
	case 'Fiscal Year':
	    period='Fiscal Year';
	    fiscal_year=row[field];
	    break;
	case 'Month':
	    period='Monthly';
	    month_long=row[field];
	    month=monthToNumber(row[field]);
	    fiscal_month=monthToFiscalMonth(row[field]);
	    break;
	case 'Calendar Year':
	    calendar_year=row[field];
	    
	    
	}
    }
    if(month && calendar_year) {
	period_date=calendar_year+'-'+month+'-01 00:00:00';
	
	fiscal_year=getFiscalYear(period_date)
	

    } else if (calendar_year) {
	period_date=calendar_year+'-01-01 00:00:00';
    } 
    let key=period+'-'+calendar_year+'-'+fiscal_year+'-'+month+'-'+month_long+'-'+fiscal_month+'-'+period_date;
    if(lookup[key]) {
	return lookup[key];
    } else {
	const insert = db.prepare('insert into period( period_id, period, calendar_year,fiscal_year, month, month_long,fiscal_month, period_date) values (? , ? , ? , ? , ? , ? , ? , ? )');    
	rowid=insert.run([null, period, calendar_year,fiscal_year, month, month_long, fiscal_month, period_date]);
	lookup[key]=[rowid.lastInsertRowid, period, calendar_year, fiscal_year, month, month_long, fiscal_month,  period_date];
	return lookup[key];
	
    }
}


const monthToNumber = (month_long) => {
    const m={
	'january':'01',
	'february':'02',
	'march':'03',
	'april':'04',
	'may':'05',
	'june':'06',
	'july':'07',
	'august':'08',
	'september':'09',
	'october':'10',
	'november':'11',
	'december':'12'
    }
    return m[month_long.toLowerCase()];
    
    
}
const monthToFiscalMonth = (month_long) => {
    const m={
	'january':4,
	'february':5,
	'march':6,
	'april':7,
	'may':8,
	'june':9,
	'july':10,
	'august':11,
	'september':12,
	'october':1,
	'november':2,
	'december':3
    }
    return m[month_long.toLowerCase()];
    
    
}

const getFiscalYear= (date) => {
    var fiscalyear = "";
    var d = new Date(date);
    if ((d.getMonth()+1 ) >= 10) {
	fiscalyear = (d.getFullYear() + 1);
    } else {
	fiscalyear = d.getFullYear();
    }
    return fiscalyear
    
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


	

	lookup[key]=[row['FIPS Code'],row.State,row.County, row['Land Category'],row['Offshore Region'],row['Offshore Planning Area'],offshore_planning_area[row['Offshore Planning Area']], row['Offshore Block'],row['Offshore Protraction'] ];
    })
			  });
    }
							     
const LAND_CATEGORY_TO_DISPLAY_NAME = {
  'Offshore': CONSTANTS.OFFSHORE,
  'Onshore': CONSTANTS.ONSHORE,
}

const LAND_CLASS_TO_DISPLAY_NAME = {
  'Federal': CONSTANTS.FEDERAL,
  'Native American': CONSTANTS.NATIVE_AMERICAN,
}

const LAND_CLASS_CATEGORY_TO_REVENUE_CATEGORY = {
  [CONSTANTS.FEDERAL]: {
    [CONSTANTS.OFFSHORE]: CONSTANTS.FEDERAL_OFFSHORE,
    [CONSTANTS.ONSHORE]: CONSTANTS.FEDERAL_ONSHORE,
  },
  [CONSTANTS.NATIVE_AMERICAN]: {
    [CONSTANTS.OFFSHORE]: CONSTANTS.NATIVE_AMERICAN,
    [CONSTANTS.ONSHORE]: CONSTANTS.NATIVE_AMERICAN,
  },
}

const COMMODITY_MAP = {
  'Oil & Gas (Non Royalty)': 'Oil & Gas (Non-Royalty)',
  'Oil & Gas (Non-Royalty)': 'Oil & Gas (Non-Royalty)'
}
main();
