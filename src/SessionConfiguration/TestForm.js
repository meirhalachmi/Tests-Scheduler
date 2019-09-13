import React from "react";
import {Button, Col, Form} from 'react-bootstrap';
import {formatDateForForms, range} from "../utils/utils";
import axios from "axios";
import {connect} from "react-redux";
import Container from "react-bootstrap/Container";
const daysInWeek = {
  0: "ראשון",
  1: "שני",
  2: "שלישי",
  3: "רביעי",
  4: "חמישי",
  5: "שישי"
}

class TestForm extends React.Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    const numOfOptionalTimes = this.props.testToEdit ? this.props.testToEdit['optionalDaysInWeek'].length : 1;
    const numOfTests = this.props.testToEdit ? this.props.testToEdit['numOfTests'] : 1;
    this.state = {numOfOptionalTimes: numOfOptionalTimes, numOfTests: numOfTests}
  }

  /*
daysGap: 5
difficulty: 5
id: 28
label: null
maxDate: "2019-08-31"
minDate: "2019-08-01"
name: "היסטוריה"
numOfTests: 2
optionalDaysInWeek: (2) [0, 3]
optionalEndHours: (2) [9, 9]
optionalStartHours: (2) [1, 1]
participatingClasses: [21]
subject: 29

  */

  getCurrentValue(fieldName){
    if (this.props.testToEdit){
      const test = this.props.testToEdit;
      if (fieldName.startsWith('optionalDaysInWeek')) {
        const ind = parseInt(fieldName.replace('optionalDaysInWeek', ''));
        return test['optionalDaysInWeek'][ind];
      } else if (fieldName.startsWith('optionalEndHours')) {
        const ind = parseInt(fieldName.replace('optionalEndHours', ''));
        return test['optionalEndHours'][ind];
      } else if (fieldName.startsWith('optionalStartHours')) {
        const ind = parseInt(fieldName.replace('optionalStartHours', ''));
        return test['optionalStartHours'][ind];
      } else {
        return test[fieldName]
      }
    }
  }

  render() {
    return (
      <Container style={{width: "85%"}}>
        {/*<h1>הוספת מבחן</h1>*/}
        <Form onSubmit={this.handleSubmit}>
          <Form.Row>
            <Col md={6}>
              <Form.Group controlId="formGridSubject">
                <Form.Label>נושא המבחן</Form.Label>
                <Form.Control required as="select" name="subject" defaultValue={this.getCurrentValue('subject')}>
                  {this.props.subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="label">
                <Form.Label>תיאור (לא חובה)</Form.Label>
                <Form.Control type="text" name="label" defaultValue={this.getCurrentValue('label')}
                              placeholder="לדוגמא- בגרות פנימית / מתכונת" maxLength={20}/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formGridClasses" style={{height: "100%"}}>
                <Form.Label>כיתות משתתפות</Form.Label>
                <Form.Control required as="select" multiple name="participatingClasses"
                              style={{height: "80%"}}
                              defaultValue={this.getCurrentValue('participatingClasses')}
                >
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
                }} defaultValue={this.getCurrentValue('numOfTests')}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </Form.Control>
              </Form.Group>
            </Col>
            {this.state.numOfTests > 1 && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label>מרווח מינימלי בין מבחנים</Form.Label>
                  <Form.Control required type="number" name="daysGap"
                                defaultValue={
                                  this.props.testToEdit ?
                                    this.getCurrentValue('daysGap') :
                                    this.props.session.defaultGap
                                } step={1}
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
                <Form.Control required type="date" format="DD-MM-YYYY" name="minDate"
                              min={this.props.minDate} max={this.props.maxDate}
                              defaultValue={
                                this.props.testToEdit ?
                                  this.getCurrentValue('minDate') :
                                  this.props.minDate
                              }/>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>תאריך מקסימלי</Form.Label>
                <Form.Control required type="date" format="DD-MM-YYYY" name="maxDate"
                              min={this.props.minDate} max={this.props.maxDate}
                              defaultValue={
                                this.props.testToEdit ?
                                  this.getCurrentValue('maxDate') :
                                  this.props.maxDate

                              }/>
              </Form.Group>
            </Col>
          </Form.Row>

          {range(0, this.state.numOfOptionalTimes-1).map(i => {
            return (
              <Form.Row>
                <Col md={4}>
                  <Form.Group>
                    {i === 0 && <Form.Label>יום</Form.Label>}
                    <Form.Control required key={i} as="select"
                                  name={"optionalDaysInWeek" + i.toString()}
                                  defaultValue={this.getCurrentValue("optionalDaysInWeek" + i.toString())}
                    >
                      {Object.entries(daysInWeek).map(entry => (
                        <option value={entry[0]} key={entry[0]}>{entry[1]}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    {i === 0 && <Form.Label>שעת התחלה</Form.Label>}
                    <Form.Control required key={i} type="number" name={"optionalStartHours" + i.toString()}
                                  defaultValue={
                                    this.props.testToEdit ?
                                      this.getCurrentValue("optionalStartHours" + i.toString()) :
                                      this.props.session.startHour
                                  } step={1}
                                  min={this.props.session.startHour} max={this.props.session.endHour}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    {i === 0 && <Form.Label>שעת סיום</Form.Label>}
                    <Form.Control requiredkey={i} type="number" name={"optionalEndHours" + i.toString()}
                                  step={1} defaultValue={
                      this.props.testToEdit ?
                        this.getCurrentValue("optionalEndHours" + i.toString()) :
                        this.props.session.endHour
                    }
                                  min={this.props.session.startHour} max={this.props.session.endHour} //TODO: Change max to the number of days in the interval
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
              <Button type="Submit">{this.props.testToEdit ? "עדכן מבחן" : "הוסף מבחן"}</Button>
            </Col>
          </Form.Row>
        </Form>
      </Container>
    )
  }

  handleSubmit(e) {
    e.preventDefault();

    const msg = {
      label: e.target.label.value,
      session: this.props.session.id,
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

    if (this.props.testToEdit){
      msg['id'] = this.props.testToEdit.id;
    }

    axios.post(process.env.REACT_APP_API_URL + '/tests', msg)
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
  session : state.session.items,
  subjects : state.subjects.items,
  classes : state.classes.items,
  minDate: formatDateForForms(state.session.items.startDate),
  maxDate: formatDateForForms(state.session.items.endDate),
})
export default connect(mapStateToProps)(TestForm);
