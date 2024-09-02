The main component for rendering a scatter plot with liniar regression lines.  groups data by category arg.

```jsx
let i =0;

let category = "none"
/** a quick function to mock data*/
const randomDataSet = () => (
        {
            name: `Dataset ${++i}`,
            data: [1,1,1,1].map(() => ({"x":Math.random()*100,"y":Math.random()*100})),
            category:category
        });

<>

<h3>default radius</h3>
<LinierRegressionScatterPlot
    scatterData={
        [
            randomDataSet(),
            randomDataSet(),
            randomDataSet(),
            randomDataSet(),
        ]
    }
    yAxisTitle={`"yAxisTitle" field`}
    xAxisTitle={`"xAxisTitle" field`}
    title={`"title" field`}
/>


<h3>custom radius</h3>
<LinierRegressionScatterPlot
    scatterData={
        [
            randomDataSet(),
            randomDataSet(),
            randomDataSet(),
            randomDataSet(),
        ]
    }
    yAxisTitle={`"yAxisTitle" field`}
    xAxisTitle={`"xAxisTitle" field`}
    title={`"title" field`}
    radius={10}
/>

<h3>multiple categories</h3>
<LinierRegressionScatterPlot
    scatterData={
        [
            randomDataSet(),
            randomDataSet(),
            randomDataSet(),
            randomDataSet(),
            (()=>{category="cat2"; return randomDataSet()})(),
            randomDataSet(),
            randomDataSet(),
            randomDataSet(),
        ]
    }
    yAxisTitle={`"yAxisTitle" field`}
    xAxisTitle={`"xAxisTitle" field`}
    title={`"title" field`}
    radius={10}
/>




</>

```