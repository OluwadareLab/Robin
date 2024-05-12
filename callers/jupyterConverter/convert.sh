#!/bin/bash
cd "$(dirname "$0")"
source ../callers.config.sh

#command line args
fileName=$1
jobId=$2

#basic paths
jobPath=$storagePath/job_$jobId
outputPath=$storagePath/job_$jobId/out
dataPath=$storagePath/job_$jobId/jupyter 
logPath=$storagePath/job_$jobId/log
logFile=$logPath/jyupter_${fileName}.log

mkdir -p $logPath
mkdir -p $dataPath

touch $logFile
exec > $logFile 2>&1

echo "converting jyupterbook to html"

jupyter nbconvert --execute --to html $dataPath/$fileName

echo "dpne converting jyupterbook to html"
