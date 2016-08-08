-- first, we delete the 'All' rows
DELETE FROM federal_disbursements WHERE fund = 'All';

-- then, we total up the onshore and offshore numbers to get the 'All' rows
INSERT INTO federal_disbursements
    (year, state, fund, source, dollars)
    SELECT
        year, state,
        'All' AS fund,
        'All' AS source,
        SUM(dollars) AS dollars
    FROM federal_disbursements
    GROUP BY year, state;

-- then we incorporate HPF rows, which apparently come from offshore
DROP TABLE IF EXISTS all_disbursements;
CREATE TABLE all_disbursements AS
    SELECT
        year, state, fund, source, dollars
    FROM federal_disbursements
UNION
    SELECT
        year, state, 'Historic Preservation' AS fund,
        'Offshore' AS source, dollars
    FROM disbursements_historic_preservation
    WHERE source = 'HPF to States';
