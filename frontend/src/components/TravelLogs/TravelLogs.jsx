import {useState, useEffect} from 'react';
import {Button, Row, Col, Container} from 'react-bootstrap';
import {client} from '../../AxiosInterceptor.js';
import './TravelLogs.css';
import md5 from "../md5.js";


import NewLogModal from "./NewLogModal.jsx";

function TravelLogs()
{
    const [travelPlans, setTravelPlans] = useState([]);
    const [modal, setModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isNewLog, setIsNewLog] = useState(false);
    const [tags, setTags] = useState([]);


    useEffect(()=>{
        client.get('/logs').then((response)=>{
            console.log(response.data);
            setTravelPlans(response.data);
        }).catch((err)=>{
            console.log(err);
        });
    }, []);

    const formatDate = (dateString)=> new Date(dateString).toLocaleDateString('en-IE', {
        weekday: 'short', // long, short, narrow
        day: 'numeric', // numeric, 2-digit
        year: 'numeric', // numeric, 2-digit
        month: 'long', // numeric, 2-digit, long, short, narrow
    });

    const generateColorCode = (textString)=>md5(textString).substring(0, 6);



    return (<>
        <h2 className="text-center">Travel Logs</h2>
        <NewLogModal
            isNewLog={isNewLog}
            modal={modal} setModal={setModal}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            description={description} setDescription={setDescription}
            setTitle={setTitle} title={title}
            travelPlans={travelPlans} setTravelPlans={setTravelPlans}
            tags={tags} setTags={setTags} />
        <Container>
            <Row>
                <Col className="text-center">
                    <Button variant="primary" onClick={() =>{
                        setIsNewLog(true);
                        setModal(true);
                    }}>
                        Add new Travel Log
                    </Button>
                </Col>
            </Row>
            <Row className="mb3 travelLogTitles">
                <Col>Title</Col>
                <Col>Start Date</Col>
                <Col>End Date</Col>
                <Col>Post Date</Col>
                <Col>Description</Col>
                <Col>Tags</Col>
                <Col>&nbsp;</Col>
            </Row>
            {travelPlans.map((plan, idx)=>(<Row key={idx} className="travelLog">
                <Col>{plan.title}</Col>
                <Col>{formatDate(plan.startDate)}</Col>
                <Col>{formatDate(plan.endDate)}</Col>
                <Col>{formatDate(plan.postDate)}</Col>
                <Col>{plan.description}</Col>
                <Col>
                    {plan.tags.map((tagObject, idx)=>{
                        return (
                            <span className="tag" key={idx}>{tagObject.tag}</span>
                        );
                    })}
                </Col>
                <Col>
                    <Button variant="primary" onClick={() => {}}>&#9999;</Button>
                    <Button variant="danger" onClick={() => {}}>&#128465;</Button>
                </Col>
            </Row>
        ))}
        </Container>
    </>);

}

export default TravelLogs;