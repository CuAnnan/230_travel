import React from 'react';
import {Container,InputGroup, Button, Row, Col, Form} from 'react-bootstrap';
import axios from 'axios';

import FormField from './FormField.jsx';

function Register()
{
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [passwordErrors, setPasswordErrors] = React.useState([]);
    const [email, setEmail] = React.useState('');
    const [emailErrors, setEmailErrors] = React.useState([]);
    const [address, setAddress] = React.useState('');
    const [validated, setValidated] = React.useState(false);
    const [errors, setErrors] = React.useState([]);
    const [registered, setRegistered] = React.useState(true);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const axiosConfig = {
            method: 'POST',
            url: 'http://localhost:3000/users/register',
            headers: {'Content-Type': 'application/json'},
            data: {username, password, passwordConfirmation, email, address}
        };
        try
        {
            let response = await axios(axiosConfig);
            setErrors([]);
            setValidated(true);
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

    }


    return (<Container>
        <h2 className="text-center">New Account Registration</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <FormField id="username" field={username} setField={setUsername} label="Username" inputGroupPrefix="&#128100;"/>
                <FormField id="address" field={address} setField={setAddress} label="Address" inputGroupPrefix="&#9993;"/>
            </Row>
            <Row className="mb-3">
                <FormField id="email" field={email} setField={setEmail} label="Email" inputGroupPrefix="@" emailErrors={emailErrors}/>
            </Row>
            <Row className="mb-3">
                <FormField id="password" field={password} setField={setPassword} type="password" label="Password" passwordErrors={passwordErrors}/>
                <FormField id="passwordConfirmation" field={passwordConfirmation} setField={setPasswordConfirmation} type="password" label="Confirm Password" passwordErrors={passwordErrors}/>
            </Row>

            {errors.map((error, idx)=>(<Row className="error" key={idx}><Col>{error}</Col></Row>))}
            {validated ? (<Row>
                You have successfully registered.
            </Row>):""}
            <Row>
                <Col>
                    <Button variant="primary" type="submit">Register</Button>
                </Col>
            </Row>
        </Form>
    </Container>);
}

export default Register;