import {Button, Row, Col, Modal, Form, InputGroup} from 'react-bootstrap';
import {client} from '../../AxiosInterceptor.js';

import FormField from '../FormField.jsx';

function JourneyPlanModal(props)
{
    const {isNewJourney, idJourneyPlans,
        journeyPlans, setJourneyPlans,
        name, setName,
        startDate, setStartDate,
        endDate, setEndDate,
        description, setDescription,
        locations, setLocations,
        activities, setActivities,
        modal, showModal
    } = props;

    const handleClose = ()=>{
        showModal(false);
    }
    return (<Modal show={modal} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>{isNewJourney?"New":"Edit"} Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Row className="mb-3">
                    <FormField field={name} setField={setName} label="Name" />
                </Row>
                <Row className="mb-3">
                    <FormField field={startDate} setField={setStartDate} type="date" label="Start Date" />
                    <FormField field={endDate} setField={setEndDate} type="date" label="End Date" />
                </Row>
                <Row className="mb-3">
                    <FormField field={description} setField={setDescription} type="textarea" label="Description" />
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label htmlFor="tags">Locations (comma separated list)</Form.Label>
                        <InputGroup>
                            <Form.Control id="tags" value={locations.join(", ")} onChange={(e) => {
                                setLocations(e.target.value.split(", "));
                            }}/>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label htmlFor="tags">Activities (comma separated list)</Form.Label>
                        <InputGroup>
                            <Form.Control id="tags" value={activities.join(", ")} onChange={(e) => {

                                setActivities(e.target.value.split(", "));
                            }}/>
                        </InputGroup>
                    </Form.Group>
                </Row>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={async()=>{
                let http = client.patch;
                const data = {name, startDate, endDate, description, locations:locations.map((location)=>location.trim()), activities:activities.map((activity)=>activity.trim())};
                if(isNewJourney)
                {
                    http = client.post;
                }
                else
                {
                    data.idJourneyPlans = idJourneyPlans;
                }

                const request = await http('/plans', data, {headers: {"Content-Type": "application/json"}});
                data.activities = request.data.activities;
                data.locations = request.data.locations;
                if(isNewJourney)
                {
                    setJourneyPlans([...journeyPlans, request]);
                }
                else
                {
                    setJourneyPlans(journeyPlans.map((plan)=>{
                        if(plan.idJourneyPlans === idJourneyPlans)
                        {
                            return data;
                        }
                        else
                        {
                            return plan;
                        }
                    }));
                }

                showModal(false);
            }}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>);
}

export default JourneyPlanModal;