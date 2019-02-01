# Study Goals

| Goals | Questions |
| :----- | :--------- |
| Determine whether we have addressed issues identified during last round of research. | Can users get to the specific data they want using any of the designs? |
| Determine the best approach to presenting disbursements data.| Are tables useful?|
| | Are filters useful? |
| | Are charts useful?|
| | Is commodity data useful?|
| | What do users like/don’t like about a specific piece of a design?|
| | Do users want any of the other functions like download, email, and save?|

# Test Method 
Over the course of the sprint we interviewed individuals for 30-minute remote 1:1 sessions to have participants walk us through the prototypes for the design options and talk with them about how they would use each and their preference. Prototype: https://m13r6x.axshare.com/start_page.html

We alternated the order the designs were presented to avoid bias due to the order in which the prototypes are presented. After participants went through all 4 designs, we had them select their preferred option and probed into the functionality that they liked or didn't like across options.

# Participants

Since we already talked with target users prior to the design studio, we reached out to the participants from that study to see if we addressed their concerns and to other users in the participant pipeline (that had been previously identified). We aimed for 5-9 participants, both internal and external to DOI.

| Participant | Internal/External | Segment | Proto Persona | Primary Task |Secondary Task |
| :----- | :--------- | :----- | :--------- | :----- | :--------- |
| P1 | External | Researcher | Data Aggregator | Get multiple numbers to build own report. |  
| P2 | Internal | Accounting Services | Question Answerer | Get a single number. | |
| P3 | Internal | Congressional Liaison | Question Answerer | Get multiple numbers to build own report. | Understand the big picture. |
| P4 | External | NGO/Advocate | Storyteller | Get a single number. | Understand the big picture. |
| P5 | Internal | Budget Office | Big Picture Understander | Understand the big picture. | Get a single number. |
| P6 | Internal | Public Affairs | Question Answerer | Get a single number. | Understand the big picture. |

## Proto Personas
After looking at the findings, it became clear that we need to start segmenting our user by behaviors instead of by internal/external or type of organization.  This is a start based on this study.  Further efforts will be made to flesh this out based on prior research and in future research.   


| Proto Persona | Participants | Primary User Story |  
| :------------ | :----------- | :------------------ |  
| Question Answerer | 3 | As a question answerer, I want to find specific data so that I can provide the answer to a question someone (a stakeholder or customer) has asked me. |  
| Storyteller | 1 | As a storyteller, I want to understand the data so that I can use it to tell a story in an article or infographic. |  
| Big Picture Understander | 1 | As a big picture understander, I want to understand how all of the pieces of the revenue data puzzle work together so that I know how the system works and how well it is currently functioning at a high level. |  
| Data Aggregator | 1 | As a data aggregator, I want to download all the data you have so that I can work with it myself and combine it with data I have from other sources. |  

