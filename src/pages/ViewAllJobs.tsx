import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiPaths } from '../api/apiConfig';
import { JobDisplay } from '../components/jobDisplay/JobDisplay';
import { JobProps } from '../components/jobDisplay/JobDisplay';

/** the page for viewing all jobs */
export const ViewAllJobsPage = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(()=>{
        try {
            axios.get(apiPaths.allJobsInfo).then((response) => {
                if(response.status===200){
                    if(response.data.jobs){
                        setJobs(response.data.jobs);
                    }
                }
                console.log(response)
                
            }).catch(err=>console.log("axios err:"+err));  
        } catch (error) {
            console.log("axios err:"+error)
        }
        
    }, [])

    let id=0;
    return (
        <div id="jobsPage">
            <ol>
            {jobs.map((e:JobProps)=>{id++;return(<><JobDisplay {...e} id={id}/></>) })}
            </ol>
            
        </div>
    )
}