this folder contains all callers and alaylsis methods /visualization that is run for the jobs

# Dependancies list

## R dependancies

### GenomicRanges
if (!require("BiocManager", quietly = TRUE))
    install.packages("BiocManager")
BiocManager::install("GenomicRanges")

### data.table
install.packages("data.table")

### optparse
install.packages("optparse")