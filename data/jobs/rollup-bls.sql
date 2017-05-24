BEGIN;
-- reset region_id, and strip leading XX from FIPS codes
UPDATE bls_employment SET
  region_id = NULL,
  fips = REPLACE(fips, 'FIPS', '');

-- set the region_id to the 2-letter code of the corresponding state
UPDATE bls_employment
  SET
    region_id = (
      SELECT abbr
      FROM states
      WHERE states.name = bls_employment.state
      LIMIT 1
    );


-- sum support activities for oil and gas
UPDATE bls_employment
  SET commodity = 'Oil and gas (only)'
  WHERE naics = 211;
DELETE FROM bls_employment WHERE naics = '211+S';
INSERT INTO bls_employment
    (year, state, county, fips, region_id, naics, commodity, jobs)
  SELECT
    year, state, county, fips, region_id, '211+S' AS _naics,
    'Oil and gas' AS commodity,
    SUM(jobs) AS jobs
  FROM bls_employment
  WHERE
    naics IN (211, 213111, 213112)
  GROUP BY
    year, state, county, fips, region_id, _naics;

-- add support activities to coal
UPDATE bls_employment
  SET commodity = 'Coal (only)'
  WHERE naics = 2121;
DELETE FROM bls_employment WHERE naics = '2121+S';
INSERT INTO bls_employment
    (year, state, county, fips, region_id, naics, commodity, jobs)
  SELECT
    year, state, county, fips, region_id, '2121+S' AS _naics,
    'Coal' AS commodity,
    SUM(jobs) AS jobs
  FROM bls_employment
  WHERE
    naics IN (2121, 213113)
  GROUP BY
    year, state, county, fips, region_id, _naics;

-- sum up "hardrock" and "nonmetallic" minerals, "support activities for
-- metal mining", and "support activities for nonmetallic minerals" into
-- "nonenergy mierals"
DELETE FROM bls_employment WHERE naics = '212X+S';
INSERT INTO bls_employment
    (year, state, county, fips, region_id, naics, commodity, jobs)
  SELECT
    year, state, county, fips, region_id, '212X+S' AS _naics,
    'Nonenergy minerals' AS commodity,
    SUM(jobs) AS jobs
  FROM bls_employment
  WHERE
    naics IN (2122, 2123, 213114, 213115)
  GROUP BY
    year, state, county, fips, region_id, _naics;

-- sum up solar, wind, and geothermal numbers into renewables totals
DELETE FROM bls_employment WHERE commodity = 'Renewables';
INSERT INTO bls_employment
    (year, state, county, fips, region_id, naics, commodity, jobs)
  SELECT
    year, state, county, fips, region_id,
    '22111X' AS naics,
    'Renewables' AS category,
    SUM(jobs) AS jobs
  FROM bls_employment
  WHERE naics IN (221111, 221114, 221115, 221116)
  GROUP BY
    year, state, county, fips, region_id, category;

-- sum up mining and renewables into _actual_ extractives
DELETE FROM bls_employment WHERE commodity = 'Extractives';
INSERT INTO bls_employment
    (year, state, county, fips, region_id, naics, commodity, jobs)
  SELECT
    year, state, county, fips, region_id, '2X' AS _naics,
    'Extractives' AS commodity,
    SUM(jobs) AS jobs
  FROM bls_employment
  WHERE
    commodity IN ('Mining', 'Renewables')
  GROUP BY
    year, state, county, fips, region_id, _naics;

-- Previously, this was done with an UPDATE w/subquery for each row, which
-- was *super* slow. The self-join is super fast, and clearer, I think.
CREATE TABLE _bls_employment AS
  SELECT
    subset.*,
    superset.jobs AS total,
    ROUND(100.0 * subset.jobs / superset.jobs, 2) AS percent
  FROM
    bls_employment AS subset
  LEFT JOIN
    bls_employment AS superset
  ON
    superset.commodity = 'All' AND
    superset.fips = subset.fips AND
    superset.year = subset.year;
DROP TABLE bls_employment;
ALTER TABLE _bls_employment RENAME TO bls_employment;

DROP TABLE IF EXISTS state_bls_employment;
CREATE TABLE state_bls_employment AS
  SELECT *
  FROM bls_employment
  WHERE county IS NULL;

-- then create national employment data as an aggregate view
-- on regional bls_employment
DROP TABLE IF EXISTS national_bls_employment;
CREATE TABLE national_bls_employment AS
  SELECT
    year, commodity, naics,
    'US' AS state,
    'US' AS region_id,
    jobs,
    0 AS total,
    0.01 AS percent
  FROM bls_employment
  WHERE
    fips = 'US000'
  GROUP BY
      year, commodity, naics;

UPDATE national_bls_employment SET percent = NULL;
UPDATE national_bls_employment
  SET
    percent = (
      SELECT
        ROUND(100.0 * national_bls_employment.jobs / superset.jobs, 2)
      FROM
        national_bls_employment AS superset
      WHERE
        superset.commodity = 'All' AND
        superset.region_id = national_bls_employment.region_id AND
        superset.year = national_bls_employment.year
      LIMIT 1
    ),
    total = (
      SELECT superset.jobs
      FROM national_bls_employment AS superset
      WHERE
        superset.commodity = 'All' AND
        superset.region_id = national_bls_employment.region_id AND
        superset.year = national_bls_employment.year
      LIMIT 1
    )
  WHERE commodity != 'All';

COMMIT;
