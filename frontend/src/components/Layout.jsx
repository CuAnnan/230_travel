import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, Container } from 'react-bootstrap';
import {client} from '../AxiosInterceptor.js';


function Layout()
{
    const loginData = localStorage.getItem("user");

    const userSections = [];
    const linkSections = [];

    const logout = (e)=>{
        e.preventDefault();
        client.clearTokens();
        window.location.reload();
    }

    if(loginData)
    {
        const user = JSON.parse(loginData);
        userSections.push(<Link to="/account"  className="nav-link"  key="2">Account</Link> );
        userSections.push(<Link to="#" key="1"  className="nav-link" onClick={logout}>Logout ({user.username})</Link>);
        linkSections.push(<Link to="/logs" key="1" className="nav-link">Travel Logs</Link>);
        linkSections.push(<Link to="/journeys" key="2" className="nav-link">Journey Plans</Link>);
    }
    else
    {
        userSections.push(<Link key="1" to="/register" className="nav-link">Register</Link>);
        userSections.push(<Link key="2" to="/login" className="nav-link">Login</Link>);
    }

    return (<div className="container-fluid">
        <header>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>Travel Application</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to="/" className="nav-link">Home</Link>
                            {linkSections}
                        </Nav>
                        <Nav className="ml-auto">
                            {userSections}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
        <main>
            <Outlet />
        </main>
    </div>);
}

export default Layout;