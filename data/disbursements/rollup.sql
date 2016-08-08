-- first, we delete the 'All' rows
DELETE FROM federal_disbursements WHERE fund = 'All';

-- then, we total up the onshore and offshore numbers to get the 'All' rows
INSERT INTO federal_disbursements
    (year, region, fund, source, dollars)
    SELECT
        year, region,
        'All' AS fund,
        'All' AS source,
        SUM(dollars) AS dollars
    FROM federal_disbursements
    GROUP BY year, region;

-- then we incorporate HPF rows, which apparently come from offshore
DROP TABLE IF EXISTS all_disbursements;
CREATE TABLE all_disbursements AS
    SELECT
        year, region, fund, source, dollars
    FROM federal_disbursements
UNION
    SELECT
        year,
        state AS region,
        'Historic Preservation' AS fund,
        'Offshore' AS source,
        dollars
    FROM disbursements_historic_preservation
    WHERE source = 'HPF to States';
