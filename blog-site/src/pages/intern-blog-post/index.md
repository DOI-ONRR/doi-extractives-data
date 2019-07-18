---
title: "Summer Internship Q&A"
authors:
- Edward Chang
- Ryan Johnson
excerpt: "Our intern has made numerous contributions during his time with us. In this post, he discusses the projects he has been working on and takeaways from his experience."
tags:
- training
- internship
- python
- open data
- gatsby
date: "2019-07-18"
---

Edward Chang joined our team this summer for a 2-month internship. Our team tries to involve interns in our core work, and Edward has made a number of meaningful contributions during his time with us.

In this Q&A, Edward shares why he joined our team, what he’s been working on, and what he’ll take away from his time with us.

## Hi Edward! Can you share a little bit about yourself and why you chose the Office of Natural Resources Revenue (ONRR) for your internship?

I’m a student at Stockton University with a major in Computer Science and a minor in Mathematics. Currently, I am enrolled in The Washington Center’s Academic Internship program for the summer. I chose ONRR because of my interest in working for the government.

## Why did you choose to study computer science?

Computers have always interested me since childhood. I always enjoyed the computer lab sessions during elementary school. When I got to high school though, I wasn’t really sure what I wanted to major in, so I decided to take accounting courses for three years. However, once I discovered computer science, I immediately changed my major. Having to start over from scratch was rough, but I don’t regret my decision to switch majors.

## What did you expect to work on during this internship before it started?

I wasn’t completely sure what I was going to be working on. I knew that I was going to help transfer the website to [GatsbyJS](https://www.gatsbyjs.org/) and maybe some do some work with [Python](https://www.python.org/). Maybe design an algorithm for data or something.

## What have you been working on during your internship?

I’ve been primarily working on some data quality scripts in Python. It mostly checks for out-of-place field names, strange entries, and other anomalies. Here's a snippet of the code:

```python
def get_w_count(self, df):
        '''Returns number of Ws found for Volume and Location

        Keyword Arguments:
            df -- A pandas DataFrame
        '''
        volume_w_count = 0
        state_w_count = 0
        # If Volume is present in file
        if file.columns.contains('Volume'):
            for entry in file['Volume']:
                if entry == 'W':
                    volume_w_count += 1
        # If State is present in file
        if file.columns.contains('State'):
            for entry in file['State']:
                if entry == 'Withheld':
                    state_w_count += 1
        # Returns Tuple of W count
        return volume_w_count, state_w_count
```

This code goes through a spreadsheet and looks specifically at the columns 'Volume' and 'State' and counts the number of times 'W' or 'Withheld' is found. These two terms indicate data that we cannot publish because it is either proprietary (would violate trade secrets), or can be used to identify an individual person. We check for withheld data in this script to make sure we’re properly identifying this data.

On the side, I’ve been doing small bug fixes on the website and learning a little bit about GatsbyJS. Most of the changes I’ve made are in single lines of code.

## How do you think you’ve helped our team with its work on [Natural Resources Revenue Data](https://revenuedata.doi.gov/)?

Hopefully the data quality scripts I’ve written will help streamline the data checking process and help make the data formatting more uniform. The small changes I’ve made to Natural Resources Revenue Data should help with a few usability concerns.

## Is there anything you wished you could have worked on or learned about, but didn’t get a chance to?

Machine learning was something I was interested in. I had some ideas on what I could’ve used machine learning for; predicting trends in revenue was one of them. Seeing as my internship will end very briefly, I probably won’t have the time to learn and integrate ML into my scripts. Maybe I’ll incorporate it into one of my next projects.

## What have you learned during this internship that you can apply in the future?

I’ll definitely start using GitHub for my future projects and start contributing to more open source projects. I’ve learned more about Agile/SCRUM methodologies as well as what it’s like working with a remote team.
