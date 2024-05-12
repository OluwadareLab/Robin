

const apiPaths = {
    /** @description the path for the put request to put general info onto the server */
    jobInfo: "/jobInfo",
    /** get the next id from the db */
    getNextID: "/nextID",

    /** the post path for uploading and injesting a cool file */
    uploadCoolFile: "/injestCool",

    //the path for submitting a post request to rerun an existing job as a new job, that is copy the data from the old job and run it again
    reRunAsNewJob: "/rerunAsNew",

    /** @description the path for the put request to put the actual data we would like to process onto the server */
    jobData: "/jobData",
    /** @description the path for the get request for where the user is in the queue */
    quePosition: "/queue",
    /** @description the path for the get request for job results */
    jobResults: "/jobResults",
    /** @description the path for a get request for info on the uploads the user has made */
    jobUploads:"/jobUploads",
    /** @description the path for submitting a job */
    jobSubmit:"/submit",
    /** the path for getting all jobs in the database for the jobs page */
    allJobsInfo:"/jobs",
    /**get: the path for getting the status of a job */
    jobStatus:"/status",
    /**post: the path for updating higlass toggle */
    higlassToggle:"/higlassToggle",
    /**get: the path for getting higlass toggle */
    jobHiglassToggle:"/getHiglassToggle",
    /** post: path for uploading a jyupter file and running it */
    jyupterUpload: "/uploadJyupter",
    /** get:path for getting the html result files from jyupter tasks */
    htmlFiles:"/JyupterHtmlFiles"

}

/**
 * @description a enum of all possible statuses within the db
 */
const STATUSES = {
    /** job info has been created but data has not been uploaded yet */
    NO_DATA: "no_data",
    /** some data has been uploaded but user has not clicked submit yet */
    HAS_SOME_DATA: "some_data_has_been_uploaded",
    /** all data has been submitted and user has pressed submit. waiting in job que */
    HAS_DATA_IN_QUE_WAITING: "waiting_in_que",
    /** all processing has run. job is done and can be viewed */
    DONE: "done",
    /** job has failed */
    FAIL: "fail",
    /** if the job is actively being run */
    RUNNING:"running"
}

export {apiPaths, STATUSES};