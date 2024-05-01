import {  Chart as ChartJS, LinearScale } from 'chart.js';
import React, { useEffect, useRef, useState } from "react";
import { VennDiagramChart, VennDiagramController } from "chartjs-chart-venn";
import { UTIL } from '../../util';
import { DownloadImg } from './downloadImg';

ChartJS.register(
  LinearScale,
  VennDiagramController

);

var i = 0;

type VennDiagramComponentProps = {
  /** @description the id of the component (use if in lists otherwise allow auto id) */
  id?:number

  /** the labels of each element in the diagram */
  labels:string[]

  /** the array of all data in the diagram */
  data:{sets:string[],value:any}[]

  /** array of colors */
  clrs?:any[]
}
const VennDiagramComponent = (props:VennDiagramComponentProps) => {
  const [chart,setChart] = useState<VennDiagramChart>();
  const chartRef = useRef();
  
  const config = {
    type: 'venn',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: "Venn Diagram",
          data: props.data
        }
      ]
    },
    options: {
      backgroundColor: [
        "rgba(255, 26, 104, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)"
      ],
      borderColor: [
        "rgba(255, 26, 104, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ]
    }
  };

  useEffect(() => {
    const ctx = document.getElementById(`ven:${props.id?props.id:i++}`);
    if(chart)chart.destroy()
    chartRef.current=new VennDiagramChart(ctx, config)
    setChart(chartRef.current);
  }, [props.data]);

  
  return (
    <>
      <canvas id={`ven:${props.id?props.id:i}`}></canvas>
      <DownloadImg chartRef={chartRef}/>
    </>
    
  );
};

export default VennDiagramComponent;
