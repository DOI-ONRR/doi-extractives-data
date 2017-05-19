BEGIN;
UPDATE bls_employment SET region_id = NULL;

-- set the region_id to the 2-letter code of the corresponding state
UPDATE bls_employment
  SET
    region_id = (
      SELECT abbr
      FROM states
      WHERE states.name = bls_employment.state
      LIMIT 1
    );

DELETE FROM bls_employment
  WHERE commodity IN ('Renewables');

INSERT INTO bls_employment
    (year, state, county, fips, region_id, naics, commodity, jobs)
  SELECT
    year, state, county, fips, region_id,
    '22111X' AS naics,
    'Renewables' AS category,
    SUM(jobs) AS jobs
  FROM bls_employment
  WHERE commodity IN ('Geothermal', 'Solar', 'Wind')
  GROUP BY
    year, state, county, fips, region_id, category;

-- all of the remaining rows are for DC US territories
DELETE
  FROM bls_employment
  WHERE region_id IS NULL;

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
        SUM(jobs) AS jobs,
        0 AS total,
        0.01 AS percent
    FROM state_bls_employment
    GROUP BY
        year, commodity, naics, region_id;

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
