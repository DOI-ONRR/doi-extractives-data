-- create state production rollups
DROP TABLE IF EXISTS federal_state_production;
CREATE TABLE federal_state_production AS
    SELECT
        year, state, product, product_name, units,
        SUM(volume) AS volume
    FROM federal_county_production
    WHERE
        state != 'Withheld' AND
        volume IS NOT NULL
    GROUP BY
        year, state, product
    ORDER BY
        year, product, product_name, units, volume DESC;

-- create regional production rollups as an aggregate view on
-- state and offshore production
DROP TABLE IF EXISTS federal_regional_production;
CREATE TABLE federal_regional_production AS
    SELECT
        year, state AS region_id, 'state' AS region_type,
        product, product_name, units, SUM(volume) AS volume
    FROM federal_state_production
    GROUP BY
        year, product, product_name, units
UNION
    SELECT
        year, area.id AS region_id, 'offshore' AS region_type,
        product, product_name, units, SUM(volume) AS volume
    FROM federal_offshore_production AS offshore
    INNER JOIN offshore_planning_areas AS area
    ON
        offshore.planning_area = area.name
    GROUP BY
        year, product, product_name, units
ORDER BY
    year, product, product_name, units, volume DESC;

-- then create national revenue rollups as an aggregate view on
-- regional revenue
DROP TABLE IF EXISTS federal_national_production;
CREATE TABLE federal_national_production AS
    SELECT
        year, product, product_name, units, SUM(volume) AS volume
    FROM federal_regional_production
    GROUP BY
        year, product, product_name, units;

-- create regional rankings views
DROP TABLE IF EXISTS federal_production_state_rank;
CREATE TABLE federal_production_state_rank AS
    SELECT
        state.year AS year,
        state.state AS state,
        state.product AS product,
        state.units AS units,
        state.volume AS volume,
        national.volume AS total,
        100 * (state.volume / national.volume) AS percent,
        0 AS rank
    FROM
        federal_state_production AS state
    INNER JOIN
        federal_national_production AS national
    ON
        national.year = state.year AND
        national.product = state.product
    WHERE
        state.volume IS NOT NULL AND
        national.volume IS NOT NULL
    ORDER BY
        state.year,
        state.product,
        percent DESC;

UPDATE federal_production_state_rank
SET rank = (
    SELECT COUNT(distinct inner.percent) AS rank
    FROM federal_production_state_rank AS inner
    WHERE
        inner.year = federal_production_state_rank.year AND
        inner.product = federal_production_state_rank.product AND
        inner.percent > federal_production_state_rank.percent
) + 1;
