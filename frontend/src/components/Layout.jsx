import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, Container } from 'react-bootstrap';


function Layout()
{
    const loginData = localStorage.getItem("loginData");

    const userSections = [];
    const logout = (e)=>{
        localStorage.removeItem("loginData");
        window.location.reload();
    }

    if(loginData)
    {
        const json = JSON.parse(loginData);
        const {user} = json;
        console.log(user);
        userSections.push(<Link key="1" onClick={logout}>Logout ({user.username})</Link>);
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