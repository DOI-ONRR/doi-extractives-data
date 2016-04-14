-- first, we delete the 'All' rows and the Historic Preservation rows, because
-- the onshore state totals include the HPF
DELETE FROM state_disbursements
WHERE
    fund = 'All' OR
    fund = 'Historic Preservation';

-- then, we total up the onshore and offshore numbers to get the 'All' rows
INSERT INTO state_disbursements
    (year, state, fund, source, dollars)
    SELECT
        year, state,
        'All' AS fund,
        'All' AS source,
        SUM(dollars) AS dollars
    FROM state_disbursements
    GROUP BY year, state;

-- then we incorporate HPF rows, which apparently come from offshore
INSERT INTO state_disbursements
    (year, state, fund, source, dollars)
    SELECT
        year, state,
        'Historic Preservation' AS fund,
        'Offshore' AS source,
        dollars
    FROM disbursements_historic_preservation
    WHERE source = 'HPF to States';
