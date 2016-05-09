# Land Ownership Statistics
The data files in this directory were created from a
[PDF](https://fas.org/sgp/crs/misc/R42346.pdf) published by the
[Congressional Research Service](https://www.fas.org/sgp/crs/) on December
29, 2014. In their own words:

> The Congressional Research Service, a component of the Library of
> Congress, conducts research and analysis for Congress on a broad range of
> national policy issues. While many CRS memoranda are generated in response
> to individual Member or staff inquiries and are confidential, most CRS
> reports are available to anyone who has access to a congressional
> intranet.

## Data files
- [land-stats.tsv]({{ site.baseurl }}/data/land-stats.tsv): total and federal acreage for each state.
This is the primary source data for Land Ownership.
- [agency-stats.tsv]({{ site.baseurl }}/data/agency-stats.tsv): total acreage by agency for each state.
- [land_stats.yml]({{ site.baseurl }}/_data/land_stats.yml): a yml file to allow for easy templating.
This is the data that HTML and Markdown pages are directly referencing.

## Transform scripts
- [transform.js]({{ site.baseurl }}/data/transform.js): script to convert `land-stats.tsv` to an SQL table,
and subsequently to `land_stats.yml`.
