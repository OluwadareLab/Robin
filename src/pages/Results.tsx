import React, { ReactElement, useEffect, useState } from 'react';
import { Col, Container, Tab, Tabs } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { HiGlassComponent, HiGlassComponentWrapper } from '../components/visualizationTools/HiGlass/HIGlass';
import {GraphComponent} from '../components/graph/simpleGraph';
import { Graph } from '../components/graph/exampleGraph';
import _ from "lodash"; // cool kids know _ is low-dash
import { ScalableElement } from '../components/misc/scaleableElement';

import { RecoveryComponent, formatDataset } from '../components/recoveryVisualize/recoveryDisplay';
import axios from 'axios';
import { apiPaths } from '../api/apiConfig';
import { useParams } from 'react-router-dom';
import {BarChart} from '../components/graph/barChart';
import { UTIL } from '../util';
import { RemDisplay } from '../components/recoveryVisualize/remDisplay';
import { ScatterChart } from '../components/graph/scatterGraph';
import { ScatterChartWithLine } from '../components/graph/scatterWithLine';
import { LinierRegressionScatterPlot } from '../components/graph/scatterWithLinierRegresionLine';

interface AnalysisResult {
  method: string;
  data: number[];
  component: ReactElement<any, any>
}

type ChromatinLoopAnalysisResultsPageProps = {
    example?: boolean;
}

const clrs: any = {};
[...Array(10).keys()].map(n=>clrs[n]=UTIL.getColor())


