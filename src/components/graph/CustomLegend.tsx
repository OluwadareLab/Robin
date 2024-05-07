import React, { createRef, useEffect, useState } from 'react';
import { ListGroup, ToggleButton } from 'react-bootstrap';

/**
 * 
 * @param backgroundColor any css clr
 * @param label the label to display
 * @param borders optional, if provided draw borders
 * @returns 
 */
export const CustomLegend = (props: { items: { backgroundColor: any, label: string, borders?:Boolean }[] }) => {
  return (
    <>
      {
        props.borders ?
          <ListGroup horizontal>
            {props.items.map((item, index) => (
              <ListGroup.Item key={index}>
                <span style={{ backgroundColor: item.backgroundColor, width: '20px', height: '20px', display: 'inline-block', marginRight: '5px', border: '1px solid black' }}></span>
                {item.label}
              </ListGroup.Item>
            ))}
          </ListGroup>

          :
          <ListGroup horizontal>
            {props.items.map((item, index) => (
              <ListGroup.Item key={index} style={{ border: '0px', margin: 0, padding: "5px" }}>
                <span style={{ backgroundColor: item.backgroundColor, width: '46px', height: '13.5px', display: 'inline-block', marginRight: '5px' }}></span>
                {item.label}
              </ListGroup.Item>
            ))}
          </ListGroup>
      }
    </>
  );
};

/**
 * 
 * @param backgroundColor any css clr
 * @param label the label to display
 * @param borders optional, if provided draw borders
 * @returns 
 */
export const CustomLegendWithSelection = (props: { items: { backgroundColor: any, label: string, borders?:Boolean}[], onSelect:(state)=>void, forceUpdate?:number, state?:any,setState?:any}) => {
  const [state,setState] = useState({});
  let labels:string[] = [];

  useEffect(()=>{
    setState(props.state)
    console.log(props.state)
  },[props.state])

  useEffect(()=>{
    let tempState = {};
    props.items.forEach(item=>{
      tempState[item.label]=false;
    })
    setState(tempState);
  },[])

  //wipe state if we switch data
  useEffect(()=>{
    console.log("forcibly cleared data")
    setState({});
  },[props.forceUpdate])

  useEffect(()=>{
    console.log(state);
  },[state])
  

  function ToggleButton(id, bool?:boolean){
    let oldState = JSON.parse(JSON.stringify(state));
    if(Object.keys(oldState).filter(key=>oldState[key]).length<3 || !oldState[id]==false){
      console.log(oldState);
      oldState[id] = (typeof bool != 'undefined') ? bool : !oldState[id]
      console.log(oldState);
      setState(oldState)
    }

    props.onSelect(oldState)
  }

  return (
      <ListGroup>
        {props.items.map((item, index) => (
          <ListGroup.Item key={index} style={{ border: '0px', margin: 0, padding: "5px" }} active={state[item.label]}>
            <span onClick={(e)=>ToggleButton(item.label)}>
              {(() =>{labels.push(item.label); return ""})()}
              <span style={{ backgroundColor: item.backgroundColor, width: '46px', height: '13.5px', display: 'inline-block', marginRight: '5px' }}></span>
              {
                !state[item.label]?
                <s>{item.label}</s> :
                item.label

              }
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
  );
};

