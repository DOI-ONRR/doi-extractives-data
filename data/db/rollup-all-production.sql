-- our regional production view combines all of the commodity-specific
-- tables into one
DROP TABLE IF EXISTS all_regional_production;
CREATE TABLE all_regional_production AS
    SELECT
        year, states.abbr AS region,
        'Coal' AS commodity,
        'Coal (short tons)' AS product,
        SUM(volume) AS volume
    FROM all_production_coal
    INNER JOIN states ON
        states.name LIKE (region || '%')
    GROUP BY
        year, region, state
UNION
    SELECT
        year, region,
        'Gas' AS commodity,
        'Natural Gas (MMcf)' AS product,
        volume
    FROM all_production_naturalgas
UNION
    SELECT
        year, states.abbr AS region,
        'Renewables' AS commodity,
        source AS product,
        volume
    FROM all_production_renewables
    INNER JOIN states ON
        states.name = state
UNION
    SELECT
        year, region,
        'Oil' AS commodity,
        'Oil (bbl)' AS product,
        volume
    FROM all_production_oil;

DROP TABLE IF EXISTS all_national_production;
CREATE TABLE all_national_production AS
    SELECT
        year, commodity, product,
        SUM(volume) AS volume
    FROM all_regional_production
    GROUP BY
        year, commodity, product;

-- create state rankings views
DROP TABLE IF EXISTS all_production_state_rank;
CREATE TABLE all_production_state_rank AS
    SELECT
        state.year AS year,
        state.region AS state,
        state.product AS product,
        state.volume AS volume,
        national.volume AS total,
        -- these numbers are both integers, so we need to explicitly cast one
        -- of them as a float in order to get a float back (because an integer
        -- divided by an integer always returns an integer)
        100 * (
            CAST(state.volume AS FLOAT) /
            national.volume
        ) AS percent,
        0 AS rank
    FROM
        all_regional_production AS state
    INNER JOIN
        all_national_production AS national
    ON
        national.year = state.year AND
        national.product = state.product
    WHERE
        state.volume IS NOT NULL AND
        LENGTH(state.region) = 2 AND
        national.volume IS NOT NULL
    ORDER BY
        state.year,
        state.product,
        percent DESC;

UPDATE all_production_state_rank
SET rank = (
    SELECT COUNT(distinct inner.percent) AS rank
    FROM all_production_state_rank AS inner
    WHERE
        inner.year = all_production_state_rank.year AND
        inner.product = all_production_state_rank.product AND
        inner.percent > all_production_state_rank.percent
) + 1;
