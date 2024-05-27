#!/bin/bash
cd "$(dirname "$0")"
source ../callers.config.sh

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
outputDir=$outputPath/$name

#the reference file for 5k input
refFile5K=./referenceFiles/GSM1872886_GM12878_RNAPII.txt

exec > RNAPII_recovery.log 2>&1
echo "generating RNAPII recovery for $name"

echo "generating $name plots"
Rscript Recovery_HiChIP_Loops.R --RefFile=$refFile5K --InpFile=$inputFile --headerRef FALSE --headerInp FALSE --QcolInp=0 --chrRef TRUE --chrInp TRUE --midRef FALSE --midInp FALSE --binsizeRef=$resolution --binsizeInp=$resolution --offset=50 --OutDir=$outputDir --LabelRef="RNAPII_$resolution" --LabelInp="$name" &
wait
