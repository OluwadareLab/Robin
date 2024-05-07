import React, { useEffect, useRef, useState } from "react";
import VennDiagramComponent from "../vennDiagram";
import { useParams } from "react-router-dom";
import { OverlapDataSet, OverlapDataObj } from "../../tempTypes/Types";
import Select from 'react-select';
import { UTIL } from "../../../util";
import { InputActionMeta } from "react-select";
import { Button, Col, Row } from "react-bootstrap";
import { CustomLegendWithSelection } from "../CustomLegend";
import { InstructionHeader } from "../../misc/instructionHeader";

type OverlapComponentProps = {
  clrs: any;
  /** the overlap data from the api */
  data: OverlapDataSet;

  /** @description the current resolution to filter by defaults to the first resolution found */
  resolutionFilter?: string
}
let i = 0;

// function parseSymbols(inputString){
//   let setMinus = "∖";
//   let setIntersect = "∩";
//   let setInclusion = "∪";

//   inputString=inputString.replace(/\<U\+2216\>/gi,setMinus) // set minus
//   inputString=inputString.replace(/\<U\+2229\>/gi,setIntersect) // set intersection
//   inputString=inputString.replace(/\<U\+222A\>/gi,setInclusion) // set inclusion

//   // Regular expression to match symbols inside parentheses
//   const parenthisisRegex = /\((.*?)\)/g;
//   const nextSymbolregex = /(?<name>.*?)(?<token>∖|∩|∪)/

//   let match;
//   if((match = regex.exec(parenthisisRegex)) !== null){ //if this is true then there exists nested elements we must deal with first

//   } else { //base case, if we are here there are no nested elements and we can evaluate the string

//   }
// }

function parseString(inputString) {
  // Regular expression to match symbols inside parentheses
  const regex = /\((.*?)\)/g;

  // Arrays to store included and not included symbols
  let includedSymbols = [];
  let notIncludedSymbols = [];

  let match;
  while ((match = regex.exec(inputString)) !== null) {
    // Splitting the match into included and not included symbols
    const symbols = match[1].split('∩');

    // Adding symbols to respective arrays
    includedSymbols.push(symbols[0]);
    if (symbols.length > 1) {
      notIncludedSymbols.push(symbols[1]);
    }
  }

  return { included: includedSymbols, notIncluded: notIncludedSymbols, baseString: inputString };
}

/**
 * @description from a string composed of set inclusion, exclusion and intersection simbols return an array of the values that are IN 
 * @param string 
 */
