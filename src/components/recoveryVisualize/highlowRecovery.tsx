import config from "../../config.mjs";
import { UTIL } from "../../util";
import { CustomLegend } from "../graph/customLegend";
import { BarChart } from "../graph/barChart"
import React, { ReactElement, useEffect, useState } from "react"

type HighLowRecoveryChartProps = {
  bottomTitle,
  barData,
  clrs,
  /** @description a raect element to display if the data provided to the chart is invalid, defaults to nothing */
  displayIfEmpty?: ReactElement
}

type DataSet = { toolName: string, data: any }[];

export const HighLowRecoveryChart = (props: HighLowRecoveryChartProps) => {
  //the component to display if our data is invalid
  let invalidComponent = props.displayIfEmpty ? props.displayIfEmpty : <></>

  //clrs for high and low
  let highClr = props.clrs ? props.clrs[0] : UTIL.getColor();
  let lowClr = props.clrs ? props.clrs[1] : UTIL.getColor();
  let legendItems = [
    { "label": "high", "backgroundColor": highClr },
    { "label": "low", "backgroundColor": lowClr }

  ]


  //categories to be displayed at the bottom of the bar chart
  let [categories, setCategories] = useState<any[]>([]);


  //clean data
  props.barData.forEach(data => {
    if (typeof data.data === 'string' || data.data instanceof String) {
      data.data = parseFloat(data.data.replace("\n", ""));
    }
  })

  useEffect(() => {
    let tempCategories = [];
    props.barData.forEach(data => {
      if (!tempCategories.includes(data.toolName)) {
        tempCategories.push(data.toolName)
        console.log(`added ${data.toolName}`)
      };
    })
    setCategories(tempCategories)

  }, [])


  let highlowData: { string: { high: DataSet, low: DataSet } } = {};

  //find cut off for middle res
  let allRes: {} | [] = {}
  props.barData.forEach(data => allRes[data.resolution] = data.resolution);
  allRes = Object.keys(allRes).map(n => parseInt(n)).sort() as number[];
  let middleRes = allRes[Math.round((allRes as number[]).length / 2) - 1]

  console.log("highlow: cuttoff" + middleRes)

  props.barData.forEach(data => {
    if (!highlowData[data.toolName]) highlowData[data.toolName] = { high: { name: data.toolName, data: [] }, low: { name: data.toolName, data: [] } };
    if (parseInt(data.resolution) >= middleRes) {
      //is low res

      highlowData[data.toolName].low.data = [];
      let indexOfToolName = categories.indexOf(data.toolName);
      highlowData[data.toolName].low.data[indexOfToolName] = [...highlowData[data.toolName].low.data, data.data];
    } else {
      //is high res
      highlowData[data.toolName].high.data = [];
      let indexOfToolName = categories.indexOf(data.toolName);
      highlowData[data.toolName].high.data[indexOfToolName] = [...highlowData[data.toolName].high.data, data.data];
    }
  });

  Object.keys(highlowData).forEach(key => {
    let highCount = allRes.length / 2;
    let lowCount = allRes.length / 2;
    highlowData[key].high.data = highlowData[key].high.data.reduce((x, y) => (x + y), 0) / highCount
    console.log(`element counts: ${highCount}`)
    highlowData[key].low.data = highlowData[key].low.data.reduce((x, y) => (x + y), 0) / lowCount
  })

  let data: { name: string, data: any }[] = [];

  Object.keys(highlowData)
    .forEach(key => {
      const element = highlowData[key];
      if (element.high.data) {
        console.log(element.high.data)
        console.log(element.low.data)
        data.push({
          name: `${key}_high`,
          data: [element.high.data],
          clr: highClr
        })
        data.push({
          name: `${key}_low`,
          data: [element.low.data],
          clr: lowClr
        })
      }

    })
    console.log(data);


  /**
   * @description a helper function that validates we have valid data to display the high low plot
   */
  const validData = () => {
    return (data.every(data => data.data))
  }

  console.log(categories)
  return (
    <>
      {validData() ?
        <>
          <BarChart
            yAxisTitle="Recovery Efficiency Rate"
            title={props.bottomTitle}
            data={data}
            clrs={props.clrs}
            labels={categories}
          />
          <CustomLegend items={legendItems} />
        </>
        : invalidComponent
      }
    </>
  )
}