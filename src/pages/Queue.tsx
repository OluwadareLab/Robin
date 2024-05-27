import React, { useState, useEffect, ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { apiPaths } from "../api/apiConfig.js";
import { useNavigate, useParams } from "react-router-dom";
import config, { paths, hrefPaths } from "../config.mjs";
import { Job } from "../api/models/job.js";
import Bookmark from "../components/bookmarkComponent/bookmark";

/**
 * @description a enum of all possible statuses within the db
 */
enum STATUSES {
  /** job info has been created but data has not been uploaded yet */
  NO_DATA= "no_data",
  /** some data has been uploaded but user has not clicked submit yet */
  HAS_SOME_DATA= "some_data_has_been_uploaded",
  /** all data has been submitted and user has pressed submit. waiting in job que */
  HAS_DATA_IN_QUE_WAITING= "waiting_in_que",
  /** all processing has run. job is done and can be viewed */
  DONE= "done",
  /** job has failed */
  FAIL="fail",
  /** if the job is actively being run */
  RUNNING="running"
}

interface QueuePageProps {
  // Additional props can be added here
}

const QueuePage: React.FC<QueuePageProps> = () => {
  let counter = 0
  const [position, setPosition] = useState<number | null>(null);
  const [jobStatus, setJobStatus] = useState<STATUSES>(STATUSES.NO_DATA);
  const [body, setBody] = useState<ReactNode>(<></>);
  let interval;
  const params = useParams();
  const navigate = useNavigate();


  const updateQuePos = () =>{
    axios.get(apiPaths.quePosition + "?id=" + params.id).then((response) => {
      if(response.status==200)
      setPosition(response.data.queueNum);
    });

    axios.get(apiPaths.jobStatus + "?id=" + params.id).then((response) => {
      try {
        if(response.status==200)
          setJobStatus(response.data.jobStatus);
      } catch (error) {
        console.log("unexpected error occured while getting job status: " + error);
      }
    });
  }
  useEffect(() => {
    const fetchQueuePosition = async () => {
      updateQuePos();
      //todo: make this stop firing once we leave the page
      interval = setInterval(()=>{
        updateQuePos();
      },config.queuePageUpdateFrequency);
      
    };
    fetchQueuePosition();
  }, [params.id]); // Empty dependency array ensures the effect runs once on mount

  useEffect(()=>{
    if(position == -1){
      clearInterval(interval);
      navigate(paths.results + "/" + params.id);
    }
  }, [position, interval, navigate])



  //make sure user has bookmarked
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      window.alert("please make sure you have bookmarked this page before you leave");
      event.returnValue = 'please make sure you have book marked this page'; // This line is necessary for the confirmation dialog to show up in some browsers
      
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  },[])


  function page(body){
    return (
      <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
        <div style={{ width: "25%", textAlign: "center" }}>
            {body}
        </div>
      </div>
    )
  }

  let baseBody = <>
    {position !== null ? (
      <div>
        {position > 0 ? (
          <>
            <p>Your current position in the queue:</p>
            <h1>{position}</h1>
            <p>Please wait while other processes are being completed.</p>
          </>
        ) : (
          <>
            <h1>Processing Now</h1>
            <p>Your job should take about 3 min per tool with 4 resolutions to complete. (10-30min depending on how much data you have)</p>
            <p>We will redirect you to your results when they are done.</p>
        
          </>
        )}
        <p>
          Feel free to bookmark this page and check back to see your results.
        </p>
        <Bookmark/>
        <hr/>
        <p>Or view potentially incomplete results <a href={`${hrefPaths.results}/${params.id}/`}>here</a></p>
      </div>
    ) : (
      <div
        className="spinner-border text-primary"
        style={{ width: "5rem", height: "5rem" }}
        role="status"
      />
    )}
  </>
  let failurePage = <>
    <h1>Possible Failure</h1>
    <p>This job has completed, but might be missing some information.</p>
    <p>
      One or more scripts produced an error.
    </p>
    <p>view potentially incomplete results <a href={`${hrefPaths.results}/${params.id}/`}>here</a></p>
  </>

  useEffect(()=>{
    setBody(baseBody);
  },[])

  useEffect(()=>{
    setBody(baseBody);

    if(jobStatus == STATUSES.FAIL){
      setBody(failurePage);
    }
  },[jobStatus])

  

  return (page(body));
};

export { QueuePage };
