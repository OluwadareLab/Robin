import React from "react";

type colProps = {
    /** @description the size of the bootstrap col 1-4 */
    size: number
}

export const Col = (props:colProps)=>{
    <div className={`col-sm-${props.size}`}>

    </div>
}