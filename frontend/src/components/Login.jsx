import React from 'react';
import {Container,InputGroup, Button, Row, Col, Form} from 'react-bootstrap';
import axios from 'axios';


import FormField from "./FormField.jsx";

function Login()
{
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [validated, setValidated] = React.useState(false);
    const [errors, setErrors] = React.useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const axiosConfig = {
            method: 'POST',
            url: 'http://localhost:3000/users/',
            headers: {'Content-Type': 'application/json'},
            data: {username, password}
        };
        try
        {
            let response = await axios(axiosConfig);
            localStorage.setItem("loginData", JSON.stringify(response.data));
            window.location.href="/";
        }
        catch(err)
        {
            const responseErrors = [];
            setValidated(false);
            for(let error of err.response.data.errors)
            {
                responseErrors.push(error);
            }
            setErrors(responseErrors);
        }
    };

    return(<Container>
        <Form  noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <FormField id="username" field={username} setField={setUsername} label="Username" inputGroupPrefix="&#128100;"/>
            </Row>
            <Row className="mb-3">
                <FormField id="password" field={password} setField={setPassword} type="password" label="Password"/>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Button variant="primary" type="submit">Login</Button>
                </Col>
            </Row>
        </Form>
    </Container>);
}

export default Login;