import { GraphComponent } from "../graph/simpleGraph"
import { BarChart } from "../graph/barChart"
import React, { useRef } from "react"
import { DownloadImg } from "../graph/downloadImg"


type recoveryComponentTypes = {
  topTitle, 
  bottomTitle, 
  lineData, 
  barData, 
  clrs,
  regex
}
export function formatDataset(dataset){
  return dataset.map(dataset=>{
    return (
      {
        name:`${dataset.toolName}_${dataset.resolution}`,
        data: dataset.data
      }
    )
  })
}

export const RecoveryComponent = (props: recoveryComponentTypes) => {
    return (
        <>
        <GraphComponent 
            datasets={formatDataset(props.lineData)}
            xAxisTitle='Number of Loops Predicted'
            yAxisTitle='Recovery Rate'
            title={props.topTitle}
            clrs={props.clrs}
          />
          <BarChart 
            title={props.bottomTitle}
            data={
              
              props.barData.filter(obj=>new RegExp(props.regex, 'i').test(obj.method)).map(value=>
                  ({
                    name:`${value.toolName}_${value.resolution}`,
                    data:[value.data]
                  }))
              
            }
            clrs={props.clrs}
            labels={[""]}
          />
          </>
    )
}