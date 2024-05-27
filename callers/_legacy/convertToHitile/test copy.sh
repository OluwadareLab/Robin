#!/bin/bash
cd "$(dirname "$0")"
source ../callers.config.sh

#command line args
fileName=$1
resolution=$2
jobId=$3
name=$4
chromFileName=$5

#basic paths
jobPath=$storagePath/job_$jobId
outputPath=$storagePath/job_$jobId/out
dataPath=$storagePath/job_$jobId/data
higlassTempDataPath=$storagePath/higlassTempData/

chromSizesFilePath=$dataPath/$chromFileName

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

tempUpdatedFile=$dataPath/_$fileName
tempUpdatedFileSorted=$dataPath/_$fileName
tempConvertedToBedgraphFile=$dataPath/$outfile.bedgraph

#add back chr to the start of the chromozone columns in the files if they don't have it already.
gawk '!/^chr/ {print "chr"$0} /^chr/ {print}' $inputFile > $tempUpdatedFile

touch $tempUpdatedFileSorted
bedtools sort -i $tempUpdatedFile > $tempUpdatedFileSorted

genomeCoverageBed -bg -trackline -trackopts name=${name} -i $tempUpdatedFileSorted -g $chromSizesFilePath > $tempConvertedToBedgraphFile

rm $tempUpdatedFile
rm $tempUpdatedFileSorted
mv $tempConvertedToBedgraphFile $higlassTempDataPath/$outfile.bedgraph

curl -u admin:admin \
    -F "datafile=@/$higlassTempDataPath/$outfile" \
    -F 'filetype=bedgraph' \
    -F 'datatype=hitile' \
    -F "name=$higlassName" \
    -F "uid=$uid" \
    -F 'coordSystem=mm10' \
    http://higlass:80/api/v1/tilesets/

echo "line:$uid" >> $idLoggingFile