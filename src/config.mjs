const config = {    
    //used to enable more logging
    DEBUG:false,

    /** the name that displays on the browser tab */
    broswerName:"Robin",

    /** the id of the job to display as an example */
    exampleJobId:"61",

    /** weather to allow users to upload cooler files to higlass or not */
    allowCoolerUploads:false,

    projectName: "Robin:  An Advanced Tool for Comparative Loop Caller Analysis Leveraging Large Language Models",
    projectDescription: "An online tool for visualization and anaylisis of chromtin loops. [mohit]",

    /** @description if a job is older than this (in ms) abandon the job TIMEOUT: 4 hours */
    maxjobage:60*1000*60 * 4,

    /** the time before we delete a cooler file from our server (1 hour) */
    timeToStoreCoolerFilesForInMs:1000 ,//60*1000*60,

    /**
     * @description the highest resolution something can be before being low res
     */
    highCuttoff:10001,

    /**
     * @description full url of our higlass server
     */
    higlassApiUrl:"http://biomlearn.uccs.edu/robinHighglassAPI/",

    /** path for flask api */
    flaskAPIUrl:"http://biomlearn.uccs.edu/robinFlaskAPI/",

    /**
     * @description full url of the api/v1 of our higlass server where tilesets can be retrieved from
     */
    higlassApiUrlV1:'',

    /**
     * @description the absolute path to the data folder
     * @todo, update this in prod
     */
    dataFolderPath:"./data",

    /** @description the api path */
    apiPath:"http://biomlearn.uccs.edu/robinAPI/", //"http://127.0.0.1:8086",

    /** the port the api should be hosted on */
    apiPort:8086,

    /** @description the path of the actual web server */
    webPath:"http://biomlearn.uccs.edu/robin/", //http://localhost:3000",

    /** @description the link to the project's github */
    github:"https://github.com/OluwadareLab/Robin/",

    /** TODO: [mohitAddthePathToOurDocsHere] */
    docs:"https://google.com",

    /** the number of milliseconds the que page will update every x */
    queuePageUpdateFrequency: 10000,

    /** the number of milliseconds the jyupter results page will update every x */
    aiFetchNewJyupterNotebookfilesFrequency: 10000,

    email:"comprehensiveloopcaller@gmail.com",
    emailServer:"gmail",
    emailPass:"comprehensivecallerazjnzxwehaganznedjaAfzjndx njzA",
    emailMsgBody:"",

    /** the path to the callers run script */
    callersScriptPath: "./callers/run.sh",

    /** the path to the script to convert to hitle and upload to higlass server */
    higlassUploadPath: "./callers/injestIntoHiglass/injestBedpeFile.sh",

    /** the path to the callers run script */
    callersRecovereyScripPath: "./callers/recovery/recovery.sh",

    /** the path to the callers rem script */
    callersRemScriptPath: "./callers/rem.sh",

    /** the path to the callers loop_size detection script */
    callersLoopSizeScriptPath: "./callers/loop_size/loop_size_runner.sh",

    /** the path to the callers overlap script */
    callersOverlapScriptPath: "./callers/overlap/vennCaller.sh",

    /** the path to the injest reference file into higlass script */
    callersHiglassReferenceInjestScript: "./callers/injestIntoHiglass/injestReferenceFile.sh",

    /** the path to the injest cooler file into higlass script */
    callersHiglassCoolerInjestScript: "./callers/injestIntoHiglass/injestCoolFile.sh",

    /** the pather to the script to convert jyupter file to html including execution */
    jupyterConverter:"./callers/jupyterConverter/convert.sh",

    // /** the port where the api is hosted (defined below)*/
    // apiPort:undefined



}

config.higlassApiUrlV1=`${config.higlassApiUrl}/api/v1`;

// /** the port where the api is hosted */
// config.apiPort=config.apiPath.split(":").slice(-1)[0];


//TODO: mohit add documentation path below:
/**
 * @description all relative paths within the website
 */
const paths = {
    home: "/",
    upload: "/upload",
    setup: "/jobSetup",
    queue: "/queue",
    results: "/results",
    jobs: "/jobs",
    example: "/example",
    about: "/about",
    referenceUpload: "/uploadRef",
    aiTest: "/testAI"

}

/**
 * @description all absulute paths
 */
const hrefPaths = {};

Object.keys(paths).forEach(key=>hrefPaths[key]=`/robin${paths[key]}`)


export {paths, hrefPaths, config};
export default config;