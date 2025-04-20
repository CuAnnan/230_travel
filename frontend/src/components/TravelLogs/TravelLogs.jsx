import {useState, useEffect} from 'react';
import {Button, Row, Col, Container} from 'react-bootstrap';
import {client} from '../../AxiosInterceptor.js';
import './TravelLogs.css';
import md5 from "../md5.js";



import NewLogModal from "./NewLogModal.jsx";
import getContrastingHex from "../contrastingColor.js";

function TravelLogs()
{
    const [travelLogs, setTravelLogs] = useState([]);
    const [modal, setModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isNewLog, setIsNewLog] = useState(false);
    const [tags, setTags] = useState([]);
    const [idTravelLogs, setIdTravelLogs] = useState([]);
    const [travelLog, setTravelLog] = useState({});


    useEffect(()=>{
        client.get('/logs').then((response)=>{
            setTravelLogs(response.data);
        }).catch((err)=>{
            console.log(err);
        });
    }, []);

    const formatDate = (dateString)=> new Date(dateString).toLocaleDateString('en-IE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const generateColorCode = (textString)=>md5(textString).substring(0, 6);
    console.log(travelLogs);

    return (<>
        <h2 className="text-center">Travel Logs</h2>
        <NewLogModal
            isNewLog={isNewLog}
            modal={modal} setModal={setModal}
            idTravelLogs={idTravelLogs}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            description={description} setDescription={setDescription}
            setTitle={setTitle} title={title}
            travelLogs={travelLogs} setTravelLogs={setTravelLogs}
            travelLog={travelLog} setTravelLog={setTravelLog}
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
                <Col sm="1">Title</Col>
                <Col className="dateCol">Start Date</Col>
                <Col className="dateCol">End Date</Col>
                <Col className="dateCol">Post Date</Col>
                <Col sm="3">Description</Col>
                <Col>Tags</Col>
                <Col>&nbsp;</Col>
            </Row>
            {travelLogs.map((log, idx)=>{

                return (<Row key={idx} className="travelLog">
                <Col sm="1">{log.title}</Col>
                <Col className="dateCol">{formatDate(log.startDate)}</Col>
                <Col className="dateCol">{formatDate(log.endDate)}</Col>
                <Col className="dateCol">{formatDate(log.postDate)}</Col>
                <Col sm="3">{log.description}</Col>
                <Col>
                    {log.tags.map((tagObject, idx)=>{
                        const bgColor = generateColorCode(tagObject.tag);
                        const color = getContrastingHex(bgColor);

                        const backgroundColor = '#'+bgColor;
                        const style = {color, backgroundColor};
                         return (
                            <span style={style} className="tag" key={idx}>{tagObject.tag}</span>
                        );
                    })}
                </Col>
                <Col className="align-items-center">
                    <div className="buttons">
                        <Button variant="primary" onClick={() => {
                            setIsNewLog(false);
                            setIdTravelLogs(log.idTravelLogs);
                            setStartDate(new Date(log.startDate).toISOString().split('T')[0]);
                            setEndDate(new Date(log.endDate).toISOString().split('T')[0]);
                            setTitle(log.title);
                            setDescription(log.description);
                            setTags((log.tags.map((tagObject)=>tagObject.tag)));
                            setTravelLog(log);
                            setModal(true);
                        }}>&#9999;</Button>
                        <Button variant="danger" onClick={() => {
                            client.delete(
                                `/logs/${log.idTravelLogs}`,
                                {headers: {"Content-Type": "application/json"}}
                            ).then(()=>{
                                setTravelLogs(travelLogs.filter((travelLog)=>travelLog.idTravelLogs !== log.idTravelLogs));
                            });
                        }}>&#128465;</Button>
                    </div>
                </Col>
            </Row>
        )})}
        </Container>
    </>);

}

export default TravelLogs;