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
import { Button, Col, Container, Form, Row } from 'react-bootstrap';





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

let k =0;
export const GraphComponent = (props: lineChartProps) => {
  let [baseRadius,setBaseRadius] = useState(0);
  let [showAllPoints,setShowAllPoints] = useState(0);
  let radius = props.radius ? props.radius : baseRadius;

  const toggleShowAllPoints = () => {
    setShowAllPoints(!showAllPoints);
    setBaseRadius((!showAllPoints) ? 5 : (props.radius ? props.radius : 0));
  }
  let renderToggleBtn = false;
  console.log(props.datasets)
  props.datasets.forEach(dataset=>{
    if(dataset.data.filter(point=>!isNaN(point.x)&&!isNaN(point.y)).length==1){
      renderToggleBtn=true;
    }
  })
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


  let clr;
  let i =0;
  const graphData = {
    
    datasets: props.datasets.map(dataset=>(
      {
        yAxisId:'y',
        label: dataset.name,
        data: dataset.data,
        borderColor: props.clrs? props.clrs[i] : clr = UTIL.getColor(),
        backgroundColor: props.clrs? props.clrs[i++] : clr,
      }
    ))
    
  }
  console.log(graphData);
  
  return (
    <>
    <Row>
      <Line options={options} data={graphData} ref={chartRef}/>
    </Row>
    { (renderToggleBtn && !props.radius) ? 
      <Container>
      <Row>
        <Col md={8}>
          <p>One or more datasets have only 1 data point, thus not drawing a line.</p>
        </Col>
        <Col>
          <Form.Check 
            type="switch"
            id={`switch-${k++}`}
            label="Draw All Points"
            checked={showAllPoints}
            onChange={toggleShowAllPoints}
          />
        </Col>
        
      </Row>

      <hr/>
      </Container>
    : ""}
    <Row>
      <Col>
        <DownloadImg chartRef={chartRef}/>
      </Col>
    </Row>
      
      
    </>
  );
};

