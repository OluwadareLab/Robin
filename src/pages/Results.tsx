import React, { ReactElement, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { HiGlassComponent } from '../components/visualizationTools/HiGlass/HIGlass';
import {GraphComponent} from '../components/graph/simpleGraph';
import { Graph } from '../components/graph/exampleGraph';
import _ from "lodash"; // cool kids know _ is low-dash

import { RecoveryComponent } from '../components/recoveryVisualize/recoveryDisplay';
import axios from 'axios';
import { apiPaths } from '../api/apiConfig';
import { useParams } from 'react-router-dom';
import {BarChart} from '../components/graph/barChart';
import { UTIL } from '../util';
import { RemDisplay } from '../components/recoveryVisualize/remDisplay';

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
  const [ctcfDatasets, setCtcfDatasets] = useState<any[]>([]);
  const [rnapiiDatasets, setRnapiiDatasets] = useState<any[]>([]);
  const [h3k27acDatasets, setH3k27acDatasets] = useState<any[]>([]);
  const [remValues, setRemValues] = useState<any[]>([]);

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
 

  const normalPage = 
  <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
    <Tab key="Apa_Score" eventKey="Apa_Score" title="APA Score">
        Apa
    </Tab>
    <Tab key="RNAPII" eventKey="RNAPII" title="rnapii">
      <RecoveryComponent 
      topTitle={"RNAPII"}
      lineData={rnapiiDatasets}
      clrs={clrs}
      bottomTitle={"RNAPII Recovery"}
      barData={getRecoveryMax(rnapiiDatasets)}
      regex={"rnapii"}
      />
      <RemDisplay 
        barData={remValues} 
        bottomTitle={"RNAPII (REM)"}
        regex={"rnapii"}
        clrs={clrs}
      ></RemDisplay>
    </Tab>
    <Tab key="h3k27ac" eventKey="h3k27ac" title="h3k27ac">
      <RecoveryComponent 
        topTitle={"H3K27AC"}
        lineData={h3k27acDatasets}
        clrs={clrs}
        bottomTitle={"H3K27AC Recovery"}
        barData={getRecoveryMax(h3k27acDatasets)}
        regex={"h3k27ac"}
        />
        <RemDisplay 
        barData={remValues} 
        bottomTitle={"H3K27AC (REM)"}
        regex={"h3k27ac"}
        clrs={clrs}
        ></RemDisplay>
    </Tab>
    <Tab key="ctcf" eventKey="ctcf" title="ctcf">
      <RecoveryComponent 
          topTitle={"CTCF"}
          lineData={ctcfDatasets}
          clrs={clrs}
          bottomTitle={"CTCF Recovery"}
          barData={getRecoveryMax(ctcfDatasets)}
          regex={"ctcf"}
      />
      <RemDisplay 
        barData={remValues} 
        bottomTitle={"CTCF (REM)"}
        regex={"ctcf"}
        clrs={clrs}
      ></RemDisplay>
    </Tab>
    <Tab key="higlass" eventKey="higlass" title="higlass">
      higlass
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
    let tempCtcfDatasets: any[] = []
    let tempRnapiiDatasets: any[] = []
    let tempH3k27acDatasets: any[] = []
    let tempRemData: any[] = []

    const toolsNames = Object.keys(results);
    toolsNames.forEach(name => {
      const toolData: {
        ctcfResults:{data:any}[],
        h3k27acResults:{data:any}[],
        remResults:{data:any}[],
        rnapiiResults:{data:any}[],
        toolName:string
      } = results[name];

      toolData.ctcfResults.map(result=>result.data=convertToXYDataset(result.data));
      toolData.rnapiiResults.map(result=>result.data=convertToXYDataset(result.data));
      toolData.h3k27acResults.map(result=>result.data=convertToXYDataset(result.data));

      //append all datasets
      tempCtcfDatasets = [...tempCtcfDatasets, ...toolData.ctcfResults];
      tempRnapiiDatasets = [...tempRnapiiDatasets, ...toolData.rnapiiResults];
      tempH3k27acDatasets = [...tempH3k27acDatasets, ...toolData.h3k27acResults];
      tempRemData = [...tempRemData, ...toolData.remResults];
    })

    setCtcfDatasets(tempCtcfDatasets);
    setRnapiiDatasets(tempRnapiiDatasets);
    setH3k27acDatasets(tempH3k27acDatasets);
    setRemValues(tempRemData);
    
      
    console.log(rnapiiDatasets)


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
    <div>
      
          {normalPage}
      
    </div>
  );
};
