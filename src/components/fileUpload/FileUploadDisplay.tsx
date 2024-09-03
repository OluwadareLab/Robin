import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../config.mjs';
import { apiPaths } from '../../api/apiConfig';

//TODO: move shared models to their own folder and use ts and make them good and stuff
import { ToolData, fileSet } from '../tempTypes/Types';


type FileUploadProps = {
  /**
   * The file types allowed by the upload component IE: '.cool, .hic, etc...'
   * @default ".cool, .hic, .bed, .bedme, .mcool"
   */
  fileTypes?: string

  /**
   * The id of this upload
   */
  id: number

  /**  an array of the files to be uploaded */
  toolData?: (ToolData)[]

  /** if provided this will ignore tool data and just use this list */
  files?: File[],

  /** if provided overrides the names of file in the files arr */
  fileNames?: string[],

  /**  upload multiple sets of files that are either toolData or name and file */
  fileSets?: fileSet[]
  /** a callback to call when the upload is done */
  cb: (e: any) => void

  /** a function to call to validate whether the button shuold be able to be pressed */
  conditionalCb?: (e: any) => boolean;

  /** optional override for the api to upload to */
  apiPath?: string;

  /** if true/defined, dont render submitbtn */
  dontShowSubmitBtn?: boolean;
}

const scrollableStyle = {
  maxHeight: '300px',  // Set a maximum height
  width: "100%",
  overflowY: 'auto',   // 'auto' will show the scrollbar only if the content overflows
  border: '1px solid #ccc', // Optional, just for visual reference
  padding: '10px',
};

/**
 *  a component for file uploading. can specify types with prop.fileTypes
 * @param {} props props.fileTypes as string ".type1 .type2 etc...."
 * @returns 
 */
export const FileUploadDisplay = (props: FileUploadProps) => {
  const id: number = props.id;
  const fileTypes = props.fileTypes || ".cool, .hic, .bed, .bedme, .mcool";
  const apiPath = props.apiPath || apiPaths.jobUploads;
  const apiEndpoint = props.apiPath || apiPaths.jobData;

  //this is for asetetics and rendering display suffs
  const [btnPressedCount, setBtnPressedCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  /** Data for the tools */
  const [uploadData, setUploadData] = useState([]);

  useEffect(() => {
    const fetchQueuePosition = async () => {
      axios.get(apiPaths.jobUploads + "?id=" + id).then((response) => {
        //console.log(response)
        if (response.status === 200)
          setUploadData(response.data.files);
      }).catch(err=>console.log("axios err:"+err));
    };
    fetchQueuePosition();
  }, [uploadComplete, id]);

  const handleUpload = (e) => {
    if(btnPressedCount>1){
      if(!window.confirm('You already have completed an upload, or one is in progress. Are you sure you need to submit this again?')){
        return;
      }
    }
    if (props.conditionalCb ? props.conditionalCb(e) : true) {
      setBtnPressedCount(btnPressedCount+1);
      //for each fileset
      //setup formdata
      const formData = new FormData();

      //id must be added first due to some annoying things
      formData.append(`id`, id.toString());
      props.fileSets?.forEach(fileSet => {
        console.log(fileSet)
        //if fileset is tooldata types then parse and add to form data
        if (fileSet[0]) {
          if (fileSet[0] instanceof ToolData || fileSet[0].resolutions) {
            console.log("toolData found")
            const toolData = fileSet as ToolData[];
            toolData.forEach((tool) => {
              console.log("tool:")
              console.log(tool)
              tool.resolutions.forEach(res => {
                console.log("has res")
                if (res.file) {
                  console.log("has res file")
                  const extention = res.file.name.split('.').pop();
                  formData.append(`files`, res.file, `${tool.name}_${res.resolution}${tool.category ? `_${tool.category}` : ''}.${extention}`);
                }
              })

            });
          }

          //if fileset has file prop
          else if (fileSet[0].file) {
            fileSet.forEach(fileObj => {
              formData.append(`files`, fileObj.file, fileObj.name ? fileObj.name : fileObj.file);
            })
          }
        }
      });

      //formdata is finished now


      console.log("FormData contents:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      // Axios request with progress event
      axios.post(apiEndpoint, formData, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ? progressEvent.total : 100)
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
            setUploadComplete(false);
            setUploadProgress(0);
            props.cb(e);
          }, 2000);
        })
        .catch(error => {
          // Handle error
          console.error('Error uploading files:', error);
          setUploadProgress(0);
          setUploadComplete(false);
        });
    };
  }

  return (
    <div className="container mt-5">

      <div style={{ display: 'flex', flexDirection: "row", justifyContent: "right" }}>

        {uploadProgress > 0 && !uploadComplete && (
          <div className="progress mt-3" style={{ width: "75%" }}>
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

        {!props.dontShowSubmitBtn ?
          <button className="btn btn-lg btn-secondary cf fileUploadBtn" id="fileUploadBtn" onClick={handleUpload} style={{ width: "25%" }}>
            Upload And Submit
          </button>
          : ""}

      </div>

      {uploadData.length > 0 ? (
        <div style={scrollableStyle}>
          <div style={{ display: 'flex', flexDirection: "row", justifyContent: "left" }}>
            <h3 style={{ color: "#708090" }}>Uploaded files for job:</h3>
          </div>
          <ol>
            {uploadData.map((element) => (<li>{element}</li>))}
          </ol>
        </div>

      ) : ""}

      {uploadComplete && (
        <div className="mt-3">
          <span className="text-success">✓</span> Upload complete
        </div>
      )}
    </div>

  );
};

export default FileUploadDisplay;
