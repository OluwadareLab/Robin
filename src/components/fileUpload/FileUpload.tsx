import React, { useEffect, useState } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../config.mjs';
import { apiPaths } from '../../api/apiConfig.js';

axios.defaults.baseURL = config.apiPath;

type FileUploadProps = {
  /**
   * The file types allowed by the upload component IE: '.cool, .hic, etc...'
   * @default ".cool, .hic, .bed, .bedme, .mcool"
   */
  fileTypes:string

  /**
   * The id of this upload
   */
  id:number
}

/**
 * @description a component for file uploading. can specify types with prop.fileTypes
 * @param {} props props.fileTypes as string ".type1 .type2 etc...."
 * @returns 
 */
const FileUploadComponent = (props: FileUploadProps) => {

  const id:number = props.id;
  const fileTypes = props.fileTypes || ".cool, .hic, .bed, .bedme, .mcool";
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadData, setUploadData] = useState([]);


  const handleFileChange = (e:any) => {
    const files = Array.from(e.target.files);

    const regEx = new RegExp(fileTypes.replace(/\s/g, '').replace(/./g, "|"));
    // Filter files with allowed extensions
    const allowedFiles = files.filter((file:any) => regEx.test(file.name));

    setSelectedFiles([...selectedFiles, ...allowedFiles]);
  };

  useEffect(() => {
    const fetchQueuePosition = async () => {
      axios.get(apiPaths.jobUploads + "?id=" + id).then((response) => {
        console.log(response)
        if(response.status===200)
        setUploadData(response.data.files);
      }).catch(err=>console.log("axios err:"+err));
    };

    fetchQueuePosition();
  }, [uploadComplete, selectedFiles, id]); // Empty dependency array ensures the effect runs once on mount

  const handleUpload = () => {
    const apiEndpoint = apiPaths.jobData;

    // Ensure there are files to upload
    if (selectedFiles.length === 0) {
      alert('Please select at least one valid file before uploading.');
      return;
    }

    const formData = new FormData();
    //id must be added first due to some annoying things
    formData.append(`id`, id.toString());

    // Append each selected file to FormData
    selectedFiles.forEach((file) => {
      formData.append(`files`, file);
    });

    // Axios request with progress event
    axios.post(apiEndpoint, formData, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(progress);
      },
    })
      .then(response => {
        // Handle API response
        console.log(response.data);
        // Set upload complete
        setUploadComplete(true);
        // Clear selected files after a short delay
        setTimeout(() => {
          setSelectedFiles([]);
          setUploadComplete(false);
          setUploadProgress(0);
        }, 2000);
      })
      .catch(error => {
        // Handle error
        console.error('Error uploading files:', error);
        setUploadProgress(0);
        setUploadComplete(false);
      });
  };

  return (
    <div className="container mt-5">
      <input
        type="file"
        className="form-control"
        accept={fileTypes}
        onChange={handleFileChange}
        multiple
      />
      <div style={{display:'flex', flexDirection:"row", justifyContent:"right"}}>

      {uploadProgress > 0 && !uploadComplete && (
        <div className="progress mt-3" style={{width:"75%"}}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${uploadProgress}%` }}
            aria-valuenow={uploadProgress}
     
          >
            {uploadProgress}%
          </div>
        </div>
      )}

      <button className="btn btn-lg btn-secondary cf" onClick={handleUpload} style={{width:"25%"}}>
        Upload
      </button>
      </div>

        {uploadData.length > 0 ? (
          <>
           <div style={{display:'flex', flexDirection:"row", justifyContent:"left"}}>
          <h3 style={{color:"#708090"}}>Uploaded files for job:</h3>
          </div>
          <ol>
          {uploadData.map((element)=>(<li>{element}</li>))}
          </ol>
          </>
         
        ): ""}
      
      

     
      
      

      

      {uploadComplete && (
        <div className="mt-3">
          <span className="text-success">✓</span> Upload complete
        </div>
      )}
    </div>
    
  );
};

export default FileUploadComponent;
