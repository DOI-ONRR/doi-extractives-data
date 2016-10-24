-- normalize million units
UPDATE all_production
    SET
        volume = volume * 1000,
        units = 'Mcf'
    WHERE
        LOWER(units) = 'mmcf';

UPDATE all_production
    SET
        volume = volume * 1000,
        units = 'bbl'
    WHERE
        LOWER(units) = 'mbbl';

UPDATE all_production
    SET
        volume = volume * 1000,
        units = 'Mwh'
    WHERE
        LOWER(units) = 'mmwh';

UPDATE all_production
    SET
        volume = volume * 1000,
        units = 'Mwh'
    WHERE
        LOWER(units) = 'thousand megawatthours';

DROP TABLE IF EXISTS all_state_production;
CREATE TABLE all_state_production AS
    SELECT
        input.*,
        states.name AS region_name,
        region AS region_id
    FROM all_production AS input
    INNER JOIN states ON
        states.abbr = input.region;

DROP TABLE IF EXISTS all_national_production;
CREATE TABLE all_national_production AS
    SELECT
        *,
        'United States' AS region_name,
        region AS region_id
    FROM all_production
    WHERE region = 'US';

DROP TABLE IF EXISTS all_offshore_production;
CREATE TABLE all_offshore_production AS
    SELECT
        input.*,
        input.region AS region_name,
        region.id AS region_id
    FROM all_production AS input
    INNER JOIN offshore_regions AS region ON
        region.name = input.region;

-- create state rankings views
DROP TABLE IF EXISTS all_production_state_rank;
CREATE TABLE all_production_state_rank AS
    SELECT
        st.year AS year,
        st.region AS state,
        st.product AS product,
        st.units AS units,
        st.volume AS volume,
        national.volume AS total,
        100.0 * st.volume / national.volume AS percent,
        0 AS rank
    FROM
        all_state_production AS st
    INNER JOIN
        all_national_production AS national
    ON
        national.year = st.year AND
        national.product = st.product
    WHERE
        st.volume IS NOT NULL AND
        national.volume IS NOT NULL
    ORDER BY
        st.year,
        st.product,
        percent DESC;

UPDATE all_production_state_rank
SET rank = (
    SELECT COUNT(DISTINCT source.percent) AS rank
    FROM all_production_state_rank AS source
    WHERE
        source.year = all_production_state_rank.year AND
        source.product = all_production_state_rank.product AND
        source.percent > all_production_state_rank.percent
) + 1;
