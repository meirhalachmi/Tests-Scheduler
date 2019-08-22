import React from "react";
import axios from 'axios/index';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux'
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
// import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import {fetchSession} from "../actions";

class SetupSession extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            subjects: ['קוסמות', 'שיקויים'], classes: ['א1', 'א2'],
            defaults: {
                sessionName: '',
                minDate: '2019-01-01', maxDate: '2019-05-01', daysGap: 30, numOfHours: 1, isZeroHour: false
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            defaults: {...this.state.defaults, [name]: value}
        });
    }

    sendSession = (e) => {
        e.preventDefault();
        const msg = {
            subjects: [this.state.subjects],
            classes: [this.state.classes],
            ...this.state.defaults
        }
        axios.post('https://tests-scheduler-app.herokuapp.com/initsession', msg)
            .then(res => res.data)
            .then(res => this.props.dispatch(fetchSession(res.session)))
            .then(() => this.props.history.push('/subjects'))
            .catch(console.error);
    }


    render(){
        const DefaultsForm = <Form>
            <Form.Row>
                <Col md={12}>
                    <Form.Group>
                        <Form.Label>כינוי</Form.Label>
                        <Form.Control type="text" required
                                      value={this.state.sessionName} name="sessionName"
                                      onChange={this.handleInputChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>תאריך התחלה</Form.Label>
                        <Form.Control required type="date"
                                      value={this.state.defaults.minDate} name="minDate"
                                      onChange={this.handleInputChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>תאריך סיום</Form.Label>
                        <Form.Control required type="date" value={this.state.defaults.maxDate} name="maxDate"
                                      onChange={this.handleInputChange}
                        />
                    </Form.Group>
                </Col>
            </Form.Row>
            <Form.Row>
                <Col md={6}>
                    <Form.Group >
                        <Form.Label>מרווח מינימלי בין מבחנים באותו המקצוע</Form.Label>
                        <Form.Control required type="number" name="daysGap" value={this.state.defaults.daysGap}
                                      step={1}
                                      min={2} max={365} //TODO: Change max to the number of days in the interval
                                      onChange={this.handleInputChange}
                        />
                    </Form.Group>
                </Col>
            </Form.Row>
            <Form.Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>מספר שעות ביום</Form.Label>
                        <Form.Control required type="number" name="numOfHours"
                                      value={this.state.defaults.numOfHours} min={1}
                                      onChange={this.handleInputChange}
                        />
                    </Form.Group>
                </Col>
            </Form.Row>
            <Form.Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Check name="isZeroHour" type="checkbox" checked={this.state.defaults.isZeroHour}
                                    label="יש שעת אפס"
                                      onChange={this.handleInputChange}
                        />
                    </Form.Group>
                </Col>


            </Form.Row>
        </Form>;
        return(
            <Container style={{width: "70%"}}>
                <h1>הגדרות</h1>

                {/*<Accordion defaultActiveKey="2">*/}
                    <Card>
                        {/*<Accordion.Toggle as={Card.Header} eventKey="2">*/}
                            <h2>הגדרות כלליות</h2>
                        {/*</Accordion.Toggle>*/}
                        {/*<Accordion.Collapse eventKey="2">*/}
                            <Card.Body>
                                {DefaultsForm}
                            </Card.Body>
                        {/*</Accordion.Collapse>*/}
                    </Card>
                    <Card>
                        {/*<Accordion.Toggle as={Card.Header} eventKey="0">*/}
                            <h2>כיתות</h2>
                        {/*</Accordion.Toggle>*/}
                        {/*<Accordion.Collapse eventKey="0">*/}
                            <Card.Body>
                                <List title="כיתות" sendText="הוסף כיתה"
                                      setParentList={list => this.setState({classes: list})}/>
                            </Card.Body>
                        {/*</Accordion.Collapse>*/}
                    </Card>
                    <Card>
                        {/*<Accordion.Toggle as={Card.Header} eventKey="1">*/}
                            <h2>מקצועות</h2>
                        {/*</Accordion.Toggle>*/}
                        {/*<Accordion.Collapse eventKey="1">*/}
                            <Card.Body>
                                <List title="מקצועות" sendText="הוסף מקצוע"
                                      setParentList={list => this.setState({subjects: list})}/>
                            </Card.Body>
                        {/*</Accordion.Collapse>*/}
                    </Card>

                    <Button onClick={this.sendSession}>שמור והמשך להגדרת אשכלות</Button>
                {/*// </Accordion>*/}


            </Container>
        )
    }
}

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text: '', list:[]};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // this.props.dispatch(fetchSubjects);
    }


    render() {
        return (
            <div>
                {/*<h2>{this.props.title}</h2>*/}
                <ul>
                    {this.state.list.map((item, idx) => {
                        return <li key={`item-${idx}`}>{item}</li>
                    })}
                </ul>
                <form>
                    <input
                        id="new-todo"
                        onChange={this.handleChange}
                        value={this.state.text}
                    />
                    <Button type="submit" onClick={this.handleSubmit}>
                        {this.props.sendText}
                    </Button>
                </form>
            </div>
        )
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.text.length) {
            return;
        }
        const newList = [...this.state.list, this.state.text]
        this.setState({list: newList})
        this.props.setParentList(newList)
        this.setState(() => ({
            text: ''
        }));


    }

}

const mapStateToProps = (state) => ({
    // subjects : state.subjects.items
})

export default connect(mapStateToProps)(SetupSession);