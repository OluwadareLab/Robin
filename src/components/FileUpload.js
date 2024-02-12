import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../config.js';
import { apiPaths } from '../api/apiConfig.js';

axios.defaults.baseURL = config.apiPath;

/**
 * @description a component for file uploading. can specify types with prop.fileTypes
 * @param {} props props.fileTypes as string ".type1 .type2 etc...."
 * @returns 
 */
const FileUploadComponent = (props) => {

  const id = props.id;
  const fileTypes = props.fileTypes || ".cool, .hic, .bed, .bedme, .mcool";
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const regEx = new RegExp(fileTypes.replace(/\s/g, '').replace(/./g, "|"));
    // Filter files with allowed extensions
    const allowedFiles = files.filter(file => regEx.test(file.name));

    setSelectedFiles([...selectedFiles, ...allowedFiles]);
  };

  const handleUpload = () => {
    const apiEndpoint = apiPaths.jobData;

    // Ensure there are files to upload
    if (selectedFiles.length === 0) {
      alert('Please select at least one valid file before uploading.');
      return;
    }

    const formData = new FormData();
    //id must be added first due to some annoying things
    formData.append(`id`, id);

    // Append each selected file to FormData
    selectedFiles.forEach((file) => {
      formData.append(`files`, file);
    });

    // Axios request with progress event
    axios.post(apiEndpoint, formData, {
      onUploadProgress: (progressEvent) => {
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
      <button className="btn btn-lg btn-secondary" style={{float:"right"}} onClick={handleUpload}>
        Upload
      </button>

      {uploadProgress > 0 && !uploadComplete && (
        <div className="progress mt-3">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${uploadProgress}%` }}
            aria-valuenow={uploadProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {uploadProgress}%
          </div>
        </div>
      )}

      {uploadComplete && (
        <div className="mt-3">
          <span className="text-success">✓</span> Upload complete
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
