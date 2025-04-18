import React from 'react';
import {Container,InputGroup, Button, Row, Col, Form} from 'react-bootstrap';
import {client} from '../../AxiosInterceptor.js';


import FormField from "../FormField.jsx";

function Login()
{
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [validated, setValidated] = React.useState(false);
    const [errors, setErrors] = React.useState([]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try
        {
            let response = await client.post(
                '/users/',
                {username, password},
                {
                    headers: {'Content-Type': 'application/json'},
                }
            );
            const {accessToken, refreshToken, user} = response.data;
            client.accessToken = accessToken;
            client.refreshToken = refreshToken;
            client.user = user;
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
    if(errors.length)
    {
        console.log(errors);
    }

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