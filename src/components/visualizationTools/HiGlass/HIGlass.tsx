import React, { useEffect } from 'react';
import * as hglib from './higlass/app/scripts/hglib';
import 'higlass/dist/hglib.css';
import { HiGlassComponent } from './higlass/app/scripts/hglib';

export const HiGlassComponentWrapper = () => {
  const container = document.getElementById('higlass-container');
  const server = "http://localhost:8888/api/v1"

  const config = {
    "editable": true,
    "zoomFixed": false,
    "trackSourceServers": [
      server
    ],
    "exportViewUrl": "/api/v1/viewconfs",
    "views": [
      {
        "uid": "aa",
        "initialXDomain": [
          0,
          3100000000
        ],
        "genomePositionSearchBox": {
          "autocompleteServer": server,
          "autocompleteId": "OHJakQICQD6gTD7skx4EWA",
          "chromInfoServer": server,
          "chromInfoId": "hg19",
          "visible": true
        },
        "tracks": {
          "top": [
            {
              "filetype": "hitile",
              "server": "//higlass.io/api/v1",
              "tilesetUid": "TvzFzi-LQle0nt3OlODEdA",
              "uid": "C0AQg88sSvKcJPoL_09YGA",
              "type": "line",
              "width": 20,
              "height": 20
            },
            {
              'type': 'line',
              "server": '//localhost:8888/api/v1',
              "tilesetUid": "HOHIJVMsRISjFxRUaI3KNg",
          }
            

          ],
          "left": [],
          "center": [],
          "right": [],
          "bottom": []
        },
        "layout": {
          "w": 12,
          "h": 12,
          "x": 0,
          "y": 0,
          "i": "aa",
          "moved": false,
          "static": false
        }
      }
    ],
    "zoomLocks": {
      "locksByViewUid": {},
      "locksDict": {}
    },
    "locationLocks": {
      "locksByViewUid": {},
      "locksDict": {}
    }
  };
  const options = {bounded: false} 
  const ref = React.createRef();
  return (
    <HiGlassComponent ref={ref} options={options || {}} viewConfig={config} />
  );
};





