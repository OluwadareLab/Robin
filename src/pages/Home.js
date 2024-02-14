import React from 'react';
import config from '../config.mjs';
import { Container, Row, Col } from 'react-bootstrap';
import { BtnLink } from '../components/buttons/BtnLink';

export const HomePage = () => {
    return (
        <div className="home-page">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <h1 className="text-center mt-5">{config.projectName}</h1>
                        <p className="lead text-center mt-3">
                            {config.projectDescription}
                        </p>
                        <div className="text-center mt-4">
                            <BtnLink title="Submit a Job" src="./jobSetup" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

