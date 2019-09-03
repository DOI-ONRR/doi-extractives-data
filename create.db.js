const Database = require('better-sqlite3');
const db = new Database('./ONRR.db',{ verbose: console.log});



let period_lookup={};
let commodity_lookup={};
let location_lookup={};

const main = () => {
    
    commodity_table();
    location_table();
    period_table();
    revenue_table();
    revenue_trends();
}

const revenue_table = () => {
    let table=`
CREATE TABLE  IF NOT EXISTS
revenue( 
  location_id integer, 
  period_id integer, 
  commodity_id integer, 
  revenue real,
  raw_revenue varchar(255),
  primary key (location_id, period_id, commodity_id)
)
`
    const create=db.prepare(table);
    create.run();
}

const period_table = () => {
    let table=`
CREATE TABLE  IF NOT EXISTS
period(
  period_id integer PRIMARY KEY AUTOINCREMENT, 
  period varchar(255),
  calendar_year integer,
  fiscal_year integer, 
  month integer, 
  month_long varchar(255),
  fiscal_month integer, 
  period_date date,
  UNIQUE(period,calendar_year,fiscal_year,month, month_long,fiscal_month, period_date)
)

`    
    const create=db.prepare(table)
    create.run();
}


const commodity_table = () => {
    let table=`
CREATE TABLE  IF NOT EXISTS
commodity(
  commodity_id integer PRIMARY KEY AUTOINCREMENT,  
  product varchar(255), 
  commodity varchar(255),  
  revenue_type varchar(255),
  revenue_category varchar(255), 
  mineral_lease_type varchar(255), 
  UNIQUE(product,commodity,revenue_type,revenue_category, mineral_lease_type)
)
`
    const create=db.prepare(table);
    create.run();

}



const location_table = () => {


    let table=`
CREATE TABLE IF NOT EXISTS
location (
   location_id integer PRIMARY KEY AUTOINCREMENT, 
   fips_code  varchar(5), 
   state varchar(255),  
   county varchar(255),  
   land_class varchar(255),
   land_category varchar(255) , 
   offshore_region varchar(255), 
   offshore_planning_area varchar(255),
   offshore_planning_area_code varhcar(3), 
   offshore_block varchar(255), 
   offshore_protraction, 
   UNIQUE(fips_code,state,county,land_class,land_category,offshore_region,offshore_planning_area,offshore_planning_area_code,offshore_block,offshore_protraction)
)
`
    const create=db.prepare(table);
    create.run();
}

const revenue_trends = () => {
    let view=`
CREATE view revenue_trends as
select fiscal_year, 
       revenue_type,  
       (select month_long from period where period_date=(select max(period_date) from period)) as current_month,
       sum(case when fiscal_month <= (select fiscal_month from period where period_date=(select max(period_date) from period)) then revenue else 0 end) as total_ytd, 
       sum(revenue) as total 
from revenue 
  natural join period 
  natural join commodity 
where commodity not null
group by fiscal_year, revenue_type

union 
select fiscal_year,  
       'All Revenue' as revenue_type,
       (select month_long from period where period_date=(select max(period_date) from period)) as current_month,
       sum(case when fiscal_month <= (select fiscal_month from period where period_date=(select max(period_date) from period)) then revenue else 0 end) as total_ytd, 
       sum(revenue) as total 
from revenue natural join period natural join commodity 
where commodity is not null
group by fiscal_year;


`
    const create=db.exec(view);

}


main();
