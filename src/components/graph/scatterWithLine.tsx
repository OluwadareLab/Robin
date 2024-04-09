import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { UTIL } from '../../util';
import { lineChartProps } from './simpleGraph';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

let i = 0;
export function ScatterChartWithLine(props: lineChartProps) {
    const data = {
        datasets: [
            {
              type: 'scatter' as const,
              yAxisId:'y',
              label: "test scatter",
              data: UTIL.getRandomXyDataset(),
              borderColor: props.clrs? props.clrs[i] : UTIL.getColor(),
              backgroundColor: props.clrs? props.clrs[i++] : UTIL.getColor(),
            },
            {
              type: 'line' as const,
              yAxisId:'y',
              label: "test line",
              data: [{x:0,y:0},{x:100,y:100}],
              borderColor: props.clrs? props.clrs[i] : UTIL.getColor(),
              backgroundColor: props.clrs? props.clrs[i++] : UTIL.getColor(),
            }
          ]

    };
    const options = {
        scales: {
            y: {
            beginAtZero: true,
            },
        },
        };
  return <Chart options={options} data={data} />;
}
