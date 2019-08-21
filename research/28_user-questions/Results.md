# Results

## Test method
30-60 minute interviews with 13 people, including 1 internal ONRR user, 4 from other federal agencies, 4 from state, county, and tribal governments, 2 from NGOs, 1 journalist, and 1 from industry.

## Who we interviewed
6 Domain Learners, 5 Question Answerers, 1 Agenda Supporter, 1 Storyteller
![Users interviewed on a matrix by type](https://github.com/ONRR/doi-extractives-data/blob/research/research/28_user-questions/user-questions-usertypes.PNG)

## User questions findings

We compiled the top categories of questions across user types and revised our user scenarios for each user type based on what we learned in this study, plus an analysis of previous user interview findings, FOIA requests, requests to our data retrieval team, and congressional inquiries.

### Top question categories
* Revenue (how much money came in)
* Information about a specific company, lease, or well
* Data for a geographic area (state, county, offshore region, basin)
* Data for a specific commodity (oil, gas, coal, geothermal, etc.)
* Disbursements (where the money went)
* Production (how much came out of the ground)
* Data broken out by revenue type (royalties, rent, bonuses, etc.)
* I can spot and understand trends in the data.

### Question answerer scenarios
* A congressional staffer needs specific, accurate data on oil royalties and disbursements because they need to provide support for a proposed bill. They’re able to quickly and easily find data about how much oil was produced on federal land in their state, how much royalty revenue was generated, and how much their state got.
* An external liaison for ONRR frequently fields questions from the public and congress for things that could be answered on the site, such as how much money the Gulf of Mexico generated from GOMESA. They look in databases for the answer to the question first, but use the site to verify the answer or for things they can point the question asker directly to on the site.
* A BLM economist uses our site to look up how much revenue and production companies had to verify whether North Dakota got the right amount of money (royalties) and who to audit. Looks at calendar year typically because every level they work with has a different fiscal year.

### Domain learner scenarios
* A new county commissioner in a western state with significant oil and gas production on federal land ran for office largely on a platform of government transparency and accountability and wants to know how extractive revenues from federal land are disbursed at the state and county level. Using the site, they are able to find out how much was disbursed to their county and state each month, which allows them to hold the state accountable, advocate for their constituents, and inform public debate about extractive industry in her county.
* A leader of a tribal nation is concerned about the layers of bureaucracy involved in tribal land governance and is working with the federal government to simplify the process for land-use authorization. They are able to find information on the tribal leasing process to inform their efforts.
* An analyst from Intergovernmental Affairs in the Office of the Secretary routinely pulls data to inform their interactions with Interior stakeholders. They have only one week to generate a GOMESA disbursements data trend analysis to present to Gulf state elected officials. They are able to find detailed, up-to-date GOMESA raw data to use as the basis of the analysis.
* A public affairs officer from an oil company uses our website to get numbers to use in press releases about their company’s extractive activities and to do comparisons against other companies.  They know the numbers are good to use because they come from a government site.

### Agenda supporter scenarios
* A analyst for an NGO is concerned about increasing volumes of oil being transported by train through their state following a recent derailment. They want to determine if oil production on federal lands has recently increased to help interpret transportation-related risks to their state. The analyst can easily find data that they trust for oil production on federal lands to use that along with state production and export volumes, from other sources, to complete the analysis. They also want to be able to pinpoint specific companies that have production in the area around the derailment, so they can be held accountable.

### Storyteller scenarios
* A professor of public policy at a major university is writing an academic article focusing on how public land management balances recreation, energy production, and conservation priorities. They are able to locate federal production volumes and locations on the NRRD site and are able to use that data to inform their points in the article about federal government land-use policy.
* A journalist at a major regional news outlet is writing a story about policy claims about energy production on public land. They’re able to find data about production trends both at the national and regional/state level and how those numbers tie to policy, which helps them back up their story with accurate numbers that haven’t been influenced by personal or political objectives.

## Prototype findings

### Homepage
We tested these hypotheses:
* The new tab styling is enough of an affordance to know that the tabs are clickable.
  * Result: TRUE
* Users can get where they want to go from the homepage.
  * Result: TRUE
* The new design helps users understand the pieces of the process.
  * Result: Inconclusive - we would need to test with users unfamiliar with the site to gauge this.
* The use of orange in the revenue trends isn’t polarizing.
  * Result: TRUE

### Filterable tables

#### Download vs. filter
* Users want to filter data on the website instead of downloading and pivoting the data in Excel.
  * 6/12 participants articulated this desire prior to seeing the filterable table.
  * 11/12 participants thought it was a useful feature after seeing the table.
  * Result: TRUE

#### Getting to the tables
* The link to the filterable table is clear to users.
  * Most participants were unclear about what the link would do.
  * 1 participant in this study and 1 in the hallway test thought “specific revenue number” might refer to the API or lease number.
  * Many participants expected to click on the charts to get to more detail.
  * Suggestions: Detailed revenue information, Revenue by commodity, Find a specific mineral number, Reach a specific state or commodity
  * After 7 participants, we decided to try something new.
  * What we tried next
    * Since most of the suggestions users came up with had to do with specific filters they used, we tried changing the label to “Filter revenue data”. Because many participants expected to click on the graph to get to more details, we tried moving the link closer to the graph.
    * So far, participants still aren’t using the link.  Maybe it’s not a bad thing?
    * People like the table when they see it, but they don’t expect it.  They would get the most value in clicking on a graph as the entry point to the tables.
  * When asked where they would go to get more detailed information, most participants wanted to click on graphs or maps to drill into the detail.
  * Result: FALSE

#### Table mechanics
* Separating filters and column selection/grouping helps users understand how to interact with the table.
  * Version 1: Both participants didn’t notice the filters right away.
  * Revision 1: 3/4 participants didn’t notice the filters right away. We decided to try removing the copy at the top of the page that nobody seemed to be reading and make the filters more visible.

* Consistent behavior with the Apply button helps users understand how to interact with the table.
  * Result: TRUE
* Users expect making selections in one filter to update the options available in the other filters.
  * Result: TRUE
* Users think of the grouping options as columns.
  * Version 1: The two participants who saw the first version didn’t see the “Change columns” selector and didn’t get what it updated when they were shown what was in it.
  * Revision 1: 5 participants saw this version and none of them noticed the option to choose columns. Most understood what it did after opening the selector, but couldn’t articulate a better label. We decided to try moving the filters out of the selector and relabeling them as “breakdowns” to see if that helped.
* Users want to filter by as many options as possible.
  * Result: TRUE
* Users understand how to interact with the timeframe selection section and find it useful.
  * Result: TRUE
* Downloading filtered data is a useful feature.
  * Result: TRUE
* Users think of the grouping options as breakdowns.
  * Revision 2: There wasn’t much improvement here.  Maybe a slight bit.
* Putting headers over the filter and breakdown options might help users understand the difference.
  * Revision 2: This didn’t help at all. Another factor that may be at play here is that there’s no column header on the Revenue Type column.  Several participants only noticed that it was broken out by Commodity.
* The copy at the top of the page is unnecessary and prevents users from seeing the filters or understanding how to interact with them.
  * Result: TRUE
* Putting the selections into a slab makes them more visible.
  * Result: TRUE

#### Replicating the stats page

* Selecting options before seeing the table is more intuitive to users than interacting with filters.
  * There was a slight preference for the version with the table shown first because it has more filtering functionality and presents the data up front.
  * Each person wants to group the data differently.
  * However, participants still didn’t get the breakdown/grouping functionality with Option A.
  * Given that users mostly want to get to the detailed data by clicking on charts or maps, the order in which filtering happens, isn’t very important.

#### Filterable table requirements
Given what we've learned about how users interact with and access the filterable tables, it is a requirement that the filterable table:
* Allows filtering by anything that can be presented in a chart.
  * Filters should include: land category, location, commodity, and revenue type.
  * Filters are smart enough to only allow selections that are valid given selections in other filters.
  * The apply button updates the table view and has no impact on the filter selections.
  * Users can select multiple options from each filter.
* Provides enough grouping functionality that will facilitate linking to logical table views from charts on the site.
  * Doesn’t overwhelm users with the grouping functionality, but has it available if it’s desired.
* Includes a column header for every visible column.
* Facilitates adjusting the filters after arriving to a pre-filtered view.
* Enables users to download just the data they’ve filtered to, but includes all columns for that data to allow more detailed pivoting.
* Allows viewing data in fiscal year, calendar year, and monthly timeframes.

### State pages
* Key facts: Most important facts show the scope of the data for the state, such as the federal ownership percentage and top commodities.
* Links to state websites: Two participants suggested linking out to the state websites, so they can easily get the detailed state information they need.

### Summary of RecommendationsImplement the homepage.
* Revise the filterable table to meet requirements.  
* Get the filtered url for the filterable table.
* Add links to the filterable table from charts and state pages.
* Make updates to state pages.
