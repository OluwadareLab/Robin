import React, { FormEventHandler } from "react";
import { FormField, FormFieldProps } from "./FormField/FormField";

interface FormProps {
    /** the on submit handler for the event */
    onSubmit: FormEventHandler<HTMLFormElement>

    /** an array of all fields in this form  */
    fields: FormFieldProps[]
}

let formId = 0;

/** a simple element for forms */
export const Form = (props: FormProps) => {
    formId++;
    let thisFormId: string = `Id-${formId}`; 
    let fields:React.JSX.Element[] = [];
    for (let index = 0; index < props.fields.length; index++) {
        /** @type {FormFieldProps}*/
        const element = props.fields[index];
        fields.push(
            <FormField {...element} />
        )
    }
    return (
    <>
     <form id={thisFormId} onSubmit={props.onSubmit}>
    {fields}
    <button className="btn btn-lg btn-secondary" style={{float:"right"}} type="submit" form={thisFormId} value="Submit">Submit</button>
    </form>
    
    </>
    )
}