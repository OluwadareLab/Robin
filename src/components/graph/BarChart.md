A basic component for rendering bar charts.  

## Bar Chart with 1 label
```js
<BarChart 
    yAxisTitle={"\"y axis\" field"}
    title={"\"title\" field"}
    data={
        [
            {data:[5],name:"dataPoint5"},
            {data:[25],name:"dataPoint25"},
            {data:[50],name:"dataPoint50"},
        ]
    }
    labels={["l1"]}
    />
```
Data prep for all charts is mostly the same:  
1) data should be named "datasets", it should contain an array of dataset objects containing a "data" a "name" and a optional "clr"
2) the internal data is an array of numbers, for a bar chart this should be an array of 1 length unless you have multiple labels in which case see below

## BarChart with multiple labels
```js
<BarChart 
    yAxisTitle={"\"y axis\" field"}
    title={"\"title\" field"}
    data={
        [
            {data:[5],name:"dataPoint5"},
            {data:[25],name:"dataPoint25"},
            {data:[50],name:"dataPoint50"},
            //to add a point to a different label add it to the index of that label in the data arr
            {data:[null,50],name:"dataPoint50InLabel2"},

            //to add a point to a different label add it to the index of that label in the data arr
            {data:[null,null,50],name:"dataPoint50InLabel3"},
        ]
    }
    labels={["l1","l2","l3"]}
    />
```

## BarChart with multiple labels in same dataset
in this rather than adding specific new datasets for the other 2 labels we combine them into the existing ones
```js
<BarChart 
    yAxisTitle={"\"y axis\" field"}
    title={"\"title\" field"}
    data={
        [
            {data:[5],name:"dataPoint5"},
            {data:[25],name:"dataPoint25"},
            //assuming this data point should span all 3 labels
            {data:[50,50,50],name:"dataPoint50"},
        ]
    }
    labels={["l1","l2","l3"]}
    />
```

