import React from "react";
import {Button, Col, Form} from 'react-bootstrap';
import {formatDate, range} from "../utils/utils";
import axios from "axios";
import {connect} from "react-redux";
import Container from "react-bootstrap/Container";

class AddBlockers extends React.Component{
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {numOfInstances: 1}
    }
    render() {
        return (
            <Container style={{width: "85%"}}>
                {/*<h1>הוספת אילוץ</h1>*/}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Row>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>שם האילוץ</Form.Label>
                                <Form.Control required type="text" name="name" placeholder="שם האילוץ"/>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>כיתות משתתפות</Form.Label>
                                <Form.Control required as="select" multiple name="participatingClasses">
                                    {this.props.classes.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}

                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>מקצועות משתתפים</Form.Label>
                                <Form.Control required as="select" multiple name="participatingSubjects">
                                    {this.props.subjects.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}

                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    {range(0, this.state.numOfInstances-1).map(i => {
                        return (

                            <Form.Row>
                                <Col md={6}>
                                    <Form.Group>
                                        {i === 0 && <Form.Label>תאריך התחלה</Form.Label>}
                                        <Form.Control required type="date" name={"startDate" + i.toString()}
                                                      min={this.props.minDate} max={this.props.maxDate}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        {i === 0 && <Form.Label>תאריך סיום</Form.Label>}
                                        <Form.Control required type="date" name={"endDate" + i.toString()}
                                                      min={this.props.minDate} max={this.props.maxDate}
                                        />
                                    </Form.Group>
                                </Col>
                            </Form.Row>
                        )
                    })}


                    <Form.Row>
                        <Col md={3}>
                            <Button onClick={(event) => {
                                this.setState({numOfInstances: this.state.numOfInstances + 1});
                            }}>הוסף מועד</Button>
                        </Col>
                        <Col md = {3}>
                            {this.state.numOfInstances > 1 &&
                            <Button onClick={(event) => {
                                this.setState({numOfInstances: this.state.numOfInstances - 1})
                            }}>מחק מועד</Button>}
                        </Col>
                    </Form.Row>



                    <Form.Row>
                        <Col md={3}>
                            <Button type="Submit">שלח</Button>
                        </Col>
                    </Form.Row>
                </Form>
            </Container>
        )
    }

    handleSubmit(e) {
        e.preventDefault();

        const msg = {
            session: this.props.session.id,
            name: e.target.name.value,
            participatingClasses:  [[...e.target.participatingClasses.options].filter(o => o.selected).map(o => o.value)],
            participatingSubjects:  [[...e.target.participatingSubjects.options].filter(o => o.selected).map(o => o.value)],
            startDates: [range(0, this.state.numOfInstances-1)
                .map( i => e.target['startDate' + i].value)],
            endDates: [range(0, this.state.numOfInstances-1)
                .map( i => e.target['endDate' + i].value)],
        }
        axios.post('http://localhost:5000/blockers', msg)
            .catch(function (error) {
                console.error(error);
                alert(error);
            })
            .then(() => {
                if (this.props.afterSend){
                    this.props.afterSend()
                }

            })
    }

}

const mapStateToProps = (state) => ({
    session: state.session.items,
    subjects : state.subjects.items,
    classes : state.classes.items,
    minDate: formatDate(state.session.items.startDate),
    maxDate: formatDate(state.session.items.endDate),

})
export default connect(mapStateToProps)(AddBlockers);