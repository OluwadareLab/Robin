const config = {
    projectName: "Robin: Compherative analysis and visualization of loop perdictions ",
    projectDescription: "An online tool for visualization and anaylisis of chromtin loops.",

    /**
     * @description the absolute path to the data folder
     * @todo, update this in prod
     */
    dataFolderPath:"./data",

    /** @description the api path */
    apiPath:"http://127.0.0.1:8086",

    /** @description the path of the actual web server */
    webPath:"http://localhost:3000",

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
    higlassUploadPath: "./callers/convertToHitile/converter.sh",

    /** the path to the callers run script */
    callersRecovereyScripPath: "./callers/recovery/recovery.sh",

    /** the path to the callers rem script */
    callersRemScriptPath: "./callers/rem.sh",

    /** the path to the callers loop_size detection script */
    callersLoopSizeScriptPath: "./callers/loop_size/loop_size_runner.sh",

    /** the port where the api is hosted (defined below)*/
    apiPort:undefined


}

/** the port where the api is hosted */
config.apiPort=config.apiPath.split(":").slice(-1)[0];

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

export {paths};
export default config;