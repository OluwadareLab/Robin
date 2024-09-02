import React, { forwardRef, useRef } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  radius: 0,
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = [1,2,3,4,5];

let i =0;
export const randomDataSet = () => (
        {
            label: `Dataset ${++i}`,
            data: labels.map(() => Math.random()*100),
            borderColor: `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`,
            backgroundColor: `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, ${Math.random()})`,
        })



/**
 * 
 * @param props a object with the attribute ref optionally used for passing the ref
 * @returns 
 */
export const ExampleGraph = forwardRef(function ExampleGraph(props,ref) {
const data = {
    labels,
    datasets: [
        randomDataSet(),
        randomDataSet(),
        randomDataSet(),
        randomDataSet(),
        
    ],
    };
  return <Line options={options} data={data} ref={ref}/>;
});
