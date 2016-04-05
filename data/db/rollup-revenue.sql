-- fix mis-categorized commodities
UPDATE county_revenue
SET
    product = commodity,
    commodity = 'Other'
WHERE
    commodity IN ('Clay', 'Copper', 'Gilsonite', 'Gold', 'Limestone');

-- fill in the product field for rows without it
UPDATE county_revenue
SET product = commodity
WHERE product IS NULL;

-- create "all commodity" rows by county
DELETE FROM county_revenue WHERE commodity = 'All';
INSERT INTO county_revenue
    (year, state, county, fips, commodity, product, revenue)
SELECT
    year, state, county, fips, 'All', 'All', SUM(revenue)
FROM county_revenue
GROUP BY
    year, state, county, fips;

-- create state revenue rollups
DROP TABLE IF EXISTS state_revenue;
CREATE TABLE state_revenue AS
SELECT
    year, state, commodity, product, SUM(revenue) AS revenue
FROM county_revenue
GROUP BY
    year, state, commodity, product;

-- create "all commodity" rows by offshore region
DELETE FROM offshore_revenue WHERE commodity = 'All';
INSERT INTO offshore_revenue
    (year, region, planning_area, offshore_area, protraction, commodity, product, revenue)
SELECT
    year, region, planning_area, offshore_area, protraction, 'All', 'All', SUM(revenue)
FROM offshore_revenue
GROUP BY
    year, region, planning_area, offshore_area, protraction;

-- fill in the product field for rows without it
UPDATE offshore_revenue
SET product = commodity
WHERE product IS NULL;

-- create regional revenue view as an aggregate view
-- on state and offshore revenue
DROP TABLE IF EXISTS regional_revenue;
CREATE TABLE regional_revenue AS
    SELECT
        year, state AS region_id, 'state' AS region_type,
        commodity, product, SUM(revenue) AS revenue
    FROM state_revenue
    GROUP BY
        year, commodity, product
UNION
    -- NOTE: we're normalizing region_id to the 3-letter planning area
    -- identifier here, e.g. "Central Gulf of Mexico" becomes "CGM"
    SELECT
        year, area.id AS region_id, 'offshore' AS region_type,
        commodity, product, SUM(revenue) AS revenue
    FROM offshore_revenue AS offshore
    INNER JOIN offshore_planning_areas AS area
    ON
        offshore.planning_area = area.name
    GROUP BY
        year, commodity, product;

-- then create national revenue as an aggregate view
-- on regional revenue
DROP TABLE IF EXISTS national_revenue;
CREATE TABLE national_revenue AS
    SELECT
        year, commodity, product, SUM(revenue) AS revenue
    FROM regional_revenue
    GROUP BY
        year, commodity, product;

-- create regional rankings views
DROP TABLE IF EXISTS state_revenue_rank;
CREATE TABLE state_revenue_rank AS
    SELECT
        state.year,
        state.state,
        state.product,
        state.revenue,
        national.revenue AS total,
        100 * (state.revenue / national.revenue) AS percent,
        0 AS rank
    FROM
        state_revenue AS state
    INNER JOIN
        national_revenue AS national
    ON
        national.year = state.year AND
        national.product = state.product
    WHERE
        state.revenue IS NOT NULL AND
        national.revenue IS NOT NULL
    ORDER BY
        state.year,
        state.product,
        percent DESC;

UPDATE state_revenue_rank
SET rank = (
    SELECT COUNT(distinct inner.percent) AS rank
    FROM state_revenue_rank AS inner
    WHERE
        inner.year = state_revenue_rank.year AND
        inner.product = state_revenue_rank.product AND
        inner.percent > state_revenue_rank.percent
) + 1;
