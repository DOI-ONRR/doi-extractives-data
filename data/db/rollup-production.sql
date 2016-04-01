-- create state production rollups
DROP VIEW IF EXISTS state_production;
CREATE VIEW state_production AS
    SELECT
        year, state, commodity, product, SUM(volume) AS volume
    FROM county_production
    GROUP BY
        year, state, commodity, product;

-- create regional production rollups as an aggregate view on
-- state and offshore production
DROP VIEW IF EXISTS regional_production;
CREATE VIEW regional_production AS
    SELECT
        year, state AS region_id, 'state' AS region_type,
        commodity, product, SUM(volume) AS volume
    FROM state_production
    GROUP BY
        year, commodity, product
UNION
    SELECT
        year, area.id AS region_id, 'offshore' AS region_type,
        commodity, product, SUM(volume) AS volume
    FROM offshore_production AS offshore
    INNER JOIN offshore_planning_areas AS area
    ON
        offshore.planning_area = area.name
    GROUP BY
        year, commodity, product;

-- then create national revenue rollups as an aggregate view on
-- regional revenue
DROP VIEW IF EXISTS national_production;
CREATE VIEW national_production AS
    SELECT
        year, commodity, product, SUM(volume) AS volume
    FROM regional_production
    GROUP BY
        year, commodity, product;
