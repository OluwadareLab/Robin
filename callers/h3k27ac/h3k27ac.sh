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
outputDir=$outputPath\\$name

#the reference file for 5k input
refFile5K=./referenceFiles/h3k27ac_5k.txt

exec > h3k27ac_recovery.log 2>&1
echo "generating h3k27ac recovery for $name"

echo "generating plots for $name"
Rscript Recovery_HiChIP_Loops.R --RefFile=$refFile5K --InpFile=$inputFile --headerRef FALSE --headerInp FALSE --QcolInp=0 --chrRef TRUE --chrInp TRUE --midRef FALSE --midInp FALSE --binsizeRef=$resolution --binsizeInp=$resolution --offset=50 --OutDir=$outputDir --LabelRef="H3K27ac_$resolution" --LabelInp="$name"

echo "done generating plots"