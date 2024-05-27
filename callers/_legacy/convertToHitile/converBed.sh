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
# gawk -i inplace '!/^chr/ {print "chr"$0} /^chr/ {print}' $inputFile
# #for multires mabye?
# gawk -i inplace '{ if ($4 !~ /^chr/) $4 = "chr" $4; print }' $inputFile

clodius aggregate bedfile \
    --max-per-tile 20 --importance-column 5 \
    --assembly hg19 \
    --output-file $storagePath/higlassTempData/$fileName.beddb \
    $inputFile

docker exec robin_comprehensiveloopcaller-higlass-1 python higlass-server/manage.py \
  ingest_tileset \
  --filename /tmp/$fileName.beddb \
  --filetype beddb \
  --datatype gene-annotation \
  --coordSystem hg19 \
  --name "test from bedtools conversion"