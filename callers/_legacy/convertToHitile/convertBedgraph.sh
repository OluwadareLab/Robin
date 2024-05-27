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
inputFile="./reference_ctcf_out.bedgraph"
outputDir=$outputPath/$name

#add back chr to the start of the chromozone columns in the files if they don't have it already.
gawk -i inplace '!/^chr/ {print "chr"$0} /^chr/ {print}' $inputFile
#for multires mabye?
#gawk -i inplace '{ if ($4 !~ /^chr/) $4 = "chr" $4; print }' $inputFile

start=`date +%s`
# clodius aggregate bedgraph $inputFile \
# --output-file $storagePath/higlassTempData/$fileName.hitile \
# --assembly hg19

# end=`date +%s`

# runtimeClod=$((end-start))
# echo "$runtimeClod" >> log.txt

start=`date +%s`

docker exec robin_comprehensiveloopcaller-higlass-1 python higlass-server/manage.py \
ingest_tileset --filename /tmp/$fileName.hitile  \
--filetype hitile --datatype vector \
--name "test with bedgraph from bedTOols"

end=`date +%s`

runtimeHiglass=$((end-start))
echo "$runtimeHiglass" >> log.txt