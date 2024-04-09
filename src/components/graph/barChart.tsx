import React, { Ref, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { UTIL } from '../../util';
import { DownloadImg } from './downloadImg';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function BarChart(props: {
    data:{"name":string,data:any}[]
    labels:string[]
    title:string
    clrs? :string[] | undefined

}) {
    let chartRef = useRef(null);
    const labels =props.labels;
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
      };


    let i = 0;
    const data = {
        labels,
        datasets: props.data.map(data=>{
            for (let index = 0; index < labels.indexOf(data.name.split("_")[0]); index++) {
                data.data.unshift(0);
            }
            
            return ({
                label: data.name,
                data: data.data,
                maxBarThickness: 80,
                backgroundColor:props.clrs? props.clrs[i++] : UTIL.getColor(),
                })
        })
    };

  return <>
    <Bar options={options} data={data} ref={chartRef}/>
    <DownloadImg chartRef={chartRef}/>
  </>
}