import React from 'react';
import { useNavigate } from "react-router-dom";
import config from '../config.js';
import { paths } from '../config.js';
import axios from 'axios';
import { BtnLink } from '../components/BtnLink.js';
import { FormField } from '../components/FormField.tsx';
import { BtnConfirm } from '../components/BtnConfirm.tsx';
import { apiPaths } from '../api/apiConfig.js';

/**
 * @description the data type that we get from the user filling out the form
 */
interface jobSetupFormData {
    title: string;
    description: string;
    email?: string;
}


export const JobSetupPage = () => {
    let navigate = useNavigate();

    return  (
    <div className="container-sm w-50"
    style={{padding: ".5% 0 .5% 0"}}
    >
    <h3 style={{color:"#708090"}}>provide job information</h3>
        <form id="jobSetupForm" onSubmit={onSubmitJobInfo}>
            <FormField 
            title='Job Title' 
            name='jobTitle'
            required={true}>
            </FormField>

            <FormField 
            name="description"
            title='Description' 
            required={true}>
            </FormField>

            <FormField 
            name='email'
            title='Email' 
            required={false}
            inputType={'email'}
            >

            </FormField>

      
        </form>

        <BtnConfirm/>
    </div>
    )

    /**
     * @description the handler for when the user submits the form
     * @param formData the form data they submitted
     */
    function onSubmitJobInfo(formEvent){
        formEvent.preventDefault();
        let data: jobSetupFormData = {
            email: formEvent.target.elements.email.value,
            description: formEvent.target.elements.description.value,
            title: formEvent.target.elements.jobTitle.value,
        }

        axios.post(apiPaths.jobInfo, data).then((res: any) =>{
            if(res.data.status === 200){
                console.log(data);
                navigate(paths.upload +"/" +res.data.id);
            } else {
                alert("An Unexpected error occurred.")
            }
        })
        
        return "test";
    }
}
    

