import React from "react";
import { UploadEntryWithRemoveAndInput } from "../userInputComponents/removablelistbtn/UploadEntryWithRemoveAndInput";
import { ReferenceFile } from "../tempTypes/Types";

/**
 * @description types for the properties of A ProtienReferenceNameInput component
 */
type ProtienReferenceNameInputProps = {

    file:ReferenceFile

    /** @description optional prop to change the label of the field */
    fieldLabelHeader?:string;

    /**
     * @description the callback to be called when the file changes
     * @param e the html input event
     * @returns 
     */
    onFileInputChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;

    /**
     * @description the callback to be called when the name changes
     * @param e the html input event
     * @returns 
     */
    onNameChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;

    /**
     * @description the callback to be called when the remove changes
     * @param e the html input event
     * @returns 
     */
    onRemove:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

export const ProtienReferenceNameInput = (props:ProtienReferenceNameInputProps) => {
    const fieldLabelHeader = props.fieldLabelHeader? props.fieldLabelHeader : "Protein Name:";
    
    return (
        <UploadEntryWithRemoveAndInput
            fieldLabel={fieldLabelHeader}
            handleFileInputChange={props.onFileInputChange}
            handleInputChange={props.onNameChange}
            handleRemoveToolData={props.onRemove}
            placeholder=""
            value={props.file.fileName}
            entryValue={props.file.userDefinedFileName}
            fieldIsRequired={true}
            key={props.file.id}
            
        />
    )
}