DELETE FROM exports
WHERE
    commodity IN('All', 'Extractives');

INSERT INTO exports
    (state, commodity, year, value)
SELECT
    state,
    'Extractives' AS commodity,
    year,
    SUM(value) AS value
FROM exports
WHERE
    commodity != 'Total'
GROUP BY
    state, commodity, year;

SELECT COUNT(*) FROM exports WHERE commodity = 'Extractives';
