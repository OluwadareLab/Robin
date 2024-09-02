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
import React, { useEffect, useRef } from "react"
import { useState } from "react"
import { Container, Row } from "react-bootstrap"

//local imports
import { BasicJobInfoInputs } from "../components/UploadPipeLine/majorSteps/BasicJobInfoInputs"
import ToolFormUploadForm from "../components/UploadPipeLine/majorSteps/ToolFormUploadForm"
import { ProtienReferenceUploadForm } from "../components/UploadPipeLine/majorSteps/ProtienReferenceUploadForm"
import FileUploadDisplay from "../components/fileUpload/FileUploadDisplay"
import { useNavigate, useParams } from "react-router-dom"
import { ChromFile, ToolData, fileSet } from "../components/tempTypes/Types"
import { jobSetupFormData } from "../components/tempTypes/Types"
import { apiPaths } from "../api/apiConfig"
import config, { paths } from "../config.mjs"
import axios from "axios"
import { HiglassUploadForm } from "../components/UploadPipeLine/HiglassUploadForm"
import { HiglassToggle } from "../components/UploadPipeLine/HiglassToggle"

type OneStepJobUploadPageProps = {

}

export const OneStepJobUploadPage = (props:OneStepJobUploadPageProps)=>{
    //use params to get id from url
    const params = useParams();
    const navigate = useNavigate();
    const formRef = useRef(null);

    
    //------------------------
    //The commmented out sections below are most of an implementation of storing 
    //the user's choices in cookies to make sure they dont lose their work if they 
    //are uploading a big job
    //---------------------
    // //stored data to make form persist
    const storedProtienRefArr:string[]=[];
    const storedProtienRefFileNames:string[]=[];
    const storedToolData:ToolData[]=[];
    const storedUseHiGlass:boolean=true;
    const storedChromFile=new ChromFile();
    const storedFileSets:fileSet[]=[];
    const storedBasicInfo:any={};

    // //these are all wrapped with try catches since we are just checking if the data
    // //exists and loading if so, hence we dont need any more than a simple try catch
    // try {storedProtienRefArr=JSON.parse(localStorage.getItem('storedProtienRefArr'))} catch {}
    // try {storedProtienRefFileNames=JSON.parse(localStorage.getItem('storedProtienRefFileNames'))} catch {}
    // try {storedToolData=JSON.parse(localStorage.getItem('storedToolData'))} catch {}
    // try {storedUseHiGlass=JSON.parse(localStorage.getItem('storedUseHiGlass'))} catch {}
    // try {storedChromFile=JSON.parse(localStorage.getItem('storedChromFile'))} catch {}
    // try {storedFileSets=JSON.parse(localStorage.getItem('storedFileSets'))} catch {}
    // try {storedBasicInfo=JSON.parse(localStorage.getItem('storedBasicInfo'))} catch {}


    // console.log(localStorage.getItem('storedProtienRefArr'));
    // console.log(localStorage.getItem('storedProtienRefFileNames'));
    
    //form states
    const [protienRefFiles, setProtienRefFiles] = useState<File[]>(storedProtienRefArr?storedProtienRefArr:[]);
    const [protienRefFileNames, setProtienRefFileNames] = useState<string[]>(storedProtienRefFileNames?storedProtienRefFileNames:[]);
    const [toolData, setToolData] = useState<ToolData[]>(storedToolData?storedToolData:[]);
    const [useHiglass, setUseHiglass] = useState<boolean>(storedUseHiGlass);
    const [chromSizesFile, setChromSizesFile] = useState<ChromFile>(storedChromFile?storedChromFile:new ChromFile());
    const [fileSets, setFilesets] = useState<fileSet[]>(storedFileSets?storedFileSets:[]);
    const [basicInfo, setBasicInfo] = useState<any>(storedBasicInfo?storedBasicInfo:{});

    // /**  a simple wrapper to update local storage with the result of the state */
    // const localStorageWrapper = (localStoreString,originalSetter) => ((value)=>{originalSetter(value);localStorage.setItem(localStoreString,JSON.stringify(value))});
    // //we wrap the form states setters to store their values to the local storage
    // const setProtienRefFiles = localStorageWrapper('storedProtienRefArr', _setProtienRefFiles);
    // const setProtienRefFileNames = localStorageWrapper('storedProtienRefFileNames', _setProtienRefFileNames);

    useEffect(()=>{
        axios.get(apiPaths.getNextID).then(response=>{
            console.log(response)
            if(response.status==200){
                navigate(`${paths.setup}/${response.data.id}/`)
            }
        }).catch(err=>console.log("axios err:"+err));
    },[])

    //update files and fileNames whenever any of these change
    useEffect(()=>{
        let i = 0;
        const protienRefFilesets = protienRefFiles.map(file=>{
            return {
                file:file,
                name:protienRefFileNames[i++]
            }
        })

        const arr = [toolData, protienRefFilesets];

        if(chromSizesFile.isValid()) arr.push([{file:chromSizesFile.file, name:chromSizesFile.fileName}]);
        console.log({file:chromSizesFile.file, name:chromSizesFile.fileName});
        console.log(chromSizesFile);
        setFilesets(arr)

        
    },[protienRefFiles,protienRefFileNames,toolData,chromSizesFile])


    //get job id from url
    let jobId = params.id ? parseInt(params.id) : undefined;
    let once = false;
    function canSubmit(e){
        //ensure all resolutions have a file
        if(toolData.some(tool=>tool.resolutions.some(res=>!res.file))) return false;
        const formElement = e.target;
        let isValid = formElement.checkValidity() && formRef.current.checkValidity();
        if(!isValid) {
            alert("you have not filled out one or more required fields");
            return 
        }

        //ensure every resolutions has atleast 2 result files
        //-extract resolutions from tooldata as a flat arr
        const allResolutionsResults = toolData.map(toolData=>toolData.resolutions).flat();
        //find all unquie resolutions. we do this by creating an array of all, then convert to a dict/set, then back to array
        const allResolutionsValues = [...new Set(allResolutionsResults.map(res=>res.resolution))];
        console.log(allResolutionsValues)

        const invalidResolutionInputs:number[] = [];
        isValid = allResolutionsValues.every(res=>{
            console.log(res);
            const val = allResolutionsResults.reduce((previousValue, resObj)=>{
                return previousValue + (resObj.resolution ? ((resObj.resolution == res) ? 1 : 0) : 0);
            },0);
            if(val < config.minResolutionValues){
                invalidResolutionInputs.push(res);
            } 
            return val >= config.minResolutionValues;
        })

        if(!isValid) {
            alert(`You must uplaoded atleast ${config.minResolutionValues} results for each resolution you have specified, the following resolution needs one or more results:\n`+invalidResolutionInputs.join("\n"));
            return;}

        const data: jobSetupFormData = {
            email: basicInfo.email,
            description: basicInfo.description,
            title: basicInfo.jobTitle,
            higlassToggle:useHiglass === true ? 1 : 0,
        }

        //add job info 
        if(!once){
            axios.post(apiPaths.jobInfo, data).then((res: any) =>{
                if(res.data.status === 200){
                    console.log(res);
                    jobId=res.data.id;
                } else {
                    alert("An Unexpected error occurred.")
                }
            }).catch(err=>console.log("axios err:"+err));
            once=true;
        }
        
        console.log(basicInfo);
        return true;
    }

        /**
     *  the function to handle submitting the form itself
     * @param e 
     */
        function submitJob(e:React.FormEvent<HTMLFormElement>){
            e.preventDefault();
            if(!canSubmit(e)){
                return;
            }
            
            
            
            
            return "test";
        }


    /**
     *  the callback when the form fully submitted
     */
    function onSubmitted(){
        //submit job
            axios.post(apiPaths.jobSubmit, {id:params.id}).then((response) => {
                    if(response.status===200)
                    navigate(paths.queue+"/"+params.id);
                else {
                    alert("something went wrong." + response.data.err);
                }
            }).catch(err=>console.log("axios err:"+err));
    }

    return (
        <form onSubmit={submitJob} id="mainForm" ref={formRef}>
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
                        refFiles={protienRefFiles}
                        refNames={protienRefFileNames}
                    />
                </Row>
                <hr/>
                <Row>
                    <HiglassUploadForm 
                    checked={useHiglass} 
                    setChecked={setUseHiglass} 
                    chromSizesFile={chromSizesFile} 
                    setChromSizesFile={setChromSizesFile}/>
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