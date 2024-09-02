import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { UTIL } from '../../util';
import { lineChartProps } from './GraphComponent';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);


let i = 0;
export function ScatterChart(props: lineChartProps) {
    const data = {
        datasets: props.datasets.map(dataset=>(
            {
              yAxisId:'y',
              label: dataset.name,
              data: dataset.data,
              borderColor: props.clrs? props.clrs[i] : UTIL.getColor(),
              backgroundColor: props.clrs? props.clrs[i++] : UTIL.getColor(),
            }
          ))
    };
    const options = {
        scales: {
            y: {
            beginAtZero: true,
            },
        },
        };
  return <Scatter options={options} data={data} />;
}
