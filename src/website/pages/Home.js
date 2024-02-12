import React from 'react';
import config from '../config';


import { BtnLink } from '../../components/BtnLink';


export const HomePage = () => (
    <>
    <h1>{config.projectName}</h1>
    <p>
        {config.projectDescription}
    </p>
    <BtnLink title={config.projectName} src="./jobSetup"/>
    
    </>
);