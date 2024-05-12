import React, { useEffect, useState } from 'react';
import * as hglib from './higlass/app/scripts/hglib';
import 'higlass/dist/hglib.css';
import { HiGlassComponent } from './higlass/app/scripts/hglib';
import { default as robinConfig } from '../../../config.mjs';
import deepClone from '../../../utils/deep-clone.js';
import { Track, TrackType } from "../../../types.ts"
import Popup from 'reactjs-popup';
import { Button, Col, Container, Row } from 'react-bootstrap';
import axios from 'axios';
import { HiglassCoolPopup } from '../../higlassCoolFileUploader/higlassCoolPopup.tsx';

let i = 0;

class HiglassTrack {
  _defaultConfig: Track = {
    "filetype": "bed2ddb",
    "server": "http://localhost:8889/api/v1",
    "tilesetUid": "bVRL97wzRR6-XeN-HdWKJg",
    "uid": `higlassWrapperComponent-${i}`,
    "type": TrackType.Rectangle2DDomain,
    "options": {
      "labelColor": "black",
      "labelPosition": "topLeft",
      "labelLeftMargin": 0,
      "labelRightMargin": 0,
      "labelTopMargin": 0,
      "labelBottomMargin": 0,
      "labelBackgroundColor": "white",
      "labelShowResolution": false,
      "labelShowAssembly": true,
      "axisLabelFormatting": "scientific",
      "axisPositionHorizontal": "right",
      "lineStrokeColor": "blue",
      "lineStrokeWidth": 1,
      "valueScaling": "linear",
      "trackBorderWidth": 0,
      "trackBorderColor": "black",
      "labelTextOpacity": 0.4,
      "showMousePosition": false,
      "minHeight": 20,
      "mousePositionColor": "#000000",
      "showTooltip": false,
      "name": "Bonev et al. 2017 - GSE96107_NPC_CTCF"
    },
    "width": 20,
    "height": 20
  }

  _config: Track;

  /**
   * 
   * @param tilesetUid the uuid of the tile set on the provided server url
   * @param type the track type to render the track as
   * @param server the server the tileset is on including /api/v1 Ex: "http://higlass.io/api/v1"
   */
  constructor(tilesetUid: string, type: TrackType, name: string, server: string = robinConfig.higlassApiUrlV1) {
    this._config = JSON.parse(JSON.stringify(this._defaultConfig));
    this._config.server = server;
    this._config.tilesetUid = tilesetUid;
    this._config.type = type;
    this._config.options.name = name;
    i++;
  }


  /**
   * @returns the higlass obj for this track
   */
  getConfig() {
    return this._config;
  }
}

/**
 * @description check if a tilesetuuid exists on our server
 * @param uid 
 * @returns 
 */
function trackHasErrors(uid) {
  return new Promise(res => {
    axios.get(`http://biomlearn.uccs.edu/robinHighglassAPI//api/v1/tileset_info/?d=${uid}`).then(response => {
      const errorsExist = Object.keys(response.data).some(key => response.data[key]["error"]);
      res(errorsExist);
    })
  })

}


export const HiGlassComponentWrapper = (props: { uids: ({ uid: string, type: TrackType }[]) }) => {
  const container = document.getElementById('higlass-container');
  const server = "//higlass.io/api/v1"; //"http://localhost:8888/api/v1"
  const [height, setHeight] = useState(100);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File>();

  useEffect(() => {
    // window.location.reload();
    let tempTracks: Track[] = [];
    let loadingPromises: Promise<void>[] = [];
    //add all reference lines first
    props.uids.filter(uuid => uuid.type == "line" && uuid.uid).forEach(uidObj => {
      loadingPromises.push(new Promise((res) => {
        trackHasErrors(uidObj.uid).then(hasError => {
          if (!hasError) {
            let track = new HiglassTrack(uidObj.uid, uidObj.type, uidObj.uid.split(".")[0].split("_").join(" "));
            track._config.height *= 2;
            let config = track.getConfig();
            tempTracks.push(config);
          }
          res();
        })
      }))
    })

    //add all results files
    console.log(props.uids)
    props.uids.filter(uuid => uuid.type != "line" && uuid.uid).forEach(uidObj => {
      loadingPromises.push(new Promise((res) => {
        trackHasErrors(uidObj.uid).then(hasError => {
          if (!hasError) {
            let track = new HiglassTrack(uidObj.uid, uidObj.type, uidObj.uid.split(".")[0].split("_").join(" "));
            tempTracks.push(track.getConfig());
          }
          res();
        })
      }))
    })

    Promise.all(loadingPromises).then(() => {
      setTracks(tempTracks);
      console.log(tempTracks);
    });
  }, [props.uids])




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
    "views": [
      {
        "exportViewUrl": "/api/v1/viewconfs/",
        "autocompleteSource": "/api/v1/suggest/?d=OHJakQICQD6gTD7skx4EWA&",
        "genomePositionSearchBox": {
          "autocompleteServer": "//higlass.io/api/v1",
          "autocompleteId": "OHJakQICQD6gTD7skx4EWA",
          "chromInfoServer": "//higlass.io/api/v1",
          "chromInfoId": "hg19",
          "visible": true
        },
        "chromInfoPath": "//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv",
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
              "height": height,
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
  const options = {
    bounded: false,


  }
  const ref = React.createRef();

  useEffect(() => {
    console.log(ref)
    console.log(ref.current)

  }, [ref])

  useEffect(() => {

  }, [height])
  return (
    <>
      <Container>

        <Row>
          <Col md={4}>
            <p>This tab will not remember any changes if you leave.</p>
          </Col>
          <Col sm={2}>
            <Button onClick={() => {
                //this is a janky work around
                localStorage.setItem('tab','nothing');
                window.location.reload()
                new Promise((res)=>{
                  setTimeout(()=>res(1),3000)
                }).then(()=>{
                  localStorage.setItem('tab','higlass');
                  window.location.reload()
                })
            }}>Reload Higlass </Button>
          </Col>
          {robinConfig.allowCoolerUploads ?
            <Col md={2}>
              <HiglassCoolPopup fileName={name} setFileName={setName} file={file} setFile={setFile} />
            </Col>
            : ""}

        </Row>

        <HiGlassComponent
          ref={ref}
          options={deepClone(options || {})}
          viewConfig={deepClone(config)}
        />
      </Container>
    </>

  );
};





