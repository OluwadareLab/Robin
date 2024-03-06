import { apiPaths } from './apiConfig.js';
import config from '../config.mjs';
import express from 'express';
import sqlite3 from 'sqlite3';
import mongoose from 'mongoose';
import {Job} from './models/job.js';
import fileUpload from "express-fileupload";
import multer from 'multer'
import bodyParser from 'body-parser';
import * as fs from 'fs';
import cors from 'cors';
import { STATUSES } from './apiConfig.js';

const upload = multer({ dest: config.dataFolderPath });


/**
 * @description the sqlite3 database
 */
const db = new sqlite3.Database(config.dataFolderPath + "/db.sqlite");

/**
 * the mongodb database for our job que
 * im using mongo for the que since we don't need an sql database for a linier que
 */
mongoose.createConnection('mongodb://localhost:27017/jobQueue')
mongoose.connect('mongodb://localhost:27017/jobQueue');

//TODO: check if this line is needed
createDb();

/** @description the express api application */
const app = express();

//for cross orgin resource sharing
app.use(cors({
    origin:"*",
    methods:['GET', 'POST']
}))

// for parsing application/json
app.use(
    bodyParser.json({
        limit: "50mb",
    })
);
// for parsing application/xwww-form-urlencoded
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
    })
);

// // for parsing multipart/form-data
// app.use(upload.array());

// app.use(fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
//   }));
app.get('/', (req, res) => res.json({ welcome: "Hello World" }));
app.listen(8080);


/**
 * @description sum all rows with the provided status with lower id than id provided
 * @param {*} id 
 * @param {*} status 
 * @returns 
 */
function getQueuePos(id, status){
    return new Promise((resolve) =>{
        db.all(`SELECT COUNT(status) FROM jobs WHERE status="${status}" AND ROWID<${id}`, (err, res) => {
            if(typeof(res[0]['COUNT(status)']) != "undefined"){
                resolve(res[0]['COUNT(status)']);
            }
        });
    })
    
}


/**----------------------------------------------
 *                
 *   
 *   GET REQUESTS
 *   
 *
 *---------------------------------------------**/

// get job results
app.get(apiPaths.jobResults, (req, res) => {
    // Path to the file to be sent
    const id = req.query.id;
    const path = generateJobOutFolderPath(id);
    const tools = fs.readdirSync(path);

    const data = {
    }
    
    tools.forEach(tool=>{
        const toolPath = `${path}/${tool}`
        const resultFiles = fs.readdirSync(toolPath);

        data[tool] = {
            "toolName":tool,
            rnapiiResults: [],
            h3k27acResults: [],
            ctcfResults: [],
            remResults: [],
        }
        
       resultFiles.forEach(file=>{
            let fileObj = {
                resultFileName:file,
                toolName:file.split("_")[1].split(".")[0],
                method:file.split("_")[2].split(".")[0],
                data:fs.readFileSync(`${toolPath}/${file}`, 'utf8'),
                resolution:file.split("_")[3]
            }
            if((/^rem\_/i.test(file))){
                data[tool].remResults.push(fileObj)
            } else if((/rnapii\_/i.test(file))){
                data[tool].rnapiiResults.push(fileObj)
            } else if((/h3k27ac\_/i.test(file))){
                data[tool].h3k27acResults.push(fileObj)
            } else if((/ctcf\_/i.test(file))){
                data[tool].ctcfResults.push(fileObj)
            }  
        })
    })

  
    // Check if the file exists

      // If the file exists, set the appropriate headers
      res.set({
        'Content-Type': 'text/plain', // Set appropriate content type
        'Content-Disposition': 'attachment; filename=file.txt', // Set filename for download
      });
  
      // Create a read stream from the file and pipe it to the response
      res.send({results:data})
 
  });


app.get(apiPaths.allJobsInfo,  async (req, response) => {
    
    try {
        //const title = req.body.title;
        
        response.json({ jobs: await getAllJobs(), status: 200 });
        console.log(`tried to fetch job info`);
            
    } catch (error) {
        response.json({ status: 400, error: "failed fetching job info" });
    }

})

app.get(apiPaths.quePosition, async (req, response) => {
    //
    const timeout = setTimeout(() => {
        response.json({ queue: 404, status: 408 });
    }, 30000);
    try {
        const id = req.query.id;
        //const title = req.body.title;
        clearTimeout(timeout);
        console.log(await getJobStatus(id));
        const pos = await getJobStatus(id) === STATUSES.DONE ? -1 : await getQueuePos(id, STATUSES.HAS_DATA_IN_QUE_WAITING);
        response.json({ queueNum: pos, status: 200 });
        console.log(`Job #${id}, in queue at ${pos}.`);
            
    } catch (error) {
        response.json({ status: 400, error: "Issue parsing your data. please provide a request in the form {title:\"something\", description:\"somthing\", email:\"Optional@optional.com\"" });
    }
})

/**
 * @description a get request to /jobUploads returns the info on all uploaded files to that job
 */
app.get(apiPaths.jobUploads, async (req, response) => {
    try{
        const id = req.query.id;
        const path = generateJobDataFolderPath(id);
        if (fs.existsSync(path)) {
            const files = fs.readdirSync(path);
            console.log(files);
            response.json({"files":files, status:200});
        } else {
            response.json({status: 400, error: "Job with provided id does not exist", "files":[]});
        }
       
    }catch (error) {
        response.json({ status: 400, error: "Issue finding your data: please provide a query of id:yourid", "files":[] });
    }
    
})




