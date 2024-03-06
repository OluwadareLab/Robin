#!/bin/bash
cd "$(dirname "$0")"
source ./callers.config.sh

#command line args
fileName=$1
resolution=$2
jobId=$3
name=$4
bigName=$5

#basic paths
jobPath=$storagePath\\job_$jobId
outputPath=$storagePath\\job_$jobId\\out
dataPath=$storagePath\\job_$jobId\\data
logPath=$outputPath\\log
logFile=$logPath\\rem_$bigName.log

#i/o paths

outputDir=$outputPath\\$name

inputFile=$outputDir\\$fileName


touch $logFile



#find last line of file
lastLine=$(tail -1 $inputFile)
echo last line line: $lastLine >> $logFile

maxCount=$(echo "$lastLine" | awk '{print $1}')
maxFrac=$(echo "$lastLine" | awk '{print $2}')

echo "found rem for $name at $resolution" >> $logFile
echo maxCount $maxCount >> $logFile
echo maxFrac $maxFrac >> $logFile


rem=$(python -c "print($maxFrac / float($maxCount))")

outFile=$outputPath\\rem_$bigName.txt
touch $outFile
echo $rem > $outFile

