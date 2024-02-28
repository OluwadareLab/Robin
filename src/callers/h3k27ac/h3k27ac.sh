#!/bin/bash
source ../callers.config.sh

jobPath=$storagePath/example_job/
fileName=lasca_5000.txt
name=lascaTest
resolution=5000

#the reference file for 5k input
refFile5K=./referenceFiles/h3k27ac_5k.txt

exec > h3k27ac_recovery.log 2>&1
echo "generating h3k27ac recovery"

echo "generating plots for $name"
Rscript Recovery_HiChIP_Loops.R --RefFile=$refFile5K --InpFile=$jobPath/$fileName --headerRef FALSE --headerInp FALSE --QcolInp=0 --chrRef TRUE --chrInp TRUE --midRef FALSE --midInp FALSE --binsizeRef=$resolution --binsizeInp=$resolution --offset=50 --OutDir=$jobPath/$name --LabelRef="H3K27ac" --LabelInp="$name" &
