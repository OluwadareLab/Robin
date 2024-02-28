import React, { useState, useEffect } from 'react';
import config from "../../config.mjs";
import textfile from "../../callers/exampleData/Recovery_lascaTest_H3K27ac_offset_50.txt";
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

const options = {
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

async function setupData(setData){
  const rawData = await (await fetch(textfile)).text();
  let x =[];
  let y =[];
  
}

const GraphComponent: React.FC = () => {

  const [data, setData] = useState<number[][]>([]);
  setupData(setData);

  return (
    <div>
      <h2>Graph</h2>
      
    </div>
  );
};

export default GraphComponent;
