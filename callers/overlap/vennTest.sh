#!/bin/bash
cd "$(dirname "$0")"
source ./callers.config.sh

# exec > venn.log 2>&1
echo "generating venn plots"

#LASCA
echo "generating lasca plots"
Rscript Venn_Interactions.r --FileList="./testData/lasca_5000.txt":"./testData/mustache_5000.tsv":"./testData/hicexplorer_5000.bedgraph" --HeaderList=0:0:0 --Labels="Lasca_5000:mustache_5000:hicexplorer_5000" --offset=50 --OutDir="lasca.chr1.5k.venn"
echo "ending lasca plots"