/**==============================================
 * 
 *   
 *   POST requests
 *   
 *
 *=============================================**/

/**
 * @description the put request to put jobInfo into the database,
 * expects a request in the form of
 * {
 *  title:string
 *  description:string
 *  email?:string | null
 * }
 */
app.post(apiPaths.jobInfo, async (req, response) => {
    const timeout = setTimeout(() => {
        response.json({ id: null, status: 408 });
    }, 10000);
    try {
        const title = req.body.title;
        const email = req.body.email || "";
        const description = req.body.description;
        //const title = req.body.title;

        addJob(title, description, email);
        db.all("SELECT last_insert_rowid();", (err, res) => {
            const id = res[0]['last_insert_rowid()'];
            if (id) {
                clearTimeout(timeout);
                response.json({ id: id, status: 200 });
                console.log(`Job #${id}, Title:${title}, Desc:${description} was written to db.`);
            }
        });
    } catch (error) {
        response.json({ status: 400, error: "Issue parsing your data. please provide a request in the form {title:\"something\", description:\"somthing\", email:\"Optional@optional.com\"" });
    }

})

/**
 * @description handle uploading data to correct spot
 */
const uploadData = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const id = req.body.id;
            const path = generateJobDataFolderPath(id);
            if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
            cb(null, path);
            return path + "/";
        },

        filename: (req, file, cb) => {
            const id = req.body.id;
            const fileName = id + "data";
            cb(null, (file.originalname || fileName))
        }
    }

    )
})

/**
 * @description the post request to put jobData into the filesystem ,
 * expects a request in the form of
 * {
 *  id:int
 * }
 */
app.post(apiPaths.jobData, uploadData.array("files"), async (req, response, next) => {
    const timeout = setTimeout(() => {
        response.json({ id: null, status: 408 });
    }, 10000);
    try {
        const id = req.body.id;
        try {
            updateJobStatus(id, STATUSES.HAS_SOME_DATA);
        } catch (error) {
            console.log(`Failed to update database status of job_${id}: ${error}.`);
        }
        
        response.json({ status: 200 });
        console.log("File uploaded to job #" + id);
        clearTimeout(timeout);
       
    } catch (err) {
        response.json({ status: 400, error: "Issue parsing your data. please provide a request in the form {id:#number, files:file}", err:err });
    }

})

/**
 * @description the post finalise a job as ready for processing and submitted
 * expects a request in the form of
 * {
 *  id:int
 * }
 */
app.post(apiPaths.jobSubmit, async(req, response) =>{
    const id = req.body.id;
    try {
        updateJobStatus(id, STATUSES.HAS_DATA_IN_QUE_WAITING);
        
        //TODO: add to work que once backend is done
        //for now just mock something taking a while and then resolve it.
        const job = await getJob(id);
        console.log(`got job obj ${JSON.stringify(job)}`);

        const newJob = await Job.create({...job, id:id});
        response.json({ status: 200 });

    } catch (error) {
        console.log(error)
        response.json({ status: 400, err:error });
    }
})

/**
 * 
 * @param {number} jobId the id of the job in the db
 * @param {STATUSES} newStatus the new status to upadate to
 */
export function updateJobStatus(jobId, newStatus){
    db.run(`
            UPDATE jobs
            SET status = "${newStatus}"
            WHERE ROWID=${jobId}`)
}

/**
 * 
 * @param {number} jobId the id of the job in the db
 * @param {STATUSES} newStatus the new status to upadate to
 */
function getJobStatus(jobId){
    return new Promise(resolve =>{
        db.all(`
            SELECT status
            FROM jobs
            WHERE ROWID=${jobId}`, (err, res) => {
                resolve(res[0].status);
            })
    })
    
}

/**
 * get a job obj
 * @param {number} jobId the job iid
 * @param {STATUSES} newStatus the new status to upadate to
 */
function getJob(jobId){
    return new Promise(resolve =>{
        db.all(`
            SELECT *
            FROM jobs
            WHERE ROWID=${jobId}`, (err, res) => {
                resolve(res[0]);
            })
    })
    
}

function getAllJobs(){
    return new Promise(resolve =>{
        db.all(`
        SELECT *
        FROM jobs
        `, (err, res) => {
            resolve(res);
        })
    })
}

function addJob(title, description, email = null, status = STATUSES.NO_DATA) {
    var pad = function(num) { return ('00'+num).slice(-2) };
    var date;
    date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.run(
        `INSERT INTO jobs (title, description, email, status, date)
         VALUES ("${title}","${description}","${email}","${status}", "${date}");
    `)
}

function createDb() {
    db.serialize(() => {
        try {
            //db.run("CREATE TABLE jobs (title TEXT, description TEXT, email TEXT, status TINYTEXT, date TIMESTAMP)");
        } catch (error) {
            console.log("Table already exists!");
        }
    });
}



/**
 * Data storage methods
 */



/**
 * Util
 */

/**
 * @description get the path to a job's data folder
 * @param {number} jobid the id of the job
 * @returns {string} the path to the jobs data folder (string)
 */
function generateJobDataFolderPath(jobid){
    return config.dataFolderPath +'/job_' + jobid + "/data/";
}

/**
 * @description get the path to a job's output folder
 * @param {number} jobid the id of the job
 * @returns {string} the path to the jobs output folder (string)
 */
function generateJobOutFolderPath(jobid){
    return config.dataFolderPath +'/job_' + jobid + "/out/";
}