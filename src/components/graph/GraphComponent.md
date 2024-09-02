The component used for rendering line plots

```jsx
let i =0;
/** a quick function to mock data*/
const randomDataSet = () => (
        {
            name: `Dataset ${++i}`,
            data: [1,1,1,1,1,1,1,1,1,1,1].map(() => ({"x":Math.random()*100,"y":Math.random()*100}))
        });

<GraphComponent
    datasets={
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
    radius={1}
/>

```