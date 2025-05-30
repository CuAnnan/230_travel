import {Button, Row, Col, Modal, Form, InputGroup} from 'react-bootstrap';
import {client} from '../../AxiosInterceptor.js';

import FormField from '../FormField.jsx';

function NewLogModal({isNewLog, modal, setModal, title, setTitle, startDate, setStartDate, endDate, setEndDate, description, setDescription, tags=[], setTags, travelLogs, setTravelLogs, idTravelLogs, travelLog})
{
    const handleClose = ()=>{
        setModal(false);
    };
    return (<Modal show={modal} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>{isNewLog?"New":"Edit"} Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Row className="mb-3">
                    <FormField field={title} setField={setTitle} label="Title" />
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
                        <Form.Label htmlFor="tags">Tags (comma separated list)</Form.Label>
                        <InputGroup>
                            <Form.Control id="tags" value={tags.join(", ")} onChange={(e) => {
                                setTags(e.target.value.split(","));
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
                const data = {title, startDate, endDate, description, tags:tags.map((tag)=>tag.trim())};
                if(isNewLog)
                {
                    http = client.post;
                }
                else
                {
                    data.idTravelLogs = idTravelLogs;
                }


                const response = await http('/logs', data, {headers: {"Content-Type": "application/json"}});
                data.tags = response.data.tags;
                if(isNewLog)
                {
                    data.idTravelLogs = response.data.insertId;
                    setTravelLogs([...travelLogs, data]);
                }
                else
                {
                    setTravelLogs(travelLogs.map(log=>{
                        if(log.idTravelLogs === travelLog.idTravelLogs)
                        {
                            return data;
                        }
                        else
                        {
                            return log;
                        }
                    }))
                }
                setModal(false);
            }}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>);
}

export default NewLogModal;