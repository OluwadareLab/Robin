import React from "react"

import { RequiredAsterisk } from "../../misc/RequiredAsterisk"

type EntryWithRemoveProps = {
    fieldIsRequired?:boolean | false,
    fieldLabel:string,
    handleRemoveToolData: (e:any)=>{}
    handleInputChange: (e:any)=>{}
    value:string
    placeholder:string

}


let i = 0;
export const EntryWithRemove = (props:EntryWithRemoveProps) => (
    <div className='form-group row mt-4'>
        <div className='col-2'>
            <label htmlFor={'nameInput' + ++i} className='col-form-label'>{props.fieldLabel}<RequiredAsterisk active={props.fieldIsRequired? true : false} /></label>
        </div>
        <div className='col-sm-8' >
            <input
                required={props.fieldIsRequired? true : false}
                className='input-sm input-sm form-control'
                id={'nameInput' + i}
                type="text"
                name="name"
                placeholder={props.placeholder}
                value={props.value}
                onChange={(e) => props.handleInputChange(e)}
            />
        </div>
        <div className='col-sm-2'>
            <button className="btn btn-secondary" onClick={(e)=>props.handleRemoveToolData(e)}>Remove</button>
        </div>
    </div>
    
)