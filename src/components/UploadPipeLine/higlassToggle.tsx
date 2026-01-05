import React from "react"
import { Col, Form, Row } from "react-bootstrap"
import { InstructionHeader } from "../misc/instructionHeader"

/**
 * @description props for the ToolFileInputProps compoenent
 */
type HiglassToggleProps = {
    checked:boolean,
    setChecked:(boolean)=>void,
    children
}
 
/**
 * @description the component for the toggle button to enable higlass, also renders anything contained inside once flipped
 * @param props 
 * @returns The React component
 */
export const HiglassToggle = (props:HiglassToggleProps) => {
    function toggle(){
        props.setChecked(!props.checked);
    }

    return(
        <>
        <Row>
            <Col sm={1}>
                <Form.Check 
                type="switch"
                id="higlass"
                label=""
                checked={props.checked}
                onChange={toggle}
                />
            </Col>
            <Col sm={3}>
                <InstructionHeader title="Enable Higlass?"/>
            </Col>
            
            
        </Row>
        <Row>
            {props.checked ? props.children : ""}
        </Row>
        </>
    )
}