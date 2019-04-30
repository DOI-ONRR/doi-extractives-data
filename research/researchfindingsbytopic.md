This is a summary of the open research findings, by topic, so we can get a sense for trends across studies and help prioritize fixes.
# Planned updates
These are topics for which we have explore solutions and have in the plan to address.

## Explore Data split
| Severity | Frequency |
| - | - |
| High | 30+ participants |

Studies: Home Page Sept 2018, Key Facts/Explore Data Aug 2018, Key Facts June 2018, Disbursements Round 1 May 2018, Inquisitive impala (unknown #), Randy Roo (unknown #), Splashy Sunfish (unknown #)

### Details

The current Explore Data page is unwieldy.  
- The map at the top doesn't orient users to what is on the page
- Download functionality is buried when users expect the two functions to be integrated
- Many users don't make it to the bottom or see all the sections because it's so long
- Many users get lost in the middle of the page
- Users don't get a good sense of what the sections (production, revenue, and disbursements) are about and how they relate to each other
 
 | Solution | Github Issue(s) |
 | - | - |
 | Split up the Explore Data page. | [Split up Explore Data page](https://github.com/ONRR/doi-extractives-data/issues/3197) <br> [Label tracking all issues in this epic](https://github.com/ONRR/doi-extractives-data/labels/Explore%20Data%20Split)|
 
## Tables and data manipulation
### Slicing and dicing data
 | Severity | Frequency |
| - | - |
| High | 16 participants |

Studies: October 2018 Interviews, Key Facts/Explore Data Aug 2018, Key Facts June 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018, Disbursements Interviews Apr 2018

#### Details
Users want to be able to filter and drill down into information without having to download and manipulate a spreadsheet.

| Solution | Github Issue(s) |
 | - | - |
 | Add filterable tables.  We have planned for disbursements and will add for production and revenue later. | [Disbursements](https://github.com/ONRR/doi-extractives-data/issues/3187)|

### Tables vs. charts
 | Severity | Frequency |
| - | - |
| High | 14+ participants |

Studies: Key Facts June 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018, Sarcastic Seacow (unknown #)

#### Details
Users like charts, but note that they aren't as useful as tables unless they happen to answer their specific question.

| Solution | Github Issue(s) |
 | - | - |
 | Add filterable tables.  We have planned for disbursements and will add for production and revenue later. | [Disbursements](https://github.com/ONRR/doi-extractives-data/issues/3187)|
 
 ### Stats page
  | Severity | Frequency |
| - | - |
| High | 6+ participants |

Studies: October 2018 Interviews, Disbursements Interviews Apr 2018, Cheesey cheetah (unknown #)

#### Details 
Users want all the funcitonality we had on the stats page.

| Solution | Github Issue(s) |
 | - | - |
 | We'll be adding some of this with the filterable tables. | [Disbursements](https://github.com/ONRR/doi-extractives-data/issues/3187)|
 
## Getting to data
   | Severity | Frequency |
| - | - |
| Medium | 12+ participants |

Studies: Disbursements Interviews Apr 2018, Key Facts/Explore Data Aug 2018, Inquisitive impala (unknown #), Home Page Sept 2018, Sarcastic Seacow (unknown #)

### Details
The narrative gets in the way of finding data.

| Solution | Github Issue(s) |
 | - | - |
 | Make links to download more prominent. | [Home page](https://github.com/ONRR/doi-extractives-data/issues/3287) <br> [Explore Data page](https://github.com/ONRR/doi-extractives-data/issues/3197) <br> [Table view](https://github.com/ONRR/doi-extractives-data/issues/3187) |

## Revenue by company
 | Severity | Frequency |
| - | - |
| Medium | 11 participants |

Studies: Key Facts/Explore Data Aug 2018

### Details
Participants liked both versions of Revenue by Company summary and several suggested combining the two.

| Solution | Github Issue(s) |
 | - | - |
 | Add the combined version of Revenue by Company to Explore Data.  | [Revenue by company](https://github.com/ONRR/doi-extractives-data/issues/2805) |
 
 ## Commodity data
  | Severity | Frequency |
| - | - |
| Medium | 10 participants |

Studies: October 2018 Interviews, Key Facts June 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018

### Details
Commodity data is important.

| Solution | Github Issue(s) |
 | - | - |
 | Add commodity data for disbursements. | [Disbursements with commodity](https://github.com/ONRR/doi-extractives-data/issues/2890) |
 
 ## Native American revenue
   | Severity | Frequency |
| - | - |
| Medium | 9 participants |

Studies: Key Facts/Explore Data Aug 2018

### Details
Users understood the table for Native American revenue much better than the graphic.

| Solution | Github Issue(s) |
 | - | - |
 | Use the table view for Native American revenue and consider using it for federal revenu, as well. | [Native American revenue table](https://github.com/ONRR/doi-extractives-data/issues/3178) |
 
## Bar chart top line
   | Severity | Frequency |
| - | - |
| Medium | 5 participants |

Studies: Key Facts/Explore Data Aug 2018

### Details
Participants didn't understand what the top line on the bar charts stood for.

| Solution | Github Issue(s) |
 | - | - |
 | Right alight the label and if that doesn't work for users, explore other options. | [Home page](https://github.com/ONRR/doi-extractives-data/issues/3293) <br> [Other charts](https://github.com/ONRR/doi-extractives-data/issues/3174) |
 
 ## Left vs. right nav

| Severity | Frequency |
| - | - |
| Medium | 5 participants |

Studies: Key Facts/Explore Data Aug 2018

### Details
Nav on the left is more familiar to users than on the right.  This may also be contributing to the higher severity and frequency issues around knowing where you are on the Explore Data page.

| Solution | Github Issue(s) |
 | - | - |
 | Move nav to the left. | [Left nav](https://github.com/ONRR/doi-extractives-data/issues/3197) |

## Search
| Severity | Frequency |
| - | - |
| Low | 6 participants |

Studies: Home Page Sept 2018, Key Facts/Explore Data Aug 2018, Disbursements Round 2 June 2018

### Details
Participants had issues with the search functionality.
- It isn't clear which results are internal vs. external
- Search doesn't return pages users expect
- Tags in search results look like links to pages, but function as filters

| Solution | Github Issue(s) |
 | - | - |
 | We already addressed the external links issues and still need to update the tag styling. | [Tag style](https://github.com/ONRR/doi-extractives-data/issues/3144) <br> [External links](https://github.com/ONRR/doi-extractives-data/issues/2981) |
 
 # Open topics
 These are topics that we need to explore further before deciding on a solution.
 ## Trend analysis
 | Severity | Frequency |
| - | - |
| Medium | 20+ participants |

Studies: October 2018 Interviews, Key Facts/Explore Data Aug 2018, Key Facts June 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018, Cheesey cheetah (unknown #), Sarcastic Seacow (unknown #)

### Details

Participants want the data to go back as far as possible for all time to get at what’s going on now compared to previously and understand context.

 
 | Solution | Github Issue(s) |
 | - | - |
 | Add data for more years and show longer trends.  Spark lines may be good for this. | [Trend analysis](https://github.com/ONRR/doi-extractives-data/issues/2581) |

## Language: "source"
 | Severity | Frequency |
| - | - |
| Medium | 14 participants |

Studies: October 2018 Interviews, Key Facts/Explore Data Aug 2018, Key Facts June 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018

### Details
Users have had trouble with the use of the word "source."
- Alternatives users have suggested: origin, place things are being disburse to, program, land category

 | Solution | Github Issue(s) |
 | - | - |
 | Explore alternatives to the word "source." | None |
 
 ## Revenue graphic
  | Severity | Frequency |
| - | - |
| Medium | 9+ participants |

Studies: October 2018 Interviews, Key Facts/Explore Data Aug 2018, Randy Roo (unknown #)

### Details
People are confused by the Revenue by Phase graphic.
- They are confused about what's being added up to create the empty bars.

 | Solution | Github Issue(s) |
 | - | - |
 | Consider different displays for federal revenue. | [Revenue graphic](https://github.com/ONRR/doi-extractives-data/issues/3176) |
 
 ## Year types
   | Severity | Frequency |
| - | - |
| Medium | 9 participants |

Studies: Key Facts/Explore Data Aug 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018

### Details
Users are confused about whether data is for the fiscal or calendar year.  Most are okay with having one year type, but want it to be consistent and clearly labeled.

| Solution | Github Issue(s) |
 | - | - |
 | Consider whether we can use the same year type for all data and clearly label which we're using. | None |
 
 ## Explanations
| Severity | Frequency |
| - | - |
| Medium | 8 participants |

Studies: Key Facts/Explore Data Aug 2018, Key Facts June 2018, Disbursements Round 2 June 2018

### Details
Participants wanted to get explanations for why numbers were off or changed.

| Solution | Github Issue(s) |
 | - | - |
 | Consider providing explanations when we can. | None |
 
 ## Drill down
 | Severity | Frequency |
| - | - |
| Medium | 7 participants |

Studies: Key Facts/Explore Data Aug 2018

### Details
Users want to be able to click on charts to drill into more details.

| Solution | Github Issue(s) |
 | - | - |
 | Consider this for future chart designs.  We're piloting this with the Revenue by Company graphic. | https://github.com/ONRR/doi-extractives-data/issues/2805 |
 
## Data available
 | Severity | Frequency |
| - | - |
| Low | 6 participants |

Studies: Key Facts June 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018, Disbursements Interviews Apr 2018

### Details
Data that isn’t available is a pain point.
- Prices and volume in the disbursements table.
- Flaring & venting and royalty relief volume 
- Further breakouts of where the money is going (U.S Treasury by agency, by program)

| Solution | Github Issue(s) |
 | - | - |
 | Consider adding this type of data. | None |
 
 ## Lease level data
 | Severity | Frequency |
| - | - |
| Medium | 6+ participants |

Studies:  October 2018 Interviews, Key Facts/Explore Data Aug 2018, Key Facts June 2018, Sarcastic Seacow (unknown #)

### Details
Users want lease, well (API number), and company/operator data.

| Solution | Github Issue(s) |
 | - | - |
 | Add lease and well level data to the site. | [Label with all issues on this topis](https://github.com/ONRR/doi-extractives-data/labels/Lease%20Level%20Research) |
 
 ## Chart coloring
  | Severity | Frequency |
| - | - |
| Medium | 5 participants |

Studies: Home Page Sept 2018, Key Facts/Explore Data Aug 2018

### Details
Users have had some issues with chart colors.
- Not enough differentiation between shades.
- Using the same colors to represent different things on charts on the same page.

| Solution | Github Issue(s) |
 | - | - |
 | We need to update some of the older charts to more differentiated colors. | None |
 
 ## Comparison & context
  | Severity | Frequency |
| - | - |
| Medium | 5+ participants |

Studies: Key Facts/Explore Data Aug 2018, Disbursements Round 1 May 2018, Inquisitive impala (unknown #), Sarcastic Seacow (unknown #)

### Details
Users want more functionality to facilitate comparing and getting context for numbers.
- Different measurement units for production.
- Not knowing how much production of a given commodity gets you. (i.e. it can power X number of lightbulbs or train cars)
- Comparisons against other countries
- Local to national comparison

| Solution | Github Issue(s) |
 | - | - |
 | Provide more comparison data. | None |
 
 ## Map coloring
  | Severity | Frequency |
| - | - |
| Low | 5 participants |

Studies: Home Page Sept 2018

### Details
The map coloring has caused issues for some users.
- Offshore regions make the map less recognizable
- People don't read the key
- The colors are too close together to be able to easily distinguish

| Solution | Github Issue(s) |
 | - | - |
 | Revisit the map design, since many users don't get that it's showing ownership and offshore may cause some confusion. | https://github.com/ONRR/doi-extractives-data/issues/3281 |
 
 ## Revenue by company page
  | Severity | Frequency |
| - | - |
| Low | 4 participants |

Studies: October 2018 Interviews, Key Facts/Explore Data Aug 2018

### Details
Participants had suggestions for improving the Revenue by Company page.
- Drill into the companies to see what commodities they have
- Filter by multiple commodities
- Total should be on the bottom instead of top
- It isn't clear what you've filtered by and the order of operations when applying multiple filters
- Needs more color

| Solution | Github Issue(s) |
 | - | - |
 | TBD | None |
 
 ## Withheld data
  | Severity | Frequency |
| - | - |
| Low | 4 participants |

Studies: October 2018 Interviews, Key Facts/Explore Data Aug 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018

### Details
People are confused by withheld data.
- The one participant who saw the withheld data design didn't understand it.
- Noted that withheld means it's not actually open data
- She didn’t know everything that was proprietary, even as someone who works for ONRR, so we could dig into what’s proprietary.
- Noted that he needs clarity around withheld numbers. (P1)
- Wants withheld data rolled up at the higher levels (i.e. include withheld counties in the state total).

| Solution | Github Issue(s) |
 | - | - |
 | TBD | https://github.com/ONRR/doi-extractives-data/issues/2023 |
 
 ## Sales year
  | Severity | Frequency |
| - | - |
| Low | 4+ participants |

Studies: October 2018 Interviews, Disbursements Interviews Apr 2018, Stats Page (unknown #)

### Details
Sales year data isn't as useful. When asked a few have said it might be useful, but couldn't provide a clear use case for when they would use it.

| Solution | Github Issue(s) |
 | - | - |
 | Consider putting sales year data on the site. | https://github.com/ONRR/doi-extractives-data/issues/2580 |
 
 ## Production chart order
  | Severity | Frequency |
| - | - |
| Low | 3 participants |

Studies: Key Facts/Explore Data Aug 2018

### Details
A few participants mentioned that it would make more sense to organize production by volume.

P5: It would be nice if you could reorganize based off the size of contribution to federal revenue
P8: Didn’t like how production is sorted alphabetically.  Wanted highest volume products (oil, gas, coal) first.  Liked what we had for this on Explore B.
P10: Wanted Coal, Gas, and Oil to be highlighted at the top of production because they are highest volume.

| Solution | Github Issue(s) |
 | - | - |
 | Consider organizing the bar charts by volume to make it clear which commodities have the largest impact. | https://github.com/ONRR/doi-extractives-data/issues/3181 |
 
 ## Production rankings
  | Severity | Frequency |
| - | - |
| Low | 4 participants |

Studies: Lease Level Interviews, October 2018 Interviews, Sarcastic Seacow (unknown #)

### Details
Participants would use rankings to compare against other data. One said they expected them to be wrong because EIA updates their data more frequently. One would compare against data from the states and one wants to compare changes over time.

In general, I literally spent like 10 minute on this, I wanted to know where the revenue comes in Coconino County. I’d be sweet if -- maybe I didn’t click the right spot -- I’d like to know what industry that revenue is coming from in my county. And how Coconino County compares to other counties. It sounded like the site ranked states, but could counties be ranked, too? And is there a way to follow that money to county coffers? Or is there a way to compare costs to counties to the revenue? What sort of impacts these counties have? Revenues coming in versus how much the county estimated they would spend. Because that’s where the interesting things are, right? Is the county getting a benefit for the spend.

| Solution | Github Issue(s) |
 | - | - |
 | Consider whether this would add value to the site. | https://github.com/ONRR/doi-extractives-data/issues/2310 |
 
 ## Printing
  | Severity | Frequency |
| - | - |
| Low | 3+ participants |

Studies: Lease Level Interviews, October 2018 Interviews, Disbursements Round 1 May 2018, Sarcastic Seacow (unknown #)

### Details
One participant prints things out, so she can refer to them later. Also makes screenshots of data she wants to refer back to and drops them in a doc.

Notes that congressional users print the screen. (P3)

Also, the site didn’t print well. Lots of white space, not as impactful. I went to print this so I could send it to our board in the way that we usually send emails (attachments with more information). I would have liked the list of state rankings and amount of revenue per state. And the case study. Since it didn’t work, we provided the link, but I’m not sure anyone clicked on it. Our board members aren’t going to go surfing the internet. Data people, sure.

Has seen other people printing.

Could be using printouts to compare line items in an audit.


| Solution | Github Issue(s) |
 | - | - |
 | Revisit printing functionality. | https://github.com/ONRR/doi-extractives-data/issues/2220 |

 
 # Tabled topics
 These are topics that are low frequency or we've decided not to address that we should watch for in the future in case they become higher frequency.
 
| Topic |	Finding | Frequency |	Studies |
| - |	- | - |	- |
| Glossary: More Terms | Participants wanted more glossaries than we currently have. <br> - Missing terms: bonuses, AML fees, revenue, disbursements, GOMESA, 8(g)" | 5 participants | Key Facts/Explore Data Aug 2018 <br> Key Facts June 2018 <br> Disbursements Round 1 May 2018 |
| Saving Data |	Nobody wanted the ability to save filters because they usually don't need to answer the same question twice. |	5	participants | Disbursements Round 1 May 2018 |
| Email Data |	Many participants liked the option to email the data, but had mixed expectations about what would be emailed. |	4	participants | Disbursements Round 1 May 2018 |
| Case Studies	| User like the case studies. <br> He’s interested in comparing against other counties and thought the case studies were an interesting way to do this. |	3	participants | Home Page Sept 2018 <br> Key Facts/Explore Data Aug 2018 <br> Key Facts June 2018 |
| Create Charts	| Users want to be able to create their own charts from the data using the site.	| 3	participants | October 2018 Interviews <br> Key Facts June 2018 <br> Disbursements Interviews Apr 2018 |
| Revenue & Disbursements | A couple participants noticed that revenue and disbursements didn't match up. <br> P4: Noticed that revenue and disbursements don’t match up. <br> P5: Disbursements: Ok, so I’m looking at all funds, doesn’t seem like it is quite the same number as revenues <br> Wants to see revenue and disbursements data tied together, so he can track funds across the process. |	3	participants | Key Facts/Explore Data Aug 2018 <br> Disbursements Round 2 June 2018 |
| EITI	| Noted that we need to be clear about what we're keeping from EITI and what our mission is now.	| 2 participants |	Disbursements Round 2 June 2018 |
| Chart interactivity	| Users want the summary graphics to be interactive.	| 2	participants | October 2018 Interviews <br> Key Facts/Explore Data Aug 2018 |
| IE Bugs | Bugs in IE: Overlapping links on About page in Gatsby, broken map <br> She uses IE and the site is broken. | 2 participants | Home Page Sept 2018 <br> Disbursements Round 2 June 2018 |
| Language: Extractive	| Thought the word “extractive” might be construed as political, but couldn’t come up with a better word. <br> I’m not exactly sure what “extractive industries” means, but I like the summary | 2 participants | Home Page Sept 2018 <br> Key Facts/Explore Data Aug 2018 |
| Language: Federal (on state pages) | Am I still just on the State of TX? I guess so, but I’m confused when I see federal revenue <br> Possibly because the federal land percentage was the first thing visible, one user expressed confusion about whether the entire scope of the page would be limited to federal land. (on a state page) |	2 participants | Key Facts/Explore Data Aug 2018 <br> Randy Roo |
| Number Formats	| Wasn’t sure if the GOMESA numbers were in thousands. <br> Thinks in terms of how budget formats for numbers (expected ,000s to be cut off) (P5) | 2 participants |	Key Facts June 2018 |
| Bar Chart Interaction |	Users are confused by the interactivity on the vertical bar charts.	| 1 participant |	Key Facts/Explore Data Aug 2018 |
| Community	| Wants a community of people who are interested in this, but hasn’t found one.	| 1 participant |	Disbursements Round 2 June 2018 |
| Data Summary |	Users want to see numbers on the charts.	| 1 participant |	October 2018 Interviews |
| Download	| Users don't know what the Download Data link in the header is for.	| 1	participant | Home Page Sept 2018 |
| Economic Impact | Liked GDP and employment data. <br> People really gravitated to this section, and seemed to understand why this was an important measure. <br> One tester wanted to be able to sort this table by number or percentage. <br> Several testers had existing perceptions about extractives employment, and were looking at this section to validate those perceptions. <br> There’s huge concern about native rights, subsistence rights, access, scope, — what’s most important is often about the impact on the people, as much as about the ownership/money. Protected impacts, and scope; the stories tend to focus around that rather than revenue. | 1+ participant | Key Facts/Explore Data Aug 2018 <br> Randy Roo (unknown #) <br> Sarcastic Seacow (unknown #) |
| EIA Data |	People don't think we should have EIA data on our site.	| 1 participant |	October 2018 Interviews |
| External Links	| Wasn’t clear when a link was taking him to the EIA site that it was taking him out of our site.	| 1 participant | 	Key Facts/Explore Data Aug 2018 |
| Home Cards |	Some users like the old cards.	| 1 participant |	Home Page Sept 2018 |
| How It Works |	Said the How It Works page wasn’t what she expected, but couldn’t articulate what she expected. |	1 participant |	Key Facts/Explore Data Aug 2018 |
| Language: Disbursements | Didn’t like the term Disbursements and thought the term general public wouldn’t know what it means. <br> Disbursements is an unfamiliar word, and people weren't sure what it meant. |	1+ participants | Key Facts/Explore Data Aug 2018 <br> Randy Roo (unknown #)|
| Language: Explore Data |	Explore data - said the term felt too technical. Expected it to be digging into the numbers in tables. |	1	participant | Key Facts/Explore Data Aug 2018 |
| Load Time |	Cares lot about load time.	| 1	participant | Home Page Sept 2018 |
| Maps	| Wanted the maps to be able to zoom in. Expected to zoom to his county from the map on the state page. |	1 participant |	Key Facts/Explore Data Aug 2018 |
| Revenue	| One participant wants to see revenue by commodity for each state. | 1 participant |	October 2018 Interviews |
| Revenue Order |	Company most important	| 1	participant | October 2018 Interviews |
| Sorting |	Wanted to be able to sort and reorganize everything.	| 1	participant | Key Facts/Explore Data Aug 2018 |
| Update Frequency	| Users want our data updated more frequently.	| 1	participant | October 2018 Interviews |
| What's New	| Would you want to know what’s new on the site? Not in this context since I don’t know the site. If the change were big enough, it might be helpful for people who come back to the site.	| 1	participant | Key Facts/Explore Data Aug 2018 |
 
 # Addressed
 Once we start implementing the planned updates, we'll move those topics down.
 ## Home page content
 | Severity | Frequency |
| - | - |
| High | 17+ participants |

Studies: Home Page Sept 2018, Key Facts/Explore Data Aug 2018, Inquisitive impala (unknown #)

### Details
The home page with key facts doesn't do a good job of orienting new users to how the process works.
- The key facts are disorienting if you don't already know what the site does.
- Many participants didn't notice the content below the key facts.
 
 | Solution | Github Issue(s) |
 | - | - |
 | Rework the How it Works content on the homepage to reduce disorientation from key facts. | [Tabbed how it works content](https://github.com/ONRR/doi-extractives-data/issues/3287)|

## Link visibility
 | Severity | Frequency |
| - | - |
| High | 10 participants |

Studies: Home Page Sept 2018, Key Facts/Explore Data Aug 2018, Key Facts June 2018

###Details
Many participants had issues understanding how the links in page lead down the funnel.
- Links from summary sections get buried under the charts.
- Links look too much like regular text.
- Some of the icons we tested weren't clear.
- "Data and documentation" link title doesn't convey that you can download data.

 | Solution | Github Issue(s) |
 | - | - |
 | Revisit the use of links and buttons and icon usage. | [Revisit link and button usage](https://github.com/ONRR/doi-extractives-data/issues/3278)|
 
## Monthly data
 | Severity | Frequency |
| - | - |
| Medium | 18 participants |

Studies: October 2018 Interviews, Home Page Sept 2018, Key Facts/Explore Data Aug 2018, Key Facts June 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018, Disbursements Interviews Apr 2018

### Details

Users think monthly data is useful. Mostly to see how the current year is going to far, which requires being able to compare against how it compares to the prior year.
 
 | Solution | Github Issue(s) |
 | - | - |
 | Add monthly data to the site. | [Home page](https://github.com/ONRR/doi-extractives-data/issues/3293) <br> [Disbursements](https://github.com/ONRR/doi-extractives-data/issues/2890) <br> [Revenue & Production on Explore Data](https://github.com/ONRR/doi-extractives-data/issues/3221) <br> [Downloads](https://github.com/ONRR/doi-extractives-data/issues/3257)|

 ## Download links
  | Severity | Frequency |
| - | - |
| Medium | 12+ participants |

Studies: October 2018 Interviews, Home Page Sept 2018, Key Facts/Explore Data Aug 2018, Disbursements Round 2 June 2018, Disbursements Round 1 May 2018, Sarcastic Seacow (unknown #)

### Details
Many users just want to download data and sometimes have difficulty finding that functionality from Explore Data.

| Solution | Github Issue(s) |
 | - | - |
 | Make links to download more prominent. | [Home page](https://github.com/ONRR/doi-extractives-data/issues/3287) <br> [Download icon](https://github.com/ONRR/doi-extractives-data/issues/3288) <br> [Explore Data page](https://github.com/ONRR/doi-extractives-data/issues/3197) |

## Home page map
Note: This has since been reversed at the request of a stakeholder.

   | Severity | Frequency |
| - | - |
| Medium | 11 participants |

Studies: Home Page Sept 2018, Key Facts/Explore Data Aug 2018

| Solution | Github Issue(s) |
 | - | - |
 | Move the map above the Data Summary. | [Home page](https://github.com/ONRR/doi-extractives-data/issues/3293) |
 
 ## Glossary icon and links
 | Severity | Frequency |
| - | - |
| Medium | 7+ participants |

Studies: Key Facts/Explore Data Aug 2018, Disbursements Round 2 June 2018, Home Page Sept 2018, Mighty Moose B (unknown #), Key Facts June 2018

### Details
The glossary icon isn't readily understood.
- When it was initially put in the header without a label, participants didn't understand what it was.  They got it when the word "glossary" was added, but the word isn't there when it appears in contextual links.
- A few people have had issues understanding the icon in contextual links and thought it was a filter when used in a table column header.

| Solution | Github Issue(s) |
 | - | - |
 | Test out different icons for the glossary. | None |
 
 ## Production sections order
 | Severity | Frequency |
| - | - |
| Medium | 7 participants |

Studies: Home Page Sept 2018

### Details
Participants had mixed opinions about whether All should come first or last.  

| Solution | Github Issue(s) |
 | - | - |
 | Keeping it with all first, for now, but will watch in future studies. | https://github.com/ONRR/doi-extractives-data/issues/3278 |
 
