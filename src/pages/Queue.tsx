import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { STATUSES, apiPaths } from "../api/apiConfig.js";
import { useNavigate, useParams } from "react-router-dom";
import config, { paths } from "../config.mjs";
import { Job } from "../api/models/job.js";
import Bookmark from "../components/bookmarkComponent/bookmark";

interface QueuePageProps {
  // Additional props can be added here
}

const QueuePage: React.FC<QueuePageProps> = () => {
  let counter = 0
  const [position, setPosition] = useState<number | null>(null);
  let interval;
  const params = useParams();
  const navigate = useNavigate();


  const updateQuePos = () =>{
    axios.get(apiPaths.quePosition + "?id=" + params.id).then((response) => {
      setPosition(response.data.queueNum);
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
  }, []); // Empty dependency array ensures the effect runs once on mount

  useEffect(()=>{
    if(position == -1){
      clearInterval(interval);
      navigate(paths.results + "/" + params.id);
    }
  }, [position, interval, navigate])


  return (
    <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
      <div style={{ width: "25%", textAlign: "center" }}>
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
                <p>We will redirect you to your results when they are done.</p>
            
              </>
            )}
            <p>
              Feel free to bookmark this page and check back to see your results.
            </p>
            <Bookmark/>
          </div>
        ) : (
          <div
            className="spinner-border text-primary"
            style={{ width: "5rem", height: "5rem" }}
            role="status"
          />
        )}
      </div>
    </div>
  );
};

export { QueuePage };
