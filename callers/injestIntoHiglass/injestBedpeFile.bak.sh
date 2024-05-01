#!/bin/bash
cd "$(dirname "$0")"
source ../callers.config.sh

#command line args
fileName=$1
resolution=$2
jobId=$3
name=$4

#basic paths
jobPath=$storagePath/job_$jobId
outputPath=$storagePath/job_$jobId/out
dataPath=$storagePath/job_$jobId/data
higlassTempDataPath=$storagePath/higlassTempData/

idLoggingFile=$outputPath/higlassIds.txt

#i/o paths
inputFile=$dataPath/$fileName
outputDir=$outputPath/$name

inFile=$inputFile
outfile=job_${jobId}_$fileName

uid=Job_${jobId}_${name}_${resolution}
higlassName=Job_${jobId}_${name}_at_${resolution}b_resolution

touch $idLoggingFile

echo $idLoggingFile

#add back chr to the start of the chromozone columns in the files if they don't have it already.
gawk -i inplace '!/^chr/ {print "chr"$0} /^chr/ {print}' $inputFile
#for multires mabye?
gawk -i inplace '{ if ($4 !~ /^chr/) $4 = "chr" $4; print }' $inputFile

clodius aggregate bedpe \
	--assembly hg19 \
	--chr1-col 1 --from1-col 2 --to1-col 3 \
	--chr2-col 4 --from2-col 5 --to2-col 6 \
	--output-file ./$outfile \
	$inFile

mv $outfile $higlassTempDataPath/$outfile

docker exec higlass-server-for-robin python higlass-server/manage.py \
  ingest_tileset \
  --filename /tmp/$outfile\
  --filetype bed2ddb \
  --datatype 2d-rectangle-domains \
  --name $higlassName  \
  --uid $uid

echo "linear-2d-rectangle-domains:$uid" >> $idLoggingFile