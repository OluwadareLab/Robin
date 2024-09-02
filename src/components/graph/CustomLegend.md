A component for making a custom legend for interactive graphs that matches chartJS's default legends.
CustomLegend example:

```js

let items = [
    {
        backgroundColor:"black",
        label:"black label",
        borders: false,
    },
    {
        backgroundColor:"white",
        label:"white label",
        borders: false,
    }
    ]
    
    return <CustomLegend
      items={items}
    />
```