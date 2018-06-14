# Sprint-SplashySunfish research results

## Hypotheses tested

- What do people think this page is saying? (see below)
- Do people see that reconciliation is not a problem in the US? YES!
- Do people understand that the variances were all explained? NO!
- How do people interact with the maps, filters and options? (see below)
- What problems are most severe? (see below)


## Participants

- 5 people unfamiliar with USEITI who live or grew up in USEITI focus states and counties. Specifically, Pima County, Arizona; Tucker County, West Virgina; St. Louis County, Minnesota; and Colorado.


## What do people think this page is saying?

People in general did not feel very comfortable on this page, but when pressed, were able to at a very high level report what the page is about.

- _I think this is showing the difference between government and company reported revenue._

- _Ok, I guess this means that reconciliation refers to the difference between reported and received payments. [pause] ok._

- _For aligning the costs and money that companies reported on Federal land versus what government is reporting and making sure that these are OK, and it’s out there in the open._

But, people were also overwhelmed.

- _Even I [a lawyer]...this is a lot of information that’s making me feel stupid._


## Do people see that reconciliation is not a problem in the US?

Yes! The summary chart, and scrolling through the by-company data where mostly percentages are close to zero, and the nice words in the intro combined to make this clear to all participants.

- _Actually, most people are honest about what they report._

- _In looking down the list, I see that most of the time, there’s not a problem._

- _So, overall, I think what I’m supposed to get out of this is that the report is very accurate but there are some individual companies that have large discrepancies._

That last quote leads us to our next question...


## Do people understand that the variances were all explained?

**Nope nope nope, not yet.** People reacted very strongly to the companies who had highlighted material variance numbers, even after we changed the color from red to bold. Note: we don't have footnote text done yet that explains the variances. Maybe this will help, but I expect that we're going to more than just those notes because participants had strong assumptions about this part of the data. For example, they assumed that if the gov and company numbers differed, it was because a company had been 'bad' and they needed to pay the government, when really we're just talking about discrepancies in accounting.

- _[Gets to a company that has a red number] Chevron! Tsk tsk. Apparently only Chevron sucks. Ooooo. [Continues scrolling, finds more red] 220% difference?! You guys need to pay up!_

- _Chevron! OOOOO! Now we’re getting to the good stuff. Pay it, Chevron! [continues looking through data] Exxon, jeez louise! [laughing]_

- _In looking down the list, I see that most of the time, there’s not a problem. But sometimes there’s a big gap, and I want to find those. [Participant wanted a way to filter to the 'problem' companies]_

Only one participant noticed that one of the discrepancies included a negative number, and so mused about that, yet still wasn't able to feel confident in what was going on.

- _Oh -- hold on -- here’s one that’s like 50% off, but it’s negative [The company side shows in parentheses]. Huh. [thinking] So this must mean that it’s not always the company that owes money to the government? Wha -- so the, um, government has to pay them back? I’m not sure about that._

It seemed like even though people seemed to understand the words "material variance" when they read it in the intro paragraph and clicked on the glossary definition, the use of that concept in the summary chart and company listings is one mental leap too far; we're not connecting the dots enough for folks. In particular, our attempt to use material variance in the summary chart was not well understood.

- _Not knowing anything about this -- [I go through the page and see] oh, something material, something is bolded, that’s what is important and what I should look at._

- _Kinda the meta question is -- these material variances -- should I think of that as an ethical question? Am I supposed to think this is this sloppy bookkeeping? Citizenship-wise, I don't see what I should make of these big variances._


## Usability issues with the data visualization interactions

### Issues on all data viz pages

- Participants expected the underlined summary sentence words to open the glossary, likely because the dashed underline motif there is similar to the one we use for the glossary, and they didn't understand the revenue type and commodity words. It seemed like a hope for a lifeline on those difficult acronyms and words. At the very least, those underlined words need to close the filters (right now, you can click to open the filters but not click to close even though they still look clickable)

  - _[Clicks Filter] Oh. [Pause] [Clicks revenue type drop-down]. Yeah, I don’t know what these are. but I could click on this to find out [tries to click on underlined word for definition, but it doesn’t do anything, participant looks deflated]._

