import React, {Component} from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "./ScheduleCalendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "react-sidebar";
import axios from "axios";

import {connect} from "react-redux";
import List from "react-list-select";
import MaterialTitlePanel from "./material_title_panel";
import {
    fetchSavedSchedules,
    fetchScheduledTests,
    fetchSession,
    resetSchedule,
    scheduleTest,
    unscheduleTest
} from "../../actions";
import {daysBetween, isEmpty, Sleep} from "../../utils/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEraser, faLock, faPlus, faRobot, faSave} from "@fortawesome/free-solid-svg-icons";
import {Event, parseDateString, styles} from "./helpers";
import {ModalForm} from "../ModalForm";
import AddBlockers from "../AddBlockers";
import AddTests from "../AddTests";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const localizer = BigCalendar.momentLocalizer(moment);



class ScheduleCalendar extends Component {
    constructor(props) {
        super(props);
        console.warn('REMOVE HARD CODED ID');
        this.props.dispatch(fetchSession());

        this.state = {
            optionalDays: [],
            selectedTestId: null,
            scheduledTests: [],
            testEvents: [],

            blockerModalShow: false, testModalShow: false
        };
        this.customDayPropGetter = this.customDayPropGetter.bind(this)
        this.SidebarContent = this.SidebarContent.bind(this)
        this.closeModals = this.closeModals.bind(this)

    }

    closeModals() {
        this.setState({blockerModalShow: false, testModalShow: false})
        this.props.dispatch(fetchSession())
    }

    componentDidMount(): void {
        // this.props.dispatch(fetchScheduledTests(this.props.session.id))
        // this.interval = setInterval(() => this.props.dispatch(fetchScheduledTests()), 1000);
    }

    componentWillUnmount() {
        // clearInterval(this.interval);
    }


