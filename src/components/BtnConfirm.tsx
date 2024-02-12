import React from "react";

type btnConfirmProps = {
    /** @description the title of the button. default "submit" */
    title:string
}

/**
 * @description the main confirm button for the site
 * @param {Object} props properties for the button
 * title: the title of the button
 * @returns {XML} the button component
 */
export const BtnConfirm = (props) => (
    <>
        <button className="btn btn-lg btn-secondary" style={{float:"right"}} type="submit" form="jobSetupForm" value="Submit">
            {props.title? props.title : "Submit"}
            </button>
    </>
)