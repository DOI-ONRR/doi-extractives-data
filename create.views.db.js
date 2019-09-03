const Database = require('better-sqlite3');
const db = new Database('./ONRR.db',{ verbose: console.log});


const main = () => {

    yearly_calendar_revenue();
    yearly_fiscal_revenue();
    
    //	revenue_trends();
	
}


const yearly_calendar_revenue = () => {
    let view=`
drop view yearly_calendar_revenue;
CREATE view yearly_calendar_revenue as
select calendar_year as year, 
       sum(case when revenue_category='Federal offshore' then revenue else 0 end) as 'Federal offshore',
       sum(case when revenue_category='Federal onshore' then revenue else 0 end) as 'Federal onshore',
       sum(case when revenue_category='Native American' then revenue else 0 end) as 'Native American',
       sum(case when revenue_category='Not tied to a lease' then revenue else 0 end) as 'Not tied to a lease'

from revenue 
  natural join period 
  natural join commodity 
where commodity is not null
group by calendar_year
`
    const create=db.exec(view);

}

const yearly_fiscal_revenue = () => {
    let view=`
drop view yearly_fiscal_revenue;
CREATE view yearly_fiscal_revenue as
select fiscal_year as year, 
       sum(case when revenue_category='Federal offshore' then revenue else 0 end) as 'Federal offshore',
       sum(case when revenue_category='Federal onshore' then revenue else 0 end) as 'Federal onshore',
       sum(case when revenue_category='Native American' then revenue else 0 end) as 'Native American',
       sum(case when revenue_category='Not tied to a lease' then revenue else 0 end) as 'Not tied to a lease'

from revenue 
  natural join period 
  natural join commodity 
where commodity is not null
group by fiscal_year


`
    const create=db.exec(view);

}


const revenue_trends = () => {
    let view=`
drop view revenue_trends;
CREATE view revenue_trends as
select fiscal_year, 
       case when (revenue_type='Other Revenues' or revenue_type='Civil Penalties' or revenue_type='Inspection Fees') then 'Other Revenues' else  revenue_type end as trend_type,  
       (select month_long from period where period_date=(select max(period_date) from period where period_date <= '2019-07-01')) as current_month,
       sum(case when fiscal_month <= (select fiscal_month from period where period_date=(select max(period_date) from period where period_date <= '2019-07-01' )) then revenue else 0 end) as total_ytd, 
       sum(revenue) as total 
from revenue 
  natural join period 
  natural join commodity 
where commodity not null
and period_date <= '2019-07-01'
group by fiscal_year, trend_type

union 
select fiscal_year,  
       'All Revenue' as trend_type,
       (select month_long from period where period_date=(select max(period_date) from period where period_date <= '2019-07-01' )) as current_month,
       sum(case when fiscal_month <= (select fiscal_month from period where period_date=(select max(period_date) from period where period_date <= '2019-07-01')) then revenue else 0 end) as total_ytd, 
       sum(revenue) as total 
from revenue natural join period natural join commodity 
where commodity is not null and  period_date <= '2019-07-01'
group by fiscal_year;


`
    const create=db.exec(view);

}


main();
