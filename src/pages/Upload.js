import React from 'react';
import FileUploadComponent from '../components/FileUpload.js';
import {useParams} from 'react-router-dom';
import { BtnConfirm } from '../components/BtnConfirm.tsx';


export const UploadPage = () => {
    const params = useParams();
    console.log(params);
    return (
        <>
        <div className="container-sm w-50"
        style={{padding: ".5% 0 .5% 0"}}
        >
            <h3 style={{color:"#708090"}}>Upload files for analysis</h3>
            <FileUploadComponent id={params.id}></FileUploadComponent>
            <BtnConfirm title="View Queue"/>
        </div>
        </>
    );
}