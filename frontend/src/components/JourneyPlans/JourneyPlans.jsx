import {useState, useEffect} from 'react';
import {Button, Row, Col, Container} from 'react-bootstrap';
import {client} from '../../AxiosInterceptor.js';
import formatDate from "../formatDate.js";
import FormField from '../FormField.jsx';
import './journeyPlans.css';
import JourneyPlanModal from "./JourneyPlanModal.jsx";


function JourneyPlans()
{
    const [journeyPlans, setJourneyPlans] = useState([]);
    const [modal, showModal] = useState(false);
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [locations, setLocations] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isNewJourney, setIsNewJourney] = useState(false);
    const [idJourneyPlans, setIdJourneyPlans] = useState("");

    const getDateString = (date) => {return new Date(date).toISOString().split('T')[0]};

    useEffect(()=>{
        client.get('/plans').then((response)=>{
            setJourneyPlans(response.data.plans);
        });
    },[]);

    return (<>
        <h2 className="text-center">Journey Plans</h2>
        <JourneyPlanModal
            showModal={showModal} modal={modal}
            name={name} setName={setName}
            activities={activities} setActivities={setActivities}
            locations={locations} setLocations={setLocations}
            journeyPlans={journeyPlans} setJourneyPlans={setJourneyPlans}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            description={description} setDescription={setDescription}
            isNewJourney={isNewJourney}
            idJourneyPlans={idJourneyPlans}
        />
        <Container>
            <Row>
                <Col className="text-center">
                    <Button variant="primary" onClick={() =>{
                        setIsNewJourney(true);
                        showModal(true);
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
                            <Button variant="primary" onClick={() => {
                                setIsNewJourney(false);
                                setName(plan.name);
                                setStartDate(getDateString(plan.startDate));
                                setEndDate(getDateString(plan.endDate));
                                setIdJourneyPlans(plan.idJourneyPlans);
                                setDescription(plan.description);
                                setLocations(plan.locations.map(location=>location.name));
                                setActivities(plan.activities.map(activity=>activity.name));
                                showModal(true);
                            }}>&#9999;</Button>
                            <Button variant="danger" onClick={async () => {
                                client.delete(
                                    `/plans/${plan.idJourneyPlans}`,
                                    {headers: {"Content-Type": "application/json"}}
                                ).then(()=>{
                                    setJourneyPlans(journeyPlans.filter(journeyPlan=>plan.idJourneyPlans !== journeyPlan.idJourneyPlans ));
                                });
                            }}>&#128465;</Button>
                        </div>
                    </Col>
                </Row>);
            })}
        </Container>
    </>);
}

export default JourneyPlans;