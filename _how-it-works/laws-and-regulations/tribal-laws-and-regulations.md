---
title: Tribal Laws and Regulations | How It Works
layout: content
permalink: /how-it-works/tribal-laws-and-regulations/
nav_description: Jump to a section
nav_items:
  - name: introduction
    title: Top
  - name: federal-obligations
    title: Federal obligations
  - name: leasing-process
    title: Leasing process
  - name: production-on-indian-land
    title: Production
  - name: revenue-from-natural-resources-on-indian-land
    title: Revenue
description: Learn more about natural resource regulation, production, and revenue in the 18 states that, in 2013, led the country in oil, gas, coal, and nonenergy mineral production; had the most DOI revenue and / or state production taxes; or had the most significant tribal natural resource interest.
tag:
- How it works
- Tribal laws and regulations
- Leasing
- Production
breadcrumb:
  - title: How it works
    permalink: /how-it-works/
title_display: Tribal laws and regulations
selector: list
revenue_types:
  Bonus: Bonus
  Rents: Rents
  Reported Royalties: Royalties
  Other Revenues: Other Revenue
---

> According to the 2011 American Community Survey conducted by the U.S. Census, there were 5.1 million American Indians and Alaska Natives living in the United States, accounting for approximately [1.6% of the population](https://www.census.gov/newsroom/releases/archives/facts_for_features_special_editions/cb12-ff22.html).

{% include selector.html %}


## Leasing process

Today, there are [two major types of Indian-owned land](http://teeic.indianaffairs.gov/triballand/):

* Trust land, in which the federal government holds legal title, but the beneficial interest remains with individual or tribe. Trust lands held on behalf of individuals are known as allotments.
* Fee land purchased by tribes, in which the tribe acquires legal title under specific statutory authority

These lands yield natural resources through a process governed primarily by the tribes themselves and four agencies within DOI. When a tribe initiates the leasing process, BIA or the tribe itself negotiates the lease sale, sets royalty rates and rental amounts, and issues the lease. If the tribe negotiates the lease, the BIA will approve the final negotiated deal. For an allotment owned by an individual, the BIA holds a bidding process to ensure the best return for the allottee. Once a contract is signed, BLM inspects the lease and helps prepare production and mining plans.

ONRR collects royalties from extractive companies and reviews monthly revenue and production reports to ensure accuracy. ONRR also performs lease audits to ensure royalties are correctly paid.

The Office of the Special Trustee for American Indians (OST) receives the payments and information from ONRR and [disburses 100% of the funds to the owner of the land (PDF)](http://www.onrr.gov/IndianServices/pdfdocs/FrequentlyAskedQuestion.pdf), whether that is an individual or a tribe.

## Production on Indian land

Natural resources are increasingly a key source of income for many American Indian tribes. **In FY 2016, ONRR and {{ "OST" | term }} disbursed [$560.4 million to American Indian tribes and allottees](http://statistics.onrr.gov/ReportTool.aspx).** This is accounting year data.

<table class="table-basic">
  <thead>
    <tr>
      <th>Commodity</th>
      <th>FY 2013</th>
      <th>FY 2014</th>
      <th>FY 2015</th>
      <th>FY 2016</th>
    </tr>
  </thead>
  <tr>
    <td>Oil (bbl)</td>
    <td class="numeric">49,244,502</td>
    <td class="numeric">60,173,618</td>
    <td class="numeric">64,145,576</td>
    <td class="numeric">58,570,842</td>
  </tr>
  <tr>
    <td>Gas (mcf)</td>
    <td class="numeric">313,218,037</td>
    <td class="numeric">324,457,237</td>
    <td class="numeric">316,547,513</td>
    <td class="numeric">317,746,651</td>
  </tr>
  <tr>
    <td>Cinders (ton)</td>
    <td class="numeric">7,021</td>
    <td class="numeric">4,926</td>
    <td class="numeric">7,835</td>
    <td class="numeric">2,992</td>
  </tr>
  <tr>
    <td>Coal (ton)</td>
    <td class="numeric">17,710,995</td>
    <td class="numeric">20,270,190</td>
    <td class="numeric">19,675,009</td>
    <td class="numeric">13,925,942</td>
  </tr>
  <tr>
    <td>Coal-Bituminous-Raw (ton)</td>
    <td class="numeric">6,034</td>
    <td class="numeric">935</td>
    <td class="numeric">-</td>
    <td class="numeric">-</td>
  </tr>
  <tr>
    <td>Copper Concentrate (ton)</td>
    <td class="numeric">3,177</td>
    <td class="numeric">-</td>
    <td class="numeric">8,476</td>
    <td class="numeric">159</td>
  </tr>
  <tr>
    <td>Gypsum (ton)</td>
    <td class="numeric">328,196</td>
    <td class="numeric">310,828</td>
    <td class="numeric">229,131</td>
    <td class="numeric">385,257</td>
  </tr>
  <tr>
    <td>Humate (ton)</td>
    <td class="numeric">-</td>
    <td class="numeric">-</td>
    <td class="numeric">-</td>
    <td class="numeric">14,202</td>
  </tr>
  <tr>
    <td>Molybdenum Concentrate (ton)</td>
    <td class="numeric">0</td>
    <td class="numeric">-</td>
    <td class="numeric">11</td>
    <td class="numeric">13</td>
  </tr>
  <tr>
    <td>Sand/Gravel (ton)</td>
    <td class="numeric">2,605,479</td>
    <td class="numeric">1,410,816</td>
    <td class="numeric">622,816</td>
    <td class="numeric">2,042,576</td>
  </tr>
  <tr>
    <td>Sand/Gravel (cyd)</td>
    <td class="numeric">7,260</td>
    <td class="numeric">7,860</td>
    <td class="numeric">5,688</td>
    <td class="numeric">5,184</td>
  </tr>
  <tr>
    <td>Geothermal (kwh)</td>
    <td class="numeric">1,695,636</td>
    <td class="numeric">1,784,470</td>
    <td class="numeric">1,502,682</td>
    <td class="numeric">1,508,963</td>
  </tr>
</table>

## Revenue from natural resources on Indian land

Much like [federal revenue]({{ site.baseurl }}/explore/#revenue), revenue from natural resource extraction on tribal land is collected in each phase of the production process (for instance, companies pay bonuses to secure rights, rents during exploration, and royalties once production begins).

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
      <td class="numeric">{% if _revenue %}{{ _revenue | intcomma_dollar }}{% else %}-{% endif %}</td>
      {% endfor %}
    </tr>
  {% endfor %}
  </tbody>
</table>
{% endfor %}

The federal government may only release information about natural
resource extraction and revenue in aggregate across all Indian
lands. This is because of confidentiality and proprietary
constraints on tribal data. These constraints arise from treaties,
laws, and regulations that the government consistently and uniformly
applies.
