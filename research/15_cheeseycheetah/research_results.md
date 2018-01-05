# Research goal
Given the decision to decommission statistics.onrr.gov in the near term, the team was interested in learning how folks used that site, as well as how heavy users of natural resource revenue data are using this data in general, and what their experience of getting that data is like now, to help inform possible changes to the NRRD site in the future. 

# Methods and participants
For this round of research, we conducted remote, 45-minute, one-on-one interviews with seven participants, where participants talked us through how they currently access and use natural resource revenue information. In some cases, participants shared their screens with us to show us their workflow.

We sourced participants for this research sprint from a list of folks who had recently made data requests to ONRR's Data Services team. **All seven participants were employees or contractors for DOI.**


# Findings and next steps

## For some internal DOI users, we discovered user needs that the NRRD site will not be able to serve, given its current scope and constraints.

Employees in other bureaus (i.e. BSEE) often need lease-level or highly detailed data to manipulate in order to answer specific questions. They may also need detailed data in order to slice the data by different geographies, such as basin, region, or tribal area.

While these users would _prefer_ to access or receive exactly the data they need, they’re already used to and capable of manually aggregating & disaggregating raw data themselves.

### What this means for us: 
Based on ONRR’s current policies and practices around potentially proprietary or tribal data, we’re unlikely to be able to offer the detailed, parsable data they seek on the public NRRD site itself.

While we can’t offer exactly the data these users seek on the NRRD site itself, **we should explore how we can make it easier for these users to identify a clear path for requesting the data they need from ONRR ([#2533](https://github.com/18F/doi-extractives-data/issues/2533)).** 


## We heard from several people that they didn’t know where to turn for the data they need.

In general, many folks don’t know what data is available where, and often turn to their own personal contacts within ONRR to get the info they need.

In several cases, their contacts within ONRR were not well-versed in what data was available on the NRRD site vs. what data required a custom data pull, which led to some confusion and wasted time on both sides.

### What this means for us:
It would be worth the NRRD team investing time in **making sure everyone at ONRR who fields information requests, whether formal or informal, is well informed about what data is available on NRRD, and how to use the site,** so that they can help direct people to the right place when the information they are asking about is in fact available on the site ([#2579](https://github.com/18F/doi-extractives-data/issues/2579)). 

This would likely entail some targeted demos, and potentially even developing some training materials or scripts that various ONRR staff can use to help direct data requestors either to relevant pages on the NRRD site or to the Data Services team for custom requests.


## Many information requests we learned about started as inquiries to Public Affairs offices.

When DOI Public Affairs offices receive inquiries about natural resources revenue (often from environmental groups and industry seeking data to better inform their advocacy work), they often route those questions to others in their Bureau (such as economists or policy analysts) to track down the data needed to answer the question.

### What this means for us:
To help us identify how we could make it easier for Public Affairs staff to get the info they need, **the NRRD team should conduct more focused research with staff of various DOI Public Affairs offices,** to better understand the kinds of questions they receive, and how they go about getting that information now ([#2578](https://github.com/18F/doi-extractives-data/issues/2578)).

It’s possible some targeted outreach and education—similar to what we suggested for folks fielding info requests at ONRR—may be useful eventually for other DOI Bureaus’ Public Affairs staff.

## Other next steps 

We heard from several users in this research round (as well as over the past few months via ONRR’s Data Services team) that making _sales year_ data available on NRRD would be particularly useful. If this could save the Data Services team significant time currently spent fulfilling custom request for this data, **the NRRD team should consider how they might add sales year data to NRRD in the coming months.**

We also learned a lot about different use cases for the NRRD site in general during this research round, so **we’ll spend some time in the next few sprints incorporating what we’ve learned about our users and their needs into the product vision for NRRD moving forward ([#2548](https://github.com/18F/doi-extractives-data/issues/2548)).**
