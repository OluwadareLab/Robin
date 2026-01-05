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

#basic pat

fileName="./reference_ctcf"
name="./reference_ctcf_out"

gawk -i inplace '!/^chr/ {print "chr"$0} /^chr/ {print}' $fileName

touch ${fileName}_sort
bedtools sort -i $fileName > ${fileName}_sort

genomeCoverageBed -bg -trackline -trackopts name=${name} -i ${fileName}_sort -g ./hg19.chrom.sizes > ${name}.bedgraph