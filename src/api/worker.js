// worker.js
import mongoose from 'mongoose';
import { Job } from './models/job.js';
import cron from 'node-cron';
import { STATUSES } from './apiConfig.js';
import {updateJobStatus} from './mainAPI.js'
import * as nodemailer from 'nodemailer';
import config, { paths } from '../config.mjs';

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

      console.log(`Executing job: ${job.task}`);
      // Your task execution logic here
      // For example, you can execute Python scripts using child_process.exec or similar methods
      // Once the task is completed, update the job status to 'completed'
      job.status = STATUSES.DONE;
      await job.save();
      console.log(`Job completed: ${job.task}`);
      updateJobStatus(job.id, STATUSES.DONE)
      jobIsRunning=false;

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
