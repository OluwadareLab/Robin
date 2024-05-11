import React, { useEffect } from 'react';
import * as hglib from './higlass/app/scripts/hglib';
import 'higlass/dist/hglib.css';
import { HiGlassComponent } from './higlass/app/scripts/hglib';
import {default as robinConfig} from '../../../config.mjs';
import deepClone from '../../../utils/deep-clone.js';
import {Track,TrackType} from "../../../types.ts"

let i = 0;

class HiglassTrack {
  _defaultConfig:Track = {
    "filetype": "bed2ddb",
    "server": "http://localhost:8889/api/v1",
    "tilesetUid": "bVRL97wzRR6-XeN-HdWKJg",
    "uid": `higlassWrapperComponent-${i}`,
    "type": TrackType.Rectangle2DDomain,
    "options": {
      "labelColor": "black",
      "labelPosition": "bottomLeft",
      "labelLeftMargin": 0,
      "labelRightMargin": 0,
      "labelTopMargin": 0,
      "labelBottomMargin": 0,
      "trackBorderWidth": 0,
      "trackBorderColor": "black",
      "rectangleDomainFillColor": "grey",
      "rectangleDomainStrokeColor": "black",
      "rectangleDomainOpacity": 0.6,
      "minSquareSize": "none",
      "name": "job_11_lasca_5000_1.txt"
    },
    "width": 1266,
    "height": 80
  }

  _config:Track;

  /**
   * 
   * @param tilesetUid the uuid of the tile set on the provided server url
   * @param type the track type to render the track as
   * @param server the server the tileset is on including /api/v1 Ex: "http://higlass.io/api/v1"
   */
  constructor(tilesetUid:string, type:TrackType, name:string, server:string=robinConfig.higlassApiUrlV1){
    this._config=JSON.parse(JSON.stringify(this._defaultConfig));
    this._config.server=server;
    this._config.tilesetUid=tilesetUid;
    this._config.type=type;
    this._config.options.name=name;
    i++;
  }


  /**
   * @returns the higlass obj for this track
   */
  getConfig(){
    return this._config;
  }
}


export const HiGlassComponentWrapper = (props:{uids:({uid:string,type:TrackType}[])}) => {
  const container = document.getElementById('higlass-container');
  const server = "//higlass.io/api/v1" ; //"http://localhost:8888/api/v1"

  // "trackSourceServers": [
  //   "/api/v1",
  //   "http://higlass.io/api/v1"
  // ],

  let tracks:Track[] = []
  
  //add all reference lines first
  props.uids.filter(uuid=>uuid.type=="line"&&uuid.uid).forEach(uidObj=>{
      let track = new HiglassTrack(uidObj.uid, uidObj.type, uidObj.uid.split(".")[0].split("_").join(" "));
      tracks.push(track.getConfig());
  })

  //add all results files
  props.uids.filter(uuid=>uuid.type!="line"&&uuid.uid).forEach(uidObj=>{
    let track = new HiglassTrack(uidObj.uid, uidObj.type, uidObj.uid.split(".")[0].split("_").join(" "));
    tracks.push(track.getConfig());
  })

  console.log(tracks)

  const config = {
    "editable": true,
    "zoomFixed": false,
    "trackSourceServers": [
      robinConfig.higlassApiUrl,
      robinConfig.higlassApiUrlV1,
      "/api/v1",
      "http://higlass.io/api/v1"
    ],
    "exportViewUrl": "/api/v1/viewconfs/",
    "views": [
      {
        "tracks": {
          "top": [
            {
              "editable": true,
              "filetype": "cooler",
              "server": "http://higlass.io/api/v1",
              "tilesetUid": "e5QaKN16SdWyIWKAidq2Kw",
              "uid": "I3VHsqI-RxquUSZ3J42LwQ",
              "type": "linear-heatmap",
              "options": {
                "backgroundColor": "#eeeeee",
                "labelPosition": "bottomRight",
                "labelLeftMargin": 0,
                "labelRightMargin": 0,
                "labelTopMargin": 0,
                "labelBottomMargin": 0,
                "labelShowResolution": true,
                "labelShowAssembly": true,
                "labelColor": "black",
                "colorRange": [
                  "white",
                  "rgba(245,166,35,1.0)",
                  "rgba(208,2,27,1.0)",
                  "black"
                ],
                "minWidth": 100,
                "minHeight": 40,
                "trackBorderWidth": 0,
                "trackBorderColor": "black",
                "name": "Rao et al. (2014) GM12878 MboI (SRR1658572)"
              },
              "width": 1506,
              "height": 40,
              "transforms": [
                {
                  "name": "ICE",
                  "value": "weight"
                },
                {
                  "name": "KR",
                  "value": "KR"
                },
                {
                  "name": "VC",
                  "value": "VC"
                },
                {
                  "name": "VC_SQRT",
                  "value": "VC_SQRT"
                }
              ]
            },
            ...tracks
          ],
          "left": [],
          "center": [],
          "right": [],
          "bottom": [],
          "whole": [],
          "gallery": []
        },
        "layout": {
          "w": 12,
          "h": 12,
          "x": 0,
          "y": 0,
          "moved": false,
          "static": false
        },
        "uid": "CUjr9AslQXSsZablkFOqSw"
      }
    ],
    "zoomLocks": {
      "locksByViewUid": {},
      "locksDict": {}
    },
    "locationLocks": {
      "locksByViewUid": {},
      "locksDict": {}
    },
    "valueScaleLocks": {
      "locksByViewUid": {},
      "locksDict": {}
    }
  };
  const options = {bounded: false} 
  const ref = React.createRef();
  return (
    <>
    <HiGlassComponent 
    ref={ref} 
    options={deepClone(options || {})} 
    viewConfig={deepClone(config)}
     />
    </>
    
  );
};





