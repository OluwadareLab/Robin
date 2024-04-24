// worker.js
import mongoose from 'mongoose';
import { Job } from './models/job.js';
import cron from 'node-cron';
import { STATUSES } from './apiConfig.js';
import {updateJobStatus} from './mainAPI.js'
import * as nodemailer from 'nodemailer';
import config, { paths } from '../config.mjs';
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



mongoose.createConnection('mongodb://localhost:27017/jobQueue')
mongoose.connect('mongodb://localhost:27017/jobQueue');

let jobIsRunning = false;
// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
  let recoveryProtiens;
  let jobID;
  try {
    console.log("trying to find pending jobs")
    const pendingJobs = await Job.find({ status: STATUSES.HAS_DATA_IN_QUE_WAITING });
    console.log("found pending jobs")
    console.log(pendingJobs);
    if (pendingJobs.length > 0 && !jobIsRunning) {
      jobIsRunning=true;
      const job = pendingJobs[0];
      jobID = job.id;
      //email send
      if(job.email){
        //if user provided emial
        var mailOptions = {
          from: config.email,
          to: job.email,
          subject: `Your job, job #${job.id} ${config.projectName} has been submitted.`,
          text: `you can view the status at: ${config.webPath}/${paths.queue}${job.id}`
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
      console.log(`Executing job: ${job.id}`);
      
      const path = `${config.dataFolderPath}/job_${job.id}/data`;
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
        fs.mkdirSync(`${path}/out/${job.tool}/`, { recursive: true });
      });

      let promises = [];
      jobInfo.forEach(job=>{
        //run recovery scrips
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

        //run loop count scripts
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
      await job.save();
      console.log(`Job started running`);
      jobIsRunning=false;


      //email send
      if(job.email){
        //if user provided emial
        var mailOptions = {
          from: config.email,
          to: job.email,
          subject: `Your job, job #${job.id} ${config.projectName} has been completed..`,
          text: `you can view the results at: ${config.webPath}/${paths.results}${job.id}`
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
      console.log(error);
    }
    } else {
      console.log('No pending jobs');
    }
    
  } catch (error) {
    console.error('Error executing job:', error);
  }


  
});
