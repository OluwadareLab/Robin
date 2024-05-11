const config = {
    //used to enable more logging
    DEBUG:false,

    projectName: "Robin: Compherative analysis and visualization of loop perdictions ",
    projectDescription: "An online tool for visualization and anaylisis of chromtin loops.",

    /** @description if a job is older than this (in ms) abandon the job TIMEOUT: 1hour */
    maxjobage:60*1000*60,

    /**
     * @description the highest resolution something can be before being low res
     */
    highCuttoff:5001,

    /**
     * @description full url of our higlass server
     */
    higlassApiUrl:"http://biomlearn.uccs.edu/robinHighglassAPI/",

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
    github:"https://github.com/mattieFM/MohitProjWeb",

    /** the number of milliseconds the que page will update every x */
    queuePageUpdateFrequency: 10000,

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

    // /** the port where the api is hosted (defined below)*/
    // apiPort:undefined


}

config.higlassApiUrlV1=`${config.higlassApiUrl}/api/v1`;

// /** the port where the api is hosted */
// config.apiPort=config.apiPath.split(":").slice(-1)[0];

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
    github: "/github",
    about: "/about",
    referenceUpload: "/uploadRef"

}

/**
 * @description all absulute paths
 */
const hrefPaths = {};

Object.keys(paths).forEach(key=>hrefPaths[key]=`/robin${paths[key]}`)


export {paths, hrefPaths};
export default config;