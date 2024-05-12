import { Button, Container, Form, Row, Col } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import Popup from 'reactjs-popup';
import { InstructionHeader } from "../misc/instructionHeader";
import { UploadEntryAndInput } from "../userInputComponents/removablelistbtn/UploadEntryAndInput";
import FileUploadDisplay from "../fileUpload/FileUploadDisplay";
import { fileSet } from "../tempTypes/Types";
import { useParams } from "react-router-dom";
import { apiPaths } from "../../api/apiConfig";
import axios from "axios";


type HiglassCoolPopupProps = {
    fileName: string
    setFileName: (string: string) => void,
    file?: File
    setFile: (file: File) => void,
}

export const TempJyupterUploader = (props: HiglassCoolPopupProps) => {
    const params = useParams();
    const [fileSets, setFilesets] = useState<fileSet[]>([]);
    let jobId = params.id ? parseInt(params.id) : 1;

    useEffect(()=>{
        console.log(props.file)
        let fileSet = [
            {
                name:props.fileName,
                file:props.file
            }
        ]
        setFilesets([fileSet]);
    },[props.file,props.fileName])

 

    function onSubmitted(){

    }

    function onSubmit(e){
        e.preventDefault();
    }

    function canSubmit(){
        return true;
    }



    return (
        <Popup
            trigger={<Button> Upload .ipynb file</Button>}
            modal
            nested
        >
            {close => (
                <Container style={{ backgroundColor: "white", margin: "50px", padding: 50, border: "5px solid #cfcece", width: "100%" }} >
                    <InstructionHeader title="Upload .ipynb file" />
                   
                    <Form onSubmit={onSubmit}>
                        <UploadEntryAndInput
                            
                            fieldIsRequired={true}
                            fieldLabel={"file name (include .ipynb)"}
                            handleInputChange={(e) => props.setFileName(e.target.value)}
                            handleFileInputChange={(e) => props.setFile(e.target.files[0])}
                           
                            placeholder={""}
                            entryValue={props.fileName}
                        />

                        <Row>
                             <Col>
                            <Button variant="secondary" onClick={close}> Close </Button>
                            </Col>
                        </Row>
                        <Row>
                        <FileUploadDisplay
                                apiPath={apiPaths.jyupterUpload}
                                fileSets={fileSets}
                                id={jobId} 
                                cb={onSubmitted}
                                conditionalCb={canSubmit}
                            />
                        </Row>
                    </Form>
                </Container>
            )

            }

        </Popup>
    )
}