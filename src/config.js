const config = {
    projectName: "Comprehensive Loop-Caller",
    projectDescription: "A comprehensive anaylisis tool for loop calling",

    /**
     * @description the absolute path to the data folder
     * @todo, update this in prod
     */
    dataFolderPath:"./data",

    /** @description the api path */
    apiPath:"http://127.0.0.1:8080"

}

/**
 * @description all relative paths within the website
 */
const paths = {
    home: "/",
    upload: "/upload",
    setup: "/jobSetup",
    queue: "/queue"

}

export {paths};
export default config;