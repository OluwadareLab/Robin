const config = {
    projectName: "Comprehensive Loop-Caller",
    projectDescription: "An online tool for visualization and anaylisis of chromtin loops.",

    /**
     * @description the absolute path to the data folder
     * @todo, update this in prod
     */
    dataFolderPath:"./data",

    /** @description the api path */
    apiPath:"http://127.0.0.1:8080",

    /** @description the link to the project's github */
    github:"https://github.com/mattieFM/MohitProjWeb"

}

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
    about: "/about"

}

export {paths};
export default config;