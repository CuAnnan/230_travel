import {useState, useEffect} from 'react';
import {Button, Row, Col, Container} from 'react-bootstrap';
import {client} from '../../AxiosInterceptor.js';
import formatDate from "../formatDate.js";
import FormField from '../FormField.jsx';
import './journeyPlans.css';


function JourneyPlans()
{
    const [journeyPlans, setJourneyPlans] = useState([]);


    useEffect(()=>{
        client.get('/journeys').then((response)=>{
            setJourneyPlans(response.data.plans);
        });
    },[]);

    return (<>
        <h2 className="text-center">Journey Plans</h2>
        <Container>
            <Row>
                <Col className="text-center">
                    <Button variant="primary" onClick={() =>{
                    }}>
                        Add new Journey Plan
                    </Button>
                </Col>
            </Row>
            <Row className="mb3 planTitle">
                <Col>Name</Col>
                <Col>Start Date</Col>
                <Col>End Date</Col>
                <Col sm="3">Description</Col>
                <Col>Locations</Col>
                <Col>Activities</Col>
                <Col>&nbsp;</Col>
            </Row>
            {journeyPlans.map((plan, idx) => {
                return (<Row className="mb3 journeyPlanRow" key={idx}>
                    <Col>{plan.name}</Col>
                    <Col>{formatDate(plan.startDate)}</Col>
                    <Col>{formatDate(plan.endDate)}</Col>
                    <Col sm="3">{plan.description}</Col>
                    <Col><ul className="journeyPlanList">
                        {plan.locations.map( (location, lidx) =><li key={lidx}>{location.name}</li>)}
                    </ul></Col>
                    <Col><ul className="journeyPlanList">
                        {plan.activities.map((activity, aidx)=><li key={aidx}>{activity.name}</li>)}
                    </ul></Col>
                    <Col>
                        <div className="buttons">
                            <Button variant="primary" onClick={() => {}}>&#9999;</Button>
                            <Button variant="danger" onClick={() => {}}>&#128465;</Button>
                        </div>
                    </Col>
                </Row>);
            })}
        </Container>
    </>);
}

export default JourneyPlans;