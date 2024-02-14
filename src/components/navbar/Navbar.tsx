import React from "react";
import { Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { paths } from "../../config.mjs";

type NavbarProps = {

}

/** the navbar for the site. Has little configurability intentionally as it shouldn't be reused elsewhere. */
export const AppNavbar: React.FC = (props: NavbarProps) => {

    return (
        <Router>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href={paths.home}>[Logo]</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href={paths.about}>About</Nav.Link>
                        <Nav.Link href={paths.jobs}>View Jobs</Nav.Link>
                        <Nav.Link href={paths.example}>Example</Nav.Link>
                        <Nav.Link href={paths.github}>GitHub</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Router>
    );
}