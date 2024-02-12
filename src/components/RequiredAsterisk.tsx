import React from "react";


/**
 * @description the types for the asterisk component
 * @prop active, whether to render or not
 */
type RequiredAsteriskProps = {
    active?: boolean
}

/**
 * @description simple component for the required asterisk
 * @returns jsx for the required asterisk
 */
export const RequiredAsterisk = (props: RequiredAsteriskProps) => {
    const active = typeof(props.active) === undefined ? false : props.active;
    return (
        <>
        {active? <span className="asteriskField">*</span> : ""}
    </>
    )
    
    
}