import { GraphComponent } from "../graph/simpleGraph"
import { BarChart } from "../graph/barChart"
import React, { ReactElement, useRef } from "react"
import { DownloadImg } from "../graph/downloadImg"
import { Row } from "react-bootstrap"


type recoveryComponentTypes = {
  topTitle, 
  bottomTitle, 
  lineData, 
  barData, 
  clrs,
  regex,
  /** @description a jsx element to insert after the first graph (optional) */
  insertAfterFirstGraph?
  /** @description set to a string resolution to filter by or avg to take an average */
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

    let barData = prepareDatasets(props.barData);
    let lineData = prepareDatasets(props.lineData);
    lineData.forEach(obj=>obj.data=obj.data.flat());
    console.log(prepareDatasets(formatDataset(props.lineData)));
    console.log(lineData);
    console.log(formatDataset(props.lineData));
    
    return (
        <>
        <GraphComponent 
            datasets={lineData}
            xAxisTitle='Number of Loops Predicted'
            yAxisTitle='Recovery Rate'
            title={props.topTitle}
            clrs={props.clrs}
          />

          <Row>
            {props.insertAfterFirstGraph?props.insertAfterFirstGraph:""}
          </Row>
          
          <BarChart 
            yAxisTitle='Recovery Rate'
            title={props.bottomTitle}
            data={barData}
            clrs={props.clrs}
            labels={[""]}
          />
          </>
    )
}