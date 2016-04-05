-- our regional production view combines all of the commodity-specific
-- tables into one
DROP VIEW IF EXISTS all_regional_production;
CREATE VIEW all_regional_production AS
    SELECT
        year, state AS region,
        'Coal' AS commodity,
        'Coal (short tons)' AS product,
        SUM(volume) AS volume
    FROM all_production_coal
    GROUP BY year, region, state
UNION
    SELECT
        year, region,
        'Gas' AS commodity,
        'Natural Gas (MMcf)' AS product,
        volume
    FROM all_production_naturalgas
UNION
    SELECT
        year, state AS region,
        'Renewables' AS commodity,
        source AS product,
        volume
    FROM all_production_renewables
UNION
    SELECT
        year, region,
        'Oil' AS commodity,
        'Oil (bbl)' AS product,
        volume
    FROM all_production_oil;

DROP VIEW IF EXISTS all_national_production;
CREATE VIEW all_national_production AS
    SELECT
        year, commodity, product,
        SUM(volume) AS volume
    FROM all_regional_production
    GROUP BY year, commodity, product;
