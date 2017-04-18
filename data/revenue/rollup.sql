-- fill in the product field for rows without it
UPDATE county_revenue
SET product = commodity
WHERE product IS NULL;

DELETE FROM county_revenue WHERE revenue_type IS NULL;
DELETE FROM offshore_revenue WHERE revenue_type IS NULL;

-- update NULL columns in civil penalties table
UPDATE civil_penalties_revenue
SET
    product = 'None',
    state = 'None'
WHERE
    product IS NULL AND
    state IS NULL AND
    (revenue_type = 'Civil Penalties' OR revenue_type = 'Other Revenues');

-- add data from civil penalties table
INSERT INTO county_revenue
    (year, state, commodity, revenue_type, revenue)
SELECT
    year, state,
    product AS commodity,
    revenue_type,
    SUM(revenue) AS revenue
FROM civil_penalties_revenue
GROUP BY
    year, state, commodity, revenue_type;

-- create "all commodity" rows by county
DELETE FROM county_revenue WHERE commodity = 'All';
INSERT INTO county_revenue
(
    year, state, county, fips,
    commodity, product, revenue_type,
    revenue
)
SELECT
    year, state, county, fips,
    'All' AS commodity,
    'All' AS product,
    'All' AS revenue_type,
    SUM(revenue) AS revenue
FROM county_revenue
GROUP BY
    year, state, county, fips;

-- create summary revenue type rows by state
DROP TABLE IF EXISTS state_revenue_type;
CREATE TABLE state_revenue_type AS
    SELECT
        year, state, commodity,
        revenue_type,
        SUM(revenue) AS revenue
    FROM county_revenue
    WHERE commodity != 'All'
    GROUP BY
        year, state, commodity,
        revenue_type;

-- create all revenue type by commodity rollups
INSERT INTO state_revenue_type
    (year, state, commodity, revenue_type, revenue)
SELECT
    year, state,
    'All' AS commodity,
    revenue_type,
    SUM(revenue) AS revenue
FROM state_revenue_type
WHERE commodity != 'All'
GROUP BY
    year, state, revenue_type;

-- create all revenue type by commodity rollups
INSERT INTO state_revenue_type
    (year, state, commodity, revenue_type, revenue)
SELECT
    year, state, commodity,
    'All' AS revenue_type,
    SUM(revenue) AS revenue
FROM state_revenue_type
GROUP BY
    year, state, commodity;

-- create state revenue rollups
DROP TABLE IF EXISTS state_revenue;
CREATE TABLE state_revenue AS
SELECT
    year, state, commodity,
    SUM(revenue) AS revenue
FROM county_revenue
GROUP BY
    year, state, commodity;

-- create "all commodity" rows by offshore region
DELETE FROM offshore_revenue WHERE commodity = 'All';
INSERT INTO offshore_revenue (
    year, region, planning_area,
    protraction,
    commodity, product, revenue_type,
    revenue
)
SELECT
    year, region, planning_area,
    protraction,
    'All' AS commodity,
    'All' AS product,
    revenue_type,
    SUM(revenue) AS revenue
FROM offshore_revenue
GROUP BY
    year, region, planning_area,
    protraction, revenue_type;

-- fill in the product field for rows without it
UPDATE offshore_revenue
SET product = commodity
WHERE product IS NULL;

-- add some more useful info for inspection fees
UPDATE offshore_revenue
SET
    commodity = 'None',
    planning_area = 'None',
    region = 'None'
WHERE
    commodity IS NULL AND
    planning_area IS NULL AND
    region IS NULL AND
    revenue_type = 'Inspection Fees';

-- place Pacific Right of Way data in Southern California
UPDATE offshore_revenue
SET
    planning_area = 'Southern California'
WHERE
    planning_area = 'Right of Way' AND
    region = 'Pacific';


-- then create regional offshore rollups as an aggregate view
DROP TABLE IF EXISTS offshore_region_revenue;
CREATE TABLE offshore_region_revenue AS
    SELECT
        year,
        COALESCE(region.name, 'None') AS region_id,
        commodity, revenue_type,
        SUM(revenue) AS revenue
    FROM offshore_revenue AS offshore
    LEFT JOIN offshore_regions AS region
    ON
        offshore.region = region.long_name
    GROUP BY
        year, region_id, commodity, revenue_type
    ORDER BY
        year, revenue DESC;

-- rollup offshore region revenue by revenue_type
INSERT INTO offshore_region_revenue
    (year, region_id, commodity, revenue_type, revenue)
SELECT
    year, region_id,
    commodity,
    'All' AS revenue_type,
    SUM(revenue) AS revenue
FROM offshore_region_revenue
WHERE
    commodity != 'All' AND
    revenue_type != 'All'
GROUP BY
    year, region_id, commodity;

-- rollup offshore region revenue by commodity
INSERT INTO offshore_region_revenue
    (year, region_id, commodity, revenue_type, revenue)
SELECT
    year, region_id,
    'All' AS commodity,
    revenue_type,
    SUM(revenue) AS revenue
FROM offshore_region_revenue
WHERE
    commodity != 'All' AND
    revenue_type != 'All'
