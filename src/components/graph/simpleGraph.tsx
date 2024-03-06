import React, { useState, useEffect } from 'react';
import config from "../../config.mjs";

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
import { UTIL } from '../../util';





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

  clrs?: string[] | undefined
}

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const bgClr = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 1)`;

export const GraphComponent = (props: lineChartProps) => {

  const options = {
    radius: 0,
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



  let i =0;
  const graphData = {
    
    datasets: props.datasets.map(dataset=>(
      {
        yAxisId:'y',
        label: dataset.name,
        data: dataset.data,
        borderColor: props.clrs? props.clrs[i] : UTIL.getColor(),
        backgroundColor: props.clrs? props.clrs[i++] : UTIL.getColor(),
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

