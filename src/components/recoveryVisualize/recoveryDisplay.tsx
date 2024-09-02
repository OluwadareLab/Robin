import { GraphComponent } from "../graph/GraphComponent"
import { BarChart } from "../graph/BarChart"
import React, { ReactElement, useRef } from "react"
import { DownloadImg } from "../graph/DownloadImg"
import { Row } from "react-bootstrap"


type recoveryComponentTypes = {
  topTitle, 
  bottomTitle, 
  lineData, 
  barData, 
  clrs,
  regex,
  /**  a jsx element to insert after the first graph (optional) */
  insertAfterFirstGraph?
  /**  set to a string resolution to filter by or avg to take an average */
  filterResolution?
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
    const shouldAvg = props.filterResolution=="average";
    const filterRes = (!["all resolutions","average"].includes(props.filterResolution)) ? props.filterResolution : undefined;

    function prepareDatasets(dataset){
      let data:{name:string,data:any}[] = dataset
        .filter(obj=>new RegExp(props.regex, 'i').test(obj.method))
        .filter(obj=>(filterRes ? obj.resolution == filterRes : true))
        .map(value=>
            ({
              name:`${value.toolName}_${value.resolution}`,
              data:[value.data]
            }));
    
        if(shouldAvg){
          const avgData = {};
          data.forEach((dataSet)=>{
            const name = dataSet.name.split('_')[0];
            if(!avgData[name]) avgData[name] = [];
            avgData[name] = [...avgData[name], ...dataSet.data]
          })
    
          console.log(avgData)
          
          Object.keys(avgData).forEach((key)=>{
            let obj = avgData[key];
            const count = obj.length;
            console.log(obj)
            obj = obj.reduce((lastValue,thisValue)=>{
              lastValue.x+=thisValue.x;
              lastValue.y+=thisValue.y;
              return lastValue;
            },{"x":0,"y":0});
            obj.x/=count;
            obj.y/=count;
            avgData[key]=obj;
          });
    
          data = Object.keys(avgData).map(key=>{
            return{
              name:key,
              data:[avgData[key]]
            }
          })
        }
        return data;
    }

    const barData = prepareDatasets(props.barData);
    const lineData = prepareDatasets(props.lineData);
    lineData.forEach(obj=>obj.data=obj.data.flat());
    console.log(prepareDatasets(formatDataset(props.lineData)));
    console.log(lineData);
    console.log(formatDataset(props.lineData));
    
    return (
        <>
        <GraphComponent 
            datasets={lineData}
            xAxisTitle='Number of Loops Predicted'
            yAxisTitle={props.isRem?'Recovery Efficiency Rate':'Recovery Rate'}
            title={props.topTitle}
            clrs={props.clrs}
          />

          <Row>
            {props.insertAfterFirstGraph?props.insertAfterFirstGraph:""}
          </Row>
          
          <BarChart 
            yAxisTitle={props.isRem?'Recovery Efficiency Rate':'Recovery Rate'}
            title={props.bottomTitle}
            data={barData}
            clrs={props.clrs}
            labels={[""]}
          />
          </>
    )
}