const logicalParser = (string: string) => {
  let stack = [];
  let setMinus = "∖";
  let setIntersect = "∩";
  let setInclusion = "∪";

  string = string.replace(/\<U\+2216\>/gi, setMinus) // set minus
  string = string.replace(/\<U\+2229\>/gi, setIntersect) // set intersection
  string = string.replace(/\<U\+222A\>/gi, setInclusion) // set inclusion


  let stringUntilSetMinus = string.split(setMinus)[0];
  return stringUntilSetMinus.split(new RegExp(`${setIntersect}|${setInclusion}`, "gi")).map(e => e.replace(/\(|\)|"/gi, ""));
}

/** @description parse the data from an overlapDataObj*/
const parseOverlapData = (obj: OverlapDataObj) => {
  let data: {
    label?: any; sets: string[], value: any
  }[] = [];
  let lines = obj.data.split('\n');
  lines.shift(); //first line is headers we do not need them.
  lines.forEach(line => {
    let cols = line.split(",")
      .map(col => col.replace(/\"/gi, "")) //remove uneccecary "
      .map(col => col.replace(/\<U\+2216\>/gi, "∖")) //parse unicode set minus symbol
      .map(col => col.replace(/\<U\+2229\>/gi, "∩")) //parse unicode set intersection symbol
      .map(col => col.replace(/\<U\+222A\>/gi, "∪")) //parse unicode set inlusion symbol

    console.log(cols);
    if (cols.length > 1)
      data.push(
        {
          sets: logicalParser(cols[1]),
          value: `${(parseFloat(cols[3]) * 100).toFixed(3)}%`,
        }
      )
  })
  return data;
}

// "","..set..","..count..","percentage"
// "1","hicexploerer_10000<U+2229>lasca_10000","  262","0.00738361"
// "2","(lasca_10000)<U+2216>(hicexploerer_10000)","33414","0.94166385"
// "3","(hicexploerer_10000)<U+2216>(lasca_10000)"," 1808","0.05095254"

export const OverlapComponent = (props: OverlapComponentProps) => {
  console.log(props.data);
  const params = useParams();
  const id = params.id ? parseInt(params.id) : undefined;
  const [filterResolution, setFilterResolution] = useState<any>(props.resolutionFilter ? props.resolutionFilter : (props.data[0] ? props.data[0].resolution : false))
  const [currentCombo, setCurrentCombo] = useState<OverlapDataObj | undefined>(props.data[0] ? props.data[0] : undefined);
  const [updater, setUpdater] = useState<number>(0);
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<{ sets: string[]; value: any; }[]>([]);
  const [customLegendWithSelectionState, setCustomLegendWithSelectionState] = useState({});
  const [avalibleOptions, setAvalibleOptions] = useState<string[]>([]);
  let validCombos: string[] = [];

  //find resolutions and then filter by unique
  let resolutions = props.data.map(e => e.resolution).filter(UTIL.onlyUnique);
  console.log(resolutions);

  let tempx = 0;
  function updateLabelsAndData() {
    if (typeof currentCombo != 'undefined') {
      let currentDataObj = currentCombo;
      let tempData = parseOverlapData(currentDataObj)

      tempData.forEach(dataObj => {
        let label = ""
        if (dataObj.sets.length == 1) {
          label = dataObj.sets[0];//.split("∖")[0]
        } else {
          label = dataObj.sets.join(" ∩ ");
        }
        dataObj.label = label;
      })

      function sorter(a, b) {
        //sort by length
        if (a.length < b.length) {
          return -1;
        }
        if (a.length > b.length) {
          return 1;
        }
        return 0;
      }

      tempData = tempData.sort((a, b) => sorter(a.sets, b.sets))

      let tempLabels = tempData.map(data => data.label)
      setLabels(tempLabels)
      setData(tempData)
    } else {
      console.log("---------------------------undefined-----------------------")
    }
  }

  /**
   * @description called whenever prop data changes. 
   * Sets filterResolution if they do not already have values.
   */
  function setDefaultFilterResolution(){
    console.log("------------------setting defaults--------------------------");
    if(!filterResolution){
      console.log("setting filter resolution")
      setFilterResolution(options[0]);
    }
  }

  /**
   * @description called whenever prop data changes. 
   * Sets graph display if they do not already have values.
   */
  function setDefaultGraph(data=data){
    if(data.length < 1){
      console.log("setting current combo")
      
      //if we know what is valid for this resolution choose the first valid combo
      console.log(validCombos);
      if(validCombos[0]){
        let obj = {};
        validCombos[0].split(":").forEach(toolName=>{
          obj[toolName]=true;
        })
        console.log(obj);
        setCustomLegendWithSelectionState(obj);
        updateSelection(obj);
      } else {
        //else just use the first on in our data
        setCurrentCombo(props.data[tempx++]);
      }
    }
    return data.length < 1;
  }

  function getValidCombos() {
    validCombos = [];
    let tempValidOptions: string[] = [];
    console.log(props.data);
    console.log(filterResolution);
    props.data.filter(e => e.resolution === filterResolution.value).forEach(dataObj => {

      validCombos.push(dataObj.fileCombo);
      tempValidOptions = [...tempValidOptions, ...parseOverlapData(dataObj).map(e => e.sets).flat()];
    })
    setAvalibleOptions(tempValidOptions.filter(UTIL.onlyUnique));
    console.log(validCombos);
  }

  useEffect(() => {
    updateLabelsAndData();
  }, [currentCombo])

  useEffect(() => {
    getValidCombos();
    //if default graph did not get set clear selection on resolution change
    if(!setDefaultGraph([])){
      setUpdater(updater + 3.124);
    }
  }, [filterResolution])

  useEffect(() => {
    console.log('0---------------------data------------------------')
    console.log(data)
  }, [data])

  useEffect(() => {
    console.log('0---------------------label------------------------')
    console.log(labels)
  }, [labels])


  //set defaults if no values are already selected
  useEffect(() => {
    setDefaultFilterResolution();
    console.log("here")
  }, [props.data])

  //format options for resolution switcher
  const options = resolutions.map(res => ({
    value: res,
    label: (!isNaN(parseInt(res))) ? `${parseInt(res) / 1000} kb` : res
  })).sort((a, b) => a.value - b.value);

  console.log(options)

  function updateSelection(data) {
    let selections = Object.keys(data).filter(key => data[key]);
    if (selections.length > 1) {
      getValidCombos()
      console.log(data)
      console.log(validCombos)
      for (let index = 0; index < validCombos.length; index++) {
        const combo = validCombos[index];
        console.log(`selection:${selections}`)
        console.log(`combo:${combo}`)
        if (selections.every(keyword => combo.includes(keyword)) && combo.split(":").length == selections.length) {
          setCurrentCombo(props.data.find(element => element.fileCombo === combo));
        }
      }
    }

  }

  let k = 0;
  return (
    <>
      <Row>
        <Col sm={3}>
          <label htmlFor='resolutionSelector'>Resolution</label>
          <Select
            name="resolutionSelector"
            options={options}
            //defaultValue={{ label: "Select Dept", value: 0 }}
            value={filterResolution}
            inputValue=""
            className="onTop"
            onChange={(val, other) => setFilterResolution(val)}
          >
          </Select>
          <hr />
          <InstructionHeader title='select up to 3 tools to visualize overlap for:' />
          <CustomLegendWithSelection
            state={customLegendWithSelectionState}
            setState={setCustomLegendWithSelectionState}
            items={
              avalibleOptions.map(name => ({
                "label": name,
                "backgroundColor": props.clrs[k++]
              }))
            }
            onSelect={updateSelection}
            forceUpdate={updater}
          />
        </Col>
        <Col md={8}>
          <VennDiagramComponent
            id={id}
            data={data}
            labels={labels}
            clrs={props.clrs}
          />
        </Col>
      </Row>

    </>

  );
};
