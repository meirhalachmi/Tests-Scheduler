import React, {Suspense, useState} from "react";
import {Col, Form, Button} from 'react-bootstrap';
import { useFetch } from 'react-hooks-fetch';
import {range} from "../../utils/utils";
import axios from "axios";

const Err = ({ error }) => <span>Error:{error.message}</span>;

const DisplayRemoteData = (props) => {
    let { error, data } = useFetch(props.url);
    if (error) return <Err error={error} />;
    if (!data) return null;
    if (props.preProcess){
        data = props.preProcess(data);
    }
    return data.map(props.parserFunction)
};

const useForm = (initialState) => {
    const [inputs, setInputs] = useState(initialState);
    const refresh = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs}))
    }
    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        const msg = Object.assign({}, inputs);
        msg.optionalDaysInWeek = [inputs.optionalDaysInWeek]
        msg.optionalStartHours = [inputs.optionalStartHours]
        msg.optionalEndHours = [inputs.optionalEndHours]
        msg.participatingClasses = [inputs.participatingClasses]
        axios.post('http://localhost:5000/tests', msg)
            .then(response => response.json())
            .catch(function (error) {
                console.log(error);
            });

    }
    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
        console.log(event)
        console.log(inputs)
    }
    const handleInputChangeInArray = (event) => {
        event.persist();
        let ar = inputs[event.target.name];
        ar.splice(parseInt(event.target.accessKey), 1, event.target.value)
        setInputs(inputs => ({...inputs, [event.target.name]: ar}));
    }
    return {
        refresh,
        handleSubmit,
        handleInputChange,
        handleInputChangeInArray,
        inputs
    };
}

const daysInWeek = {
    1: "ראשון",
    2: "שני",
    3: "שלישי",
    4: "רביעי",
    5: "חמישי",
    6: "שישי"
}

function sortByName(list) {
    return list.sort((a, b) => (a.name > b.name) ? 1 : -1);
}

export default function AddTests() {
    const DEFAULT_GAP = 30; // TODO: Make input
    const {inputs, refresh, handleInputChange, handleInputChangeInArray, handleSubmit} = useForm(
        {
            daysGap: DEFAULT_GAP,
            difficulty: 5, //TODO: Add as a form control
            minDate: "2019-04-01",
            maxDate: "2019-04-30",
            subject: 1, //FIXME: Doesn't really control the initial visual state,
            numOfTests: 2,
            numOfOptionalTimes: 1,
            participatingClasses: [],
            optionalDaysInWeek: ["1"],
            optionalStartHours: [1],
            optionalEndHours: [3]
        },
    );

    return (
        <div style={{width: "50%"}}>
            <h1>הוספת מבחן</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                    <Col md={6}>
                        <Form.Group controlId="formGridSubject">
                            <Form.Label>נושא המבחן</Form.Label>
                            <Form.Control as="select" name="subject" onChange={handleInputChange}>
                                <Suspense fallback={<option></option>}>
                                    <DisplayRemoteData url="http://localhost:5000/subjects"
                                                       preProcess={sortByName}
                                                       parserFunction={(s) => (<option selected={s.id===inputs.subject} key={s.id} value={s.id}>{s.name}</option>)}/> //FIXME: Not secure (using the db-id as the value)
                                </Suspense>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formGridClasses">
                            <Form.Label>כיתות משתתפות</Form.Label>
                            <Form.Control as="select" multiple name="classes" onChange={(e)=>{e.persist(); inputs.participatingClasses=Array.from(e.target.selectedOptions).map(c => c.value)}}> //TODO: less hacky
                                <Suspense fallback={<option></option>}>
                                    <DisplayRemoteData url="http://localhost:5000/classes"
                                                       preProcess={sortByName}
                                                       parserFunction={(s) => (<option key={s.id} value={s.id}>{s.name}</option>)}/> //FIXME: Not secure (using the db-id as the value)
                                </Suspense>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>מספר מבחנים</Form.Label>
                            <Form.Control as="select" name="numOfTests" value={inputs.numOfTests} onChange={handleInputChange}>
                                <option>1</option>
                                <option>2</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>מרווח מינימלי בין מבחנים</Form.Label>
                            <Form.Control type="number" name="daysGap" step={1} value={inputs.daysGap} onChange={handleInputChange}
                                          min={2} max={365} //TODO: Change max to the number of days in the interval
                            />
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>תאריך מינימלי</Form.Label>
                            <Form.Control type="date" name="minDate" value={inputs.minDate} onChange={handleInputChange}/>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>תאריך מקסימלי</Form.Label>
                            <Form.Control type="date" name="maxDate" value={inputs.maxDate} onChange={handleInputChange}/>
                        </Form.Group>
                    </Col>
                </Form.Row>

                {range(0, inputs.numOfOptionalTimes-1).map(i => {
                    return (
                        <Form.Row>
                            <Col md={4}>
                                <Form.Group>
                                    {i === 0 && <Form.Label>יום</Form.Label>}
                                    <Form.Control accessKey={i} as="select" name={"optionalDaysInWeek"} value={inputs.optionalDaysInWeek[i]} onChange={handleInputChangeInArray}>
                                        {Object.entries(daysInWeek).map(entry => (
                                            <option value={entry[0]} key={entry[0]}>{entry[1]}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    {i === 0 && <Form.Label>שעת התחלה</Form.Label>}
                                    <Form.Control accessKey={i} type="number" name={"optionalStartHours"} step={1} value={inputs.optionalStartHours[i]} onChange={handleInputChangeInArray}
                                                  min={0} max={9} //TODO: Change max to the number of days in the interval
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    {i === 0 && <Form.Label>שעת סיום</Form.Label>}
                                    <Form.Control accessKey={i} type="number" name={"optionalEndHours"} step={1} value={inputs.optionalEndHours[i]} onChange={handleInputChangeInArray}
                                                  min={0} max={9} //TODO: Change max to the number of days in the interval
                                    />
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    )
                })}
                <Form.Row>
                    <Col md={3}>
                        <Button onClick={(event) => {
                            inputs.numOfOptionalTimes += 1;
                            inputs.optionalDaysInWeek.push("ראשון");
                            inputs.optionalStartHours.push(1);
                            inputs.optionalEndHours.push(3);
                            refresh(event);
                        }}>הוסף מועד</Button>
                    </Col>
                    <Col md = {3}>
                        {inputs.numOfOptionalTimes > 1 &&
                        <Button onClick={(event) => {
                            inputs.numOfOptionalTimes -= 1;
                            inputs.optionalDaysInWeek.splice(-1, 1);
                            inputs.optionalStartHours.splice(-1, 1);
                            inputs.optionalEndHours.splice(-1, 1);
                            refresh(event);
                        }}>מחק מועד</Button>}
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col md={3}>
                        <Button onClick={handleSubmit}>שלח</Button>
                    </Col>
                </Form.Row>

            </Form>
        </div>
    )
}