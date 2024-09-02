import React, { FormEventHandler, useState } from "react";
import { FormField, FormFieldProps } from "./FormField/FormField";

interface FormProps {
    /** the on submit handler for the event */
    onSubmit: FormEventHandler<HTMLFormElement>

    /** an array of all fields in this form  */
    fields: FormFieldProps[]

    /**
     *  (optional) if turned off this will be a full form with <form> and submit button, if not it will just the input
     * buttons to be put inside of another form
     */
    fakeForm?:boolean

    setData?:(any:any)=>void
}



//TODO: rename this component to avoid confusion and disambiguate.
//TODO: refactor this code its a bit funky
/** a simple element for forms */
export const Form = (props: FormProps) => {

    const [data, _setData] = useState({});
    const setData = (data)=>{
        _setData(data);
        if(props.setData)props.setData(data);
    }

    let formId = 0;
    formId++;
    let thisFormId: string = `Id-${formId}`; 
    let fields:React.JSX.Element[] = [];
    for (let index = 0; index < props.fields.length; index++) {
        /** @type {FormFieldProps}*/
        const element = props.fields[index];
        fields.push(
            <FormField {...element} key={`form-Id-${formId}-Field-${index}`} setValue={val=>{
                let newData = {...data};
                if(element.name)newData[element.name]=val
                setData(newData);

              
            }} />
        )
    }


    return (
        props.fakeForm ? 
        <>
            <div id={`form-${props.fields[0]}`}>
                {fields}
            </div>
        </> 
        :
        <>
            <form id={thisFormId} onSubmit={props.onSubmit}>
            {fields}
            <button className="btn btn-lg btn-secondary" style={{float:"right"}} type="submit" form={thisFormId} value="Submit">Submit</button>
            </form>
        </>
    )
}


