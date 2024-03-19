import React, { useState } from "react"

import { apiPaths } from "../api/apiConfig"
import axios from "axios"
import { InstructionHeader } from "../components/misc/instructionHeader"
import { UploadEntryWithRemoveAndInput } from "../components/userInputComponents/removablelistbtn/UploadEntryWithRemoveAndInput"
import {FileUploadDisplay} from "../components/fileUpload/FileUploadDisplay"
import { useNavigate, useParams } from "react-router-dom"
import { config } from "process"
import { paths } from "../config.mjs"


export type ReferenceFile = {
    id:number,
    file:File,
    fileName:string,
    userDefinedFileName:string
}



export const ProtienReferenceUploadPage = () =>{
    const navigate = useNavigate();
    const params = useParams();
    const getDefaultRefFile = () => (JSON.parse(JSON.stringify({id:0,"fileName":""})));
    const [allFiles, setAllFiles] = useState<File[]>([]);
    const [allFileNames, setAllFileNames] = useState<string[]>([]);
    const [referenceFiles, setReferenceFiles] = useState<ReferenceFile[]>([{id:0,"fileName":""}]);

    let i = 0;
    const onAddNewReferenceInput = () => {
        setReferenceFiles([...referenceFiles, {id:referenceFiles.length,"fileName":""}])
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
        setAllFiles(referenceFiles.filter(file=>file.file).map(file=>file.file));
        setAllFileNames(referenceFiles.filter(file=>file.userDefinedFileName).map(file=>`reference_${file.userDefinedFileName}`));
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
            <div className="container-sm w-75"
            style={{padding: ".5% 0 .5% 0"}}
            >
                <InstructionHeader title="Upload Protein Reference Files"/>
                
                {referenceFiles.map(file=>{
                    return (
                        <>
                            <UploadEntryWithRemoveAndInput
                                fieldLabel="Protein Name:"
                                handleFileInputChange={async (e) => {onFileChange(e, file.id)}}
                                handleInputChange={async (e) => {onNameChange(e, file.id)}}
                                handleRemoveToolData={async (e) => {onRemove(file.id)}}
                                placeholder=""
                                value={file.fileName}
                                entryValue={file.userDefinedFileName}
                                fieldIsRequired={true}
                                key={file.id}
                                
                            />
                        </>
                    )
                })}

                <button className="btn btn-primary" onClick={onAddNewReferenceInput}>Add New Reference File</button>
                
                <FileUploadDisplay files={allFiles} fileNames={allFileNames} fileTypes='.tsx' id={params.id ? parseInt(params.id) : 0} cb={onSubmit}/>
                <button 
                style={{position: "absolute", bottom: 0, right: 0 ,margin: "80px", width:"80px", height:"80px"}} 
                className="btn btn-primary" 
                onClick={onSubmit}>
                    Skip
                </button>
                
            </div>
            

        </>
    )
}