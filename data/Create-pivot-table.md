# Create a pivot table

To create a pivot table in Microsoft Excel, start by clicking on the "Insert" tab in the top left of the document.

**Click "PivotTable".**

<img src="../img/data/pivot-start.png" alt="" width="400" />

**A dialog named "Create PivotTable" will open. Click "OK" to select the entire document.**

<img src="../img/data/pivot-create-pivot-dialog.png" alt="" width="400" />

**Once you have dont this you will be prompted by a "PivotTable Builder" navigation panel. This is also known as a "Field List". Enter the columns of data that are relavent, and move all but the column that you are totalling to the list under "Row".**

<img src="../img/data/pivot-complete-field-list.png" alt="" width="400" />

**Now it is time to display your data in a machine readable manner. Switch to the "Design" tab.**

<img src="../img/data/pivot-design.png" alt="" width="400" />

**Within "Design", select "Report Layout" and select "Show in Tabular Form" and "Don't Repeat Item Labels".**

<img src="../img/data/pivot-tabular.png" alt="" width="400" />
<img src="../img/data/pivot-dont-repeat.png" alt="" width="400" />

**Still within "Design", Select "Subtotals" and select "Don't Show Subtitles".**

<img src="../img/data/pivot-subtitles.png" alt="" width="400" />

**Save the document as an `.csv` by going to "File", slecting "Save as" and choosing the `.csv` document type. Once you have saved the `.csv`, you can use a ruby script `csv_tsv.rb` in the root directory of this project to tranform the data from `.csv` to `.tsv`.**

```
ruby csv_tsv.rb path/to/csv.csv path/to/tsv.tsv
```

Now you are ready to run `npm test`!
