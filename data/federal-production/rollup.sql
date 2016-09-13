-- then create national revenue rollups as an aggregate view on
-- regional revenue
DROP TABLE IF EXISTS federal_national_production;
CREATE TABLE federal_national_production AS
    SELECT
        year, product, product_name, units, SUM(volume) AS volume
    FROM federal_local_production
    GROUP BY
        year, product, product_name, units;

-- then split federal_county_production into its offshore

-- create offshore area production
DROP TABLE IF EXISTS federal_offshore_area_production;
CREATE TABLE federal_offshore_area_production AS
    SELECT
        year, area.region AS region_id,
        area.id AS area_id,
        area.name AS area_name,
        product,
        product_name,
        units,
        SUM(volume) AS volume
    FROM federal_local_production AS offshore
    INNER JOIN offshore_planning_areas AS area
    ON
        offshore.locality_id = area.name
    GROUP BY
        year, region_id,
        area_id, area_name,
        product, product_name,
        units
ORDER BY
    year, product, product_name, units, volume DESC;

-- create onshore county production
DROP TABLE IF EXISTS federal_county_production;
CREATE TABLE federal_county_production AS
    SELECT
        year, region_id AS state,
        locality_id AS county,
        production.fips AS fips,
        product,
        product_name,
        units,
        SUM(volume) AS volume
    FROM federal_local_production AS production
    INNER JOIN states ON
        states.abbr = production.region_id
    GROUP BY
        year, state,
        county, production.fips,
        product, product_name, units
ORDER BY
    year, product, product_name, units, volume DESC;


-- then create regional offshore rollups as an aggregate view
DROP TABLE IF EXISTS federal_offshore_region_production;
CREATE TABLE federal_offshore_region_production AS
    SELECT
        year, region_id, product, product_name, units, SUM(volume) AS volume
    FROM federal_offshore_area_production
    GROUP BY
        year, region_id, product, product_name, units
    ORDER BY
        year, product, product_name, units, volume DESC;


-- create state production rollups
DROP TABLE IF EXISTS federal_state_production;
CREATE TABLE federal_state_production AS
    SELECT
        year, state,
        product, product_name,
        units,
        SUM(volume) AS volume
    FROM federal_county_production
    WHERE
        LENGTH(state) = 2 AND
        fips IS NOT NULL
    GROUP BY
        year, state, product, product_name, units
    ORDER BY
        year, product, product_name, units, volume DESC;

-- create state rankings views
DROP TABLE IF EXISTS federal_production_state_rank;
CREATE TABLE federal_production_state_rank AS
    SELECT
        state.year AS year,
        state.state AS state,
        state.product AS product,
        state.product_name AS product_name,
        state.units AS units,
        state.volume AS volume,
        national.volume AS total,
        100.0 * state.volume / national.volume AS percent,
        0 AS rank
    FROM
        federal_state_production AS state
    INNER JOIN
        federal_national_production AS national
    ON
        national.year = state.year AND
        national.product = state.product
    WHERE
        national.volume IS NOT NULL AND
        state.state != 'Withheld'
    ORDER BY
        state.year,
        state.product,
        percent DESC;

UPDATE federal_production_state_rank
SET rank = (
    SELECT COUNT(DISTINCT source.percent) AS rank
    FROM federal_production_state_rank AS source
    WHERE
        source.year = federal_production_state_rank.year AND
        source.product = federal_production_state_rank.product AND
        source.percent > federal_production_state_rank.percent
) + 1;
