#!/bin/bash
cd "$(dirname "$0")"
source ../callers.config.sh

#command line args
fileName=$1
resolution=$2
jobId=$3
name=$4
bigName=$5

#basic paths
jobPath=$storagePath/job_$jobId
outputPath=$storagePath/job_$jobId/out
dataPath=$storagePath/job_$jobId/data
logPath=$storagePath/job_$jobId/log
logFile=$logPath/loop_size_$bigName.log

#i/o paths
outputDir=$outputPath/$name
outFile=$outputPath/$name/loopsize_${bigName}_noMethodProvided_${resolution}_.size
inputFile=$dataPath/$fileName

mkdir -p $outputPath/$name/

touch $outFile

touch $logFile
exec > $logFile 2>&1
echo "generating h3k27ac recovery for $name"

python ./loop_size.py $inputFile $outFile $resolution