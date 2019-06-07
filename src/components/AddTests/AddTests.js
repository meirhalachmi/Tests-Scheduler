import React, {Fragment, Suspense, useEffect, useState} from "react";
import {Row, Col, Form, Button} from 'react-bootstrap';
import { useFetch } from 'react-hooks-fetch';

const Err = ({ error }) => <span>Error:{error.message}</span>;

const DisplayRemoteData = (props) => {
    const { error, data } = useFetch(props.url);
    if (error) return <Err error={error} />;
    if (!data) return null;
    return data.map(props.parser)
};

const useSignUpForm = (initialState) => {
    const [inputs, setInputs] = useState(initialState);
    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
    }
    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
        console.log(inputs)
    }
    return {
        handleSubmit,
        handleInputChange,
        inputs
    };
}

export default function AddTests() {
    const DEFAULT_GAP = 30; // TODO: Make input
    const {inputs, handleInputChange, handleSubmit} = useSignUpForm(
        {
            daysGap: 30,
            minDate: "2019-04-01",
            maxDate: "2019-04-30",
            subject: '',
            numOfTests: 2
        }
    );
    // inputs.gap = 30;
    const [testData, setTestData] = useState({
        minDate: new Date('April 1, 2019'),
        maxDate: new Date('April 30, 2019'),
        subject: null
    })

    return (
        <div style={{width: "50%"}}>
            <h1>הוספת מבחן</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                    <Col>
                        <Form.Group controlId="formGridSubject">
                            <Form.Label>נושא המבחן</Form.Label>
                            <Form.Control as="select" name="subject" value={inputs.subject} onChange={handleInputChange}>
                                <Suspense fallback={<option></option>}>
                                    <DisplayRemoteData url="http://localhost:5000/subjects"
                                                       parser={(s) => (<option key={s.id}>{s.name}</option>)}/>
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


            </Form>
        </div>
    )
}