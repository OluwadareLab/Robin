import { Button, Container, Form, Row, Col } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import Popup from 'reactjs-popup';
import { InstructionHeader } from "../misc/InstructionHeader";
import { UploadEntryAndInput } from "../userInputComponents/removablelistbtn/UploadEntryAndInput";
import FileUploadDisplay from "../fileUpload/FileUploadDisplay";
import { fileSet } from "../tempTypes/Types";
import { useParams } from "react-router-dom";
import { apiPaths } from "../../api/apiConfig";


type HiglassCoolPopupProps = {
    fileName: string
    setFileName: (string: string) => void,
    file?: File
    setFile: (file: File) => void,
}

export const HiglassCoolPopup = (props: HiglassCoolPopupProps) => {
    const params = useParams();
    const [fileSets, setFilesets] = useState<fileSet[]>([]);
    const jobId = params.id ? parseInt(params.id) : undefined;

    useEffect(()=>{
        console.log(props.file)
        const fileSet = [
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
            trigger={<Button> Upload .Cool file</Button>}
            modal
            nested
        >
            {close => (
                <Container style={{ backgroundColor: "white", margin: "50px", padding: 50, border: "5px solid #cfcece", width: "100%" }} >
                    <InstructionHeader title="Upload .cool matrix file" />
                    <p>
                        You may upload your own .cool matrix file to our servers for a short period of time, since these files are large we will cache it for a few hours
                        and then delete it. Please double check all natively avalible matrixs within higlass before uploading your own.
                    </p>
                    <Form onSubmit={onSubmit}>
                        <UploadEntryAndInput
                            fieldIsRequired={true}
                            fieldLabel={"Matrix Name"}
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
                                apiPath={apiPaths.uploadCoolFile}
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