import React, { FormEvent } from 'react';
import { useNavigate } from "react-router-dom";
import config from '../config';
import { paths } from '../config';

import { BtnLink } from '../../components/BtnLink.js';
import { FormField } from '../../components/FormField.tsx';

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

        <button className="btn btn-lg btn-secondary" style={{float:"right"}} type="submit" form="jobSetupForm" value="Submit">Submit</button>
    </div>
    )

    /**
     * @description the handler for when the user submits the form
     * @param formData the form data they submitted
     */
    function onSubmitJobInfo(formEvent: FormEvent<HTMLFormElement>){
        formEvent.preventDefault();
        let data: jobSetupFormData = {
            email: formEvent.target.elements.email.value,
            description: formEvent.target.elements.description.value,
            title: formEvent.target.elements.jobTitle.value,
        }
        console.log(data);
        navigate(paths.upload);
        return "test";
    }
}
    

