import React from "react";


import './css/master_style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
import { WebRoutes } from './Route';
import { AppNavbar } from "./components/navbar/Navbar";
import { Footer } from "./components/Footer/footer";

function App() {
  return (
    <>
      <AppNavbar/>
      <WebRoutes/>
      <Footer/>
    </>
    
  );
}

export default App;
