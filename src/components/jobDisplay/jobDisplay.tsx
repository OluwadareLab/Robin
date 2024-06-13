import React, { useEffect, useState } from 'react';
import { Accordion, AccordionBody, AccordionCollapse, AccordionHeader, AccordionItem, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { STATUSES } from '../../api/apiConfig.js';
import { BtnLink } from '../buttons/BtnLink';
import { hrefPaths as paths } from '../../config.mjs';
import { apiPaths } from '../../api/apiConfig.js';
import { Graph } from '../graph/exampleGraph';
import Popup from 'reactjs-popup';
import { ChromatinLoopAnalysisResultsPage } from '../../pages/Results';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InstructionHeader } from '../misc/instructionHeader';
import FileUploadDisplay from '../fileUpload/FileUploadDisplay';
import DownloadJsonButton from '../downloadjson/download';

type JobProps = {
  id: number;
  status: string;
  title: string;
  description: string;
  email?: string;
  date?: string;
}

export const JobDisplay = (props: JobProps) => {
  const [data, setData] = useState<any>();
  const navigate = useNavigate();
  function onClickRerunJob(id) {
    axios.post(apiPaths.reRunAsNewJob, { id: id }).then((response) => {
      if (response.data.status === 200){
        alert(`running as new job: ${response.data.id} redirecting you to queue once you close this popup`);
        navigate(paths.queue + "/" + response.data.id);
      }
      else {
        alert("something went wrong." + response.data.err);
      }
    }).catch(err=>console.log("axios err:"+err));
  }

  useEffect(()=>{
    window.onerror = function (message, source, lineno, colno, error) {
      console.log("An error occurred:", message);
      return true; // Prevent the default browser error handler
    };
    
    window.onunhandledrejection = function (event) {
      console.warn("Unhandled promise rejection:", event.reason);
      return true; // Prevent the default browser error handler
    };
    
    try {
      axios.get(apiPaths.jobResults + "?id=" + props.id).then(async (response) => {
        setData(response);
      }).catch(err=>{
        setData(err);
      });
    } catch (error) {
      setData(error);
    }
    
  },[])

  function onAddToJobQueue(id){
    axios.post(apiPaths.jobSubmit, {id:id}).then((response) => {
      if(response.status===200){
        alert(`set status of: ${id} to waiting in queue, redirecting you to its queue once you close this popup`);
        navigate(paths.queue + "/" + id);
      } else {
          alert("something went wrong." + response.data.err);
      }
      }).catch(err=>console.log("axios err:"+err));
  }

  return (
    <Card>
      <Card.Body>

        <Card.Title>{props.title}</Card.Title>
        {props.status === STATUSES.DONE && false ?
          <Accordion>
            <AccordionItem eventKey='preview'>
              <Accordion.Header>preview</Accordion.Header>
              <AccordionBody>
                <ChromatinLoopAnalysisResultsPage example={true} />
              </AccordionBody>
            </AccordionItem>
          </Accordion>


          : ""}
        <hr></hr>
        <Card.Text>ID: {props.id}</Card.Text>
        <Card.Text>Status: {props.status}</Card.Text>
        <Card.Text>Description: {props.description}</Card.Text>
        {props.date !== 'null' && props.date ? <Card.Text>Date: {props.date}</Card.Text> : ""}
        {props.email !== 'null' && props.email ? <Card.Text>Email: {props.email}</Card.Text> : ""}
        {props.status === STATUSES.DONE ? <BtnLink src={`${paths.results}/${props.id}`} title="viewJob" /> : ""}
        {props.status === STATUSES.FAIL ? <BtnLink src={`${paths.results}/${props.id}`} title="View Potentially Incorrect Results" /> : ""}
        <Popup
            trigger={<Button> Admin </Button>}
            modal
            nested
        >
            {close => (
                <Container style={{ backgroundColor: "white", margin: "50px", padding: 50, border: "5px solid #cfcece", width: "100%" }} >
                  <InstructionHeader title="admin controls and info"/>
                    <Button variant="secondary" onClick={close}> Close </Button>

                    <Row>
                      <Col>
                        <Button onClick={()=>onClickRerunJob(props.id)}>Rerun As New Job</Button>
                      </Col>
                      <Col>
                      <Button onClick={()=>onAddToJobQueue(props.id)}>Add to Job Queue</Button>
                      </Col>
                      <Col>
                      <BtnLink src={`${paths.results}/${props.id}`} title="Force View Job" />
                      </Col>
                      <Col>
                        <DownloadJsonButton
                          jsonData={data}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <FileUploadDisplay
                          id={props.id}
                          dontShowSubmitBtn={true}
                      />
                    </Row>
                </Container>
            )

            }
        </Popup>
      </Card.Body>
    </Card>
  );
};