    SidebarContent = props => {
        const style = props.style
            ? { ...styles.sidebar, ...props.style }
            : styles.sidebar;

        let test_div = []
        let test_div_ids = []
        props.testsToSchedule.forEach( info => {
            const test = info.test;
            test_div_ids.push(test.id);
            const numOfOptionalDates = info.optionalDates.length;
            const color = numOfOptionalDates > 0 ? 'blue' : 'red';
            test_div.push(
                (<div className="test">
                    <div className="name"><span style={{color: color}}>[{numOfOptionalDates}] </span>{test.name} - ({info.howManyLeft} מתוך {test.numOfTests})</div>
                    <div className="classes">
                        {test.participatingClasses.map(cls => {
                            return props.classesDict[cls] ? props.classesDict[cls].name : '';
                        }).join(', ')}
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
                    this.setState({
                        selectedTestId: test_div_ids[selected],
                    })
                    fetch('http://localhost:5000/finddate?' +
                        'testid='+test_div_ids[selected].toString() +
                        '&session='+this.props.session.id.toString()
                    )
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
            <MaterialTitlePanel title={
                <div>
                    <span style={{margin: '15px'}}>
                        <FontAwesomeIcon icon={faSave} onClick={() => {
                            const name = prompt('בחר שם:')
                            if (name.length > 0){
                                axios.post(
                                    'http://localhost:5000/schedulerstatestore',
                                    {name}
                                )
                                    .then(() => Sleep(500))
                                    .then(this.props.dispatch(fetchSavedSchedules()))
                                    .catch(console.error)
                            }
                        }}/>
                    </span>
                    <span style={{margin: '15px'}}><FontAwesomeIcon icon={faEraser} onClick={()=>{this.props.dispatch(resetSchedule())}}/></span>
                    <span style={{margin: '15px'}}>
                        <FontAwesomeIcon icon={faRobot} onClick={()=>{
                            // const interval = setInterval(() => this.props.dispatch(fetchScheduledTests()), 300);
                            fetch('http://localhost:5000/runscheduler?session=' +
                                this.props.session.id.toString())
                                .then(() => {
                                    Sleep(300);
                                    this.props.dispatch(fetchScheduledTests())
                                })
                                .catch(console.error)
                        }}/>
                    </span>
                    <span style={{margin: '15px'}}>
                        <FontAwesomeIcon icon={faPlus} onClick={() => this.setState({testModalShow: true})}/>
                    </span>
                    <span style={{margin: '15px'}}>
                        <FontAwesomeIcon icon={faLock} onClick={() => this.setState({blockerModalShow: true})}/>
                    </span>
                </div>

            } style={style}>
                <ModalForm title="הוסף אילוץ"
                           show={this.state.blockerModalShow}
                           onHide={this.closeModals}>
                    <AddBlockers afterSend={this.closeModals}/>
                </ModalForm>
                <ModalForm title="הוסף מבחן"
                           show={this.state.testModalShow}
                           onHide={this.closeModals}>
                    <AddTests afterSend={this.closeModals}/>
                </ModalForm>
                <ModalForm title="הוסף מבחן"
                           show={this.state.storeNameShow}
                           onHide={this.closeModals}>
                    <AddTests afterSend={this.closeModals}/>
                </ModalForm>


                <div>
                    <div style={styles.divider} />
                    {list}
                    {/*<a href="index.html" style={styles.sidebarLink}>*/}
                    {/*    Home*/}
                    {/*</a>*/}
                    {/*<a href="responsive_example.html" style={styles.sidebarLink}>*/}
                    {/*</a>*/}
                    {/*    Responsive Example*/}

                </div>
            </MaterialTitlePanel>
        );
    };

    customDayPropGetter(date) {
        if (this.state.optionalDays.includes(date.getTime())){
            return {
                className: 'special-day',
                style: {
                    border: 'solid 3px #afa',
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
        const startDate = moment(this.props.session.startDate);
        const endDate = moment(this.props.session.endDate);

        const result = [];

        if (endDate.isBefore(startDate)) {
            throw "End date must be greated than start date."
        }

        while (startDate.isBefore(endDate)) {
            result.push(startDate.format("YYYY-MM-01"));
            startDate.add(1, 'month');
        }
        // console.log(result)
        return (
            <Sidebar {...sidebarProps} styles={{root: {margin: '0 15px'}}} >
                <MaterialTitlePanel title={
                    <div>
                        <DropdownButton id="dropdown-basic-button"
                                        variant="secondary" title="עבור ללוח שמור">
                            {this.props.savedSchedules.map(savedSchedule => {
                                const daysPassed = daysBetween(new Date(), new Date(savedSchedule.dateSaved));
                                return (
                                    <Dropdown.Item onSelect={() => (
                                        this.props.dispatch(
                                            fetchScheduledTests('?storeid=' + savedSchedule.storeid)
                                        )
                                    )}>{savedSchedule.name + " - " }
                                        <em>{"נשמר לפני " + `${daysPassed}` + ' ימים'}</em>
                                    </Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                    </div>
                }>
                    {result.map(date => (
                        <div style={styles.content}>
                            {this.getBigCalendar(new Date(date))}
                        </div>
                    ))}
                </MaterialTitlePanel>
            </Sidebar>
        );
    }

    getBigCalendar(defaultDate) {
        return <BigCalendar
            selectable
            localizer={localizer}
            defaultDate={defaultDate}
            defaultView="month"
            views={{month: true}}
            events={[...this.props.blockerEvents, ...this.props.testEvents]}
            style={{height: "650px"}}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(event, e) => {
                if (event.type === 'test') {
                    let date = event.start;
                    date.setHours(0, 0, 0, 0);
                    this.props.dispatch(unscheduleTest(event.id, date))
                    this.setState({
                        selectedTestId: null,
                        optionalDays: []
                    })
                }
            }}
            onSelectSlot={(slotInfo) => {
                const isAnOption = this.state.optionalDays.includes(parseDateString(slotInfo['start']));
                if (isAnOption) {
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

        />;
    }
}

const mapStateToProps = (state) => {
    let classesDict = state.classes.items.reduce((o, cur) => ({...o, [cur.id]: cur}), {});
    let testsDict = state.tests.items.reduce((o, cur) => ({...o, [cur.id]: cur}), {});
    return ({
        session: state.session.items,
        subjects: state.subjects.items,
        classes: state.classes.items,
        blockers: state.blockers.items,
        tests: state.tests.items,
        classesDict: classesDict,
        testsDict: testsDict,
        scheduledTests: state.schedule.scheduledTests,
        savedSchedules: state.savedSchedules.items,
        testsToSchedule: state.tests.items.map(
            test => {
                const alreadyScheduledCount = state.schedule.scheduledTests.filter(st => st.id === test.id).length;
                const howManyNeeded = test.numOfTests;
                if (howManyNeeded > alreadyScheduledCount){

                    let unscheduledTestsOption = state.schedule.unscheduledTestsOptions[test.id];
                    unscheduledTestsOption = unscheduledTestsOption ? unscheduledTestsOption : [];
                    return {
                        test: test,
                        howManyLeft: howManyNeeded - alreadyScheduledCount,
                        optionalDates: unscheduledTestsOption.map(parseDateString)
                    }
                }
                else {
                    return null;
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
                console.log('info: ', scheduledTestInfo)
                const id = scheduledTestInfo.id;
                const date = scheduledTestInfo.date;
                if (isEmpty(testsDict)){
                    return []
                }
                const testToSchedule = testsDict[id];
                console.log('dict+id ', testsDict, id);
                return {
                    title: testToSchedule.name + ' (' + testToSchedule.participatingClasses.map(cls => {
                        return classesDict[cls] ? classesDict[cls].name : '';
                    }).join(', ') + ')',
                    start: new Date(date),
                    end: new Date(date),
                    type: 'test',
                    id: id
                }
            })
    });
}

export default connect(mapStateToProps)(ScheduleCalendar);