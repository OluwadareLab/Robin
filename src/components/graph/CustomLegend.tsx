import React from 'react';
import { ListGroup } from 'react-bootstrap';

export const CustomLegend = (props:{items:{backgroundColor:any,label:string}[]}) => {
  return (
    <ListGroup horizontal>
      {props.items.map((item, index) => (
        <ListGroup.Item key={index}>
          <span style={{ backgroundColor: item.backgroundColor, width: '20px', height: '20px', display: 'inline-block', marginRight: '5px', border: '1px solid black'}}></span>
          {item.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
