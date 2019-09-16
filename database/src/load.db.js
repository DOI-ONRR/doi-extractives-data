const { Pool, Client } = require('pg')

const etl = require('etl');
const BATCH=1;
const db =  new Pool({user: 'postgres',
			 host: 'localhost',
			 database: 'onrr_db',
			 password: 'secret',
			 port: 5433,
		     });
//const CSV="../../downloads/csv/revenue/monthly_revenue.csv"
const CONSTANTS = require('../../src/js/constants')
const CSV=process.argv[2

		      ];



const main =async () => {
    let period_lookup=await  initPeriod({});
//    console.debug("PL", period_lookup);
    let commodity_lookup=await initCommodity({});
    let location_lookup=await initLocation({});
    etl.file(CSV)
	.pipe(etl.csv()).pipe(etl.collect(BATCH)).promise().then(async  (data) => {
	    data.map(async  (rows,index) => {
		rows.map( async (row, ii) => {


		    let N=false;
		    for(let f in row) {
			if(row.Month != '' ) {
			    console.debug(row);
			    console.debug("field",f)
			    N=true
			}
		    }
		    if(N) {
			 console.debug(row);
		  let location= await addLocation(row,location_lookup);
		    let location_id=location[0]
		   let commodity=await addCommodity(row,commodity_lookup);
		    let commodity_id=commodity[0];
		 
		 
		    let period= await addPeriod(row,period_lookup);
		   let period_id=period[0];
		  let raw_revenue=getRevenue(row);
		    let revenue=cleanRevenue(raw_revenue);
		    try {
			
			const insert = await db.query('insert into revenue( location_id, period_id, commodity_id, revenue , raw_revenue) values ($1 , $2 , $3 , $4 , $5 )',[location_id, period_id, commodity_id, revenue , raw_revenue]);
		    } catch(err)  { console.debug("Fact", err), process.exit()};
		 
		    }
		});
		
	    });
	});
    

    
}

const initLocation = (lookup) => {
    let r=db.query('select * from location').then(
	(res) => {
	    res.rows.map( (row, i) => {
		let key=row.fips_code+'-'+row.state+'-'+row.county+'-'+row.land_class+'-'+row.land_category+'-'+row.offshore_region+'-'+row.offshore_planning_area+'-'+row.offshore_planning_area_code+'-'+row.offshore_block+'-'+row.offshore_protraction;
		lookup[key]=[row.location_id,row.fips_code,row.state,row.county,row.land_class,row.land_category,row.offshore_region,row.offshore_planning_area,row.offshore_planning_area_code,row.offshore_block,row.offshore_protraction];
	
	    });
	    return lookup
	}).catch( err =>{ console.debug(err); 	    process.exit();});
	return r
    

}

const addLocation= async (row, lookup) => {
   
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
	try {
	    const insert = await  db.query('insert into location(fips_code, state,county,land_class,land_category, offshore_region, offshore_planning_area, offshore_planning_area_code, offshore_block,offshore_protraction) values ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING  returning location_id', [fips_code,state,county,land_class,land_category,offshore_region,offshore_planning_area,offshore_planning_area_code,offshore_block,offshore_protraction]); 
	    
	    if(insert.rows.length > 0 ) {
		lookup[key]=[insert.rows[0].location_id, fips_code,state,county,land_class,land_category, offshore_region,offshore_planning_area,offshore_planning_area_code,offshore_block,offshore_protraction];
		
	    } else {
	    	//console.debug("IGNORE ----------------------");
	    }
	} catch  (err) {
	    console.log("location ERROR: ", err.stack);
	    console.log("ROW: ", row);
	    process.exit();
	}
	console.debug("addLocation", lookup[key])
	return lookup[key];
    }
}




const initCommodity = (lookup) => {
    let r=db.query('select * from commodity').then(
	(res) => {
	    res.rows.map( (row, i) => {
		let key=row.product+'-'+row.commodity+'-'+row.revenue_type+'-'+row.revenue_category+'-'+row.mineral_lease_type;
		lookup[key]=[row.commodity_id, row.product, row.commodity, row.revenue_type,row.revenue_category, row.mineral_lease_type]
	    })
	    return lookup
	}).catch( err => {console.debug(err); process.exit();});
    return r;
    
    
}

