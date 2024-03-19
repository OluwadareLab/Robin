#!/bin/bash
cd "$(dirname "$0")"
source ../callers.config.sh

#command line args
fileName=$1
resolution=$2
jobId=$3
name=$4
refFile=$5
protienName=$6

#basic paths
jobPath=$storagePath/job_$jobId
outputPath=$storagePath/job_$jobId/out
dataPath=$storagePath/job_$jobId/data
logPath=$storagePath/job_$jobId/log

#i/o paths
inputFile=$dataPath/$fileName
outputDir=$outputPath/$name

mkdir -p $dataPath
mkdir -p $outputPath
mkdir -p $logPath

touch $logPath/${name}_${protienName}_recovery.log
exec > $logPath/${name}_${protienName}_recovery.log 2>&1
echo "generating h3k27ac recovery for $name"

echo "generating plots for $name" with  reference: $refFile
Rscript Recovery_HiChIP_Loops.R --RefFile=$dataPath/$refFile --InpFile=$inputFile --headerRef FALSE --headerInp FALSE --QcolInp=0 --chrRef TRUE --chrInp TRUE --midRef FALSE --midInp FALSE --binsizeRef=$resolution --binsizeInp=$resolution --offset=50 --OutDir=$outputDir --LabelRef="${protienName}_$resolution" --LabelInp="$name"

echo "done generating plots"