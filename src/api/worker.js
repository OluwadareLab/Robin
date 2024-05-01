// worker.js
import mongoose from 'mongoose';
import { Job } from './models/job.js';
import cron from 'node-cron';
import { STATUSES } from './apiConfig.js';
import {updateJobStatus, getAllJobsWithStatus} from './mainAPI.js'
import * as nodemailer from 'nodemailer';
import config, { paths } from '../config.mjs';
import {url} from "./mongo.config.js";
import { exec } from 'child_process';
import * as fs from 'fs'
import { promises } from 'dns';

var transporter = nodemailer.createTransport({
  service: config.emailServer,
  auth: {
    user: config.email,
    pass: config.emailPass
  }
});

function getCombinations(valuesArray)
{

    var combi = [];
    var temp = [];
    var slent = Math.pow(2, valuesArray.length);

    for (var i = 0; i < slent; i++)
    {
        temp = [];
        for (var j = 0; j < valuesArray.length; j++)
        {
            if ((i & Math.pow(2, j)))
            {
                temp.push(valuesArray[j]);
            }
        }
        if (temp.length > 0)
        {
            combi.push(temp);
        }
    }
    
    combi.sort((a, b) => a.length - b.length);
    console.log(combi.join("\n"));
    return combi;
}

mongoose.connect('mongodb://mongodb:27017').catch(error => console.log("mongooseErr:"+error));

