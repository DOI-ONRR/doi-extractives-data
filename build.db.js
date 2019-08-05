const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ONRR.db', (err) => {
	if (err) {
	    console.error(err.message);
	}
    console.log('Connected to the ONRR database.');
});

const main=() => {
    
    location_table();
    period_table();
    db.close();
}

const period_table = () => {
    db.serialize(() => {
	let periods=[
	    ['2019', 'Yearly', 2019, null, null],
	    ['01/2019', 'Monthly', 2019, 01, 'January'],
	    ['02/2019', 'Monthly', 2019, 02, 'February'],
	    ['03/2019', 'Monthly', 2019, 03, 'March'],
	    ['04/2019', 'Monthly', 2019, 04, 'April'],
	    ['05/2019', 'Monthly', 2019, 05, 'May'],
	    ['06/2019', 'Monthly', 2019, 06, 'June'],
	    ['07/2019', 'Monthly', 2019, 07, 'July'],
	    ['08/2019', 'Monthly', 2019, 08, 'August'],
	    ['09/2019', 'Monthly', 2019, 09, 'September'],
	    ['10/2019', 'Monthly', 2019, 10, 'October'],
	    ['11/2019', 'Monthly', 2019, 11, 'November'],
	    ['12/2019', 'Monthly', 2019, 12, 'December'],
	    ['2018', 'Yearly', 2018, null, null],
	    ['01/2018', 'Monthly', 2018, 01, 'January'],
	    ['02/2018', 'Monthly', 2018, 02, 'February'],
	    ['03/2018', 'Monthly', 2018, 03, 'March'],
	    ['04/2018', 'Monthly', 2018, 04, 'April'],
	    ['05/2018', 'Monthly', 2018, 05, 'May'],
	    ['06/2018', 'Monthly', 2018, 06, 'June'],
	    ['07/2018', 'Monthly', 2018, 07, 'July'],
	    ['08/2018', 'Monthly', 2018, 08, 'August'],
	    ['09/2018', 'Monthly', 2018, 09, 'September'],
	    ['10/2018', 'Monthly', 2018, 10, 'October'],
	    ['11/2018', 'Monthly', 2018, 11, 'November'],
	    ['12/2018', 'Monthly', 2018, 12, 'December']
	]
	let insert = 'insert into period( id, period, year, month, month_long) values (? , ? , ? , ? , ? )';
	let create='CREATE TABLE period(id varchar(5), period varchar(255), year integer, month integer, month_long)'
	db.run(create);
	
	periods.map((period,i) => {
	    db.run(insert, period, (err) => {
		if (err) {
		    throw err;
		}
	    });
	});
    /*	.each(insert, data, (err, row) => {
	
	})
    */
	
	;
	let sql='select * from period';
	db.all(sql, [], (err, rows) => {
	    if (err) {
		throw err;
	    }
	    rows.forEach((row) => {
		console.log(row.id);
	    });
	});
	
    }); //end db.serialize;

}

const location_table = () => {
    db.serialize(() => {
	// Queries scheduled here will be serialized.
	let locations=[
	    ['01', 'Alabama', 'AL', 'Alabama', null, null, null, null, null],
	    ['01001', 'Autauga County', 'AL', 'Alabama', '01001', 'Autauga County', null, null, null],
	    ['01003', 'Baldwin County', 'AL', 'Alabama', '01003', 'Baldwin County', null, null, null],
	    ['01005', 'Barbour County', 'AL', 'Alabama', '01005', 'Barbour County', null, null, null], 
	    ['02', 'Alaska', 'AK', 'Alaska', null, null, null, null, null],
	    ['02013', 'Aleutians East Borough', 'AK', 'Alaska', '01001', 'Aleutians East Borough', null, null, null],
	    ['02016', 'Aleutians West Census Area', 'AK', 'Alaska', '01003', 'Aleutians West Census Area', null, null, null],
	    ['02020', 'Anchorage Borough', 'AK', 'Alaska', '01005', 'Anchorage Borough', null, null, null], 
	    ['AKA',   'Anchorage offshore', null, null,  null, null, 'Alaska offshore', 'AKA',  'Anchorage offshore']
	]
	
	let insert = 'insert into location( id, name, state, state_name, county, county_name, region, planning_area, planning_area_name) values (? , ? , ? , ? , ? , ? , ? , ? , ?)';
	let create='CREATE TABLE location(id varchar(5), name varchar(255), state varchar(2),  state_name varchar(255), county varchar(5), county_name varchar(255), region varchar(255), planning_area varhcar(3), planning_area_name varchar(255)) '
	db.run(create);
	
	locations.map((location,i) => {
	    db.run(insert, location, (err) => {
		if (err) {
		    throw err;
	    }
	    });
    });
    /*	.each(insert, data, (err, row) => {
	
		})
	*/
    
	;
	let sql='select * from location';
	db.all(sql, [], (err, rows) => {
	if (err) {
	    throw err;
	}
	rows.forEach((row) => {
	    console.log(row.name);
	});
	});
    });
    
}

main();