- Lists that are not in alphabetical order should be. This includes the company list on the reconciliation page and the drop-down filter menus, for example, the commodity menu under 'hardrock minerals'. [#1256](https://github.com/18F/doi-extractives-data/issues/1256)

- People don't know how to clear the filters. [#924](https://github.com/18F/doi-extractives-data/issues/924)

- People don't know how to close the filters. We might consider making the filters close if you click anywhere outside the blue area. [#1258](https://github.com/18F/doi-extractives-data/issues/1258)

- People seem to want to 'dive into the counties' or whatever lowest-level information we have. For example, once they've filtered to a state, and it is displaying counties on the bar chart, they don't necessarily know that they might filter/dive into this data by playing with the filters. They say things like "hmm, I wish I knew more about this". Potential solution: clicking on a county name in the bar chart opens the filters? [#1257](https://github.com/18F/doi-extractives-data/issues/1257)

- People do not like seeing words they don't understand or acronyms in the filter options.

  - _Let’s look at oil and gas [chooses that, sees the next drop-down appear]. Then -- NGL? Natural...gas….um….nevermind. [chooses something else]_

- BUG: the secondary commodity list doesn’t reset when after you’ve chosen a state, and after you’ve chosen, say, hardrock and you get a long list in the secondary commodity dropdown. At this point, if you go back and change the first commodity to coal, you still get the hardrock dropdown. Maybe [#1213](https://github.com/18F/doi-extractives-data/issues/1213)

- There's no indication of 'the combo of filters you've selected is not valid'. ie, if you’ve chosen a combination of filters that does not have data, there is nothing that really shows that this is the case and the user is confused. For example, we had a case where because of order the participant entered the filters, she never noticed the trend charts over the years. Then when she selected things that reduced those to zero (ie, no data), she couldn’t figure out why nothing seemed to be showing up. She kept clicking on different years to change that filter when the real problem was that she needed to pick a different commodity because the issue was that State X didn't produce Commodity Y. [#1022](https://github.com/18F/doi-extractives-data/issues/1022)



### Issues on the reconciliation page specifically

Almost everyone commented on the first line of data on the summary chart -- the fact that it says "ONRR" and they don't know what that is. It seems to put a bad taste in everyone's mouth. [#1253](https://github.com/18F/doi-extractives-data/issues/1253)

- _Ummm -- the first place my eyes go is to the charts here, they draw me in, but I don’t understand what’s going on. I’m reading the title of the chart, Median …, I don’t really know what that means. Then I’m looking down at ONRR, and I don’t know what that means._

- _This would be really cool if this had one of those glossary plugins so I could hover and see what ONRR is. All the acronyms._

- _I think I don’t know what ONRR is so I think this is for insiders._

- _[Finds the filters] Oh! Filters! [YAY] Oh. [sad] [The only thing here is] these words I don't understand again._

The summary chart was hit-and-miss. In particular, no one was able to figure out what we were trying to communicate with the material variances on the right of the intro chart. [#1252](https://github.com/18F/doi-extractives-data/issues/1252)

- _[Referring to the summary bars] I guess this means that this is the direction of the discrepancy, but I don't really know._

- _So now I have a sense of what the percentages [in the chart] mean [after reading the intro paragraphs]. But what are these? [the 1%, 2%, 3%] They line up, so I guess these are tick marks -- it looks like -- I don’t know. [pause] I’m gonna start scrolling._

- _I’m not entirely sure what’s going on with the bar charts. This part is clear -- I get that the bar goes with the 1%, but these tick marks -- these are separate? A different column? Oh, wait. These are all one chart. Something about these threw me off. It wasn’t clear that those marks are part of the bar._

- _[Looking at the tick marks] I wonder why the threshold is considered different for different types?_

Searching by company name didn't resonate with participants. Instead, they wanted to search by industry or location. This was either because they didn't know enough about the companies to know them by name, or because they were savvy enough to know that companies buy and sell each other a lot and often change names. [#1255](https://github.com/18F/doi-extractives-data/issues/1255)

- _[Tries to search for a company] Oh gosh, I can't remember the name of the taconite companies [near me], and they keep renaming themselves anyways [implying that even if I did, searching by name wouldn’t be very useful]. It would be cool if I could search by industry, since I know there's an industry by me, but I can't find my personal interest here._

- _I also don’t know what these companies do. ["I don't know company names, but I know what's being mined near me"]_

- _Oh my gosh, this is [Company X]. They’re evil. They would keep changing names and buying other companies._

- _Oh! [finds the option to sort by tax] By taxes, does this mean taxes to federal? local? I want to know what's coming to my county, and if I'm getting the amount they should._

Directionality. Participants weren't always clear on who was making the money. This is a problem common to many of our datasets. [#1254](https://github.com/18F/doi-extractives-data/issues/1254)

- _Ooo, they’re making so much fucking money! [referring to the top entires on reconciliation, when really those numbers are amounts paid to government]_


## Usability issues on the site in general

There are several bugs and usability issues that need to be addressed.

- When the user clicks on a glossary term, it should open the glossary and the term should be open. This is a bug that was introduced lately and is issued in [#1251](https://github.com/18F/doi-extractives-data/issues/1251).

- Clicking a glossary term again should close the glossary. [#819](https://github.com/18F/doi-extractives-data/issues/819)

- Almost everyone tries to click on a state from the middle-of-homepage graphic as their first exploration into our data. This sends them to the [federal revenue by location](https://useiti.doi.gov/explore/federal-revenue-by-location/) dataset and they don't know that there are more datasets available. Also, they are surprised when clicking on a state from the homepage doesn't send them to information on that state specifically. [#1259](https://github.com/18F/doi-extractives-data/issues/1259)

- Very few people scroll down on our sub-page landing pages unless they have large computer screens. 4 out of 5 of our testing group did not have screens big enough to notice that they should scroll down. So, even if they, for example, make it to our explore data landing page, they don't see the full breadth of information available.

- No one noticed the drop-down on the case studies page that navigates through the 12 case studies. They skimmed over the overview page and that was it.


## What problems were most severe?

### Reconciliation

By far, the most severe problem is the fact that participants did not understand what we were trying to communicate with regard to material variances, ie, that the variances found were not significant. In a close second is the general confusion around the summary chart at the top of the reconciliation page.

### Site

The fact that many participants don't know that there is more than one dataset on the site, and that the map from the homepage doesn't link to specific states is a big deal. However, the user research that is happening in parallel with this usability work seems to indicate that more work in general in pulling together information by state will be an important next step. This usability issue should be taken into consideration for that work.
