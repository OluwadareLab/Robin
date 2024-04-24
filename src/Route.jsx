import React from 'react';
import {Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { paths } from './config';
import {QueuePage} from './pages/Queue';
import { ChromatinLoopAnalysisResultsPage } from './pages/Results';
import { ViewAllJobsPage } from './pages/ViewAllJobs';
import { HiGlassComponentWrapper } from './components/visualizationTools/HiGlass/HIGlass';
import { OneStepJobUploadPage } from './pages/OneStepJobPage';

export const WebRoutes = () => (
    <Router>
        <Routes>
            <Route exact path={paths.home} element={<HomePage />}/>
            <Route path={`${paths.setup}/:id`} element={<OneStepJobUploadPage />}/>
            <Route path={`${paths.setup}`} element={<OneStepJobUploadPage />}/>
            <Route path={`${paths.queue}/:id`} element={<QueuePage />}/>
            <Route path={`${paths.results}/:id`} element={<ChromatinLoopAnalysisResultsPage />}/>
            <Route path={`${paths.example}`} element={<ChromatinLoopAnalysisResultsPage example={true}/>}/>
            <Route path={`${paths.about}`} element={<div>about</div>}/>
            <Route path={`${paths.github}`} element={<div>https://github.com/mattieFM/MohitProjWeb</div>}/>
            <Route path={`${paths.jobs}`} element={<ViewAllJobsPage/>}/>
            <Route path={`/temp/`} element={<HiGlassComponentWrapper/>}/>
        </Routes>
    </Router>
);