let jobIsRunning = false;
// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
  let recoveryProtiens;
  let jobID;
  try {
    console.log("trying to find pending jobs")
    const pendingJobs = await getAllJobsWithStatus(STATUSES.HAS_DATA_IN_QUE_WAITING)
    console.log("found pending jobs")
    console.log(pendingJobs);
    if (pendingJobs.length > 0 && !jobIsRunning) {
      jobIsRunning=true;
      const job = pendingJobs[0];
      jobID = job.rowid;
      var date = new Date();
      let dateSubmitted = Date.parse(job.date);
      if(Date.now() - dateSubmitted > config.maxjobage){
        updateJobStatus(jobID, STATUSES.FAIL);
        return;
      }
      //email send
      if(job.email){
        //if user provided emial
        var mailOptions = {
          from: config.email,
          to: job.email,
          subject: `Your job, job #${job.rowid} ${config.projectName} has been submitted.`,
          text: `you can view the status at: ${config.webPath}/${paths.queue}${job.rowid}`
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }

      //---------------------
      //main execution of job
      //---------------------
      console.log(`Executing job: ${job.rowid}`);
      
      const path = `${config.dataFolderPath}/job_${job.rowid}/data`;
      console.log(path)
      const files = fs.readdirSync(path);
      console.log(`files in dir ${files}`)
      console.log(files);
      // Replace 'script.sh' with the path to your .sh script

      //all the tool data
      const jobInfo = files.filter(file=>!file.startsWith("reference_")).map(file=>{
        const splitFile = file.split("_")
        return {
          resolution: parseInt(splitFile[1]),
          tool: splitFile[0],
          fileName:file,
        }
      })

      console.log("---------------JobsINFOn---------------")
      console.log("stringifyed:")
      console.log(JSON.stringify(jobInfo))
      console.log("base:")
      console.log(jobInfo)

      //all the protien reference files
      recoveryProtiens = files.filter(file=>file.startsWith("reference_")).map(file=>{
        const splitFile = file.split("_")
        return {
          protein: splitFile[1],
          fileName:file,
        }
      })

      jobInfo.forEach(job=>{
        //create all folders
        fs.mkdirSync(`${config.dataFolderPath}/job_${jobID}/out/${job.tool}/`, { recursive: true });
      });

      let promises = [];

      //OVERLAP RUNNER

      //group jobs by their resolution
      let jobsGroupedByResolution = {};
      jobInfo.forEach(job=>{
        if(!jobsGroupedByResolution[job.resolution]) jobsGroupedByResolution[job.resolution] = []
        jobsGroupedByResolution[job.resolution].push(job)
      });
      console.log("---------------JobsGroupedByResolution---------------")
      console.log("stringifyed:")
      console.log(JSON.stringify(jobsGroupedByResolution))
      console.log("base:")
      console.log(jobsGroupedByResolution)

      //all valid combinations for venn diagram displays
      let combinationsArray = [];
      Object.keys(jobsGroupedByResolution).forEach(resolution=>{
        let jobsWithThisResolution = jobsGroupedByResolution[resolution];
        let jobFilenames = jobsWithThisResolution.map(job=>job.fileName)
        let combinationsOfThisResolutionFilenames = getCombinations(jobFilenames);
        //no combinations of 1 item
        let validCombinations = combinationsOfThisResolutionFilenames.filter(arr=>arr.length>1);
        //merge arrs
        combinationsArray = [...combinationsArray, ...validCombinations]
      })

      console.log(combinationsArray);
      console.log("---------------Combinations Array---------------")
      console.log("stringifyed:")
      console.log(JSON.stringify(combinationsArray))
      console.log("base:")
      console.log(combinationsArray)

      //-----------OVERLAP CALLER-----------
      //now that we have the combinations in nested arrays, we can flatten them down into the strings we need to run the commands
      combinationsArray.forEach(combo=>{
        //example script call: vennCaller.sh "lasca_5000.txt:mustache_5000.tsv:hicexplorer_5000.bedgraph" 5000 8 lasca:mustache:hicexplorer4
        //vennCaller.sh $fileList $resolution $jobid $labelList

        let fileList = combo.join(":");
        let resolution = parseInt(combo[0].split("_")[1]);
        let labelsList = combo.map(e=>e.split(".")[0]).join(":");
        let overlapBashCmd = `bash ${config.callersOverlapScriptPath} ${fileList} ${resolution} ${jobID} ${labelsList}`;
        
        console.log(`running: overlap: ${overlapBashCmd}`);
        promises.push(new Promise(res=>{
          const child = exec(overlapBashCmd, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing overlap script: ${error}`);
              res();
            }
            if (stderr) {
              console.error(`Overlap Script stderr: ${stderr}`);
              res();
            }
            console.log(`Overlap Script output: ${stdout}`);
            res();
          });

          child.on("disconnect",()=>{
            res();
          });
        }))
      })

      jobInfo.forEach(job=>{
        //-----------RECOVERY SCRIPTS-----------
        recoveryProtiens.forEach(referenceFile=>{
          promises.push(new Promise(res=>{
            const child = exec(`bash ${config.callersRecovereyScripPath} ${job.fileName} ${job.resolution} ${jobID} ${job.tool} ${referenceFile.fileName} ${referenceFile.protein}`, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing script: ${error}`);
                res();
              }
              if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                res();
              }
              console.log(`Script output: ${stdout}`);
              res();
            });
  
            child.on("disconnect",()=>{
              res();
            });
          }))
        })

        //-----------LOOP COUNT RUNNER-----------
        promises.push(new Promise(resolve=>{
          console.log(`running: for loop_size: bash ${config.callersLoopSizeScriptPath} ${job.fileName} ${job.resolution} ${jobID} ${job.tool} ${job.tool}`);
          const child = exec(`bash ${config.callersLoopSizeScriptPath} ${job.fileName} ${job.resolution} ${jobID} ${job.tool} ${job.tool}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing loop_size script: ${error}`);
            }
            if (stderr) {
              console.error(`loop_size Script stderr: ${stderr}`);
            }
            resolve();
            console.log(`loop_size Script output: ${stdout}`);
          })
        }))

        //HIGLASS UPLOADER
        promises.push(new Promise(resolve=>{
          console.log(`running: for converting tools to hitle and uploading to higlass server: bash ${config.higlassUploadPath} ${job.fileName} ${job.resolution} ${jobID} ${job.tool} ${job.tool}`);
          const child = exec(`bash ${config.higlassUploadPath} ${job.fileName} ${job.resolution} ${jobID} ${job.tool}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing script: ${error}`);
            }
            if (stderr) {
              console.error(`Script stderr: ${stderr}`);
            }
            resolve();
            console.log(`Script output: ${stdout}`);
          })
        }))
      })

      await Promise.all(promises);
      job.status = STATUSES.DONE;
      console.log(`Job started running`);
      jobIsRunning=false;


      //email send
      if(job.email){
        //if user provided emial
        var mailOptions = {
          from: config.email,
          to: job.email,
          subject: `Your job, job #${job.rowid} ${config.projectName} has been completed..`,
          text: `you can view the results at: ${config.webPath}/${paths.results}${job.rowid}`
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }


    promises = [];


    try {
      console.log("running rem")
      const pathOut = `${config.dataFolderPath}/job_${jobID}/out`;
      console.log(pathOut)
      const files = fs.readdirSync(pathOut, {recursive:true});
      const recoveryFiles = files.filter(file=>file.includes("Recovery"));
      console.log(recoveryFiles)
      console.log(files)
      console.log(pathOut)
  
      recoveryFiles.forEach(referenceFile=>{

        //REM scripts
        promises.push(new Promise(resolve=>{
          const method = referenceFile.split("_")[2];
          const toolname = referenceFile.split("_")[1];
          const res = referenceFile.split("_")[3];
          const split=referenceFile.split("/")
          referenceFile=split[split.length-1];
          console.log(`running: for rem: bash ${config.callersRemScriptPath} ${referenceFile} ${res} ${jobID} ${toolname} ${toolname}_${method}`);
          const child = exec(`bash ${config.callersRemScriptPath} ${referenceFile} ${res} ${jobID} ${toolname} ${toolname}_${method}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing script: ${error}`);
            }
            if (stderr) {
              console.error(`Script stderr: ${stderr}`);
            }
            resolve();
            console.log(`Script output: ${stdout}`);
          })
        }));

      })
      await Promise.all(promises);
      updateJobStatus(jobID, STATUSES.DONE);
    } catch (error) {
      jobIsRunning=false;
      console.log(error);
    }
    } else {
      console.log('No pending jobs');
    }
    
  } catch (error) {
    jobIsRunning=false;
    console.error('Error executing job:', error);
  }


  
});
