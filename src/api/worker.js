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
  try {
    console.log("trying to find pending jobs")
    const pendingJobs = await Job.find({ status: STATUSES.HAS_DATA_IN_QUE_WAITING });
    console.log("found pending jobs")
    console.log(pendingJobs);
    if (pendingJobs.length > 0 && !jobIsRunning) {
      jobIsRunning=true;
      const job = pendingJobs[0];
      const jobID = job.id;
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

      const jobInfo = files.map(file=>{
        const splitFile = file.split("_")
        return {
          resolution: parseInt(splitFile[1]),
          tool: splitFile[0],
          fileName:file,
        }
      })

      jobInfo.forEach(job=>{
        exec(`bash ${config.callersScriptPath} ${job.fileName} ${job.resolution} ${jobID} ${job.tool}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing script: ${error}`);
            return;
          }
          if (stderr) {
            console.error(`Script stderr: ${stderr}`);
            return;
          }
          console.log(`Script output: ${stdout}`);
        });
      })

      
      

      job.status = STATUSES.DONE;
      await job.save();
      console.log(`Job completed: ${job.task}`);
      updateJobStatus(job.id, STATUSES.DONE)
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
    } else {
      console.log('No pending jobs');
    }
  } catch (error) {
    console.error('Error executing job:', error);
  }
});
