import React from 'react';
import {Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './pages/Home.js';
import { UploadPage } from './pages/Upload.js'
import { JobSetupPage } from './pages/JobSetup.tsx';
import { paths } from './config';
import {QueuePage} from './pages/Queue.tsx';
import { ChromatinLoopAnalysisResultsPage } from './pages/Results.tsx';
import { ViewAllJobsPage } from './pages/ViewAllJobs.tsx';

export const WebRoutes = () => (
    <Router>
        <Routes>
            <Route exact path={paths.home} element={<HomePage />}/>
            <Route path={`${paths.upload}/:id`} element={<UploadPage />}/>
            <Route path={paths.setup} element={<JobSetupPage />}/>
            <Route path={`${paths.queue}/:id`} element={<QueuePage />}/>
            <Route path={`${paths.results}/:id`} element={<ChromatinLoopAnalysisResultsPage />}/>
            <Route path={`${paths.example}`} element={<ChromatinLoopAnalysisResultsPage example={true}/>}/>
            <Route path={`${paths.about}`} element={<div>about</div>}/>
            <Route path={`${paths.github}`} element={<div>https://github.com/mattieFM/MohitProjWeb</div>}/>
            <Route path={`${paths.jobs}`} element={<ViewAllJobsPage/>}/>
        </Routes>
    </Router>
);