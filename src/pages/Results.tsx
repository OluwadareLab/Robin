import React, { ReactElement, useEffect, useState } from 'react';
import { Accordion, AccordionBody, AccordionItem, Col, Container, Tab, Tabs, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { HiGlassComponent, HiGlassComponentWrapper } from '../components/visualizationTools/HiGlass/HIGlass';
import { GraphComponent } from '../components/graph/simpleGraph';
import { Graph } from '../components/graph/exampleGraph';
import _ from "lodash"; // _ is low-dash
import Select from 'react-select'
import { ScalableElement } from '../components/misc/scaleableElement';

import { RecoveryComponent, formatDataset } from '../components/recoveryVisualize/recoveryDisplay';
import axios from 'axios';
import { apiPaths } from '../api/apiConfig';
import config from '../config.mjs';
import { useParams } from 'react-router-dom';
import { BarChart } from '../components/graph/barChart';
import { UTIL } from '../util';
import { RemDisplay } from '../components/recoveryVisualize/remDisplay';
import { ScatterChart } from '../components/graph/scatterGraph';
import { ScatterChartWithLine } from '../components/graph/scatterWithLine';
import { LinierRegressionScatterPlot } from '../components/graph/scatterWithLinierRegresionLine';
import VennDiagramComponent from '../components/graph/vennDiagram';
import { RecoveryAndRemWithResolutionSwitch } from '../components/recoveryVisualize/recoveryResolutionSwitcher';
import { HighLowRecoveryChart } from '../components/recoveryVisualize/highlowRecovery';
import { TrackType } from '../types';
import { OverlapComponent } from '../components/graph/overlap/overlap';
import { OverlapDataSet } from '../components/tempTypes/Types';
import { getJobStatus } from '../api/mainAPI';
import { InstructionHeader } from '../components/misc/instructionHeader';
import { AiAssistantComponent } from '../components/aiAssistant/aiAssistant';
import { JobDisplay } from '../components/jobDisplay/jobDisplay';
import JobDataTab from '../components/jobDataTab/jobDataTab';


interface AnalysisResult {
  method: string;
  data: number[];
  component: ReactElement<any, any>
}

type ChromatinLoopAnalysisResultsPageProps = {
  example?: boolean;
}

const clrs: any = {};
[...Array(100).keys()].map(n => clrs[n] = UTIL.getColor())


export const ChromatinLoopAnalysisResultsPage = (props: ChromatinLoopAnalysisResultsPageProps) => {
  const [higlassUids, setHiglassUids] = useState<{ uid: string, type: TrackType }[]>([]);
  const [overlapData, setOverlapData] = useState<OverlapDataSet>([]);
  const [activeTab, setActiveTab] = useState<string>(localStorage.getItem('tab') ? localStorage.getItem('tab') : "Overlap");
  const [activeResolution, setActiveResolution] = useState<string>('5000');
  const [jobResults, setJobResults] = useState<{ toolname: string, files: { resultFileName: string, data: string }[] }[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [regressionPoints, setRegressionPoints] = useState<any[]>([]);
  const [recoveryDatasets, setRecoveryDatasets] = useState<{ string: any }>({});
  const [rnapiiDatasets, setRnapiiDatasets] = useState<any[]>([]);
  const [loopSizes, setLoopSizes] = useState<any[]>([]);
  const [remValues, setRemValues] = useState<any[]>([]);
  const [kbVsResDataset, setKbVsResDataset] = useState<any[]>([]);
  const [binVsResDataset, setBinVsResDataset] = useState<any[]>([]);
  const [binVsResVsKbVsResDataset, setBinVsResVsKbVsResDataset] = useState<any>({});
  const [renderHiglass, setRenderHiglass] = useState<boolean>(false);

  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);

  const params = useParams()

  const handleTabSelect = (tab: any) => {
    localStorage.setItem('tab', tab);
    setActiveTab(tab);
    return true
  };

  const handleResolutionSelect = (res: any) => {
    setActiveResolution(res);
    return true
  };

  useEffect(() => {
    axios.get(apiPaths.jobHiglassToggle + "?id=" + jobId).then(response => {
      console.log(response)
      if (response.status == 200) {
        setRenderHiglass(response.data.higlassToggle);
      }
    }).catch(err=>console.log("axios err:"+err));
  }, [])



  let jobId = params.id
  if (props.example) jobId = config.exampleJobId;
 


  if (config.DEBUG) console.log(Object.keys(binVsResVsKbVsResDataset).map(key => ({ 'name': key, 'data': binVsResVsKbVsResDataset[key], category: 'none' })));
  const RegressionGraph = (props: { dataset: any, xAxisTitle: string, yAxisTitle: string, title: string }) => {
    if (config.DEBUG) console.log(props.dataset);

    const parsedDataSets = Object.keys(props.dataset).map(key => (
      {
        name: key,
        data: props.dataset[key]
      }
    ))
    if (config.DEBUG) console.log(parsedDataSets)
    return (
      <GraphComponent
        datasets={parsedDataSets}
        xAxisTitle={props.xAxisTitle}
        yAxisTitle={props.yAxisTitle}
        title={props.title}
        clrs={props.clrs}
        radius={5}
      />
    )
  }
  if (config.DEBUG) console.log(kbVsResDataset)

  const higlasstab =
    <Container>
      <HiGlassComponentWrapper uids={higlassUids} demo={props.example} />
      <p>If Higlass is not loading, please try clearing browsing data or using an incognito window/other browser, and clicking the reload higlass button at the top of this page</p>
    </Container>
  const normalPage =
    <>
    <JobDisplay
      id={jobId}
      minimal={true}
    />
    <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
      <Tab key="Overlap" eventKey="Apa_Score" title="Overlap">
        <OverlapComponent
          data={overlapData}
          clrs={clrs}
        />
      </Tab>

      <Tab key="Regression" eventKey="Regression" title="Regression">
        <ScalableElement defaultSize={.5}>
          <Container>
            <RegressionGraph dataset={binVsResDataset} xAxisTitle='Resolution' yAxisTitle='Average Bin Size (# bins)' title={`Average Bin Size (# bins) vs. Resolution`} />
            <RegressionGraph dataset={kbVsResDataset} xAxisTitle='Resolution' yAxisTitle='Average Bin Size (kB)' title={`Average Bin Size (kB) vs Resolution`} />
            <LinierRegressionScatterPlot
              clrs={clrs}
              yAxisTitle={'Average Bin Size (KB) Vs. Resolution'}
              xAxisTitle={'Average Bin Size (# bins) Vs. Resolution'}
              scatterData={
                Object.keys(binVsResVsKbVsResDataset).map(key => ({ 'name': key, 'data': binVsResVsKbVsResDataset[key].data, category: 'none' }))
              }
              title={'Regression Plot'}
            />
            <LinierRegressionScatterPlot
              clrs={clrs}
              yAxisTitle={'Average Bin Size (KB) Vs. Resolution'}
              xAxisTitle={'Average Bin Size (# bins) Vs. Resolution'}
              scatterData={Object.keys(binVsResVsKbVsResDataset).map(key => ({ 'name': key, 'data': binVsResVsKbVsResDataset[key].data, category: binVsResVsKbVsResDataset[key].category }))}
              title={'Categorical Regression Plot'}
            />
          </Container>
        </ScalableElement>
      </Tab>
      {Object.keys(recoveryDatasets).map(key => {
        const recoveryMethodArr = recoveryDatasets[key];
        return (
          <Tab key={`${recoveryMethodArr[0].method}`} eventKey={`${recoveryMethodArr[0].method}`} title={`${recoveryMethodArr[0].method}`}>
            <ScalableElement defaultSize={.5}>
              <Container>
                <RecoveryAndRemWithResolutionSwitch
                  recoveryDatasets={recoveryDatasets}
                  recoveryDataSetKey={key}
                  isRem={true}
                  clrs={clrs}
                  remValues={remValues}
                />
                {true ? <HighLowRecoveryChart
                  barData={remValues}
                  isRem={true}
                  bottomTitle={`${recoveryMethodArr[0].method}`}
                  clrs={clrs}
                /> : ""}

              </Container>
            </ScalableElement>
          </Tab>
        )
      }
      )
      }

      {renderHiglass ?
        <Tab key="higlass" eventKey="higlass" title="HiGlass">
          {(renderHiglass != 2) ?
            <>
              <InstructionHeader title='Your data is not fully injested into higlass yet...' />
              <p>Injesting reference files into higlass takes about an hour, feel free to view the incomplete results below, check back in about an hour for full results.</p>
              <Accordion>
                <AccordionItem eventKey='View Anyways?'>
                  <Accordion.Header>preview results</Accordion.Header>
                  <AccordionBody>
                    {higlasstab}
                  </AccordionBody>
                </AccordionItem>
              </Accordion>
            </>
            : higlasstab
          }
        </Tab>
        : ""}

      <Tab key="Ai Assistant" eventKey="Ai Assistant" title="AI Assistant">
        <Container>
          <AiAssistantComponent clrs={clrs} demo={props.example}/>
        </Container>
      </Tab>

      <Tab key="Data" eventKey="Data" title="Data">
        <Container>
            <JobDataTab clrs={clrs} jobId={jobId}/>
          </Container>
      </Tab>

    </Tabs>
    </>

  function getJobResults() {
    axios.get(apiPaths.jobResults + "?id=" + jobId).then((response) => {
      setJobResults(response.data);
    }).catch(err=>console.log("axios err:"+err));
  }

  async function setupDataSets() {
    axios.get(apiPaths.jobResults + "?id=" + jobId).then(async (response) => {
      console.log("-------------------------all results data-------------------------")
      console.log(response);
      await setJobResults(response.data.results);
      if (config.DEBUG) console.log(response.data);
      setHiglassUids(response.data.tilesetUids);
      setOverlapData(response.data.overlapData);
      const results = response.data.results;
      if (config.DEBUG) console.log(results)

      const formattedData: { x: number, y: number }[] = [];
      // datasets=[{
      //   name:"exampleLascaData",
      //   data:graphdata
      // }]
      const dataSets: any[] = [

      ]

      function convertToXYDataset(str: string) {
        return str.split("\n").map(line => {
          const splitLine = line.split(/\s+/);
          return (
            {
              "x": parseFloat(splitLine[0]),
              "y": parseFloat(splitLine[1])
            }
          )
        })
      }

      //clear all datasets as we update
      let tempDatasets: any = {}
      let tempRemData: any[] = [];
      let tempLoopSizes: any = {};
      let tempRegressionPoints: any = {}
      let tempKbVsRes: any = {};
      let tempBinVsRes: any = {};
      let tempBinVsResVsKbVsResDataset: any = {};

      const toolsNames = Object.keys(results);
      toolsNames.forEach(name => {
        const toolData: {
          ctcfResults: { data: any }[],
          h3k27acResults: { data: any }[],
          remResults: { data: any }[],
          rnapiiResults: { data: any }[],
          toolName: string
        } = results[name];


        toolData.results.map(result => result.data = convertToXYDataset(result.data));
        if (config.DEBUG) console.log(toolData)

        //append all datasets
        toolData.results.forEach(obj => {
          if (!tempDatasets[obj.method]) tempDatasets[obj.method] = [];
          tempDatasets[obj.method].push(obj);
        })

        toolData.loopSizeResults.forEach(obj => {
          if (!tempLoopSizes[obj.toolName]) tempLoopSizes[obj.toolName] = [];
          tempLoopSizes[obj.toolName].push(obj);
        })

        tempRemData = [...tempRemData, ...toolData.remResults];
        if (config.DEBUG) console.log(toolData)

        //if we have enough points to plot our regression
        // if(tempLoopSizes[obj.method].length > 1){
        let obj = toolData.results[0] || toolData.loopSizeResults[0] || toolData.remResults[0];
        if (config.DEBUG) console.log(obj)
        console.log("-------------------firstObj----------------------")
        console.log(obj);
        if (obj) {

          tempRegressionPoints[obj.toolName] = {
            'kbVsRes': [],
            'binVsRes': []
          };

          if (!tempLoopSizes[obj.toolName]) tempLoopSizes[obj.toolName] = [];
          tempLoopSizes[obj.toolName].forEach(loopSizeInfo => {
            tempRegressionPoints[obj.toolName]['kbVsRes'].push({ x: parseInt(loopSizeInfo.resolution), y: parseFloat(loopSizeInfo.avgKbSize) })
            tempRegressionPoints[obj.toolName]['binVsRes'].push({ x: parseInt(loopSizeInfo.resolution), y: parseFloat(loopSizeInfo.avgBinNumersSize) })
          })

          //extract the data
          tempKbVsRes[obj.toolName] = []
          tempRegressionPoints[obj.toolName]['kbVsRes'].forEach(kbVsResElement => {
            tempKbVsRes[obj.toolName].push(kbVsResElement);
          })
          tempBinVsRes[obj.toolName] = []
          tempRegressionPoints[obj.toolName]['binVsRes'].forEach(binVsResElement => {
            tempBinVsRes[obj.toolName].push(binVsResElement);
          })

          console.log("---------------regression--------------")
          console.log(tempKbVsRes)
          console.log(tempBinVsRes)
          console.log(tempLoopSizes)


          tempBinVsResVsKbVsResDataset[obj.toolName] = [];
          for (let index = 0; index < tempBinVsRes[obj.toolName].length; index++) {
            const binVsResElement = tempBinVsRes[obj.toolName][index];
            const kbVsResElement = tempKbVsRes[obj.toolName][index];
            tempBinVsResVsKbVsResDataset[obj.toolName].push({
              y: (kbVsResElement.y / kbVsResElement.x),
              x: (binVsResElement.y / binVsResElement.x)
            })
          }

          tempBinVsRes[obj.toolName] = tempBinVsRes[obj.toolName].sort((a, b) => {
            return (a.x - b.x)
          });
          tempKbVsRes[obj.toolName] = tempKbVsRes[obj.toolName].sort((a, b) => {
            return (a.x - b.x)
          });

          tempBinVsResVsKbVsResDataset[obj.toolName] = tempBinVsResVsKbVsResDataset[obj.toolName].sort((a, b) => {
            return (a.x - b.x)
          });

          let obj2 = {}
          obj2.data = tempBinVsResVsKbVsResDataset[obj.toolName];
          obj2.category = obj.category;
          tempBinVsResVsKbVsResDataset[obj.toolName] = obj2;

          if (config.DEBUG) console.log(tempKbVsRes)
          if (config.DEBUG) console.log(tempBinVsResVsKbVsResDataset)

          setBinVsResDataset(tempBinVsRes);
          setKbVsResDataset(tempKbVsRes);
          setBinVsResVsKbVsResDataset(tempBinVsResVsKbVsResDataset);
        }


        // }
      })



      if (config.DEBUG) console.log(tempDatasets)
      setRecoveryDatasets(tempDatasets);
      setRemValues(tempRemData);
      setLoopSizes(tempLoopSizes);
      setRegressionPoints(tempRegressionPoints);
      if (config.DEBUG) console.log(tempRegressionPoints)
      if (config.DEBUG) console.log(tempLoopSizes)

      setDataHasLoaded(true);
    }).catch(err=>console.log("axios err:"+err));
    

  }

  useEffect(() => {
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
      {dataHasLoaded?
      normalPage:
      <>
       <InstructionHeader title="Loading Your Data" />
        <div
        className="spinner-border text-primary"
        style={{ width: "5rem", height: "5rem" }}
        role="status"
      />
      </>
      }
    </div>
  );
};
