import React, {Suspense, useState} from "react";
import {Button, Col, Form} from 'react-bootstrap';
import {DisplayRemoteData, range, sortByName} from "../../utils/utils";
import axios from "axios";
import {connect} from "react-redux";


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

class AddTestsClass extends React.Component{
    constructor(props) {
        super(props);
        this.state = {numOfOptionalTimes: 1}
    }
    render() {
        return (
            <div style={{width: "50%"}}>
                <h1>הוספת מבחן</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Row>
                        <Col md={6}>
                            <Form.Group controlId="formGridSubject">
                                <Form.Label>נושא המבחן</Form.Label>
                                <Form.Control as="select" name="subject">
                                    {this.props.subjects.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formGridClasses">
                                <Form.Label>כיתות משתתפות</Form.Label>
                                <Form.Control as="select" multiple name="classes"> //TODO: less hacky
                                    {this.props.classes.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}

                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>מספר מבחנים</Form.Label>
                                <Form.Control as="select" name="numOfTests">
                                    <option>1</option>
                                    <option>2</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>מרווח מינימלי בין מבחנים</Form.Label>
                                <Form.Control type="number" name="daysGap" defaultValue={30} step={1}
                                              min={2} max={365} //TODO: Change max to the number of days in the interval
                                />
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>תאריך מינימלי</Form.Label>
                                <Form.Control type="date" name="minDate"/>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>תאריך מקסימלי</Form.Label>
                                <Form.Control type="date" name="maxDate"/>
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    {range(0, this.state.numOfOptionalTimes-1).map(i => {
                        return (
                            <Form.Row>
                                <Col md={4}>
                                    <Form.Group>
                                        {i === 0 && <Form.Label>יום</Form.Label>}
                                        <Form.Control accessKey={i} as="select" name={"optionalDaysInWeek"}>
                                            {Object.entries(daysInWeek).map(entry => (
                                                <option value={entry[0]} key={entry[0]}>{entry[1]}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        {i === 0 && <Form.Label>שעת התחלה</Form.Label>}
                                        <Form.Control accessKey={i} type="number" name={"optionalStartHours"} defaultValue={0} step={1}
                                                      min={0} max={9} //TODO: Change max to the number of days in the interval
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        {i === 0 && <Form.Label>שעת סיום</Form.Label>}
                                        <Form.Control accessKey={i} type="number" name={"optionalEndHours"} step={1} defaultValue={9}
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
                                this.setState({numOfOptionalTimes: this.state.numOfOptionalTimes + 1});
                                // refresh(event);
                            }}>הוסף מועד</Button>
                        </Col>
                        <Col md = {3}>
                            {this.state.numOfOptionalTimes > 1 &&
                            <Button onClick={(event) => {
                                this.setState({numOfOptionalTimes: this.state.numOfOptionalTimes - 1})
                            }}>מחק מועד</Button>}
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col md={3}>
                            <Button type="Submit">שלח</Button>
                        </Col>
                    </Form.Row>
                </Form>
            </div>
        )
    }

    handleSubmit(e) {
        e.preventDefault();
        window.alert('TODO')
    }

}

const mapStateToProps = (state) => ({
    subjects : state.subjects.items,
    classes : state.classes.items
})
export default connect(mapStateToProps)(AddTestsClass);