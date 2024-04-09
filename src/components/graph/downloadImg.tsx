import React, { useState, useEffect, useRef, Ref } from 'react';
import config from "../../config.mjs";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


type DownloadImgProps = {
    chartRef: Ref<Chart>
}
export const DownloadImg = (props: DownloadImgProps) => {
    function clickHandler() {
        const link = document.createElement('a');
        link.download = "chart.png";
        link.href = props.chartRef.current.toBase64Image('image/png', 1);
        link.click();
      }
    

    return(
        <button value='print' style={{float:"right"}} onClick={clickHandler}><FontAwesomeIcon icon={faDownload} /></button>
    )
}