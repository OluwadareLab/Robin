import React, { useEffect } from 'react';
import { ChromosomeInfo, viewer, version } from 'higlass';
import 'higlass/dist/hglib.css';

export const HiGlassComponent = () => {
  useEffect(() => {
    // Initialize HiGlass
    const container = document.getElementById('higlass-container');
    const config = {"editable": true, "zoomFixed": false, "trackSourceServers": ["//higlass.io/api/v1", "https://resgen.io/api/v1/gt/paper-data"], "exportViewUrl": "/api/v1/viewconfs", "views": [{"uid": "aa", "initialXDomain": [0, 3100000000], "autocompleteSource": "/api/v1/suggest/?d=OHJakQICQD6gTD7skx4EWA&", "genomePositionSearchBox": {"autocompleteServer": "//higlass.io/api/v1", "autocompleteId": "OHJakQICQD6gTD7skx4EWA", "chromInfoServer": "//higlass.io/api/v1", "chromInfoId": "hg19", "visible": true}, "chromInfoPath": "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv", "tracks": {"top": [{"type": "horizontal-gene-annotations", "height": 60, "tilesetUid": "OHJakQICQD6gTD7skx4EWA", "server": "//higlass.io/api/v1", "position": "top", "uid": "OHJakQICQD6gTD7skx4EWA", "name": "Gene Annotations (hg19)", "options": {"name": "Gene Annotations (hg19)"}, "maxWidth": 4294967296, "maxZoom": 22}, {"chromInfoPath": "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv", "type": "horizontal-chromosome-labels", "position": "top", "name": "Chromosome Labels (hg19)", "height": 30, "uid": "X4e_1DKiQHmyghDa6lLMVA", "options": {}}], "left": [{"type": "vertical-gene-annotations", "width": 60, "tilesetUid": "OHJakQICQD6gTD7skx4EWA", "server": "//higlass.io/api/v1", "position": "left", "name": "Gene Annotations (hg19)", "options": {"labelPosition": "bottomRight", "name": "Gene Annotations (hg19)"}, "uid": "dqBTMH78Rn6DeSyDBoAEXw", "maxWidth": 4294967296, "maxZoom": 22}, {"chromInfoPath": "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv", "type": "vertical-chromosome-labels", "position": "left", "name": "Chromosome Labels (hg19)", "width": 30, "uid": "RHdQK4IRQ7yJeDmKWb7Pcg", "options": {}}], "center": [{"uid": "c1", "type": "combined", "height": 200, "contents": [{"server": "//higlass.io/api/v1", "tilesetUid": "CQMd6V_cRw6iCI_-Unl3PQ", "type": "heatmap", "position": "center", "options": {"maxZoom": null, "labelPosition": "bottomRight", "name": "Rao et al. (2014) GM12878 MboI (allreps) 1kb"}, "uid": "GjuZed1ySGW1IzZZqFB9BA", "name": "Rao et al. (2014) GM12878 MboI (allreps) 1kb", "maxWidth": 4194304000, "binsPerDimension": 256, "maxZoom": 14}], "position": "center", "options": {}}], "right": [], "bottom": []}, "layout": {"w": 12, "h": 12, "x": 0, "y": 0, "i": "aa", "moved": false, "static": false}}], "zoomLocks": {"locksByViewUid": {}, "locksDict": {}}, "locationLocks": {"locksByViewUid": {}, "locksDict": {}}};
    const options = {bounded: false} 
    
    console.log(container);
    console.log(config);
    console.log(options)
    viewer(container, config, options);
  }, []);

  return (
    <div id="higlass-container" style={{ width: '800px', height: '600px' }}></div>
  );
};

