import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "./ScheduleCalendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "react-sidebar";

import {connect} from "react-redux";
import List from "react-list-select";
import MaterialTitlePanel from "./material_title_panel";
import {fetchScheduledTests, scheduleTest, unscheduleTest} from "../../actions";
import {isEmpty} from "../../utils/utils";

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

    componentDidMount(): void {
        this.props.dispatch(fetchScheduledTests())
        // this.interval = setInterval(() => this.props.dispatch(fetchScheduledTests()), 1000);
    }

    componentWillUnmount() {
        // clearInterval(this.interval);
    }


    SidebarContent = props => {
        const style = props.style
            ? { ...styles.sidebar, ...props.style }
            : styles.sidebar;

        let links = [];

        let test_div = []
        let test_div_ids = []
        props.testsToSchedule.map( info => {
            const test = info.test;
            // howManyLeft;
            test_div_ids.push(test.id);
            test_div.push(
                (<div className="test">
                    <div className="name">{test.name} - ({info.howManyLeft} מתוך {test.numOfTests})</div>
                    <div className="classes">
                        {test.participatingClasses.map(cls => props.classesDict[cls].name).join(', ')}
                    </div>
                </div>)
            )


        });
        let selectedTestIndInList = test_div_ids.indexOf(this.state.selectedTestId)
        let list = (
            <List
                items={test_div}
                selected={[selectedTestIndInList]}
                disabled={[]}
                multiple={false}
                onChange={(selected) => {
                    this.setState({selectedTestId: test_div_ids[selected]})
                    fetch('http://localhost:5000/finddate?testid='+test_div_ids[selected].toString())
                        .then(response => response.json())
                        .then(res => {
                            // console.log(res)
                            const days = res.map(date => {
                                return parseDateString(date);
                            });
                            this.setState({
                                optionalDays: days
                            });
                            if (res.length === 0){
                                window.alert('לא נותרו תאריכים אפשריים למבחן זה')
                            }

                        })
                        .catch(console.error)
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
        const sidebar = <this.SidebarContent testsToSchedule={this.props.testsToSchedule} classesDict={this.props.classesDict}/>;
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
            <Sidebar {...sidebarProps}>
                <MaterialTitlePanel>
                    <div style={styles.content}>

                        <BigCalendar
                            selectable
                            localizer={localizer}
                            defaultDate={new Date()}
                            defaultView="month"
                            views={{month: true, agenda: true}}
                            events={[...this.props.blockerEvents, ...this.props.testEvents]}
                            style={{ height: "100vh"}}
                            startAccessor="start"
                            endAccessor="end"
                            onSelectEvent={(event, e) => {
                                if (event.type === 'test'){
                                    let date = event.start;
                                    date.setHours(0,0,0,0);
                                    this.props.dispatch(unscheduleTest(event.id, date))
                                    this.setState({
                                        selectedTestId: null,
                                        optionalDays: []
                                    })
                                }
                            }}
                            onSelectSlot={(slotInfo) => {
                                const isAnOption = this.state.optionalDays.includes(parseDateString(slotInfo['start']));
                                if (isAnOption){
                                    this.props.dispatch(scheduleTest(this.state.selectedTestId, slotInfo.start))

                                    this.setState({
                                        selectedTestId: null,
                                        optionalDays: []
                                    })

                                }
                            }}
                            components={{
                                event: Event
                            }}
                            dayPropGetter={this.customDayPropGetter}
                            rtl={true}

                        />
                    </div>
                </MaterialTitlePanel>
            </Sidebar>
        );
    }
}

const mapStateToProps = (state) => {
    let classesDict = state.classes.items.reduce((o, cur) => ({...o, [cur.id]: cur}), {});
    let testsDict = state.tests.items.reduce((o, cur) => ({...o, [cur.id]: cur}), {});
    return ({
        subjects: state.subjects.items,
        classes: state.classes.items,
        blockers: state.blockers.items,
        tests: state.tests.items,
        classesDict: classesDict,
        testsDict: testsDict,
        scheduledTests: state.schedule.scheduledTests,
        testsToSchedule: state.tests.items.map(
            test => {
                const alreadyScheduledCount = state.schedule.scheduledTests.filter(st => st.id === test.id).length;
                const howManyNeeded = test.numOfTests;
                if (howManyNeeded > alreadyScheduledCount){
                    return {
                        test: test,
                        howManyLeft: howManyNeeded - alreadyScheduledCount
                    }
                }
            }
        ).filter(i => i != null),
        blockerEvents:
            state.blockers.items.reduce((ar, blocker) => {
                ar = [...ar,
                    ...blocker.startDates.map((_, i) => ({
                        title: blocker.name,
                        start: new Date(blocker.startDates[i]),
                        end: new Date(blocker.endDates[i]),
                        type: 'blocker',
                        id: blocker.id
                    }))
                ];
                return ar;
            }, []),
        testEvents:
            state.schedule.scheduledTests.map(scheduledTestInfo => {
                const id = scheduledTestInfo.id;
                const date = scheduledTestInfo.date;
                if (isEmpty(testsDict)){
                    return []
                }
                const testToSchedule = testsDict[id];
                return {
                    title: testToSchedule.name + ' (' + testToSchedule.participatingClasses.map(cls => classesDict[cls].name).join(', ') + ')',
                    start: new Date(date),
                    end: new Date(date),
                    type: 'test',
                    id: id
                }
            })
    });
}

export default connect(mapStateToProps)(ScheduleCalendar);