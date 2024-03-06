import React, { useState, useEffect } from 'react';
import config from "../../config.mjs";
//import textfile from "../../../callers/exampleData/Recovery_lascaTest_H3K27ac_offset_50.txt";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';




type lineChartProps = {
  /**
   * @description the name of the y-axis
   */
  yAxisTitle:string

  /**
   * @description the name of the x-axis
   */
  xAxisTitle:string

  /** the x,y data set */
  datasets:{name:string,data:{x:number,y:number}[]}[]

  /** the title that displays above the graph */
  title:string
}

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



// async function setupData(setData){
//   const rawData = await (await fetch(textfile)).text();
//   const formattedData: {x:number,y:number}[] = [];
//   rawData.split("\n").forEach(line=>{
//     const splitLine = line.split(/\s+/);
//     formattedData.push(
//       {
//         "x":parseFloat(splitLine[0]),
//         "y":parseFloat(splitLine[1])
//       }
//     )
//   })
//   setData(formattedData)

  
// }

const bgClr = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0)`;

export const GraphComponent = (props: lineChartProps) => {
  const options = {
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
      x: {
        title: {
          display: true,
          text: props.xAxisTitle,
        },
        type: 'linear',
      },
      y: {
        title: {
          display: true,
          text: props.yAxisTitle,
        },
        type: 'linear'
      }
    },
    parsing:{
      xAxisKey: 'x',
      yAxisKey: 'y'
    }
  };

  const graphData = {
    datasets: props.datasets.map(dataset=>(
      {
        yAxisId:'y',
        label: dataset.name,
        data: dataset.data,
        borderColor: `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`,
        backgroundColor: bgClr,
      }
    ))
    
  }

  return (
    <div>
      <h2>Graph</h2>
      <Line options={options} data={graphData} />
    </div>
  );
};

