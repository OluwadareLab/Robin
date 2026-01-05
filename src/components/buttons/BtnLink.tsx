import React from 'react'

type btnLinkProps = {
    /** 
     * the title of the button. 
     * */
    title:string
    /**
     * the link to go to
     */
    src:string

    /** 
     * the color of the button's background 
     * @default blue
     * */
    bgClr?:string

    /**html link target */
    target:string
}


/**
 * The main button to go to other pages
 */
export const BtnLink = (props: btnLinkProps) => (
    <>
        <a className="btn btn-primary btn-sm" href={props.src} 
        target={props.target}
        style={{
            textDecoration: 'none',
            padding:"15px 40px",
            marginLeft:"10px",
            marginRight:"10px",
            background:props.bgClr || "#0d6efd"
          
        }}>
            
            <span className="visible-xs-block">{props.title}</span>
            
        </a>
    </>
)