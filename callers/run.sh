#This file will run all analysis on one file
#provide the file path as the first argument and the resolution as the second and the jobid as the third and tool name as the forth

#!/bin/bash

fileName=$1
resolution=$2
jobId=$3
jobPath=$storagePath\\job_$3
name=$4

touch job.log
echo "running" >> job.log

mkdir -p $jobPath/data/
mkdir -p $jobPath/out/

./callers/h3k27ac/h3k27ac.sh $fileName $resolution $jobId $name &

wait