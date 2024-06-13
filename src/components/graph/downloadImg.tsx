import React, { useState, useEffect, useRef, Ref } from 'react';
import config from "../../config.mjs";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


type DownloadImgProps = {
    chartRef: Ref<Chart>
}
export const DownloadImg = (props: DownloadImgProps) => {
    //used to upadte element
    const [number,setNumber] = useState(0);
    function clickHandler() {
        const link = document.createElement('a');
        link.download = "chart.png";
        link.href = props.chartRef.current.toBase64Image('image/png', 1);
        link.click();
      }
    
      console.log(props.chartRef.current)

      //only used to update the button. displayed in a hidden div just to be safe
      useEffect(()=>{
        setNumber(number+1);
      },[number, props.chartRef])
    return(
        <>
            {
                //only display download btn if graph has atleast 1 valid data point
                props.chartRef.current && props.chartRef.current.data && props.chartRef.current.data.datasets.length>0 && props.chartRef.current.data.datasets.some(set=>(set.data.length>0)) ?
                <button value='print' style={{float:"right"}} onClick={clickHandler}><FontAwesomeIcon icon={faDownload} /></button>
                : <></>
            }
            <div style={{display:"none"}}>{number}</div>
        </>
        
    )
}