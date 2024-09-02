import React from "react"

/**
 *  props for the ToolFileInputProps compoenent
 */
type ToolFileInputProps = {
    /**
     *  called when the user changes the value of the file of this input
     * @param e the html input event
     * @returns void
     */
    onFileChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
}
 
/**
 *  the compoenent for prompting the user to enter the tool file they would like to upload
 * @param props 
 * @returns The React component
 */
export const ToolFileInput = (props:ToolFileInputProps) => {
    return(
        <>
        <div className='col-sm-6'>
            <input
                required={true}
                className='col-sm-2 form-control'
                type="file"
                name="file"
                onChange={props.onFileChange}
            />
        </div>
        </>
    )
}