import React, {Component} from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "./ScheduleCalendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./react-contextmenu.css"

import {formatDateForText} from "../../utils/utils";
import {Event} from "./helpers";
import {Jumbotron} from "react-bootstrap";
import CardDeck from "react-bootstrap/CardDeck";
import Card from "react-bootstrap/Card";

const localizer = BigCalendar.momentLocalizer(moment);

class PrintSchedule extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scheduledTests: [],
      filteredClassOnSchedule: null,
    };
  }

  render() {
    const startDate = moment(this.props.session.startDate);
    const endDate = moment(this.props.session.endDate);

    const dates = [];

    if (endDate.isBefore(startDate)) {
      throw "End date must be greater than start date."
    }

    while (startDate.isBefore(endDate)) {
      dates.push(startDate.format("YYYY-MM-01"));
      startDate.add(1, 'month');
    }
    return (
      <>
        <div className={"page-break"}>
          <Jumbotron>
            <h1>{this.props.session.name}</h1>
            <CardDeck>
              {this.props.classes.map(classInfo => (
                <Card style={{margin: 3}}>
                  <Card.Body style={{padding: 6}}>
                    <Card.Title style={{paddingRight: 10}}>{classInfo.name}</Card.Title>
                    <Card.Text>
                      <ul>
                        {this.props.testEvents
                          .filter(testEvent => testEvent.test.participatingClasses.includes(classInfo.id))
                          .sort((a, b) => (a.start > b.start) ? 1 : -1)
                          .map(testEvent => (
                            <li>{formatDateForText(testEvent.start, false)} - {testEvent.test.name}</li>
                          ))}
                      </ul>
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </CardDeck>
          </Jumbotron>
        </div>
        {dates.map(date => (
          <div className="page-break">
            {this.getBigCalendar(new Date(date), {height: 950, width: 1500})}
          </div>
        ))}
      </>
    );
  }

  getBigCalendar(defaultDate, style={}) {
    return <BigCalendar
      popup
      selectable
      localizer={localizer}
      defaultDate={defaultDate}
      defaultView="month"
      views={{month: true}}
      events={[
        ...this.props.blockerEvents.filter(
          e => this.state.filteredClassOnSchedule === null ||
            e.blocker.participatingClasses.includes(this.state.filteredClassOnSchedule)
        ),
        ...this.props.testEvents.filter(
          e => this.state.filteredClassOnSchedule === null ||
            e.test.participatingClasses.includes(this.state.filteredClassOnSchedule)
        )]}
      style={{height: "500px", ...style}}
      startAccessor="start"
      endAccessor="end"
      components={{
        event: Event
      }}
      rtl={true}

    />;
  }

}
export default PrintSchedule;