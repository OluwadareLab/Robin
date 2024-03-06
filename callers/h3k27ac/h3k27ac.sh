#!/bin/bash
cd "$(dirname "$0")"
source ../callers.config.sh

jobId=$3

jobPath=$storagePath\\job_$jobId
outputPath=$storagePath\\job_$jobId\\out
dataPath=$storagePath\\job_$jobId\\data
fileName=$1
name=$4
resolution=$2

#the reference file for 5k input
refFile5K=./referenceFiles/h3k27ac_5k.txt

exec > h3k27ac_recovery.log 2>&1
echo "generating h3k27ac recovery"

echo "generating plots for $name"

Rscript Recovery_HiChIP_Loops.R --RefFile=$refFile5K --InpFile=$dataPath\\$fileName --headerRef FALSE --headerInp FALSE --QcolInp=0 --chrRef TRUE --chrInp TRUE --midRef FALSE --midInp FALSE --binsizeRef=$resolution --binsizeInp=$resolution --offset=50 --OutDir=$outputPath/$name --LabelRef="H3K27ac_$resolution" --LabelInp="$name" &

wait

echo "done generating plots"