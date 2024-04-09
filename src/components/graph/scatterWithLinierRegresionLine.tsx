import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { UTIL } from '../../util';
import { lineChartProps } from './simpleGraph';
import {linearRegression} from 'simple-statistics'
import { DownloadImg } from './downloadImg';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);


export type linierRegressionScatterPlotProps = {
  /**
   * @description the name of the y-axis
   */
  yAxisTitle:string

  /**
   * @description the name of the x-axis
   */
  xAxisTitle:string

  /** the scatter data each additional dataset is considered a different category*/
  scatterData:{name:string,data:{x:number,y:number}[]}[]

  /** the title that displays above the graph */
  title:string

  clrs?: string[] | undefined

  radius?: Number
}

let i = 0;
let k =0;
export function LinierRegressionScatterPlot(props: linierRegressionScatterPlotProps) {
    let chartRef = useRef(null);
    let radius = props.radius ? props.radius : 3;
    //an array of all slope intercepts for the regression lines
    let regressionFormulas: {
      m: number;
      b: number;
    }[] = [];
    //an array of all rgression lines bounded by the  highest and lowest x values of their categories
    let regressionLines: {name:string,data:{x:number,y:number}[]}[] = []

    props.scatterData.forEach(dataSet=>{
      let smallestX=dataSet.data[0].x;
      let largestX=dataSet.data[0].x;
      let data: number[][] = []
      dataSet.data.forEach(coord=>{
        if(coord.x < smallestX) smallestX = coord.x;
        else if(coord.x > largestX) largestX = coord.x;
        data.push([coord.x,coord.y]);
      })

      const regressionData = linearRegression(data);
      regressionFormulas.push(regressionData);

      let regressionPointLow = {y:regressionData.m*smallestX+regressionData.b,x:smallestX};
      let regressionPointHigh = {y:regressionData.m*largestX+regressionData.b,x:largestX};
      let regressionLineDataset ={
        name:dataSet.name,
        data:[regressionPointLow,regressionPointHigh]
      };
      regressionLines.push(regressionLineDataset);
    })


    const data = {
        datasets: [
          ...props.scatterData.map(scatterData=>({
            type: 'scatter' as const,
            yAxisId:props.yAxisTitle,
            label: `${scatterData.name}(original data)`,
            data: scatterData.data,
            borderColor: props.clrs? props.clrs[i] : UTIL.getColor(),
            backgroundColor: props.clrs? props.clrs[i++] : UTIL.getColor(),
          })),
            ...regressionLines.map(lineData=>(
              {
                radius:0,
                type: 'line' as const,
                yAxisId:props.yAxisTitle,
                label:`${lineData.name}(regression line)`,
                data: lineData.data,
                borderColor: props.clrs? props.clrs[k] : UTIL.getColor(),
                backgroundColor: props.clrs? props.clrs[k++] : UTIL.getColor(),
              })
            ),
          ]

    };
    const options = {
      radius: radius,
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: props.title,
        },
      },
        scales: {
            y: {
            beginAtZero: true,
            },
        },
        };
  return <>
    <Chart options={options} data={data} type={'line'} />;
    <DownloadImg chartRef={chartRef}/>
  </>
  
}
