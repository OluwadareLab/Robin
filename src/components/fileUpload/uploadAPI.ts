import axios, { AxiosProgressEvent } from "axios";
import { apiPaths } from "../../api/apiConfig";


/**
 * @description a method to upload files to a job
 * @param id the id of the job
 * @param files, an array of the files to upload
 * @param fileNames, an optional array of the filenames if file names other their actual names should be used when sent.
 * @param progressCb an optional callback to be called within the axios progress thingy
 */
export const uploadFiles = (id:number, files:File[], fileNames:string[]=[], progressCb:any=undefined) => {
    const formData = new FormData();

    //id must be added first due to some annoying things
    formData.append(`id`, id.toString());
    
    const apiEndpoint = apiPaths.jobData;
    if(files){
      let i = 0;
      files.forEach(file=>{
        formData.append(`files`, file, fileNames ? fileNames[i++] : file.name);
      })      
    }

    axios.post(apiEndpoint, formData, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            let progress = 0;
            if(progressEvent){
                progress = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total?progressEvent.total:100)
                  );
            }
            progressCb(progress);
        },
      }).catch(err=>console.log("axios err:"+err));
}