## User Types
After this round of research, we conducted a workshop to better define out user types.  We went back and mapped these participants to the new user types.  We talked with 3 Question Answerers, 1 Domain Learner, 1 Agenda Supporter, and 1 hybrid of a Question Answerer and Storyteller.
![User Type Diagram](https://github.com/18F/doi-extractives-data/blob/research/assets/img/Round1UserTypes.PNG)

# Findings

## Getting to Specific Data
### Participants want additional data that isn’t currently on the site.  

| Data Type | Total Users | Plan |  
| :------------ | :----------- | :------------------ |  
| Year Over Year | 6 | Add back to 2007 to be consistent with other sections of the site.  Make older years available in the data download. |  
| Commodity | 4 | Add when it becomes available in November. |  
| Monthly | 3 | Add when it becomes available in November. |  
| Year Selection (calendar, fiscal) | 2 | Add the ability to choose calendar or fiscal year. |  
| Where the money is going (U.S. Treasury by agency, by program) | 2 | Break out "other" bucket into BSEE and BOEM and any other items we can track down. |  

### Participants pointed out ways we can make the data displayed clearer.

| Behavior | Total Users | Plan |  
| :------------ | :----------- | :------------------ |  
Wants to see rolled up totals for states and funds. | 2 | Include total for the state. |  
Percentage is nice to have. | 2 | Will include if it makes sense with the data we end up with. |  
Notes that state should be treated differently from county on the chart. | 2 | Will address when looking at adding total for the state. |  
Noted that he needs clarity around withheld numbers. | 1 | We don't currently withhold any disbursement data, but may become an issue when adding commodity and monthly data. |  
Wants definitions of terms. | 1 | Add glossaries for confusing terms and content from current site describing funds. |  

### Participants were critical of the current Explore Data page.

| Behavior | Total Users |  
| :------------ | :----------- | 
Participants want consistency across different types of data on the site (disbursements, revenue, production, etc.). | 2 | 
Participants said they are overwhelmed by the long Explore Data page. | 2 | 

#### Plan
Consider splitting out the Explore Data page into separate pages.  Will decide whether to address as part of disbursements project depending on how much weight adding the additional data and functionality adds to the page.  

## Tables

### Preferences for Interacting
Participants had different preferences for interacting with data.   
Most common were seeing all data in one table, filtering with drop-downs on top, selecting multiple options for a filter, and drilling within tables.  

| Behavior | Total Users | 
| :------------ | :----------- | 
 All of the data visible in one table | 4 |  
Drill down in a table | 4 |  
Filters on the top | 3 |  
Select multiple options for filters (i.e. more than one commodity) | 3 |  
Ability to group the data in different ways | 2 |  
Dislikes scrolling | 2 |  
Okay with not seeing data immediately | 2 |  
Doesn’t want to have to filter too many times | 1 |  
Ability to sort table columns | 1 |  
Ability to add columns | 1 |  
Thinks it’s clunky to pick things before seeing the table | 1 |  
Filters all together (in a pop-up) | 1 |  
Charts | 1 |  
Selecting how to view the data before viewing it | 1 |  

#### Plan
 Prototype with data agreed on and look at these with that to determine what makes sense.
 
 ## Filtering
 ### Geography/Location
 Filtering by geography/location is the most important way to filter.

| Behavior | Total Users | 
| :------------ | :----------- | 
All participants would filter by geography/location and many would filter by that first. | 6 |  
Noted that the location picker in Option B is overwhelming and might be difficult to use. | 4 |  
Wanted a map view to pick location. | 2 |  

#### Plan
Focus next round of changes on the state pages.

### Source
Most participants wanted to filter by source, but had different definitions of what a source is.

| Behavior | Total Users | 
| :------------ | :----------- | 
 Filters by source. | 4 |  
Notes that need totals for Onshore and Offshore in Source. | 2 |  
Doesn't think Source is the right word. | 1 |  
Didn’t know what 8g is. | 1 |  
Considers tribal/federal as a source. | 1 |  

#### Plan
Test out different names for the source filter.  The Data Display team reviewed the data and decided that the filter should be Onshore and Offshore with breakouts for Offshore for GOMESA, 8(g), and Other.  Geothermal can move to Commodity and Tribal is its own Recipient/Fund.


## Charts
### Charts
While we only showed one type of chart, they brought mixed reviews.

| Behavior | Total Users | 
| :------------ | :----------- | 
 Doesn't think the charts would be useful. | 3 |  
Thinks the data has too small of breakouts for the charts to be useful. | 2 |  
Said they liked charts, but as a secondary way to view the data. | 2 |  
Really likes charts. | 1 |  
Thinks congressional staffers would prefer pictures/maps over tables. | 1 |  

#### Plan
Decide whether we can effectively display the data with charts, explore different types of charts, and work with user types that like charts to determine their needs.  This is a lower priority than nailing down tables and filters.

## Other Functions

### Downloading
Participants liked the ability to download both filtered and unfiltered data.

| Behavior | Total Users | 
| :------------ | :----------- | 
 Wants to download the data | 6 |  
Wants to download filtered data. | 6 |  
Liked Download All Data option in Option D. | 4 |  

#### Plan
Ensure the final design has a way to download both all the data and filtered data.

### Share by Email
Many participants liked the option to email the data, but had mixed expectations about what would be emailed.

| Behavior | Total Users | 
| :------------ | :----------- | 
 Would use email function to send a filtered data set to external users. | 4 |  
Expects the Email function to email a file. | 3 |  
Expect Email function to email a link. | 1 |  
Expects the Email function to email an image of a snapshot. | 1 |  
Thought the Email function would be to send an email to ONRR. | 1 |  

#### Plan
This is a lower priority than other items.  It may be difficult to implement and may comes with some usability issues.  However, we could  use this function to promote the site if internal users use it to send data to external users.  We will table it for future discussion.

### Saved Filters
Nobody wanted the ability to save filters because they usually don't need to answer the same question twice.

#### Plan
Drop this feature idea.

## For Future Consideration
A couple of participants brought up ideas we should consider for the future:
* Wants easy contact information if he can't find what he's looking for.
* Notes that congressional users print the screen to save the number they found.





