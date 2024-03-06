#This file will run all analysis on one file
#provide the file path as the first argument and the resolution as the second and the jobid as the third and tool name as the forth

#!/bin/bash
cd "$(dirname "$0")"
source ./callers.config.sh

#command line args
fileName=$1
resolution=$2
jobId=$3
name=$4

#basic paths
jobPath=$storagePath\\job_$jobId
outputPath=$storagePath\\job_$jobId\\out
dataPath=$storagePath\\job_$jobId\\data

#i/o paths
inputFile=$dataPath\\$fileName
outputDir=$outputPath\\$name
logPath=$outputPath\\log
logFile=$logPath\\run.log
mkdir -p $logPath


touch $logFile
echo "begin log" > $logFile
echo "Running on job_$jobId" >> $logFile

mkdir -p $jobPath/data/
mkdir -p $jobPath/out/


# #plot all recovery methods
./h3k27ac/h3k27ac.sh $fileName $resolution $jobId $name &
./RNAPii/rnapii.sh $fileName $resolution $jobId $name &
./ctcf/ctcf.sh $fileName $resolution $jobId $name &
wait

#find all files
h3k27acOut=$(ls -R $outputPath | grep -i h3k.*${resolution}_)
rnapiiOut=$(ls -R $outputPath | grep -i rnapii.*${resolution}_)
ctcfOut=$(ls -R $outputPath | grep -i ctcf.*${resolution}_)

echo h3k27ac done: $h3k27acOut >> $logFile
echo rnapii done: $rnapiiOut >> $logFile
echo ctcf done: $ctcfOut >> $logFile

#Find REM values

./rem.sh $h3k27acOut $resolution $jobId ${name} ${name}_h3k27ac &
./rem.sh $rnapiiOut $resolution $jobId ${name} ${name}_rnapii &
./rem.sh $ctcfOut $resolution $jobId ${name} ${name}_ctcf &
wait

echo rem done: $ctcfOut >> $logFile