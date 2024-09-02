// worker.js
import mongoose from 'mongoose';
import { Job } from './models/job.js';
import cron from 'node-cron';
import { STATUSES, maxParralellScripts, minFreeMemOnSystem } from './apiConfig.js';
import { updateJobStatus, getAllJobsWithStatus, getJobStatus, getJobHiglassStatus, updateJobHiglassToggle, getAllJobsWithHiglassStatus } from './mainAPI.js'
import * as nodemailer from 'nodemailer';
import config, { paths } from '../config.mjs';
import { url } from "./mongo.config.js";
import { exec, spawn } from 'child_process';
import * as fs from 'fs'
import { promises } from 'dns';
import process from 'process';
import os from 'os';
import pidusageTree from 'pidusage-tree';
const baseLog = console.log;

/** an array of all children scripts that are being run */
let children = [];

/**  get the free mem on the system in gb */
function getFreeMem() {
  // Get the free memory in bytes
  const freeMemory = os.freemem();

  // Convert free memory to megabytes
  const freeMemoryGB = freeMemory / 1024 / 1024 / 1024;

  return freeMemoryGB;
}

/** the memory usage of this process and all children in GB*/
//this crashes for some reason
function getMemUsedByThisProcess() {
  return 0;
  return new Promise(res => {
    //memory used in bytes of the base process
    let mem = 0;//process.memoryUsage().heapTotal;
    const promises = children.map(child =>
      new Promise((res) => {
        try {
          //if child still running
          if (child.pid) {
            if(!child.killed && child.exitCode == null)
            pidusageTree(child.pid, function (err, stats) {
              if (stats && stats.memory) {
                mem += stats.memory;
                // console.log(stats.memory);
                // console.log(`mem:${mem}bytes total; this:${stats.memory}`)
              }
              res();
            });
          } else {res()};
        } catch (error) {
          console.log(`error fetching mem for child ${child.pid}: ${error}`);
          res();
        };
      }))

    console.log("-------------returning mem--------------------")
    Promise.all(promises).then(() => {
      res(mem / 1000000000);
    })

  })

}

const shortTimeoutOptions = {
  timeout: 60000 * 20, // timeout in milliseconds
};

const medTimeoutOptions = {
  timeout: 60000 * 60, // timeout in milliseconds
};

const highTimeoutOptions = {
  timeout: 60000 * 120, // timeout in milliseconds
};

var transporter = nodemailer.createTransport({
  service: config.emailServer,
  auth: {
    user: config.email,
    pass: config.emailPass
  }
});

/** simple function to get all combos of an array */
function getCombinations(valuesArray) {
  var combi = [];
  var temp = [];
  var slent = Math.pow(2, valuesArray.length);

  for (var i = 0; i < slent; i++) {
    temp = [];
    for (var j = 0; j < valuesArray.length; j++) {
      if ((i & Math.pow(2, j))) {
        temp.push(valuesArray[j]);
      }
    }
    if (temp.length > 0) {
      combi.push(temp);
    }
  }

  combi.sort((a, b) => a.length - b.length);
  return combi;
}

