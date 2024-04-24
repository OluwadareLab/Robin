import React, { useState, useEffect, useRef } from 'react';
import config from "../../config.mjs";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Hammer from "hammerjs";
import Zoom, * as zoom from 'chartjs-plugin-zoom'
import ZoomPlugin from 'chartjs-plugin-zoom'
import "chartjs-plugin-zoom";
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DownloadImg } from './downloadImg';





export type lineChartProps = {
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

  radius?: Number
}

ChartJS.register(
  Zoom,
  zoom,
  ZoomPlugin,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const bgClr = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 1)`;

export const GraphComponent = (props: lineChartProps) => {
  let radius = props.radius ? props.radius : 0;
  const chartRef = useRef(null);

  const options = {
    spanGaps:true,
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
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
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
    },

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
  console.log(graphData);
  
  return (
    <>
      <Line options={options} data={graphData} ref={chartRef}/>
      <DownloadImg chartRef={chartRef}/>
    </>
  );
};

