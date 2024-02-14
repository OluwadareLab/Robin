import React from "react";

type btnConfirmProps = {
    /** 
     * the title of the button. 
     * @default submit
     * */
    title?:string

    /** the function to run on click of this button */
    onClick:()=>{}
}

/**
 * The main confirm button for the site
 */
export const BtnConfirm = (props: btnConfirmProps) => (
    <>
        <button className="btn btn-lg btn-secondary" style={{float:"right"}} type="submit" value="Submit" onClick={props.onClick}>
            {props.title? props.title : "Submit"}
            </button>
    </>
)
