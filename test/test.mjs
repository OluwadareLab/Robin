import config from "../src/config.mjs";
import { execSync, exec } from "child_process";
import createTestCafe from "testcafe"
import * as fs from "fs"
import { exit } from "process";
import axios from "axios";
import * as html from "testcafe-reporter-html" 
const outputPath = `${process.env.ABSULUTE_TEST_OUTPUT_PATH}`;
const testcafe = await createTestCafe('localhost', 1337, 1338);


const testScripts = fs.readdirSync(config.testFolder).map(fileName => `${config.testFolder}/${fileName}`);

const targetServer = `http://${process.env.REACT_APP_HOST_SERVER}:${process.env.REACT_APP_WEB_PORT_HOST}/robin/`;
console.log(`targeting:${targetServer}`)

//set env to be test mode
execSync(`cp ${config.testEnvFile} ${config.envFile}`);

//run the server
const dockerComposeCmd = exec("docker compose up");

(async () => {
    let gotData = false;

    //wait till server is up
    while (!gotData) {
        console.log("waiting till server is up")
        try {
            let result = await axios.get(targetServer);
            gotData = true;
            res();
        } catch (error) {
            if (error.response) {
                gotData = true;
            } else {
                await new Promise(res => {
                    setTimeout(() => {
                        res()
                    }, 5000);
                })
            }

        }
    }
    console.log("server is up")
    let date = Date.now()

    //run tests
    try {
        const runner = testcafe.createRunner();

        const failed = await runner
            .src(testScripts)
            .browsers(["chrome:headless"])
            .reporter("html",outputPath)
            .run();

        console.log('Tests failed: ' + failed);
    }
    finally {
        await testcafe.close();
    }


    //set env to be prod mode & stop server
    execSync("docker compose stop");
    execSync(`cp ${config.prodEnvFile} ${config.envFile}`);
})();


