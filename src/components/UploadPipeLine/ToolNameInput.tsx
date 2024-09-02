import React from "react"
import { EntryWithRemove } from "../userInputComponents/removablelistbtn/EntryWithRemove"


//TODO: check if these need to be async or not.
type ToolNameInputProps = {
    /**  the prop for the value of the input */
    name:string,

    /**
     *  the callback for when a the input is changed for the name field
     * might need to be async, I dont remember
     * @param e the html input change event
     * @returns nothing
     * 
     */
    onInputChange: (e:React.ChangeEvent<HTMLInputElement>)=>void,
    /**
     *  the callback function for when the remove button is hit.
     * might need to be async, I dont remember
     */
    onToolRemove:()=>void,

    /** if truthy, the remove button will not exist on this input. */
    cannotBeRemoved?:boolean,
}

/**
 *  a simple wrapper for entry with remove to enter a tool name for the tool upload component
 * @returns react component for inputting a tool name
 */
export const ToolNameInput = (props:ToolNameInputProps) =>{
    return(
        <EntryWithRemove
            fieldLabel='Tool Name'
            fieldIsRequired={true}
            handleInputChange={props.onInputChange}
            handleRemoveToolData={props.onToolRemove}
            placeholder="IE: Lasca, CLoops, etc..."
            value={props.name}
            cannotBeRemoved={props.cannotBeRemoved}
            
        />
    )
}