import React, { ReactElement, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { HiGlassComponent } from '../components/visualizationTools/HiGlass/HIGlass';
import {GraphComponent} from '../components/graph/simpleGraph';
import { Graph } from '../components/graph/exampleGraph';

interface AnalysisResult {
  method: string;
  data: number[];
  component: ReactElement<any, any>
}

type ChromatinLoopAnalysisResultsPageProps = {
    example?: boolean;
}

export const ChromatinLoopAnalysisResultsPage: React.FC = (props: ChromatinLoopAnalysisResultsPageProps) => {
  const [activeTab, setActiveTab] = useState<string>('method1');

  const handleTabSelect = (tab:any) => {
    setActiveTab(tab);

    return true
  };

  const normalPage = 
  <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
    <Tab key="Apa_Score" eventKey="Apa_Score" title="APA Score">
        Apa
    </Tab>
    <Tab key="RNAPII" eventKey="RNAPII" title="rnapii">
        rnapii
    </Tab>
    <Tab key="h3k27ac" eventKey="h3k27ac" title="h3k27ac">
        h3k27ac
    </Tab>
    <Tab key="ctcf" eventKey="ctcf" title="ctcf">
      ctcf
    </Tab>
    <Tab key="higlass" eventKey="higlass" title="higlass">
      higlass
    </Tab>
  </Tabs>

  const examplePage = 
  <>
    <Graph></Graph>
  </>

  return (
    <div>
      
          {props.example? examplePage : normalPage}
      
    </div>
  );
};
