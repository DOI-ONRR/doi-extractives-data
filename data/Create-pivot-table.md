# Create a pivot table

To create a pivot table in Microsoft Excel, start by clicking on the "Insert" tab in the top left of the document.

Click "PivotTable".

![]({{ site.baseurl }}/img/data/pivot-start.png)

A dialog named "Create PivotTable" will open. Click "OK" to select the entire document.

![]({{ site.baseurl }}/img/data/pivot-create-pivot-dialog.png)

Once you have dont this you will be prompted by a "PivotTable Builder" navigation panel. This is also known as a "Field List". Enter the columns of data that are relavent, and move all but the column that you are totalling to the list under "Row".

![]({{ site.baseurl }}/img/data/pivot-complete-field-list.png)

Now it is time to display your data in a machine readable manner. Switch to the "Design" tab.

![]({{ site.baseurl }}/img/data/pivot-design.png)

Within "Design", select "Report Layout" and select "Show in Tabular Form" and "Don't Repeat Item Labels".

![]({{ site.baseurl }}/img/data/pivot-tabular.png)
![]({{ site.baseurl }}/img/data/pivot-dont-repeat.png)

Still within "Design", Select "Subtotals" and select "Don't Show Subtitles".

![]({{ site.baseurl }}/img/data/pivot-subtitles.png)

Save the document as an `.csv` by going to "File", slecting "Save as" and choosing the `.csv` document type. Once you have saved the `.csv`, you can use a ruby script `csv_tsv.rb` in the root directory of this project to tranform the data from `.csv` to `.tsv`.

```
ruby csv_tsv.rb path/to/csv.csv path/to/tsv.tsv
```

Now you are ready to run `npm test`!


subtitles
switch to design
dont-repeat
show in tabular form
complete-field-list
create-pivot-dialog
pivot-field-list
start-pivot