GROUP BY
    year, region_id, revenue_type;

-- rollup offshore region revenue by commodity and revenue_type
INSERT INTO offshore_region_revenue
    (year, region_id, commodity, revenue_type, revenue)
SELECT
    year, region_id,
    'All' AS commodity,
    'All' AS revenue_type,
    SUM(revenue) AS revenue
FROM offshore_region_revenue
WHERE
    commodity != 'All' AND
    revenue_type != 'All'
GROUP BY
    year, region_id;

-- create regional revenue view as an aggregate view
-- on state and offshore revenue
DROP TABLE IF EXISTS regional_revenue;
CREATE TABLE regional_revenue AS
    SELECT
        year, commodity,
        state AS region_id,
        'state' AS region_type,
        SUM(revenue) AS revenue
    FROM state_revenue
    GROUP BY
        year, commodity
UNION
    -- NOTE: we're normalizing region_id to the 3-letter planning area
    -- identifier here, e.g. "Central Gulf of Mexico" becomes "CGM"
    SELECT
        year, commodity,
        COALESCE(area.id, 'None') AS region_id,
        'offshore' AS region_type,
        SUM(revenue) AS revenue
    FROM offshore_revenue AS offshore
    LEFT JOIN offshore_planning_areas AS area
    ON
        offshore.planning_area = area.name
    GROUP BY
        year, commodity;

-- create federal offshore area revenue table
DROP TABLE IF EXISTS offshore_area_revenue;
CREATE TABLE offshore_area_revenue AS
    SELECT
        year, commodity,
        COALESCE(area.region, 'None') AS region_id,
        COALESCE(area.id, 'None') AS area_id,
        COALESCE(area.name, 'None') AS area_name,
        revenue_type,
        SUM(revenue) AS revenue
    FROM offshore_revenue AS offshore
    LEFT JOIN offshore_planning_areas AS area
    ON
        offshore.planning_area = area.name
    GROUP BY
        year, commodity, region_id, area_id, area_name, revenue_type;

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
DELETE FROM offshore_region_revenue_type
    WHERE commodity = 'All';
INSERT INTO offshore_region_revenue_type
(
    year, region_id, commodity,
    revenue_type, revenue
)
SELECT
    year, region_id, 'All',
    revenue_type,
    SUM(revenue) AS revenue
FROM offshore_region_revenue_type
GROUP BY
    year, region_id, revenue_type;

DELETE FROM offshore_region_revenue_type
    WHERE revenue_type = 'All';
INSERT INTO offshore_region_revenue_type
(
    year, region_id, commodity, revenue_type,
    revenue
)
SELECT
    year, region_id, commodity, 'All',
    SUM(revenue) AS revenue
FROM offshore_region_revenue_type
GROUP BY
    year, region_id, commodity;

DROP TABLE IF EXISTS regional_revenue_type;
CREATE TABLE regional_revenue_type AS
    SELECT
        year, commodity, revenue_type,
        SUM(revenue) AS revenue
    FROM state_revenue_type
    GROUP BY
        year, commodity, revenue_type
UNION
    SELECT
        year, commodity, revenue_type,
        SUM(revenue) AS revenue
    FROM offshore_region_revenue_type
    GROUP BY
        year, commodity, revenue_type;

SELECT
    COUNT(*) AS regional_revenue_count
FROM regional_revenue_type;

-- then create national revenue as an aggregate view
-- on regional revenue
DROP TABLE IF EXISTS national_revenue;
CREATE TABLE national_revenue AS
    SELECT
        year,
        (CASE WHEN commodity == 'None'
         THEN 'Non-commodity revenue'
         ELSE commodity
         END) AS commodity,
        SUM(revenue) AS revenue
    FROM regional_revenue
    WHERE commodity != 'All'
    GROUP BY
        year, commodity;

-- create "all commodity" row
DELETE FROM national_revenue WHERE commodity = 'All';
INSERT INTO national_revenue (
    year, commodity, revenue
)
SELECT
    year,
    'All' AS commodity,
    SUM(revenue) AS revenue
FROM national_revenue
WHERE
    commodity != 'All'
GROUP BY
    year;

-- then create national revenue type as an aggregate view
-- on regional_revenue_type
DROP TABLE IF EXISTS national_revenue_type;
CREATE TABLE national_revenue_type AS
    SELECT
        year, commodity, revenue_type,
        SUM(revenue) AS revenue
    FROM regional_revenue_type
    GROUP BY
        year, commodity, revenue_type;

-- create all revenue type by commodity rollups
INSERT INTO national_revenue_type
    (year, commodity, revenue_type, revenue)
SELECT
    year, commodity,
    'All' AS revenue_type,
    SUM(revenue) AS revenue
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
         THEN 100.0 * state.revenue / national.revenue
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
    SELECT COUNT(DISTINCT source.revenue) AS rank
    FROM state_revenue_rank AS source
    WHERE
        source.year = state_revenue_rank.year AND
        source.commodity = state_revenue_rank.commodity AND
        source.revenue > state_revenue_rank.revenue
) + 1;