function sendEmailStart(job) {
  //email send
  if (job.email) {
    //if user provided emial
    var mailOptions = {
      from: config.email,
      to: job.email,
      subject: `Your job, job #${job.rowid} ${config.projectName} has been submitted.`,
      text: `you can view the status at: ${config.webPath}/${paths.queue}${job.rowid}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}

function sendEmailEnd(job) {
  //email send
  if (job.email) {
    //if user provided emial
    var mailOptions = {
      from: config.email,
      to: job.email,
      subject: `Your job, job #${job.rowid} ${config.projectName} has been completed..`,
      text: `you can view the results at: ${config.webPath}/${paths.results}${job.rowid}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}


/** handle runnign the cooler upload and deletion jobs */
async function runCoolerUploadJobs() {
  try {
    const pendingCoolerJobs = [...await getAllJobsWithHiglassStatus(4), ...await getAllJobsWithHiglassStatus(5)];

    pendingCoolerJobs.forEach(async (job) => {
      const jobId = job.rowid;
      try {

        console.log(`Executing cooler injestion job: ${job.rowid}`);
        const path = `${config.dataFolderPath}/job_${job.rowid}/data`;
        const files = fs.readdirSync(path);
        console.log(`files in dir ${files}`)
        console.log(files);

        const coolFiles = files.filter(file => file.endsWith(".cool")).map(file => {
          const splitFile = file.split("_")
          return {
            timeUploaded: splitFile[0],
            fileName: file,
          }
        });


        //if this job needs cool file processed
        let higlassStatus = await getJobHiglassStatus(jobId);
        console.log(`job:${jobId} has status: ${higlassStatus}`);
        if (higlassStatus == 4) {
          updateJobHiglassToggle(jobId, 6);

          let coolerPromises = [];
          coolFiles.forEach((coolFile) => {
            coolerPromises.push(injestCoolFile(coolFile.fileName, job));
          })

          Promise.all(coolerPromises).then(() => {
            updateJobHiglassToggle(jobId, 5);
          })
        } else {
          console.log("-----------checking deletion time for cool files----------------")
          console.log(coolFiles);
          //if we need to check if this file needs to be deleted
          coolFiles.forEach((coolFile) => {
            console.log(coolFile)
            const timeDif = Date.now() - parseInt(coolFile.timeUploaded);
            console.log(`job has time diff of: ${timeDif}`);
            if (timeDif > config.timeToStoreCoolerFilesForInMs) {
              console.log(`deleting:${path}/${coolFile.fileName}`)
              fs.unlinkSync(`${path}/${coolFile.fileName}`);
            }
          })
        }
      } catch (error) {
        console.log(`error executing job:${jobId}`)
        console.log(error);
      }
    })

  } catch (error) {
    console.log("error in executing cooler injestion")
    console.log(error);
    jobIsRunning = false
  }
}

/**
 * 
 * @param {{file:File,job:any,protein:string}[]} referenceFilesArr 
 * @param {File[]} chromSizesArr
 * @returns Promise[] 
 */
function injestAllReferenceFiles(referenceFilesArr, chromSizesArr) {
  let promises = [];
  //injest all reference files into higlass
  chromSizesArr.forEach(chromSizeFile => {
    referenceFilesArr.forEach(referenceFile => {
      promises.push(injestReferenceFile(referenceFile, chromSizeFile));
    })
  })
  return promises;
}

mongoose.connect('mongodb://mongodb:27017').catch(error => console.log("mongooseErr:" + error));


/**
 *  find all files that start with reference_ and then parse them accordingly
 * @param {*} files 
 * @returns 
 */
function getRecoveryProtiens(files, job) {
  return files.filter(file => file.startsWith("reference_")).map(file => {
    const splitFile = file.split("_");
    return {
      protein: splitFile[1],
      file: file,
      fileName: file,
      job: job
    }
  });
}

/**
 *  find all files that start with chrom.sizes and parse accordingly
 * @param {*} files 
 */
function getChromSizesFiles(files) {
  return files.filter(file => file.startsWith("chrom.sizes")).map(file => {
    const splitFile = file.split("_")
    return {
      protein: splitFile[1],
      fileName: file,
    }
  });
}
/**
 *  all tool files f
 * @param {*} files 
 */
function getAllToolData(files) {
  return files.filter(file => !file.startsWith("reference_") && !file.startsWith("chrom.sizes") && !file.endsWith(".cool")).map(file => {
    const splitFile = file.split("_")
    return {
      resolution: parseInt(splitFile[1]),
      tool: splitFile[0],
      fileName: file,
    }
  });
}

/**
 *  
 * @param {*} jobsGroupedByResolution 
 * @returns 
 */
function getCombinationsArrayFromjob(jobInfo) {
  let jobsGroupedByResolution = {};
  jobInfo.forEach(job => {
    if (!jobsGroupedByResolution[job.resolution]) jobsGroupedByResolution[job.resolution] = []
    jobsGroupedByResolution[job.resolution].push(job)
  });

  //all valid combinations for venn diagram displays
  let combinationsArray = [];
  Object.keys(jobsGroupedByResolution).forEach(resolution => {
    let jobsWithThisResolution = jobsGroupedByResolution[resolution];
    let jobFilenames = jobsWithThisResolution.map(job => job.fileName)
    let combinationsOfThisResolutionFilenames = getCombinations(jobFilenames);
    //no combinations of 1 item and no greater than 3
    let validCombinations = combinationsOfThisResolutionFilenames.filter(arr => arr.length > 1).filter(arr => arr.length <= 3);
    //merge arrs
    combinationsArray = [...combinationsArray, ...validCombinations]
  })

  return combinationsArray
}

/**
 *  injest a reference file into higlass
 * @param {*} referenceFile 
 * @param {*} chromSizes 
 * @returns promise for script to complete
 */
function injestReferenceFile(referenceFile, chromSizes) {
  let job = referenceFile.job;
  let fileName = referenceFile.file;
  console.log(chromSizes);
  console.log(referenceFile);
  console.log(fileName);
  let script = `bash ${config.callersHiglassReferenceInjestScript} ${fileName} ${job.rowid} ${referenceFile.protein} ${chromSizes.fileName} ${chromSizes.fileName.split(".").pop()}`;
  return (runChildScript(script, "injest reference file", highTimeoutOptions));
}

/**
 *  injest a .cool file into higlass
 * @param {*} coolFile 
 * @param {*} job the job this cool file is for
 * @returns promise for script to complete
 */
function injestCoolFile(coolFileName, job) {
  let fileName = coolFileName;
  let script = `bash ${config.callersHiglassCoolerInjestScript} ${fileName} ${job.rowid} ${referenceFile.protein} ${chromSizes.fileName} ${chromSizes.fileName.split(".").pop()}`;
  return (runChildScript(script, "injest reference file"));
}


let jobIsRunning = false;

/** an array of functions that will return a promise to run their script */
let scriptBacklog = [];
/** a counter for all currently active scripts */
let numberOfActiveScripts = 0;

function addChildScriptToQueue(script, name, options = shortTimeoutOptions) {
  const numberOfActiveScripts = getNumberOfActiveScriptsInQueue();
  if (numberOfActiveScripts < maxParralellScripts) {
    console.log(`activeScripts:${numberOfActiveScripts}; maxActiveScripts:${maxParralellScripts} script backlog:${scriptBacklog.length} thus running`)
    return runChildScript(script, name, options);
  } else {
    return new Promise((res) => {
      console.log(`activeScripts:${numberOfActiveScripts}; maxActiveScripts:${maxParralellScripts} script backlog:${scriptBacklog.length} thus adding to backlog`)
      scriptBacklog.push((() => {
        let childScriptPromise = runChildScript(script, name, options).then(res());
        return childScriptPromise;
      }));
    })

  }
}

/**
 *  a simple script to run a child script in bash and catch/log errors
 * @param {*} script the script to run
 * @param {*} name a descriptive name to print to console for info
 * @param {options obj from exec} options optional options for changing timeout
 */
export function runChildScript(script, name, options = shortTimeoutOptions) {
  return new Promise(res => {
    console.log(`running: ${name} with script: ${script}`)
    numberOfActiveScripts++;
    const child = exec(script, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${name}: ${error}`);
        res();
      }
      if (stderr) {
        console.error(`${name} stderr: ${stderr}`);
        res();
      }
      console.log(`${name} output: ${stdout}`);
      numberOfActiveScripts--;
      //then to speed up stuff a bit check immidietly if we need to run another
      scriptWorker();
      res();
    });
    children.push(child);
  })
}

