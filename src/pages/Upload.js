import React from 'react';
import FileUploadComponent from '../components/fileUpload/FileUpload';
import {useNavigate, useParams} from 'react-router-dom';
import { BtnConfirm } from '../components/buttons/BtnConfirm';
import config, { paths } from '../config.mjs';
import { apiPaths } from '../api/apiConfig';
import axios from 'axios';

export const UploadPage = () => {
    const navigate = useNavigate();

    function onSubmit(){
        axios.post(apiPaths.jobSubmit, {id:params.id}).then((response) => {
            if(response.status===200)
            navigate(paths.queue+"/"+params.id);
        else {
            alert("something went wrong." + response.data.err);
        }
          });
        
    }

    const params = useParams();
    console.log(params);
    return (
        <>
        <div className="container-sm w-50" 
        style={{padding: ".5% 0 .5% 0"}}
        >
            <h3 style={{color:"#708090"}}>Upload files for analysis</h3>
            <div> <FileUploadComponent id={params.id}></FileUploadComponent></div>
            <div class="container mt" style={{display:'flex', flexDirection:"row", justifyContent:"right"}}>
            <div style={{float:'right'}}><BtnConfirm title="Submit Job" onClick={onSubmit}/></div>
            </div>

           
            
            
        </div>
        </>
    );
}

