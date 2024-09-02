import {  Chart as ChartJS, LinearScale } from 'chart.js';
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { VennDiagramChart, VennDiagramController } from "chartjs-chart-venn";
import { UTIL } from '../../util';
import { DownloadImg } from './DownloadImg';

ChartJS.register(
  LinearScale,
  VennDiagramController

);

var i = 0;

type VennDiagramComponentProps = {
  /**  the id of the component (use if in lists otherwise allow auto id) */
  id?:number

  /** the labels of each element in the diagram */
  labels:string[]

  /** the array of all data in the diagram */
  data:{sets:string[],value:any}[]

  /** array of colors */
  clrs?:any[]
}
const VennDiagram = (props:VennDiagramComponentProps) => {
  const containerRef = useRef(null);
  const [chart,setChart] = useState<VennDiagramChart>();
  const dimensions = useDimensions(containerRef);
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
      legend: {
        display: false
     },
     layout:{
      "padding":50,
     },
     plugins: {
      legend: {
          display: false
      },
      labels: {
        padding: 50,
        font: {
          size: 14,
        },
      },
  },
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
    //get the container of the chart
    const ctx = document.getElementById(`ven:${props.id?props.id:i++}`);
    //destroy a chart if one already exists
    if(chart)chart.destroy()
    //set ref to new chart
    chartRef.current=new VennDiagramChart(ctx, config)
    //set state to new chart
    setChart(chartRef.current);
  }, [props.data]);

  useEffect(()=>{
    //make chart correct size
    chartRef.current?.resize(dimensions.width,dimensions.height);
  },[dimensions])

  
  return (
    <div ref={containerRef}>
      <canvas id={`ven:${props.id?props.id:i}`}></canvas>
      <DownloadImg chartRef={chartRef}/>
    </div>
    
  );
};

// Hook
//simple hook to resize our graph
function useDimensions(targetRef) {
  const getDimensions = () => {
    return {
      width: targetRef.current ? targetRef.current.offsetWidth : 0,
      height: targetRef.current ? targetRef.current.offsetHeight : 0
    };
  };

  const [dimensions, setDimensions] = useState(getDimensions);

  const handleResize = () => {
    setDimensions(getDimensions());
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    handleResize();
  }, []);
  return dimensions;
}

export default VennDiagram;
