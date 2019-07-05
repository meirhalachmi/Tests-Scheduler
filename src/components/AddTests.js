import React from "react";
import {Button, Col, Form} from 'react-bootstrap';
import {range} from "../utils/utils";
import axios from "axios";
import {connect} from "react-redux";
const daysInWeek = {
    1: "ראשון",
    2: "שני",
    3: "שלישי",
    4: "רביעי",
    5: "חמישי",
    6: "שישי"
}

class AddTests extends React.Component{
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {numOfOptionalTimes: 1, numOfTests: 1}
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
                                <Form.Control required as="select" name="subject">
                                    {this.props.subjects.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formGridClasses">
                                <Form.Label>כיתות משתתפות</Form.Label>
                                <Form.Control required as="select" multiple name="participatingClasses">
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
                                <Form.Control required as="select" name="numOfTests" onChange={(e) => {
                                    this.setState({numOfTests: e.target.value})
                                }}>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        {this.state.numOfTests > 1 && (
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>מרווח מינימלי בין מבחנים</Form.Label>
                                    <Form.Control required type="number" name="daysGap" defaultValue={30} step={1}
                                                  min={2} max={365} //TODO: Change max to the number of days in the interval
                                    />
                                </Form.Group>
                            </Col>
                        )}

                    </Form.Row>
                    <Form.Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>תאריך מינימלי</Form.Label>
                                <Form.Control required type="date" name="minDate"/>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>תאריך מקסימלי</Form.Label>
                                <Form.Control required type="date" name="maxDate"/>
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    {range(0, this.state.numOfOptionalTimes-1).map(i => {
                        return (
                            <Form.Row>
                                <Col md={4}>
                                    <Form.Group>
                                        {i === 0 && <Form.Label>יום</Form.Label>}
                                        <Form.Control required key={i} as="select" name={"optionalDaysInWeek" + i.toString()}>
                                            {Object.entries(daysInWeek).map(entry => (
                                                <option value={entry[0]} key={entry[0]}>{entry[1]}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        {i === 0 && <Form.Label>שעת התחלה</Form.Label>}
                                        <Form.Control required key={i} type="number" name={"optionalStartHours" + i.toString()} defaultValue={0} step={1}
                                                      min={0} max={9} //TODO: Change max to the number of days in the interval
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        {i === 0 && <Form.Label>שעת סיום</Form.Label>}
                                        <Form.Control requiredkey={i} type="number" name={"optionalEndHours" + i.toString()} step={1} defaultValue={9}
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

        const msg = {
            subject: e.target.subject.value,
            participatingClasses:  [[...e.target.participatingClasses.options].filter(o => o.selected).map(o => o.value)],
            numOfTests: e.target.numOfTests.value,
            daysGap: this.state.numOfTests > 1 ? e.target.daysGap.value : 0,
            minDate: e.target.minDate.value,
            maxDate: e.target.maxDate.value,
            optionalDaysInWeek: [range(0, this.state.numOfOptionalTimes-1)
                .map( i => e.target['optionalDaysInWeek' + i].value)],
            optionalStartHours: [range(0, this.state.numOfOptionalTimes-1)
                .map( i => e.target['optionalStartHours' + i].value)],
            optionalEndHours: [range(0, this.state.numOfOptionalTimes-1)
                .map( i => e.target['optionalEndHours' + i].value)],
            difficulty: 5, //TODO
        }
        console.log(msg)
        axios.post('http://localhost:5000/tests', msg)
            .catch(function (error) {
                console.error(error);
            })
    }

}

const mapStateToProps = (state) => ({
    subjects : state.subjects.items,
    classes : state.classes.items
})
export default connect(mapStateToProps)(AddTests);