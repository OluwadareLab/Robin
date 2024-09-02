import React from "react";
import { Navbar, Nav, ToggleButton, ButtonGroup } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { hrefPaths as paths, paths as path2, config} from "../../config.mjs";
import { Logo } from "../logo/logo";
import { DarkModeToggle } from "../misc/DarkModeToggle";

type NavbarProps = {

}

/** the navbar for the site. Has little configurability intentionally as it shouldn't be reused elsewhere. */
export const AppNavbar = (props: NavbarProps) => {
    return (
        <Router basename="robin">
            <Navbar bg="" expand="lg" style={{padding:0, margin:0}}>
                <Navbar.Brand  style={{display:"inline-block", width:"50px"}} href={paths.home} ><Logo/></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="ml-auto">
                    <Nav className="mr-auto">
                        <Nav.Link href={paths.about}>About</Nav.Link>
                        <Nav.Link target="_blank" href={config.docs}>Documentation</Nav.Link>
                        <Nav.Link href={paths.example}>Example</Nav.Link>
                        <Nav.Link target="_blank" href={config.github}>GitHub</Nav.Link>
                        
                    </Nav>
                   
                    
                </Navbar.Collapse>
                <Nav className="ml-auto">
                        <Nav.Item className="ml-auto"><DarkModeToggle/></Nav.Item>
                    </Nav>
            </Navbar>
        </Router>
    );
}