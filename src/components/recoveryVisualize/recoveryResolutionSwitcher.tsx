import React, { useEffect, useState } from "react";
import { RemDisplay } from "./remDisplay";
import Select from 'react-select';
import { RecoveryComponent } from "./recoveryDisplay";
import _ from "lodash"; // _ is low-dash

type RecoveryAndRemWithResolutionSwitchProps = {
    recoveryDatasets
    recoveryDataSetKey
    clrs
    remValues
}

/**
 *  get the largest value from a dataset
 * @param data 
 * @returns 
 */
const getRecoveryMax = (data) =>{

    let testData = _.cloneDeep(data);

    testData.forEach(data=>{
      data.data = data.data[data.data.length-2];
    })
    return testData
  }

export const RecoveryAndRemWithResolutionSwitch = (props:RecoveryAndRemWithResolutionSwitchProps) =>{
    const [resolution, setResolution] = useState<any>("");

    const recoveryDatasets = props.recoveryDatasets;
    const key = props.recoveryDataSetKey;
    const recoveryMethodArr = recoveryDatasets[key];
    const remValues = props.remValues;
    let resolutions:any = {};
    Object.keys(recoveryDatasets).forEach(key=>recoveryDatasets[key].forEach(tool=>resolutions[tool.resolution]=true));
    console.log(recoveryDatasets);
    resolutions = Object.keys(resolutions) as string[];
    resolutions.push("average");
    resolutions.push("all resolutions");
    const barData = getRecoveryMax(recoveryMethodArr);
    const data = recoveryMethodArr;
    console.log(barData);
    console.log(resolutions);
    
    const options = resolutions.map(res=>({
        value:res,
        label:(!isNaN(parseInt(res))) ? `${parseInt(res)/1000} kb` : res
        }));
    

    useEffect(()=>{
        setResolution(options[0]);
        console.log(options[0])
    },[])

    

    return (
        <>
            <>
                <label htmlFor='resolutionSelector'>Resolution</label>
                <Select
                    name="resolutionSelector"
                    options={options}
                    value={resolution}
                    onChange={(val,other)=>setResolution(val)}
                    >
                        
                </Select>
            </>
            <hr/>
            <RecoveryComponent
                topTitle={`${recoveryMethodArr[0].method}`}
                bottomTitle={`${recoveryMethodArr[0].method} Recovery`}
                clrs={props.clrs}
                regex={`${recoveryMethodArr[0].method}${(()=>{console.log(resolution.value);return"";})()}`}
                barData={barData}
                lineData={data}
                filterResolution={resolution.value}
            />
            <RemDisplay
                filterResolution={resolution.value}
                barData={remValues}
                bottomTitle={`${recoveryMethodArr[0].method} (REM)`}
                clrs={props.clrs}
                regex={`${recoveryMethodArr[0].method}`}
            />
        </>
    )
}