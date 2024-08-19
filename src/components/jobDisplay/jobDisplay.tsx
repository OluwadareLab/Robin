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
  /** the id of the job */
  id: number;
  /** the status of the job */
  status?: string;
  /** the title of the job */
  title?: string;
  /** the desc of the job */
  description?: string;
  /** the email of the job */
  email?: string;
  /** the date of the job */
  date?: string;
  /** boolean weather admin buttons should be included, default false */
  includeBtns?: boolean;

  /** if true only display title and desc and no buttons */
  minimal?: boolean;
}

export const JobDisplay = (props: JobProps) => {
  const showAdminBtns = (false || props.includeBtns);
  const minimal = false || props.minimal;
  const [data, setData] = useState<any>();
  const navigate = useNavigate();
  const [job, setJob] = useState({});

  useEffect(()=>{
    console.log("gehsilhaligheag");
      try {
          axios.get(apiPaths.getJobInfo + "?id=" + props.id).then((response) => {
            console.log("gehsilhaligheag")
            console.log(response);
              if(response.status===200){
                  if(response.data.job){
                    console.log("gehsilhaligheag")
                    console.log(response.data.job)
                    setJob(response.data.job);
                  }
              }
              console.log(response)
              
          }).catch(err=>console.log("axios err:"+err));  
      } catch (error) {
        console.log("gehsilhaligheag")
          console.log(error);
      }
      
  }, [])

  function onClickRerunJob(id) {
    axios.post(apiPaths.reRunAsNewJob, { id: id }).then((response) => {
      if (response.data.status === 200) {
        alert(`running as new job: ${response.data.id} redirecting you to queue once you close this popup`);
        navigate(paths.queue + "/" + response.data.id);
      }
      else {
        alert("something went wrong." + response.data.err);
      }
    }).catch(err => console.log("axios err:" + err));
  }

  useEffect(() => {
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
      }).catch(err => {
        setData(err);
      });
    } catch (error) {
      setData(error);
    }

  }, [])

  function onAddToJobQueue(id) {
    axios.post(apiPaths.jobSubmit, { id: id }).then((response) => {
      if (response.status === 200) {
        alert(`set status of: ${id} to waiting in queue, redirecting you to its queue once you close this popup`);
        navigate(paths.queue + "/" + id);
      } else {
        alert("something went wrong." + response.data.err);
      }
    }).catch(err => console.log("axios err:" + err));
  }

  return (
    <Card>
      <Card.Body>

        <Card.Title> <b style={{color:"#708090"}}>{props.title || job.title}</b></Card.Title>
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
        {!minimal?<Card.Text><b style={{color:"#708090"}}>ID:</b> {props.id}</Card.Text>:""}
        {!minimal?<Card.Text><b style={{color:"#708090"}}>Status:</b> {props.status || job.status}</Card.Text>:""}
        <Card.Text><b style={{color:"#708090"}}>Description:</b> {props.description || job.description}</Card.Text>
        {!minimal?<>
        {(props.date !== 'null' && props.date) || job.date ? <Card.Text><b style={{color:"#708090"}}>Date:</b> {props.date || job.date}</Card.Text> : ""}
        {(props.email !== 'null' && props.email) || job.email ? <Card.Text><b style={{color:"#708090"}}>Email:</b> {props.email || job.email}</Card.Text> : ""}
        {props.status === STATUSES.DONE && showAdminBtns ? <BtnLink src={`${paths.results}/${props.id}`} title="viewJob" /> : ""}
        {props.status === STATUSES.FAIL && showAdminBtns ? <BtnLink src={`${paths.results}/${props.id}`} title="View Potentially Incorrect Results" /> : ""}
        </>:""}
        {showAdminBtns ? <Popup
          trigger={<Button> Admin </Button>}
          modal
          nested
        >
          {close => (
            <Container style={{ backgroundColor: "white", margin: "50px", padding: 50, border: "5px solid #cfcece", width: "100%" }} >
              <InstructionHeader title="admin controls and info" />
              <Button variant="secondary" onClick={close}> Close </Button>

              {showAdminBtns ? <>
                <Row>
                  <Col>
                    <Button onClick={() => onClickRerunJob(props.id)}>Rerun As New Job</Button>
                  </Col>
                  <Col>
                    <Button onClick={() => onAddToJobQueue(props.id)}>Add to Job Queue</Button>
                  </Col>
                  <Col>
                    <BtnLink src={`${paths.results}/${props.id}`} title="Force View Job" target={''} />
                  </Col>
                  <Col>
                    <DownloadJsonButton
                      jsonData={data}
                    />
                  </Col>
                </Row>
              </>:""
              }

              <Row>
                <FileUploadDisplay
                  id={props.id}
                  dontShowSubmitBtn={true}
                />
              </Row>
            </Container>
          )

          }
        </Popup>:""}
      </Card.Body>
    </Card>
  );
};