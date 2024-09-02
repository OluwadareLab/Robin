import React from "react"

import { RequiredAsterisk } from "../../misc/RequiredAsterisk"

type UploadEntryAndInputProps = {
    fieldIsRequired?: boolean | false,
    fieldLabel: string,
    handleInputChange: (e: any) => void
    handleFileInputChange: (e: any) => void
    value: string
    placeholder: string
    entryValue: string
    list?:string
}


let i = 0;
/**
 * @component
 * @param props 
 * @returns 
 */
export const UploadEntryAndInput = (props: UploadEntryAndInputProps) => (
    <>
        <div className='col-2'>
            <label htmlFor={'nameInput' + ++i} className='col-form-label'>{props.fieldLabel}<RequiredAsterisk active={props.fieldIsRequired ? true : false} /></label>
        </div><div className='col-sm-3'>
            <input
                list={props.list}
                required={props.fieldIsRequired ? true : false}
                className='input-sm input-sm form-control'
                id={'nameInput' + i}
                type="text"
                name="name"
                placeholder={props.placeholder}
                value={props.entryValue}
                onChange={(e) => props.handleInputChange(e)} />
        </div><div className='col-sm-5'>
            <input
                required={props.fieldIsRequired ? true : false}
                className='input-sm input-sm form-control'
                id={'fileInput' + i}
                type="file"
                name="file"
                placeholder={props.placeholder}
                value={props.value}
                onChange={(e) => props.handleFileInputChange(e)} />
        </div>
    </>
)