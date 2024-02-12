import React from 'react';
import {Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './pages/Home.js';
import { UploadPage } from './pages/Upload.js'
import { JobSetupPage } from './pages/JobSetup.tsx';
import { paths } from './config.js';
import {QueuePage} from './pages/Queue.tsx';

export const WebRoutes = () => (
    <Router>
        <Routes>
            <Route exact path={paths.home} element={<HomePage />}/>
            <Route path={`${paths.upload}/:id`} element={<UploadPage />}/>
            <Route path={paths.setup} element={<JobSetupPage />}/>
            <Route path={`${paths.queue}/:id`} element={<QueuePage />}/>
        </Routes>
    </Router>
);