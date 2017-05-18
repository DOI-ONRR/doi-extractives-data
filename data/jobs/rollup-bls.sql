UPDATE bls_employment SET region_id = NULL, total = NULL;

DELETE FROM bls_employment
  WHERE commodity IN ('Renewables');

INSERT INTO bls_employment
    (year, state, county, fips, region_id, naics, commodity, jobs)
  SELECT
    year, state, county, fips, region_id,
     AS naics,
    'Renewables' AS commodity,
    END AS category,
    SUM(jobs) AS jobs
  FROM bls_employment
  WHERE commodity IN ('Geothermal', 'Solar', 'Wind')
  GROUP BY
    year, state, county, fips, region_id, category;

-- set the region_id to the 2-letter code of the corresponding state
UPDATE bls_employment
  SET
    region_id = (
      SELECT abbr
      FROM states
      WHERE states.name = bls_employment.state
      LIMIT 1
    );

-- all of the remaining rows are for DC US territories
DELETE
  FROM bls_employment
  WHERE region_id IS NULL;

UPDATE bls_employment SET percent = NULL;
UPDATE bls_employment
  SET
    percent = (
      SELECT
        ROUND(100.0 * bls_employment.jobs / superset.jobs, 2)
      FROM
        bls_employment AS superset
      WHERE
        superset.commodity = 'All' AND
        superset.fips = bls_employment.fips AND
        superset.year = bls_employment.year
      LIMIT 1
    ),
    total = (
      SELECT superset.jobs
      FROM bls_employment AS superset
      WHERE
        superset.commodity = 'All' AND
        superset.fips = bls_employment.fips AND
        superset.year = bls_employment.year
      LIMIT 1
    )
  WHERE commodity != 'All';

DROP TABLE IF EXISTS state_bls_employment;
CREATE TABLE state_bls_employment AS
    SELECT
        year, commodity, naics, region_id, state, jobs,
        0 AS total,
        0.01 AS percent
    FROM bls_employment
    WHERE
        county IS NULL;

UPDATE state_bls_employment SET percent = NULL;
UPDATE state_bls_employment
  SET
    percent = (
      SELECT
        ROUND(100.0 * state_bls_employment.jobs / superset.jobs, 2)
      FROM
        state_bls_employment AS superset
      WHERE
        superset.commodity = 'All' AND
        superset.region_id = state_bls_employment.region_id AND
        superset.year = state_bls_employment.year
      LIMIT 1
    ),
    total = (
      SELECT superset.jobs
      FROM state_bls_employment AS superset
      WHERE
        superset.commodity = 'All' AND
        superset.region_id = state_bls_employment.region_id AND
        superset.year = state_bls_employment.year
      LIMIT 1
    )
  WHERE commodity != 'All';

-- then create national employment data as an aggregate view
-- on regional bls_employment
DROP TABLE IF EXISTS national_bls_employment;
CREATE TABLE national_bls_employment AS
    SELECT
        year, commodity, naics,
        'US' AS state,
        'US' AS region_id,
        SUM(jobs) AS jobs,
        0 AS total,
        0.01 AS percent
    FROM state_bls_employment
    GROUP BY
        year, commodity;

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
