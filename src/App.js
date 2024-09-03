import React, { useEffect } from "react";

import { StandardErrorBoundary } from "./components/error/StandardErrorBoundary";
import './css/master_style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
import { WebRoutes } from './Route';
import { AppNavbar } from "./components/navbar/AppNavbar";
import { Footer } from "./components/Footer/footer";
import config from './config.mjs';
import axios from 'axios';
import ReactGA from 'react-ga';

axios.defaults.baseURL = config.apiPath;
axios.defaults.headers.post['Access-Control-Allow-Origin'] ='*';
axios.defaults.headers.get['Access-Control-Allow-Credentials'] =false;
//axios.defaults.headers.get['Content-Type'] ='application/x-www-form-urlencoded';

const ThemeContext = React.createContext('light');

const setThemeInStorage = (theme) => {
  localStorage.setItem('theme', theme)
}

/**
 * the app itself.
 * @returns 
 */
function App() {
  console.log(process.env);
  useEffect(()=>{
    let theme=localStorage.getItem('theme');
    console.log(theme)
    if(theme=="dark"){
      document.documentElement.setAttribute('data-bs-theme','dark')
    } else {
      document.documentElement.setAttribute('data-bs-theme','light')
    }
  },[])

  return (
    <>
      <AppNavbar/>
        <WebRoutes/>
      <Footer/>
    </>
    
  );
}

export default App;
