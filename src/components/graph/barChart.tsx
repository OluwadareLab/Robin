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
import Zoom, * as zoom from 'chartjs-plugin-zoom'
import ZoomPlugin from 'chartjs-plugin-zoom'

ChartJS.register(
  Zoom,
  zoom,
  ZoomPlugin,
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
    width?:number
      /**
     * @description the name of the y-axis
     */
    yAxisTitle:string

    /**
     * @description the name of the x-axis
     */
    xAxisTitle:string


    /** if provided use this as the data for the data set */
    overrideDataPureNumberArray?:number[]

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
            },  
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
        barThickness: props.width || undefined
      };

      console.log("max="+Math.max(...props.data.map(e=>e.data).flat().filter(e=>!isNaN(e))))
      console.log(props.data.map(e=>e.data).flat());
      console.log(props.data.map(e=>e.data))
      console.log(props.data.map(e=>e.data).flat().filter(e=>!isNaN(e)))
    let i = 0;
    const data = {
        labels,
        datasets: props.data.map(data=>{
            for (let index = 0; index < labels.indexOf(data.name.split("_")[0]); index++) {
                data.data.unshift(undefined);
            }
            
            return ({
                skipNull:true,
                minBarLength:3,
                label: data.name,
                data: data.data,
                maxBarThickness: 80,
                backgroundColor:(data.clr? data.clr : (props.clrs? props.clrs[i++] : UTIL.getColor())),
                })
        })
        // .sort((seta,setb)=>{
        //   if(!props.sort) return 0;
        //   let val = setb.data-seta.data;
        //   console.log(val);
        //   if(isNaN(val)){
        //     val = setb.data.filter(e=>!isNaN(e))[0]-seta.data.filter(e=>!isNaN(e))[0];
        //   }
        //   console.log(val);
        //   if(isNaN(val)){
        //     val = setb.data[0].y-seta.data[0].y;
        //   }
        //   console.log("returned:"+val);

        //   return val;

        // })
    };
    console.log(data);

  return <>
    <Bar options={options} data={data} ref={chartRef}/>
    <DownloadImg chartRef={chartRef}/>
  </>
}