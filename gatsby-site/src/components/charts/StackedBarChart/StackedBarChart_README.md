---
title: Stacked Bar Chart
componentName: StackedBarChart
patternCategory: Charts
---

```
<div>
	<div style={{width: "400px", height:"450px", display:"inline-block", marginRight: "50px"}}>
		<StackedBarChart 

			data={[
				{"Jan": [{"Federal onshore": 50, "Federal offshore": 100, "Native American":75}]},
				{"Feb": [{"Federal onshore": 10, "Federal offshore": 30, "Native American":15}]},
				{"Mar": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"Apr": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"May": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"Jun": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"Jul": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"Aug": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"Sep": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"Oct": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"Nov": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"Dec": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			]}

			defaultSelected={"May"}

		></StackedBarChart>
	</div>
	<div style={{width: "300px", display:"inline-block"}}>
		<StackedBarChart 

			data={[
				{"'08": [{"Federal onshore": 50, "Federal offshore": 100, "Native American":75}]},
				{"'09": [{"Federal onshore": 10, "Federal offshore": 30, "Native American":15}]},
				{"'10": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"'11": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"'12": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"'13": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"'14": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"'15": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"'16": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
				{"'17": [{"Federal onshore": 30, "Federal offshore": 50, "Native American":35}]},
			]}

			defaultSelected={"'08"}

		></StackedBarChart>
	</div>
</div>
```



## How to use
This stacked bar uses D3 to render the data visualization. The react component is just a wrapper that links to D3 by lifecycle events. 
