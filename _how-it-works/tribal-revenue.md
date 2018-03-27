---
title: Tribal Lands | Revenue
layout: content
permalink: /how-it-works/tribal-revenue/
nav_description: Jump to a section
nav_items:
  - name: introduction
    title: Top
  - name: revenue-collection
    title: Revenue collection
  - name: revenue-distribution
    title: Revenue distribution
  - name: revenue-data
    title: Revenue data
  - name: audits-and-assurances
    title: Audits and assurances
description: Natural resources are increasingly a key source of income for many Native American tribes.
tag:
- how it works
- production
- renewable energy
- geothermal
- wind
- water power
- biomass
breadcrumb:
  - title: How it works
    permalink: /how-it-works/
title_display: Revenue from natural resources on Indian land
selector: list
revenue_types:
  Bonus: Bonus
  Rents: Rents
  Reported Royalties: Royalties
  Other Revenues: Other Revenue
---

> Natural resources are increasingly a key source of income for many Native American tribes. In 2017, {{ "ONRR" | term }} and {{ "OST" | term }} disbursed $675.7 million to tribes and allottees.

{% include selector.html %}

Much like [federal revenue]({{ site.baseurl }}/explore/#revenue), revenue from natural resource extraction on tribal land is collected in each phase of the production process (for instance, companies pay bonuses to secure rights, rents during exploration, and royalties once production begins).

## Revenue collection

Several organizations within the Department of the Interior have roles and responsibilities in collecting revenue from production on Indian land:

<table class="article_table">
  <tbody>
    <tr>
      <th rowspan="2">Resource</th>
      <th colspan="3">Stage of Production</th>
    </tr>
    <tr>
      <th>Securing a lease or claim</th>
      <th>Pre-production</th>
      <th>During production</th>
    </tr>
    <tr>
      <td>Fluid minerals</td>
      <td>BIA bills, collects, and accounts for bonuses.</td>
      <td>BIA bills, collects, and accounts for rental on a least prior to BLM notice of first production.</td>
      <td>After production, ONRR collects, accounts for, and deposits rentals, royalties, and compliance-based collections. BIA collects other collections, such as payment for surface damages.</td>
    </tr>
    <tr>
      <td>Solid minerals</td>
      <td>BIA bills, collects, and accounts for bonuses.</td>
      <td>BIA bills, collects, and accounts for rental prior to production.</td>
      <td>BIA bills, collects, and accounts for rentals post-production. Companies submit royalty and production reports to ONRR, but ONRR may not collect royalty payments unless BIA requests it. Companies deposit payments into OST- or tribal-owned lockboxes or mail checks to individual allottees. BIA collects other collections, such as water payments or payments for surface damages.</td>
    </tr>
  </tbody>
</table>

Exceptions exist to this process: notably, tribal lease direct payment, when a tribe collects and accounts for all payments except the bonus. Additionally, mineral owners of allotted leases may request that payments be made directly to them. BIA approves or denies these direct pay requests. The amounts paid for extraction on tribal lands vary by tribe and are not publicly available.

In the case of an {{ "IMDA" | term }} agreement, the tribe collects taxes and non-trust revenue.

## Revenue distribution

When the federal government collects payments, they're generally deposited into trust accounts managed by the Office of the Special Trustee for American Indians (OST). When deposits are made into an OST-owned lockbox, OST deposits the funds into a trust account. When deposits are made into a tribal-owned lockbox, the tribe receives the funds directly.

ONRR provides a financial distribution report called an Explanation of Payment report (EOP) to tribes. For allottees, ONRR provides the collection information to BIA to create the EOP which outlines the distribution for each mineral owner. OST then transfers funds from the OST treasury account to either the mineral owner’s individual account or make a payment via check or automated clearing house payment to the mineral estate owner.

## Revenue data

The federal government may only release information about natural resource extraction and revenue in aggregate across all Indian lands. This is because of confidentiality and proprietary constraints on tribal data. These constraints arise from treaties, laws, and regulations that the government consistently and uniformly applies.

In the tables below, revenue may be grouped differently depending on the stage of production; see [documentation about the federal revenue dataset]({{ site.baseurl }}/downloads/federal-revenue-by-location/) for more detailed explanations.

{% for year_revenue in site.data.tribal_revenue reversed %}

### Revenue from natural resources on Indian land (FY {{ year_revenue[0] }})

<table class="table-basic u-margin-top u-margin-bottom">
  <thead>
    <tr>
      <th>Commodity</th>
      {% for revenue_type in page.revenue_types %}
      <th>{{ revenue_type[1] }}</th>
      {% endfor %}
    </tr>
  </thead>
  <tbody>
  {% for commodity in year_revenue[1] %}
    <tr>
      <td>{{ commodity[0] }}</td>
      {% for revenue_type in page.revenue_types %}
        {% assign _revenue_type = revenue_type[0] %}
        {% assign _revenue = commodity[1][_revenue_type] %}
      <td class="numeric">{% if _revenue %}{{ _revenue | round | intcomma_dollar }}{% else %}-{% endif %}</td>
      {% endfor %}
    </tr>
  {% endfor %}
  </tbody>
</table>
{% endfor %}

## Audits and assurances

Tribal revenue data, like federal revenue data, is subject to standards, audits, and assurances. These include:

- The [Onshore Energy and Mineral Lease Management Interagency Standard Operating Procedures (PDF)](https://www.onrr.gov/about/pdfdocs/FINAL%20Interagency%20SOP%20-%2009-23-13.pdf) outlines the procedures that BLM, ONRR, and BIA follow to verify and enforce compliance for production and revenue collection from Indian lands
- The [Indian Self-Determination and Education Act (Public Law 93-638)](https://www.doi.gov/ost/tribal_beneficiaries/contracting) and Section 202 of the [Federal Oil & Gas Royalty Management Act of 1982 (PDF)](https://www.boem.gov/uploadedFiles/BOEM/Oil_and_Gas_Energy_Program/Leasing/Outer_Continental_Shelf/Lands_Act_History/federal%20og%20royalty%20mgmt.pdf) (FOGRMA) outline how DOI may contract with a tribe to perform compliance activities
- The Office of the Special Trustee for American Indians (OST) [Annual Report of the Tribal and Other Trust Funds and Individual Indian Monies Trust Funds Managed by the U.S. Department of the Interior OST](https://www.doi.gov/ost) includes the annual auditor’s report for tribal and other trust funds under the [American Indian Trust Fund Management Reform Act of 1994 (PDF)](https://www.doi.gov/sites/doi.gov/files/migrated/ost/trust_documents/upload/American-IndianTrustFundManagementReformActof1994.pdf). [Archived audits are available here](https://www.doi.gov/ost/trust_documents/Annual-Audits).
