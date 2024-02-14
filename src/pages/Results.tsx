import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { HiGlassComponent } from '../components/visualizationTools/HiGlass/HIGlass';

interface AnalysisResult {
  method: string;
  data: number[];
}

type ChromatinLoopAnalysisResultsPageProps = {
    example?: boolean;
}

export const ChromatinLoopAnalysisResultsPage: React.FC = (props: ChromatinLoopAnalysisResultsPageProps) => {
  const [activeTab, setActiveTab] = useState<string>('method1');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([
    { method: 'Apa_Score', data: [10, 20, 30, 40, 50] },
    { method: 'Chromosight', data: [50, 40, 30, 20, 10] },
    { method: 'recovery', data: [25, 30, 35, 40, 45] },
    { method: 'HiGlass', data: [25, 30, 35, 40, 45] },
    { method: 'Overlap', data: [25, 30, 35, 40, 45] },
    { method: 'Peak', data: [25, 30, 35, 40, 45] },
    { method: 'BCC?', data: [25, 30, 35, 40, 45] },
  ]);

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
        {analysisResults.map(result => (
          <Tab key={result.method} eventKey={result.method} title={result.method}>
            {result.method === "HiGlass" ? <HiGlassComponent/> : ""}
            {props.example? <div>example</div>:""}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};
