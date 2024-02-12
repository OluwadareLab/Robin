import React from "react";

/**
 * @description the main button to go to other pages
 * @param {Object} props properties for the button
 * title: the title of the button
 * src: the link to go to
 * @returns {XML} the button component
 */
export const BtnLink = (props) => (
    <>
        <a className="btn btn-primary btn-sm" href={props.src} 
        style={{
            textDecoration: 'none',
            padding:"15px 40px",
          
        }}>
            <span className="visible-xs-block">{props.title}</span>
            
        </a>
    </>
)