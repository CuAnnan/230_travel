import React from 'react';
import {Container,InputGroup, Button, Row, Col, Form} from 'react-bootstrap';
import {client} from '../AxiosInterceptor.js';

import FormField from './FormField.jsx';

function Register()
{
    const user = client.user;

    const [password, setPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [email, setEmail] = React.useState(user.email);
    const [address, setAddress] = React.useState(user.address);
    const [validated, setValidated] = React.useState(false);
    const [errors, setErrors] = React.useState([]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try
        {
            await client.patch('/users', {password, newPassword, passwordConfirmation, email, address}, {headers: {'Content-Type': 'application/json'}});
            user.email = email;
            user.address = address;
            client.user = user;
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
        <h2 className="text-center">Account details</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <FormField id="address" field={address} setField={setAddress} label="Address" inputGroupPrefix="&#9993;"/>
            </Row>
            <Row className="mb-3">
                <FormField id="email" field={email} setField={setEmail} label="Email" inputGroupPrefix="@"/>
            </Row>
            <Row className="mb-3">
                <FormField id="newPassword" field={newPassword} setField={setNewPassword} type="password" label="New Password"/>
                <FormField id="passwordConfirmation" field={passwordConfirmation} setField={setPasswordConfirmation} type="password" label="Confirm Password"/>
            </Row>
            <Row className="mb-3">
                <FormField id="password" field={password} setField={setPassword} type="password" label="Password"/>
            </Row>


            {errors.map((error, idx)=>(<Row className="error" key={idx}><Col>{error}</Col></Row>))}
            {validated ? (<Row>
                Account successfully updated!
            </Row>):""}
            <Row>
                <Col>
                    <Button variant="primary" type="submit">Update</Button>
                </Col>
            </Row>
        </Form>
    </Container>);
}

export default Register;