import React from 'react';
import { Nav } from 'react-bootstrap';
import config from '../../../config.mjs';
import gitlogo from '../../../images/git.png';

/** a simple link to the projet github */
export const GitHubLink: React.FC = () => {
  return (
    <>
    <img src={gitlogo} alt="github logo" className="rounded-circle" style={{ width: '54%' }} /> 
    <Nav.Link href={config.github}>Github</Nav.Link>
    </>
      
        

  );
};
