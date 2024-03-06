import { GraphComponent } from "../graph/simpleGraph"
import { BarChart } from "../graph/barChart"
import React from "react"


type recoveryComponentTypes = {
  bottomTitle, 
  barData, 
  clrs,
  regex
}


export const RemDisplay = (props: recoveryComponentTypes) => {

    return (
        <>
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
            labels={props.barData
              .filter(obj=>RegExp(props.regex, 'i').test(obj.method))
              .filter((c,i,ar) => i == 0 || ar[i].toolName !== ar[i-1].toolName)
              .map(value=>`${value.toolName}`)}
          
          />
          </>
    )
}