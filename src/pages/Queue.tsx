import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { apiPaths } from "../api/apiConfig.js";
import { useNavigate, useParams } from "react-router-dom";
import { paths } from "../config.mjs";

interface QueuePageProps {
  // Additional props can be added here
}

const QueuePage: React.FC<QueuePageProps> = () => {
  const [position, setPosition] = useState<number | null>(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueuePosition = async () => {
      axios.get(apiPaths.quePosition + "?id=" + params.id).then((response) => {
        setPosition(response.data.queueNum);
      });
    };
    fetchQueuePosition();
  }, []); // Empty dependency array ensures the effect runs once on mount

  useEffect(()=>{
    if(position == -1){
      navigate(paths.results + "/" + params.id);
    }
  }, [position])

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
                <p>We will redirect you to your results when they are done</p>
              </>
            )}
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
