import React, {useEffect} from 'react';
import {Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { paths } from './config';
import {QueuePage} from './pages/Queue';
import { ChromatinLoopAnalysisResultsPage } from './pages/Results';
import { ViewAllJobsPage } from './pages/ViewAllJobs';
import { HiGlassComponentWrapper } from './components/visualizationTools/HiGlass/HIGlass';
import { OneStepJobUploadPage } from './pages/OneStepJobPage';
import { AiAssistantComponent } from './components/aiAssistant/aiAssistant';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { AboutPage } from './pages/aboutPage';

const TrackPageViews = () => {
    const location = useLocation();
  
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page:window.location.pathname + window.location.search});;
    }, [location]);
  
    return null;
  };

export const WebRoutes = () => (
    <Router basename="robin/">
        <TrackPageViews/>
        <Routes>
            <Route exact path={paths.home} element={<HomePage />}/>
            <Route path={`${paths.aiTest}`} element={<AiAssistantComponent />}/>
            <Route path={`${paths.setup}/:id`} element={<OneStepJobUploadPage />}/>
            <Route path={`${paths.setup}`} element={<OneStepJobUploadPage />}/>
            <Route path={`${paths.queue}/:id`} element={<QueuePage />}/>
            <Route path={`${paths.results}/:id`} element={<ChromatinLoopAnalysisResultsPage />}/>
            <Route path={`${paths.example}`} element={<ChromatinLoopAnalysisResultsPage example={true}/>}/>
            <Route path={`${paths.about}`} element={<AboutPage/>}/>
            <Route path={`${paths.github}`} element={<div>https://github.com/mattieFM/MohitProjWeb</div>}/>
            <Route path={`${paths.jobs}`} element={<ViewAllJobsPage/>}/>
            <Route path={`/temp/`} element={<HiGlassComponentWrapper/>}/>
        </Routes>
    </Router>
);