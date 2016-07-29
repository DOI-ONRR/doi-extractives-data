-- first, we delete the 'All' rows
DELETE FROM state_disbursements WHERE fund = 'All';

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
DROP TABLE IF EXISTS all_disbursements;
CREATE TABLE all_disbursements AS
    SELECT
        year, state, fund, source, dollars
    FROM state_disbursements
UNION
    SELECT
        year, state, 'Historic Preservation' AS fund,
        'Offshore' AS source, dollars
    FROM disbursements_historic_preservation
    WHERE source = 'HPF to States';
