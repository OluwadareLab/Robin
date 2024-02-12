import { apiPaths } from './apiConfig.js';
import config from '../config.js';
import express from 'express';
import sqlite3 from 'sqlite3';
import fileUpload from "express-fileupload";
import multer from 'multer'
import bodyParser from 'body-parser';
import * as fs from 'fs';
import cors from 'cors';


const upload = multer({ dest: config.dataFolderPath });

const STATUSES = {
    NO_DATA: "no_data",
    HAS_SOME_DATA: "some_data_has_been_uploaded",
    HAS_DATA_IN_QUE_WAITING: "waiting_in_que",
    DONE: "done"
}
const db = new sqlite3.Database(config.dataFolderPath + "/db.sqlite");

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

app.get(apiPaths.quePosition, async (req, response) => {
    //
    const timeout = setTimeout(() => {
        response.json({ queue: 404, status: 408 });
    }, 30000);
    try {
        const id = req.query.id;
        //const title = req.body.title;
        clearTimeout(timeout);
        const pos = await getQueuePos(id, STATUSES.HAS_DATA_IN_QUE_WAITING);
        response.json({ queueNum: pos, status: 200 });
        console.log(`Job #${id}, in queue at ${pos}.`);
            
    } catch (error) {
        response.json({ status: 400, error: "Issue parsing your data. please provide a request in the form {title:\"something\", description:\"somthing\", email:\"Optional@optional.com\"" });
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
            const path = config.dataFolderPath + '/job_' + id;
            if (!fs.existsSync(path)) fs.mkdirSync(path);
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
        response.json({ status: 200 });
        console.log("File uploaded to job #" + id);
        clearTimeout(timeout);

        try {
            db.run(`
            UPDATE jobs
            SET status = "${STATUSES.HAS_SOME_DATA}"
            WHERE ROWID=${id}`)
        } catch (error) {
            console.log(`Failed to update database status of job_${id}: ${error}.`)
        }
       
    } catch (err) {
        response.json({ status: 400, error: "Issue parsing your data. please provide a request in the form {id:#number, files:file}", err:err });
    }

})


function addJob(title, description, email = null, status = STATUSES.NO_DATA) {
    db.run(
        `INSERT INTO jobs (title, description, email, status)
         VALUES ("${title}","${description}","${email}","${status}");
    `)
}

function createDb() {
    db.serialize(() => {
        try {
            //db.run("CREATE TABLE jobs (title TEXT, description TEXT, email TEXT, status TINYTEXT)");
        } catch (error) {
            console.log("Table already exists!");
        }
    });
}



/**
 * Data storage methods
 */