function getNumberOfActiveScriptsInQueue() {
  return numberOfActiveScripts;
}

/**
 *  this runs once every second to check for scripts that need to be ran
 * @param {{script:string,name:string}} scriptObj 
 */
export async function scriptWorker() {
  //if not enough free mem wait
  if(getFreeMem()<minFreeMemOnSystem)return;
  const numberOfActiveScripts = getNumberOfActiveScriptsInQueue();
  if (scriptBacklog.length == 0) {
    //console.log(`No scripts in backlog`)
    return;
  }
  if (numberOfActiveScripts < maxParralellScripts) {
    console.log(`activeScripts:${numberOfActiveScripts}; maxActiveScripts:${maxParralellScripts} script backlog:${scriptBacklog.length} --thus running from backlog`)
    let script = scriptBacklog.pop();
    if (script) {
      script();
    }
  } else {
    //dont do anything, wait till a script finishes running
    console.log(`activeScripts:${numberOfActiveScripts}; maxActiveScripts:${maxParralellScripts} script backlog:${scriptBacklog.length} ->thus, waiting.`)
  }
}

/**
 *  called once every min checking for new jobs to start if one is not already running
 */
async function jobWorker() {
  let recoveryProtiens;
  let chromSizes;
  let jobID;

  try {
    console.log("trying to find pending jobs")
    const pendingJobs = [...await getAllJobsWithStatus(STATUSES.HAS_DATA_IN_QUE_WAITING), ...await getAllJobsWithStatus(STATUSES.RUNNING)];
    console.log("found pending jobs")
    console.log(pendingJobs);
    if (pendingJobs.length > 0 && !jobIsRunning) {


      jobIsRunning = true;
      const job = pendingJobs[0];
      jobID = job.rowid;

      //if job id as not defined cancel
      if (!jobID) return;

      //cancel if job is not waiting in que
      console.log("----checking job status-----");
      const jobStatus = await getJobStatus(jobID);
      console.log(`jobStatus:${jobStatus}`);
      console.log(`jobStatus is inQueue:${jobStatus === STATUSES.HAS_DATA_IN_QUE_WAITING}`);
      if (jobStatus === STATUSES.HAS_DATA_IN_QUE_WAITING) {
        updateJobStatus(jobID, STATUSES.RUNNING);
        var date = new Date();
        let dateSubmitted = Date.parse(job.date);
        if (Date.now() - dateSubmitted > config.maxjobage) {
          if (jobID)
            updateJobStatus(jobID, STATUSES.FAIL);
          return;
        }
      } else {
        return;
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

      //all the tool data
      const jobInfo = getAllToolData(files);

      //all the protien reference files
      recoveryProtiens = getRecoveryProtiens(files, job);

      //all the chrom sizes files files
      chromSizes = getChromSizesFiles(files);

      jobInfo.forEach(job => {
        //create all folders
        fs.mkdirSync(`${config.dataFolderPath}/job_${jobID}/out/${job.tool}/`, { recursive: true });
      });

      //all promises that need to resolve before job is done
      let promises = [];
      //the promises to get recovery scripts done used to make sure rem waits for it
      let recoveryScriptPromises = [];

      //----------HIGLASS INJESTION---------
      //reference files
      //since this is heavy, only run if user enabled higlass
      if (getJobHiglassStatus(jobID)) {
        Promise.all(injestAllReferenceFiles(recoveryProtiens, chromSizes)).then(() => {
          updateJobHiglassToggle(jobID, 2)
        });
      }

      //OVERLAP RUNNER
      let combinationsArray = getCombinationsArrayFromjob(jobInfo);

      //-----------OVERLAP CALLER-----------
      //now that we have the combinations in nested arrays, we can flatten them down into the strings we need to run the commands
      combinationsArray.forEach(combo => {
        //example script call: vennCaller.sh "lasca_5000.txt:mustache_5000.tsv:hicexplorer_5000.bedgraph" 5000 8 lasca:mustache:hicexplorer4
        //vennCaller.sh $fileList $resolution $jobid $labelList

        let fileList = combo.join(":");
        let resolution = parseInt(combo[0].split("_")[1]);
        let labelsList = combo.map(e => e.split(".")[0]).join(":");
        let overlapBashCmd = `bash ${config.callersOverlapScriptPath} ${fileList} ${resolution} ${jobID} ${labelsList}`;

        console.log(`running: overlap: ${overlapBashCmd}`);
        promises.push(addChildScriptToQueue(overlapBashCmd, "overlap script", medTimeoutOptions));
      });

      jobInfo.forEach(job => {
        //-----------RECOVERY SCRIPTS-----------
        recoveryProtiens.forEach(referenceFile => {
          const recoveryProtienScript = `bash ${config.callersRecovereyScripPath} ${job.fileName} ${job.resolution} ${jobID} ${job.tool} ${referenceFile.fileName} ${referenceFile.protein}`
          recoveryScriptPromises.push(runChildScript(recoveryProtienScript, "recovery script"));
        })

        //merge the promises with recovery promises script arrs
        promises = [...promises, ...recoveryScriptPromises]

        //-----------LOOP COUNT RUNNER-----------
        const loopSizeScript = `bash ${config.callersLoopSizeScriptPath} ${job.fileName} ${job.resolution} ${jobID} ${job.tool} ${job.tool}`;
        promises.push(addChildScriptToQueue(loopSizeScript, "loop size script"));

        //-----------HIGLASS UPLOADER-----------
        const higlassScript = `bash ${config.higlassUploadPath} ${job.fileName} ${job.resolution} ${jobID} ${job.tool}`;
        promises.push(addChildScriptToQueue(higlassScript, "higlass script script", medTimeoutOptions))
      })

      //wait to run rem untill all recovery scritps are done
      await Promise.all(recoveryScriptPromises);

      //then run rem
      try {
        console.log("running rem")
        const pathOut = `${config.dataFolderPath}/job_${jobID}/out`;
        // console.log(pathOut)
        const files = fs.readdirSync(pathOut, { recursive: true });
        const recoveryFiles = files.filter(file => file.includes("Recovery"));
        // console.log(recoveryFiles)
        // console.log(files)
        // console.log(pathOut)

        console.log('----------------------here----------------------------')
        console.log(files)
        console.log(recoveryFiles)
        recoveryFiles.forEach(referenceFile => {

          //REM scripts
          promises.push(new Promise(resolve => {
            const method = referenceFile.split("_")[2];
            const toolname = referenceFile.split("_")[1];
            const res = referenceFile.split("_")[3];
            const split = referenceFile.split("/")
            referenceFile = split[split.length - 1];
            console.log(`running: for rem: bash ${config.callersRemScriptPath} ${referenceFile} ${res} ${jobID} ${toolname} ${toolname}_${method}`);
            const remScript = `bash ${config.callersRemScriptPath} ${referenceFile} ${res} ${jobID} ${toolname} ${toolname}_${method}`;
            addChildScriptToQueue(remScript, "rem script").then(() => resolve())
          }));

        })

        await Promise.all(promises);

        if (jobID) updateJobStatus(jobID, STATUSES.DONE);

      } catch (error) {
        jobIsRunning = false;
        if (jobID) updateJobStatus(jobID, STATUSES.FAIL);
        console.log(error);
      }
    } else {
      jobIsRunning = false
      if (jobID) updateJobStatus(jobID, STATUSES.FAIL);
      console.log('No pending jobs');
    }

  } catch (error) {
    jobIsRunning = false;
    if (jobID) updateJobStatus(jobID, STATUSES.FAIL);
    console.error('Error executing job:', error);
  }

  //handle cooler uploads
  if (config.allowCoolerUploads) runCoolerUploadJobs();

  jobIsRunning = false



}

//this cron job handles running our scripts in the queue of scripts to make sure we never overwhelm the server even if we
//have a ton of scripts to run for one job
cron.schedule('* * * * *', () => {
  // Run the task every one second for one minute
  const interval = setInterval(async () => {
    //console.log(`this process and children have used ${await getMemUsedByThisProcess()}gb, and there is ${getFreeMem()}GB free on the server;`)
    await scriptWorker();
  }, 1000);

  // Clear the interval after one minute
  setTimeout(() => {
    clearInterval(interval);
  }, 60000);
});


// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
  await jobWorker();
});
