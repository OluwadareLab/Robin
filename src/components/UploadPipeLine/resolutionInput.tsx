import React from "react"
import { RequiredAsterisk } from "../misc/RequiredAsterisk"
import { ResolutionData } from "../tempTypes/Types";


type resolutionInputProps = {
    /** @description the value resolution of the input */
    resolution:ResolutionData,
    /**
     * @description the function called when the user changes the resolution of this input
     */
    handleResolutionChange: (e:React.ChangeEvent<HTMLInputElement>)=>void;

}

/**
 * @description the component for resolution input display, just the label and input
 * @param props 
 * @returns 
 */
export const ResolutionInput = (props:resolutionInputProps) => {
    return (
        <>
            <label htmlFor='resolutionInput' className='col-2 col-form-label'>Resolution (Bases)<RequiredAsterisk active={true} /></label>
            <div className='col-sm-2'>
                <input
                    required={true}
                    className='input-sm form-control'
                    id="resolutionInput"
                    type="number"
                    list="resolutions"
                    placeholder="IE: 1000, 5000..."
                    value={props.resolution.resolution}
                    step={1}
                    onChange={(e) => props.handleResolutionChange(e)}
                />
                <datalist id="resolutions">
                    <option value="1000"/>
                    <option value="5000"/>
                    <option value="10000"/>
                    <option value="100000"/>
                    <option value="250000"/>
                    <option value="500000"/>
                    <option value="1000000"/>
                </datalist>
            </div>
        </>
    )
}