UPDATE bls_employment SET
  region_id = (
    SELECT abbr
    FROM states
    WHERE states.name = bls_employment.state
    LIMIT 1
  );

-- then create national employment data as an aggregate view
-- on regional bls_employment
DROP TABLE IF EXISTS national_bls_employment;
CREATE TABLE national_bls_employment AS
    SELECT
        year, 'US' as state, 'US' as region_id, SUM(extractive_jobs) AS extractive_jobs,
        SUM(total_jobs) AS total_jobs, percent
    FROM bls_employment
    GROUP BY
        year;

DROP TABLE IF EXISTS state_bls_employment;
CREATE TABLE state_bls_employment AS
    SELECT
        year, state, region_id, SUM(extractive_jobs) AS extractive_jobs,
        SUM(total_jobs) AS total_jobs, percent
    FROM bls_employment
    GROUP BY
        year, state, region_id;
