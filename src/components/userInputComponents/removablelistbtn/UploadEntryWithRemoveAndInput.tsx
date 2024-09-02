import React from "react"

import { RequiredAsterisk } from "../../misc/RequiredAsterisk"
import { UploadEntryAndInput } from "./UploadEntryAndInput"

type UploadEntryWithRemoveAndTitleProps = {
    fieldIsRequired?:boolean | false,
    fieldLabel:string,
    handleRemoveToolData: (e:any)=>void
    handleInputChange: (e:any)=>void
    handleFileInputChange: (e:any)=>void
    value:string
    placeholder:string
    entryValue:string
}

const i = 0;
/**
 * @component
 * @param props 
 * @returns 
 */
export const UploadEntryWithRemoveAndInput = (props:UploadEntryWithRemoveAndTitleProps) => (
    <div className='form-group row mt-4'>
        <UploadEntryAndInput {...props}/>
        <div className='col-sm-2'>
            <button className="btn btn-secondary" onClick={(e)=>props.handleRemoveToolData(e)}>Remove</button>
        </div>
    </div>
    
)