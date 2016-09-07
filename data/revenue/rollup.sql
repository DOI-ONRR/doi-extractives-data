-- fix mis-categorized commodities
-- UPDATE county_revenue
-- SET
--     product = commodity,
--     commodity = 'Other'
-- WHERE
--     commodity IN ('Clay', 'Copper', 'Gilsonite', 'Gold', 'Limestone');

-- fill in the product field for rows without it
UPDATE county_revenue
SET product = commodity
WHERE product IS NULL;

-- create "all commodity" rows by county
DELETE FROM county_revenue WHERE commodity = 'All';
INSERT INTO county_revenue
    (year, state, county, fips, commodity, product, revenue_type, revenue)
SELECT
    year, state, county, fips, 'All', 'All', revenue_type, SUM(revenue)
FROM county_revenue
GROUP BY
    year, state, county, fips, revenue_type;

-- create summary revenue type rows by state
DROP TABLE IF EXISTS state_revenue_type;
CREATE TABLE state_revenue_type AS
    SELECT
        year, state, commodity, revenue_type,
        SUM(revenue) AS revenue
    FROM county_revenue
    GROUP BY
        year, state, commodity, revenue_type;

-- create all revenue type by commodity rollups
INSERT INTO state_revenue_type
    (year, state, commodity, revenue_type, revenue)
SELECT
    year, state, commodity, 'All', SUM(revenue)
FROM county_revenue
GROUP BY
    year, state, commodity;

-- create state revenue rollups
DROP TABLE IF EXISTS state_revenue;
CREATE TABLE state_revenue AS
SELECT
    year, state, commodity, SUM(revenue) AS revenue
FROM county_revenue
GROUP BY
    year, state, commodity;

-- create "all commodity" rows by offshore region
DELETE FROM offshore_revenue WHERE commodity = 'All';
INSERT INTO offshore_revenue
    (year, region, planning_area, offshore_area, protraction, commodity, product, revenue, revenue_type)
SELECT
    year, region, planning_area, offshore_area, protraction, 'All', 'All', SUM(revenue), revenue_type
FROM offshore_revenue
GROUP BY
    year, region, planning_area, offshore_area, protraction, revenue_type;

-- fill in the product field for rows without it
UPDATE offshore_revenue
SET product = commodity
WHERE product IS NULL;


-- create regional revenue view as an aggregate view
-- on state and offshore revenue
DROP TABLE IF EXISTS regional_revenue;
CREATE TABLE regional_revenue AS
    SELECT
        year, commodity,
        state AS region_id, 'state' AS region_type,
        SUM(revenue) AS revenue
    FROM state_revenue
    GROUP BY
        year, commodity
UNION
    -- NOTE: we're normalizing region_id to the 3-letter planning area
    -- identifier here, e.g. "Central Gulf of Mexico" becomes "CGM"
    SELECT
        year, commodity,
        area.id AS region_id,
        'offshore' AS region_type,
        SUM(revenue) AS revenue
    FROM offshore_revenue AS offshore
    INNER JOIN offshore_planning_areas AS area
    ON
        offshore.planning_area = area.name
    GROUP BY
        year, commodity;

-- create federal offshore area revenue table
DROP TABLE IF EXISTS offshore_area_revenue;
CREATE TABLE offshore_area_revenue AS
    SELECT
        year, commodity,
        area.region AS region_id,
        area.id AS area_id,
        area.name AS area_name,
        SUM(revenue) AS revenue,
        revenue_type
    FROM offshore_revenue AS offshore
    INNER JOIN offshore_planning_areas AS area
    ON
        offshore.planning_area = area.name
    GROUP BY
        year, commodity, region_id, area_id;

-- then create regional offshore rollups as an aggregate view
DROP TABLE IF EXISTS offshore_region_revenue;
CREATE TABLE offshore_region_revenue AS
    SELECT
        year, region_id, SUM(revenue) AS revenue, commodity, revenue_type
    FROM offshore_area_revenue
    GROUP BY
        year, region_id, commodity
    ORDER BY
        year, revenue DESC;

-- create summary revenue type rows by state
DROP TABLE IF EXISTS offshore_region_revenue_type;
CREATE TABLE offshore_region_revenue_type AS
    SELECT
        year, region_id, commodity, revenue_type,
        SUM(revenue) AS revenue
    FROM offshore_region_revenue
    GROUP BY
        year, region_id, commodity, revenue_type;

-- create all revenue type by commodity rollups
INSERT INTO offshore_region_revenue_type
    (year, region_id, commodity, revenue_type, revenue)
SELECT
    year, region_id, commodity, 'All', SUM(revenue)
FROM offshore_region_revenue
GROUP BY
    year, region_id, commodity;


-- then create national revenue as an aggregate view
-- on regional revenue
DROP TABLE IF EXISTS national_revenue;
CREATE TABLE national_revenue AS
    SELECT
        year, commodity, SUM(revenue) AS revenue
    FROM regional_revenue
    GROUP BY
        year, commodity;

-- then create national revenue type as an aggregate view
-- on state_revenue
DROP TABLE IF EXISTS national_revenue_type;
CREATE TABLE national_revenue_type AS
    SELECT
        year, commodity, SUM(revenue) AS revenue, revenue_type
    FROM county_revenue
    GROUP BY
        year, commodity, revenue_type;

-- create all revenue type by commodity rollups
INSERT INTO national_revenue_type
    (year, commodity, revenue_type, revenue)
SELECT
    year, commodity, 'All', SUM(revenue)
FROM county_revenue
GROUP BY
    year, commodity;


-- create regional rankings views
DROP TABLE IF EXISTS state_revenue_rank;
CREATE TABLE state_revenue_rank AS
    SELECT
        state.year,
        state.state,
        state.commodity,
        state.revenue,
        national.revenue AS total,
        (CASE WHEN state.revenue * national.revenue >= 0
         THEN 100 * (state.revenue / national.revenue)
         ELSE NULL
         END) AS percent,
        0 AS rank
    FROM
        state_revenue AS state
    INNER JOIN
        national_revenue AS national
    ON
        national.year = state.year AND
        national.commodity = state.commodity
    WHERE
        state.revenue IS NOT NULL AND
        national.revenue IS NOT NULL
    ORDER BY
        state.year,
        state.commodity,
        percent DESC;

UPDATE state_revenue_rank
SET rank = (
    SELECT COUNT(distinct inner.revenue) AS rank
    FROM state_revenue_rank AS inner
    WHERE
        inner.year = state_revenue_rank.year AND
        inner.commodity = state_revenue_rank.commodity AND
        inner.revenue > state_revenue_rank.revenue
) + 1;
