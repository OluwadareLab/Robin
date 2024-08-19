import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import StandardErrorBoundary from './components/error/standardErrorBoundry';
import ReactGA from 'react-ga4';

// Initialize Google Analytics
ReactGA.initialize('G-021HZV22E3');

// To log the initial page view
ReactGA.send({ hitType: "pageview", page:window.location.pathname + window.location.search});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StandardErrorBoundary>
        <App />
    </StandardErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
