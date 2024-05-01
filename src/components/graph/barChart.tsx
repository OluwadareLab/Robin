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
    data:{
      clr?: any;"name":string,data:any
  }[]
    labels:string[]
    title:string
    clrs? :string[] | undefined
      /**
     * @description the name of the y-axis
     */
    yAxisTitle:string

    /**
     * @description the name of the x-axis
     */
    xAxisTitle:string

}) {
    console.log(props)
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
          tooltip: {
          // Custom tooltip handling to display values in scientific notation
          callbacks: {
            label: function(context) {
              let label = context.dataset.label
              let value = context.raw.y;
              let parsedValue = value;
              if(value < .00001){
                if(typeof value == 'string' || value instanceof String) value = parseFloat(value);
                parsedValue = value.toPrecision();
              }

              if(typeof parsedValue == 'undefined'){
                parsedValue = context.parsed.y;
              }

              if(parsedValue==0 || isNaN(parsedValue) || typeof parsedValue == 'undefined'){
                parsedValue = context.raw.y;
              }
              return `${label}: ${parsedValue}`;
              }
            }
          },

          plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
  
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: props.xAxisTitle,
            },
          },
          y: {
            title: {
              display: true,
              text: props.yAxisTitle,
            },
          }
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
                backgroundColor:(data.clr? data.clr : (props.clrs? props.clrs[i++] : UTIL.getColor())),
                })
        })
    };

  return <>
    <Bar options={options} data={data} ref={chartRef}/>
    <DownloadImg chartRef={chartRef}/>
  </>
}