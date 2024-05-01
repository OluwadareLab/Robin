#!/bin/bash
cd "$(dirname "$0")"
source ../callers.config.sh

#command line args

#a list of files seperated by ':'' IE: "lasca_5000.txt":"mustache_5000.tsv":"hicexplorer_5000.bedgraph" --HeaderList=0:0:0 --Labels="Lasca_5000":"mustache_5000":"hicexplorer_5000"
fileList=$1

resolution=$2
jobId=$3
labelsList=$4

#basic paths
jobPath=$storagePath/job_$jobId
outputPath=$storagePath/job_$jobId/out/venn/$resolution/$labelsList/
dataPath=$storagePath/job_$jobId/data
logPath=$storagePath/job_$jobId/log/venn/

#i/o paths
inputFile=$dataPath/$fileName
outputDir=$outputPath/

mkdir -p $dataPath
mkdir -p $outputPath
mkdir -p $logPath

touch $logPath/${labelsList}_${resolution}_venn.log
exec > $logPath/${labelsList}_${resolution}_venn.log 2>&1

echo "updating fileSet string to use absulute path of job"
fileList=$(./addBaseUrlToFileSetString.sh "$fileList" "$dataPath/")
echo "new fileList: $fileList"

echo "generating venn plots"
echo "generating $labelsList plots"
Rscript Venn_Interactions.r --FileList=$fileList --HeaderList=0:0:0 --Labels=$labelsList --offset=50 --OutDir=$outputPath
echo "ending $labelsList plots"


echo "deleting interaction's files to save space since they are no longer needed..."


if [ -f "${outputPath}Master_Interactions_Unique.bed" ]; then
    rm "${outputPath}Master_Interactions_Unique.bed"
fi

if [ -f "${outputPath}Master_Interactions.bed" ]; then
    rm "${outputPath}Master_Interactions.bed"
fi