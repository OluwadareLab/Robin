import React, { useEffect } from "react"
import { HiglassToggle } from "./HiglassToggle"
import { InstructionHeader } from "../misc/InstructionHeader"
import { Row } from "react-bootstrap"
import { UploadEntryAndInput } from "../userInputComponents/removablelistbtn/UploadEntryAndInput"
import { ChromFile } from "../tempTypes/Types"

/**
 *  props for the ToolFileInputProps compoenent
 */
type HiglassUploadFormProps = {
    checked:boolean,
    setChecked:(boolean)=>void,

    chromSizesFile:ChromFile,
    setChromSizesFile:(File:ChromFile)=>void,
}
 
/**
 * The component for the toggle button to enable higlass, also renders anything contained inside once flipped
 * @param props 
 * @returns The React component
 */
export const HiglassUploadForm= (props:HiglassUploadFormProps) => {
    /** set the name of the chrom file obj */
    function setName(chromName:string){
        let newChromFileObj = new ChromFile().fromExisting(props.chromSizesFile);
        newChromFileObj.chromName=chromName;
        newChromFileObj.fileName=`chrom.sizes.${chromName}`;
        console.log(newChromFileObj);
        props.setChromSizesFile(newChromFileObj);
    }

    /** set the file of the chrom file obj */
    function setFile(file:File){
        let newChromFileObj = new ChromFile().fromExisting(props.chromSizesFile);
        newChromFileObj.file=file;
        props.setChromSizesFile(newChromFileObj);
    }

    return(
        <HiglassToggle 
        checked={props.checked} 
        setChecked={props.setChecked}>
            <hr/>
            <div id="higlass-upload-chrom-sizes-file-container">
                <Row>
                    <InstructionHeader title="Upload Chrom Sizes File"/>
                </Row>
                <Row>
                    <UploadEntryAndInput 
                    fieldIsRequired={true}
                    fieldLabel={"Assembly Name"} 
                    handleInputChange={(e)=>setName(e.target.value)} 
                    handleFileInputChange={(e)=>setFile(e.target.files[0])} 
                    value={props.chromSizesFile.file?.fileName} 
                    placeholder={"IE: hg38, hg18, mm9..."} 
                    entryValue={props.chromSizesFile.chromName}                    
                    />
                </Row>
                
            </div>
        </HiglassToggle>
    )
}