export const ChromatinLoopAnalysisResultsPage = (props: ChromatinLoopAnalysisResultsPageProps) => {
  const [activeTab, setActiveTab] = useState<string>('method1');
  const [jobResults, setJobResults]  = useState<{toolname:string, files:{resultFileName:string, data:string}[]}[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [regressionPoints, setRegressionPoints] = useState<any[]>([]);
  const [recoveryDatasets, setRecoveryDatasets] = useState<{string:any[]}>({});
  const [rnapiiDatasets, setRnapiiDatasets] = useState<any[]>([]);
  const [loopSizes, setLoopSizes] = useState<any[]>([]);
  const [remValues, setRemValues] = useState<any[]>([]);
  const [kbVsResDataset, setKbVsResDataset] = useState<any[]>([]);
  const [binVsResDataset, setBinVsResDataset] = useState<any[]>([]);

  const params = useParams()

  const handleTabSelect = (tab:any) => {
    setActiveTab(tab);

    return true
  };

  

  let jobId = params.id
  if(props.example) jobId = "1";

  const getRecoveryMax = (data) =>{

    let testData = _.cloneDeep(data);

    testData.forEach(data=>{
      data.data = data.data[data.data.length-2];
    })
    return testData
  }
 

  const RegressionGraph = (props:{dataset:any,xAxisTitle:string,yAxisTitle:string,title:string}) => (
    <GraphComponent 
        datasets ={ 
          Object.keys(props.dataset).map(key=>(
            {
              name:key,
              data:props.dataset[key]
            }
          ))
      }
        xAxisTitle={props.xAxisTitle}
        yAxisTitle={props.yAxisTitle}
        title={props.title}
        clrs={props.clrs}
        radius={5}
      />
    )
  const normalPage = 
  <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
      <Tab key="Overlap" eventKey="Apa_Score" title="Overlap">
        
      </Tab>
        
      <Tab key="Regression" eventKey="Regression" title="Regression">
      <ScalableElement defaultSize={.5}>
        <Container>
          <LinierRegressionScatterPlot clrs={clrs} yAxisTitle={'temp'} xAxisTitle={'temp2'} scatterData={[{'name':"londa",data:UTIL.getRandomXyDataset(3)},{'name':"costco",data:UTIL.getRandomXyDataset(3)},{'name':"casca",data:UTIL.getRandomXyDataset(3)}]} title={'test'} />
          <RegressionGraph dataset={binVsResDataset} xAxisTitle='Resolution' yAxisTitle='Bin Size' title={`Size (% bins) vs. Resolution`}/>
          <RegressionGraph dataset={kbVsResDataset} xAxisTitle='Resolution' yAxisTitle='Bin Size' title={`Size (kB) vs Resolution`}/>
        </Container>
      </ScalableElement>
      </Tab>

      
        {Object.keys(recoveryDatasets).map(key=>{
          const recoveryMethodArr = recoveryDatasets[key];
          const barData = getRecoveryMax(recoveryMethodArr);
          const data = recoveryMethodArr;
          console.log(barData);
          

          return (
            <Tab key={`${recoveryMethodArr[0].method}`} eventKey={`${recoveryMethodArr[0].method}`} title={`${recoveryMethodArr[0].method}`}>
              <ScalableElement defaultSize={.5}>
              <Container>
                <RecoveryComponent
                  topTitle={`${recoveryMethodArr[0].method}`}
                  bottomTitle={`${recoveryMethodArr[0].method} Recovery`}
                  clrs={clrs}
                  regex={`${recoveryMethodArr[0].method}`}
                  barData={barData}
                  lineData={data}
                />
                <RemDisplay
                  barData={remValues}
                  bottomTitle={`${recoveryMethodArr[0].method} (REM)`}
                  clrs={clrs}
                  regex={`${recoveryMethodArr[0].method}`}
                />
              </Container>
              </ScalableElement>
            </Tab>
          )
        }
        )
        }
      
      <Tab key="higlass" eventKey="higlass" title="higlass">
        <Container>
          <HiGlassComponentWrapper/>
        </Container>
      </Tab>
  </Tabs>

function getJobResults(){
  axios.get(apiPaths.jobResults + "?id=" + jobId).then((response) => {
    setJobResults(response.data);
  });
}

async function setupDataSets (){
  axios.get(apiPaths.jobResults + "?id=" + jobId).then(async (response) => {
    await setJobResults(response.data.results);
    const results = response.data.results;
    console.log(results)

    const formattedData: {x:number,y:number}[] = [];
    // datasets=[{
    //   name:"exampleLascaData",
    //   data:graphdata
    // }]
    const dataSets: any[] = [
    
    ]

    function convertToXYDataset(str:string) {
      return str.split("\n").map(line=>{
        const splitLine = line.split(/\s+/);
        return(
          {
            "x":parseFloat(splitLine[0]),
            "y":parseFloat(splitLine[1])
          }
        )
      })
    }

    //clear all datasets as we update
    let tempDatasets:any = {}
    let tempRemData: any[] = [];
    let tempLoopSizes: any = {};
    let tempRegressionPoints: any = {}
    let tempKbVsRes: any = {};
    let tempBinVsRes: any = {};

    const toolsNames = Object.keys(results);
    toolsNames.forEach(name => {
      const toolData: {
        ctcfResults:{data:any}[],
        h3k27acResults:{data:any}[],
        remResults:{data:any}[],
        rnapiiResults:{data:any}[],
        toolName:string
      } = results[name];


      toolData.results.map(result=>result.data=convertToXYDataset(result.data));
      

      console.log(toolData)
      //append all datasets
      toolData.results.forEach(obj=>{
        if(!tempDatasets[obj.method]) tempDatasets[obj.method] = [];
        tempDatasets[obj.method].push(obj);
      })

      toolData.loopSizeResults.forEach(obj=>{
        if(!tempLoopSizes[obj.toolName]) tempLoopSizes[obj.toolName] = [];
        tempLoopSizes[obj.toolName].push(obj);
      })

      tempRemData = [...tempRemData, ...toolData.remResults];
      console.log(toolData)     

      //if we have enough points to plot our regression
      // if(tempLoopSizes[obj.method].length > 1){
        let obj = toolData.results[0];
        tempRegressionPoints[obj.toolName] = {
        'kbVsRes':[],
        'binVsRes':[]
      };
      
      console.log(tempLoopSizes)
      console.log(obj.toolName)
      tempLoopSizes[obj.toolName].forEach(loopSizeInfo=>{
        tempRegressionPoints[obj.toolName]['kbVsRes'].push({x:parseInt(loopSizeInfo.resolution),y:parseFloat(loopSizeInfo.avgKbSize)})
        tempRegressionPoints[obj.toolName]['binVsRes'].push({x:parseInt(loopSizeInfo.resolution),y:parseFloat(loopSizeInfo.avgBinNumersSize)})
      })

      //extract the data
      tempKbVsRes[obj.toolName]=[]
      tempRegressionPoints[obj.toolName]['kbVsRes'].forEach(kbVsResElement=>{
        tempKbVsRes[obj.toolName].push(kbVsResElement);
      })
      tempBinVsRes[obj.toolName]=[]
      tempRegressionPoints[obj.toolName]['binVsRes'].forEach(binVsResElement=>{
        tempBinVsRes[obj.toolName].push(binVsResElement);
      })

      setBinVsResDataset(tempBinVsRes);
      setKbVsResDataset(tempKbVsRes);
        
      // }
    })

    

    console.log(tempDatasets)
    setRecoveryDatasets(tempDatasets);
    setRemValues(tempRemData);
    setLoopSizes(tempLoopSizes);
    setRegressionPoints(tempRegressionPoints);
    console.log(tempRegressionPoints)   
    console.log(tempLoopSizes)


  });
  
}

  useEffect(()=>{
    setupDataSets();
  }, [])

  const examplePage = 
  <>
    <GraphComponent 
      datasets={datasets}
      xAxisTitle='x'
      yAxisTitle='y'
      title='example'
    ></GraphComponent>
  </>

  return (
    <div id="resultsMainPage">
          {normalPage}
    </div>
  );
};
