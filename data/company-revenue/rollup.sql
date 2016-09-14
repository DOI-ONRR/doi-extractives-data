DELETE FROM company_revenue
WHERE
    commodity = 'All' OR
    revenue_type = 'All';

INSERT INTO company_revenue
(
    year, company, revenue_type, commodity, revenue
)
SELECT
    year, 'Total' AS company,
    'All' AS revenue_type,
    'All' AS commodity,
    SUM(revenue) AS revenue
FROM company_revenue
GROUP BY year;

INSERT INTO company_revenue
(
    year, company, revenue_type, commodity, revenue
)
SELECT
    year, company,
    'All' AS revenue_type,
    commodity,
    SUM(revenue) AS revenue
FROM company_revenue
WHERE
    company != 'Total'
GROUP BY year, company, commodity;

INSERT INTO company_revenue
(
    year, company, revenue_type, commodity, revenue
)
SELECT
    year, company,
    revenue_type,
    'All' AS commodity,
    SUM(revenue) AS revenue
FROM company_revenue
WHERE
    company != 'Total' AND
    revenue_type != 'All'
GROUP BY year, company, revenue_type;
