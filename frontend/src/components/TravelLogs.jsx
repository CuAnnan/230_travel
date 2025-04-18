import {useState, useEffect} from 'react';
import {Container,InputGroup, Button, Row, Col, Form} from 'react-bootstrap';
import {client} from '../AxiosInterceptor.js';

import FormField from './FormField.jsx';

function TravelLogs()
{
    const [travelPlans, settravelPlans] = useState([]);

    useEffect(()=>{
        client.get('/logs').then((response)=>{
            settravelPlans(response.data);
        }).catch((err)=>{
            console.log(err);
        });
    }, []);

    return (<>
        <h2>Travel Logs</h2>

        {travelPlans.map((plan, idx)=>(<Row key={idx}>
            <Col>{plan.title}</Col><Col>{plan.startDate}</Col><Col>{plan.title}</Col><Col>{plan.postDate}</Col>
            <Col>
                <Button variant="primary" onClick={() => settravelPlans([])}>&#9999;</Button>
                <Button variant="danger" onClick={() => settravelPlans([])}>&#128465;</Button>
            </Col>
        </Row>))}
    </>);

}

export default TravelLogs;