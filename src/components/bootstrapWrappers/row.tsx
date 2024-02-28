import React from "react";

type rowProps = {
    /** @description the size of the bootstrap row 1-4 */
    size?: number
}

export const Row = (props:rowProps)=>{
    {if(!props.size) props.size=1}
    <div className={`row-sm-${props.size}`}>

    </div>
}