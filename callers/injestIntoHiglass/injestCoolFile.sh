#!/bin/bash
cd "$(dirname "$0")"
source ../callers.config.sh

#command line args
fileName=$1
jobId=$2
name=$3
chromFileName=$4
assembly=$5 #e.g: "hg19"

#basic paths
jobPath=$storagePath/job_$jobId
outputPath=$storagePath/job_$jobId/out
dataPath=$storagePath/job_$jobId/data
higlassTempDataPath=$storagePath/higlassTempData/
logPath=$storagePath/job_$jobId/log
logFile=$logPath/referenceHiglassInjest_${name}_${assembly}.log

mkdir -p $logPath

touch $logFile
exec > $logFile 2>&1

echo "starting conversion and injestion of $name with assembly $assembly"

chromSizesFilePath=$dataPath/$chromFileName

idLoggingFile=$outputPath/higlassIds.txt

#i/o paths
inputFile=$dataPath/$fileName
outputDir=$outputPath/$name

inFile=$inputFile
outfile=job_${jobId}_$fileName

uid=Job_${jobId}_${name}_ref
higlassName=Job_${jobId}_${name}_reference

touch $idLoggingFile

echo $idLoggingFile

tempUpdatedFile=$dataPath/_$fileName
tempUpdatedFileSorted=$dataPath/_${fileName}_sorted
tempConvertedToBedgraphFile=$dataPath/$outfile.bedgraph
convertedToHitileFile=$dataPath/$outfile.hitile

# #add back chr to the start of the chromozone columns in the files if they don't have it already.
gawk '!/^chr/ {print "chr"$0} /^chr/ {print}' $inputFile > $tempUpdatedFile

echo "gawk ran and added chr to the start of all lines that did not start with it"

touch $tempUpdatedFileSorted
bedtools sort -i $tempUpdatedFile > $tempUpdatedFileSorted

echo "reference file copied and sorted"

genomeCoverageBed -bg -trackline -trackopts name=${name} -i $tempUpdatedFileSorted -g $chromSizesFilePath > $tempConvertedToBedgraphFile

wait

echo "reference file converted to bedgraph"

gawk -i inplace 'NR > 1' $tempConvertedToBedgraphFile

echo "removed headers of bedgraph file"

wait

echo "clodius conversion started"

wait

clodius aggregate bedgraph $tempConvertedToBedgraphFile --output-file $convertedToHitileFile --assembly $assembly

echo "clodius conversion ended"

echo "cleaning up temp files"

wait

# rm $tempUpdatedFile
# rm $tempUpdatedFileSorted
# rm $tempConvertedToBedgraphFile

echo "copying hitile file to higlass path"
cp $convertedToHitileFile $higlassTempDataPath/$outfile.hitile

echo "api requesting to injest higlass file"
curl -u admin:admin \
    -F "datafile=@/$higlassTempDataPath/$outfile.hitile" \
    -F 'datatype=vector' \
    -F 'filetype=hitile' \
    -F "name=$higlassName" \
    -F "uid=$uid" \
    -F 'coordSystem=mm10' \
    http://higlass:80/api/v1/tilesets/


echo "line:$uid" >> $idLoggingFile

echo "done"