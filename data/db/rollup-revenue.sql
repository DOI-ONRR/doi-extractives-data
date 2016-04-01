-- create "all commodity" rows by county
DELETE FROM county_revenue WHERE commodity = 'All';
INSERT INTO county_revenue
    (year, state, county, fips, commodity, revenue)
SELECT
    year, state, county, fips, 'All', SUM(revenue)
FROM county_revenue
GROUP BY
    year, state, county, fips;

-- create state revenue rollups
DROP VIEW IF EXISTS state_revenue;
CREATE VIEW state_revenue AS
SELECT
    year, state, commodity, product, SUM(revenue) AS revenue
FROM county_revenue
GROUP BY
    year, state, commodity, product;

-- create "all commodity" rows by offshore region
DELETE FROM offshore_revenue WHERE commodity = 'All';
INSERT INTO offshore_revenue
    (year, region, planning_area, offshore_area, protraction, commodity, revenue)
SELECT
    year, region, planning_area, offshore_area, protraction, 'All', SUM(revenue)
FROM offshore_revenue
GROUP BY
    year, region, planning_area, offshore_area, protraction;

-- create regional revenue view as an aggregate view
-- on state and offshore revenue
DROP VIEW IF EXISTS regional_revenue;
CREATE VIEW regional_revenue AS
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
DROP VIEW IF EXISTS national_revenue;
CREATE VIEW national_revenue AS
    SELECT
        year, commodity, product, SUM(revenue) AS revenue
    FROM regional_revenue
    GROUP BY
        year, commodity, product;

