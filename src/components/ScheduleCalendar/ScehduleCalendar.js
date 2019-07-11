import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "./ScheduleCalendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "react-sidebar";

import {connect} from "react-redux";
import List from "react-list-select";
import MaterialTitlePanel from "./material_title_panel";
import axios from "axios";

const localizer = BigCalendar.momentLocalizer(moment);


const styles = {
    sidebar: {
        width: 256,
        // height: "100%"
    },
    sidebarLink: {
        display: "block",
        padding: "16px 0px",
        color: "#757575",
        textDecoration: "none"
    },
    divider: {
        margin: "8px 0",
        height: 1,
        backgroundColor: "#757575"
    },
    content: {
        // padding: "16px",
        // height: "100%",
        backgroundColor: "white"
    }
};

function Event({ event }) {
    const color = event.type === 'blocker' ? 'red' : 'blue';
    return (
        <div style={{backgroundColor: color}}>
            <strong>{event.title}</strong>
            {event.desc && ':  ' + event.desc}
        </div>
    )
}

function parseDateString(date) {
    let d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime()
}

class ScheduleCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            optionalDays: [],
            selectedTestId: null,
            scheduledTests: [],
            testEvents: []
        };
        this.customDayPropGetter = this.customDayPropGetter.bind(this)
        this.SidebarContent = this.SidebarContent.bind(this)
    }


    SidebarContent = props => {
        const style = props.style
            ? { ...styles.sidebar, ...props.style }
            : styles.sidebar;

        let links = [];

        let test_div = []
        let test_div_ids = []
        props.tests
            .filter(test => !this.state.scheduledTests.includes(test.id))
            .map((test, ind) => {
                test_div_ids.push(test.id);
                test_div.push(
                    (<div className="test">
                        <div className="name">{test.name}</div>
                        <div className="classes">
                            {test.participatingClasses.map(cls => props.classesDict[cls].name).join(', ')}
                        </div>
                    </div>)
                )
            })
        let selectedTestIndInList = test_div_ids.indexOf(this.state.selectedTestId)
        let list = (
            <List
                items={test_div}
                selected={[selectedTestIndInList]}
                disabled={[]}
                multiple={false}
                onChange={(selected) => {
                    this.setState({selectedTestId: test_div_ids[selected]})
                    fetch('http://localhost:5000/finddate?testid='+props.tests[selected].id.toString())
                        .then(response => response.json())
                        .then(res => res.map(date => {
                            return parseDateString(date);
                        }))
                        .then(res =>
                            this.setState({
                                optionalDays: res
                            })

                        )
                }}
            />)

        return (
            <MaterialTitlePanel title="מבחנים" style={style}>
                <div style={styles.content}>
                    {list}
                    {/*<a href="index.html" style={styles.sidebarLink}>*/}
                    {/*    Home*/}
                    {/*</a>*/}
                    {/*<a href="responsive_example.html" style={styles.sidebarLink}>*/}
                    {/*    Responsive Example*/}
                    {/*</a>*/}
                    {/*<div style={styles.divider} />*/}
                    {links}

                </div>
            </MaterialTitlePanel>
        );
    };

    customDayPropGetter(date) {
        if (this.state.optionalDays.includes(date.getTime())){
            return {
                className: 'special-day',
                style: {
                    border: 'solid 3px ' + ('#afa'),
                },
            }

        }
        else return {}
    }



    render() {
        const sidebar = <this.SidebarContent tests={this.props.tests} classesDict={this.props.classesDict}/>;
        const sidebarProps = {
            sidebar,
            docked: true,
            sidebarClassName: "custom-sidebar-class",
            contentId: "custom-sidebar-content-id",
            open: true,
            touch: true,
            shadow: false,
            pullRight: true,
            transitions: true,
        };

        return (
            <div >
                <Sidebar {...sidebarProps}>
                    {/*<MaterialTitlePanel>*/}
                    <div style={styles.content}>

                        <BigCalendar
                            selectable
                            localizer={localizer}
                            defaultDate={new Date()}
                            defaultView="month"
                            views={{month: true, agenda: true}}
                            events={[...this.props.blockerEvents, ...this.state.testEvents]}
                            style={{ height: "100vh"}}
                            startAccessor="start"
                            endAccessor="end"
                            onSelectEvent={(event, e) => {console.log(event)}}
                            onSelectSlot={(slotInfo) => {
                                const isAnOption = this.state.optionalDays.includes(parseDateString(slotInfo['start']));
                                if (isAnOption){
                                    const msg = {
                                        testid: this.state.selectedTestId.toString(),
                                        date: slotInfo.start
                                    };
                                    const testToSchedule = this.props.testsDict[this.state.selectedTestId];
                                    axios.post('http://localhost:5000/scheduletest', msg)
                                        .then(
                                            () => {
                                                this.setState(
                                                    {
                                                        scheduledTests: [...this.state.scheduledTests, this.state.selectedTestId],
                                                        selectedTestId: null,
                                                        optionalDays: [],
                                                        testEvents: [
                                                            ...this.state.testEvents,
                                                            {
                                                                title: testToSchedule.name + ' (' + testToSchedule.participatingClasses.map(cls => this.props.classesDict[cls].name).join(', ') + ')',
                                                                start: new Date(slotInfo.start),
                                                                end: new Date(slotInfo.start),
                                                                type: 'test'
                                                            }
                                                        ]
                                                    }
                                                )

                                            }
                                        )
                                        .catch(console.error)
                                }
                            }}
                            components={{
                                event: Event
                            }}
                            dayPropGetter={this.customDayPropGetter}
                            rtl={true}

                        />
                    </div>
                    {/*</MaterialTitlePanel>*/}
                </Sidebar>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    subjects : state.subjects.items,
    classes : state.classes.items,
    blockers: state.blockers.items,
    tests: state.tests.items,
    classesDict: state.classes.items.reduce((o, cur) => ({...o, [cur.id]: cur}), {}),
    testsDict: state.tests.items.reduce((o, cur) => ({...o, [cur.id]: cur}), {}),
    blockerEvents: [
        ...
            state.blockers.items.map(blocker => {
                return {
                    title: blocker.name,
                    start: new Date(blocker.startDates[0]), //TODO: Add The Entire List
                    end: new Date(blocker.endDates[0]), //TODO: Add The Entire List
                    type: 'blocker'
                }
            }),
    ]
})

export default connect(mapStateToProps)(ScheduleCalendar);
