DELETE FROM company_revenue
WHERE
    company = 'All' OR
    commodity = 'All' OR
    revenue_type = 'All';

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
GROUP BY year, company, revenue_type;

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
GROUP BY year, company, commodity;

INSERT INTO company_revenue
(
    year, company, revenue_type, commodity, revenue
)
SELECT
    year,
    'All' AS company,
    'All' AS revenue_type,
    'All' AS commodity,
    SUM(revenue) AS revenue
FROM company_revenue
WHERE
    revenue_type = 'All' AND
    commodity = 'All'
GROUP BY year;
