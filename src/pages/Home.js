import React from 'react';
import config, { paths } from '../config.mjs';
import { Container, Row, Col } from 'react-bootstrap';
import { BtnLink } from '../components/buttons/BtnLink';
import { InstructionHeader } from '../components/misc/instructionHeader';
import { OverlapComponent } from '../components/graph/overlap/overlap';
import HomeVideo from '../components/homePageVideo/HomeVideo';

// import uccsLogo from '../images/homePageExample.png';

export const HomePage = () => {
    return (
        <div className="home-page">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <h1 className="text-center mt-5">{config.projectName}</h1>
                        <p className="lead text-center mt-3">
                            {config.projectDescription} <a
                                href="https://uccs-bioinformatics.com/" rel="noopener noreferrer" target="_blank">Oluwadare Lab</a>.
                        </p>
                        <div className="text-center mt-4">
                            <BtnLink title="Submit a Job" src="./jobSetup" />
                        </div>
                    </Col>

                </Row>
                <Row>
                    <h3 style={{ color: "#708090" }}>Documentation</h3>
                    <a className='justify-content-center' target="_blank" href={paths.docs}>📒 The full user manual is available here.</a>
                </Row>
                <Row>
                    <h3 style={{ color: "#708090" }}>AI Assistant Example</h3>
                    <HomeVideo />
                    {/*TODO: add a clip of the AI assistant here */}
                    {/* <img src={uccsLogo} alt="UCCS Logo" className="rounded" style={{ width: '27%', marginLeft:"px10"}} /> */}
                </Row>
            </Container>
        </div>
    );
};

