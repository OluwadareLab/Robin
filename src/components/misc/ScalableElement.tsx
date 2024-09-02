import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export const ScalableElement = ({ children, defaultSize }) => {
  const [scale, setScale] = useState(defaultSize);

  const handleScaleChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setScale(newScale);
  };

  return (
    <>
    <Row>
        <Col>
            <label htmlFor='#scaler'>Scale:</label>
        </Col>
        <Col md={11}>
        <input
            style={{width:"20%"}}
            id="scaler"
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={scale}
            onChange={handleScaleChange}
        />
        </Col>
        
        
        
    </Row>
    
      <Container className="scalable-element-container" style={{
        width:`${scale*100}%`
    }}> 
        {children}
    </Container>
    </>
    
  );
};
