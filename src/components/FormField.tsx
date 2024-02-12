import React, { HTMLInputTypeAttribute } from "react";
import { RequiredAsterisk } from "./RequiredAsterisk.tsx";

/**
 * @description the type for a form field
 * @prop {string} title: the title of the field
 * @prop {bool} required: whether the filed is required or not
 * @prop {HTMLInputTypeAttribute} inputType: the type of the input
 * @prop {number} size how big should the label be. 1 being small, 10 being big
 */
type FormFieldProps = {
    title?: string;
    required?: boolean;
    inputType?: HTMLInputTypeAttribute;
    name?: string
}


/**
 * @description a field within a form
 * @param {FormFieldProps} props 
 * title (string) (optional): the title of the label for this field.
 * required (boolean) (optional default=true): is this field a required field? 
 * inputType (string) (optional, default="text") html input type, IE: text, number, etc.
 * @returns 
 */
export const FormField = (props: FormFieldProps) => {
    const type = props.inputType ? props.inputType : "text";
    const title = props.title ? props.title : "";
    const required = typeof(props.required) != undefined ? props.required : true;
    const id = `formInput_${title}`;
    return (
        <div
            style={{padding: ".5% 0 .5% 0"}}
        >
            <div 
                className={`
                    form-group 
                    ${required? "requiredField" : ""}`
                } 
                id={`div_${title}_group`}
            >

                <div id={`div_${title}_label`} className="inter_bold">
                    <label 
                        htmlFor={`${id}`}
                        className="lb-sm"
                    >
                        {title}
                        {<RequiredAsterisk active={required}/>}
                        
                    </label>
                </div>
                <div id={`div_${props.title}_input`}>
                    <input 
                        name={props.name}
                        type = {type}
                        id = {id}
                        required = {required}
                        maxLength={100}
                        className="textinput form-control"
                    
                    >
                    
                    </input>
                </div>
            </div>
        </div>
        
    )
}
 
