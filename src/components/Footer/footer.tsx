import React from 'react';
import "./footer.css"
import {GitHubLink} from './githubLink/githubLink'
import { Col, Row } from 'react-bootstrap';

import uccsLogo from './../../images/UCCS_Logo.png';

/** a simple footer for the website */
export const Footer = () => {
  return (
    <footer className="footer" style={{marginTop:"auto"}} >
      <Row>
        <Col >
          <div style={{ float: 'left' }}>
            <img src={uccsLogo} alt="UCCS Logo" className="rounded" style={{ width: '27%', marginLeft:"px10"}} />
          </div>
          <div style={{ float: 'left', marginLeft: '10px' }}>
            <span style={{ marginTop: '5px', fontSize: '14px' }}>
              © {new Date().getFullYear()} <b><a target="_blank" href="https://uccs-bioinformatics.com/" rel="noreferrer">Oluwadare Lab</a></b>
            </span>
          </div>
        </Col>
        <Col >
          <div style={{ float: 'right', width:"10%"}}>
            <GitHubLink />
          </div>
        </Col>
      </Row>
    </footer>
  );
};