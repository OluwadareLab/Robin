import React, { useRef } from 'react';
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
import { lineChartProps } from './GraphComponent';
import { linearRegression } from 'simple-statistics'
import { DownloadImg } from './DownloadImg';
import { CustomLegend } from './customLegend';

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


export type linierRegressionScatterPlotProps = {
  /**
   *  the name of the y-axis
   */
  yAxisTitle: string

  /**
   *  the name of the x-axis
   */
  xAxisTitle: string

  /** the scatter data, category can be undefined*/
  scatterData: { name: string, data: { x: number, y: number }[], category: string }[]

  /** the title that displays above the graph */
  title: string

  clrs?: string[] | undefined

  radius?: Number

  /**  default true */
  shouldAvg?: boolean
}

let i = 0;
let k = 0;
export function LinierRegressionScatterPlot(props: linierRegressionScatterPlotProps) {
  const shouldAvg = typeof props.shouldAvg != 'undefined' ? props.shouldAvg : true;
  let chartRef = useRef(null);
  let radius = props.radius ? props.radius : 5;
  //an array of all slope intercepts for the regression lines
  let regressionFormulas: {
    m: number;
    b: number;
  }[] = [];
  //an array of all rgression lines bounded by the  highest and lowest x values of their categories
  let regressionLines: { name: string, data: { x: number, y: number }[] }[] = []
  let categoricalLegend = {};
  console.log(props.scatterData);
  //average all tools to 1 point based on their resolutions.
  let categories = {};
  props.scatterData.forEach(dataSet => {
    if (shouldAvg) {
      let count = dataSet.data.length;
      dataSet.data = [dataSet.data.reduce((sumObj, curObj) => {
        return ({
          x: sumObj.x + curObj.x,
          y: sumObj.y + curObj.y
        });

      }, { x: 0, y: 0 })
      ];
      dataSet.data[0].x /= count;
      dataSet.data[0].y /= count;
    }

    if(!categoricalLegend[dataSet.category]) categoricalLegend[dataSet.category] = [];
    categoricalLegend[dataSet.category].push({title:dataSet.name});
    if (!categories[dataSet.category]) categories[dataSet.category] = JSON.parse(JSON.stringify(dataSet));
    else {
      categories[dataSet.category].data = [...categories[dataSet.category].data, ...dataSet.data]
    }
  })

  console.log(categories);



  Object.keys(categories).forEach(key => {
    const dataSet = categories[key];
    let smallestX = 0;
    let largestX = 0;
    if (dataSet.data[0]) {
      smallestX = dataSet.data[0].x;
      largestX = dataSet.data[0].x;
    }
    let data: number[][] = []
    dataSet.data.forEach(coord => {
      if (coord.x < smallestX) smallestX = coord.x;
      else if (coord.x > largestX) largestX = coord.x;
      data.push([coord.x, coord.y]);
    })

    const regressionData = linearRegression(data);
    regressionFormulas.push(regressionData);

    let regressionPointLow = { y: regressionData.m * smallestX + regressionData.b, x: smallestX };
    let regressionPointHigh = { y: regressionData.m * largestX + regressionData.b, x: largestX };
    let regressionLineDataset = {
      name: dataSet.name,
      data: [regressionPointLow, regressionPointHigh],
      category: dataSet.category
    };
    regressionLines.push(regressionLineDataset);
  })

  const regressionMatcher = (clr,category)=>{
    categoricalLegend[category].backgroundColor=clr;
    return "";
  }

  let clr;
  const data = {
    datasets: []

  };

  //add data to datasets array in order of category line, all data points for that category, category line, ...
  regressionLines.forEach(lineData=>{
    let category = lineData.category;
    let categoryColor = (props.clrs && regressionLines.length>1) ? props.clrs[k] : clr=UTIL.getColor();
    k++;
    //call a function to match the color of the category to the external legend that displays below the chart
    regressionMatcher(categoryColor,category);

    let categoryRegressionLineDataObj = {
      radius: 0,
      type: 'line' as const,
      yAxisId: props.yAxisTitle,
      label: `${regressionLines.length>1?`${category}`:"Regression Line"}`,
      data: lineData.data,
      borderColor: categoryColor,
      backgroundColor: categoryColor,
    }

    data.datasets.push(categoryRegressionLineDataObj);
    //filter for only scatter data sets that have the same category
    props.scatterData.filter(scatterData=>scatterData.category==category).forEach(scatterData=>{
        let borderClr = (props.clrs) ? (props.clrs[i]) : clr=UTIL.getColor();
        let backgroundColor = (props.clrs) ?  ( regressionLines.length>1 ? categoricalLegend[scatterData.category].backgroundColor : props.clrs[i]) : clr;
        i++;
        let scatterDataObj = {
          type: 'scatter' as const,
          yAxisId: props.yAxisTitle,
          label: `${scatterData.name}`,
          data: scatterData.data,
          borderColor: borderClr,
          backgroundColor: backgroundColor,
        }
      data.datasets.push(scatterDataObj);
    })
  })

  const options = {
    spanGaps: true,
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
    parsing: {
      xAxisKey: 'x',
      yAxisKey: 'y'
    },

  };

  console.log(categoricalLegend)

  let realCatLegend:any = [];
  Object.keys(categoricalLegend).forEach((key)=>{
    let tools = categoricalLegend[key];
    console.log(tools);
    realCatLegend.push({
      "label":`Category ${key}: ${tools.map(tool=>`${tool.title}, `)}`,
      "backgroundColor":tools.backgroundColor
      })
  });

  //todo: make this cleaner.
  //this is just a simple formatting function to clean up baddly passed strings, so its fine to be a bit messy
  realCatLegend.forEach(item=>item.label=item.label.replace(/,\s*$/,"").replace(/,{0,2}\s,/gi,",").replace(/,/gi,", "));

  return <>
    <Chart options={options} data={data} type={'line'} ref={chartRef} />
    {regressionLines.length>1?
      <CustomLegend
      items={realCatLegend}
      />:""
  }
    
    <DownloadImg chartRef={chartRef} />
    
  </>

}
