/**
 * ----------------------------------------------------------
 * 
 * A new page that combines all previous pipline steps into one page 
 * to simplify and remove abiguity from the upload process. The other pages
 * that did exists in the pipeline should be broken into compoenents instead.
 * 
 * 
 * 
 * ----------------------------------------------------------
 */

//package imports
import React, { createRef, useEffect } from "react"
import { useState } from "react"
import { Container, Row } from "react-bootstrap"

//local imports
import { BasicJobInfoInputs } from "../components/UploadPipeLine/majorSteps/BasicJobInfoInputs"
import ToolFormUploadForm from "../components/UploadPipeLine/majorSteps/ToolFormUploadForm"
import { ProtienReferenceUploadForm } from "../components/UploadPipeLine/majorSteps/ProtienReferenceUploadForm"
import FileUploadDisplay from "../components/fileUpload/FileUploadDisplay"
import { useNavigate, useParams } from "react-router-dom"
import { ToolData, fileSet } from "../components/tempTypes/Types"
import { jobSetupFormData } from "../components/tempTypes/Types"
import { apiPaths } from "../api/apiConfig"
import { paths } from "../config.mjs"
import axios from "axios"
import { InstructionHeader } from "../components/misc/instructionHeader"

type OneStepJobUploadPageProps = {

}

export const OneStepJobUploadPage = (props:OneStepJobUploadPageProps)=>{
    //use params to get id from url
    const params = useParams();
    const navigate = useNavigate();

    //form states
    const [protienRefFiles, setProtienRefFiles] = useState<File[]>([]);
    const [protienRefFileNames, setProtienRefFileNames] = useState<string[]>([]);
    const [toolData, setToolData] = useState<ToolData[]>([]);

    const [fileSets, setFilesets] = useState<fileSet[]>([]);
    const [basicInfo, setBasicInfo] = useState<any>({});

    useEffect(()=>{
        axios.get(apiPaths.getNextID).then(response=>{
            if(response.status==200){
                navigate(`${paths.setup}/${response.data.id}/`)
            }
        })
    },[])

    //update files and fileNames whenever any of these change
    useEffect(()=>{
        let i = 0;
        let protienRefFilesets = protienRefFiles.map(file=>{
            return {
                file:file,
                name:protienRefFileNames[i++]
            }
        })

        setFilesets([toolData, protienRefFilesets])

        
    },[protienRefFiles,protienRefFileNames,toolData])


    //get job id from url
    let jobId = params.id ? parseInt(params.id) : undefined;
    /**
     * @description the function to handle submitting the form itself
     * @param e 
     */
    function submitJob(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        
        //submit job
        axios.post(apiPaths.jobSubmit, {id:params.id}).then((response) => {
            if(response.status===200)
            navigate(paths.queue+"/"+params.id);
        else {
            alert("something went wrong." + response.data.err);
        }
            });
        
        
        return "test";
    }

    function canSubmit(){
        if(toolData.some(tool=>tool.resolutions.some(res=>!res.file))) return false;

        let data: jobSetupFormData = {
            email: basicInfo.email,
            description: basicInfo.description,
            title: basicInfo.jobTitle,
        }

        //add job info 
            axios.post(apiPaths.jobInfo, data).then((res: any) =>{
                if(res.data.status === 200){
                    console.log(res);
                    jobId=res.data.id;
                } else {
                    alert("An Unexpected error occurred.")
                }
            })
        console.log(basicInfo);
        return true;
    }


    /**
     * @description the callback when the form fully submitted
     */
    function onSubmitted(){

    }

    return (
        <form onSubmit={submitJob}>
            <Container fluid className="w-75" style={{ padding: ".5% 0 .5% 0" }}>
                <Row>
                    <BasicJobInfoInputs setData={setBasicInfo}/>
                </Row>
                <hr/>
                <Row>
                    <ToolFormUploadForm
                        setToolDataCb={setToolData}
                    />
                </Row>
                <hr/>
                <Row>
                    <ProtienReferenceUploadForm
                        setRefFileNames={setProtienRefFileNames}
                        setRefFiles={setProtienRefFiles}
                    />
                </Row>
            </Container>
            <FileUploadDisplay 
                fileSets={fileSets}
                id={jobId} 
                cb={onSubmitted}
                conditionalCb={canSubmit}
            />
        </form>
    )
}