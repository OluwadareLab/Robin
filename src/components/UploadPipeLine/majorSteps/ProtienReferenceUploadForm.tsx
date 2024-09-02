import React, { useState } from "react"

import { apiPaths } from "../../../api/apiConfig"
import axios from "axios"
import { InstructionHeader } from "../../misc/InstructionHeader"
import { UploadEntryWithRemoveAndInput } from "../../userInputComponents/removablelistbtn/UploadEntryWithRemoveAndInput"
import {FileUploadDisplay} from "../../fileUpload/FileUploadDisplay"
import { useNavigate, useParams } from "react-router-dom"
import { config } from "process"
import { paths } from "../../../config.mjs"
import { ProtienReferenceNameInput } from "../ProtienReferenceNameInput"
import { ReferenceFile } from "../../tempTypes/Types"
import { Col } from "react-bootstrap"

type ProtienReferenceUploadFormProps = {
    /**
     *  optional, if true a submit button will be rendered
     */
    renderSubmitBtn?:boolean,

    /**
     * optional ref to pass to store files 
     */
    setRefFiles:(files:File[])=>void,

    /**
     *  optional ref to pass to store file names in
     */
    setRefFileNames:(files:string[])=>void,

    refNames?:string[],
    refFiles?:File[]
}


/**
 *  the component for the protien reference form
 * @param props {ProtienReferenceUploadFormProps}
 * @returns 
 */
export const ProtienReferenceUploadForm = (props:ProtienReferenceUploadFormProps) =>{
    const navigate = useNavigate();
    const params = useParams();
    const [allFiles, setAllFiles] = useState<(File|undefined)[]>(props.refFiles||[]);
    const [allFileNames, setAllFileNames] = useState<string[]>(props.refNames||[]);
    const [referenceFiles, setReferenceFiles] = useState<ReferenceFile[]>([new ReferenceFile(0)]);

    let i = 0;
    const onAddNewReferenceInput = () => {
        setReferenceFiles([...referenceFiles, new ReferenceFile(referenceFiles.length)])
        getFiles();
    }

    const onRemove = (index) =>{
        const newData = [...referenceFiles];
        newData.splice(index,1);
        setReferenceFiles(newData);
        getFiles();
    }

    const onFileChange = (e, index) => {
        const file = e.target.files[0];
        const newData = [...referenceFiles];
        newData[index].fileName = e.target.value;
        newData[index].file = file;
        setReferenceFiles(newData);

        getFiles();
    }

    const onNameChange = (e, index) =>{
        const newData = [...referenceFiles];
        newData[index].userDefinedFileName = e.target.value;
        setReferenceFiles(newData);

        getFiles();
    }

    const getFiles = () =>{
        const allFiles = referenceFiles.filter(file=>file.file).map(file=>file.file);
        const allFileNames = referenceFiles.filter(file=>file.userDefinedFileName).map(file=>`reference_${file.userDefinedFileName}`)

        //set states
        setAllFiles(allFiles);
        setAllFileNames(allFileNames);

        //pass data up to any parent listening with its cbs.
        if(props.setRefFileNames){
            props.setRefFileNames(allFileNames);
        }

        if(props.setRefFiles){
            props.setRefFiles((allFiles.filter(e=>e instanceof File)) as File[]);
        }
    }

    function onSubmit(){
        axios.post(apiPaths.jobSubmit, {id:params.id}).then((response) => {
            if(response.status===200)
            navigate(paths.queue+"/"+params.id);
        else {
            alert("something went wrong." + response.data.err);
        }
          });
        
    }

    return (
        <>
            <InstructionHeader title="Upload Protein Reference Files"/>
            {referenceFiles.map(file=>{
                return (
                        <ProtienReferenceNameInput
                            key={`ProtienRefNamEInput-${file.id}`}
                            onFileInputChange={async (e) => {onFileChange(e, file.id)}}
                            onNameChange={async (e) => {onNameChange(e, file.id)}}
                            onRemove={async (e) => {onRemove(file.id)}}
                            file={file}
                        />
                )
            })}

            <Col>
                <button type="button" className="btn btn-primary" onClick={onAddNewReferenceInput}>Add New Reference File</button>
            </Col>
            

            {props.renderSubmitBtn?
                <>
                    <FileUploadDisplay files={(allFiles.filter(e=>e instanceof File)) as File[]} fileNames={allFileNames} fileTypes='.tsx' id={params.id ? parseInt(params.id) : 0} cb={onSubmit}/>
                    <button 
                    style={{position: "absolute", bottom: 0, right: 0 ,margin: "80px", width:"80px", height:"80px"}} 
                    className="btn btn-primary" 
                    onClick={onSubmit}>
                        Skip
                    </button>
                </> : ""
            }
        </>
    )
}