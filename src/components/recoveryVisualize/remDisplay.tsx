import { GraphComponent } from "../graph/GraphComponent"
import { BarChart } from "../graph/BarChart"
import React from "react"


type recoveryComponentTypes = {
  bottomTitle, 
  barData, 
  clrs,
  regex
  /**  set to a string resolution to filter by or avg to take an average */
  filterResolution?
}


export const RemDisplay = (props: recoveryComponentTypes) => {
  const shouldAvg = props.filterResolution=="average";
  const filterRes = (!["all resolutions","average"].includes(props.filterResolution)) ? props.filterResolution : undefined;

  let data:{name:string,data:any}[] = 
      props.barData
        .filter(obj=>new RegExp(props.regex, 'i').test(obj.method))
        .filter(obj=>(filterRes ? obj.resolution == filterRes : true))
        .map(value=>
            ({
              name:`${value.toolName}_${value.resolution}`,
              data:[value.data]
            }));

            console.log(props.barData);
    if(shouldAvg){
      let avgData = {};
      data.forEach((dataSet)=>{
        let name = dataSet.name.split('_')[0];
        if(!avgData[name]) avgData[name] = [];
        avgData[name] = [...avgData[name], ...dataSet.data]
      })

      console.log(avgData)
      
      Object.keys(avgData).forEach((key)=>{
        let obj = avgData[key];
        let count = obj.length;
        console.log(obj)
        obj = obj.reduce((lastValue,thisValue)=>{
          lastValue+=parseFloat(typeof thisValue == 'string' ? thisValue.replace("\n",'') : thisValue);
          return lastValue;
        },0);
        obj/=count;
        avgData[key]=obj;
      });

      data = Object.keys(avgData).map(key=>{
        return{
          name:key,
          data:[avgData[key]]
        }
      })
    }

    return (
        <>
          <BarChart 
            yAxisTitle="Recovery Efficiency Rate"
            title={props.bottomTitle}
            data={data}
            clrs={props.clrs}
            labels={[""]}
          
          />
          </>
    )
}