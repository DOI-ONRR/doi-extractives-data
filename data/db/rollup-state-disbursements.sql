DELETE FROM state_disbursements WHERE fund = 'All';
INSERT INTO state_disbursements
    (year, state, fund, source, dollars)
    SELECT
        year, state,
        'All' AS fund,
        'All' AS source,
        SUM(dollars) AS dollars
    FROM state_disbursements
    GROUP BY year, state;