const addCommodity= async (row, lookup) => {
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

	try {
	    const insert = await db.query('insert into commodity(  product,commodity, revenue_type, revenue_category,  mineral_lease_type) values ($1 , $2 , $3 , $4 , $5   ) ON CONFLICT DO NOTHING returning commodity_id', [ product, commodity, revenue_type, revenue_category, mineral_lease_type]);
	    if(insert.rows.length > 0 ) {
		lookup[key]=[insert.rows[0].commodity_id, product, commodity, revenue_type, revenue_category, mineral_lease_type];
	    } else {
		//console.debug("IGNORE ----------------------")
	    }
	} catch  (err) {
	    console.log("commodity ERROR: ", err.stack);
	    process.exit();
	}
    }
    console.debug("addCommodity", lookup[key]);
    
    return lookup[key]
}





const initPeriod = (lookup) => {
    
    
    let r=  db.query('select * from period',).then(
	(res) => {
	    res.rows.map( (row, i) => {
		let date=row.period_date.toISOString().replace('T', ' ');
		date=date.replace('Z','');

		let key=row.period+'-'+row.calendar_year+'-'+row.fiscal_year+'-'+row.month+'-'+row.month_long+'-'+row.fiscal_month
		lookup[key]=[row.period_id, row.calendar_year, row.fiscal_year, row.month, row.month_long, row.fiscal_month, date];
	    });
	    
	    return lookup
	}).catch( err =>{ console.debug(err);	    process.exit();});
    return r;
    

}

const addPeriod=async (row, lookup) => {
    let period='';
    let calendar_year='';
    let fiscal_year='';
    let month='';
    let month_long='';
    let fiscal_month='';
    let period_date='';

    for( let field in row) {
	switch (field) {
	case "Fiscal Year":
	    period='Fiscal Year';
	    fiscal_year=row[field];
	    console.debug("fiscal_Year", period, fiscal_year);
	    month=0;
	    fiscal_month=0;
	    calendar_year=0;
	    period_date=fiscal_year+'-01-01 00:00:00';

	    break;
	case 'Month':
	    period='Monthly';
	    month_long=row[field];
	    month=monthToNumber(row[field]);
	    fiscal_month=monthToFiscalMonth(row[field]);
	    break;
	case 'Calendar Year':
	    calendar_year=row[field];
	    period_date=calendar_year+'-01-01 00:00:00';
	    break;
	default:
	     console.debug("DEFALT>>"+field+"<<");
	    //process.exit();
	    
	}
    }
    if(month && calendar_year) {
	period_date=calendar_year+'-'+month+'-01 00:00:00';
	
	fiscal_year=getFiscalYear(period_date)
	

    } 

    let key=period+'-'+calendar_year+'-'+fiscal_year+'-'+month+'-'+month_long+'-'+fiscal_month
    if(lookup[key]) {
	return lookup[key];
    } else {

	try {
	    const insert =await db.query('insert into period( period, calendar_year,fiscal_year, month, month_long,fiscal_month, period_date) values ($1 , $2 , $3 , $4 , $5 , $6 , $7 ) ON CONFLICT DO NOTHING returning period_id', [ period, calendar_year,fiscal_year, month, month_long, fiscal_month, period_date] )
	    if(insert.rows.length > 0 ) {
		lookup[key]=[insert.rows[0].period_id, period, calendar_year, fiscal_year, month, month_long, fiscal_month,  period_date];
	    }else {



	//	process.exit();
	    }
	   
	} catch (err) {
	    console.log("peroid ERROR: ", err.stack);
	    console.log("ROW: ", row);
	    console.log("ROW: ", key);
	    process.exit();
	}
	//	rowid=insert.run([null, period, calendar_year,fiscal_year, month, month_long, fiscal_month, period_date]);
	//lookup[key]=[rowid.lastInsertRowid, period, calendar_year, fiscal_year, month, month_long, fiscal_month,  period_date];
	console.debug("AddPeriod: ", lookup[key]);
	return lookup[key]; 

    }
//    console.debug("lookup -=-------", lookup);
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



const monthToNumber = (month_long) => {
    const m={
	'january':1,
	'february':2,
	'march':3,
	'april':4,
	'may':5,
	'june':6,
	'july':7,
	'august':8,
	'september':9,
	'october':10,
	'november':11,
	'december':12




	
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
