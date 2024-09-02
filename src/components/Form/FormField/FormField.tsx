import React, { HTMLInputTypeAttribute, useState } from "react";
import { RequiredAsterisk } from "../../misc/RequiredAsterisk";

/**
 *  the type for a form field
 * @prop {string} title: the title of the field
 * @prop {bool} required: whether the filed is required or not
 * @prop {HTMLInputTypeAttribute} inputType: the type of the input
 * @prop {number} size how big should the label be. 1 being small, 10 being big
 */
export type FormFieldProps = {
    /** the title of the label for this field
     * @default 
    */
    title?: string;
    /**
     * whether the field is required or not
     * @default false
     */
    required?: boolean;
    /**
     * the html input type of the field
     * @default text
     */
    inputType?: HTMLInputTypeAttribute;
    /**
     * the name of the html input field
     * 
     */
    name?: string

    /**  optional cb to pass value up */
    setValue?:(e)=>void
}


/**
 *  a field within a form
 * @param {FormFieldProps} props 
 * title (string) (optional): the title of the label for this field.
 * required (boolean) (optional default=true): is this field a required field? 
 * inputType (string) (optional, default="text") html input type, IE: text, number, etc.
 * @returns 
 */
export const FormField = (props: FormFieldProps) => {
    const [value, setValue] = useState<string>("");
    const type = props.inputType ? props.inputType : "text";
    const title = props.title ? props.title : "";
    const required = typeof(props.required) != 'undefined' ? props.required : true;
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
                        value={value}
                        onChange={e=>{setValue(e.target.value); if(props.setValue) props.setValue(e.target.value)}}
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
 
