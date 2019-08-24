import React, {Component} from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "./ScheduleCalendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./react-contextmenu.css"
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
import {daysBetween, formatDate, isEmpty, Sleep} from "../../utils/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEraser, faLock, faPlus, faRobot, faSave} from "@fortawesome/free-solid-svg-icons";
import {Event, parseDateString, styles} from "./helpers";
import {ModalForm} from "../ModalForm";
import AddBlockers from "../BlockerForm";
import AddTests from "../TestForm";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import {ContextMenu, MenuItem} from "react-contextmenu";

const localizer = BigCalendar.momentLocalizer(moment);



class ScheduleCalendar extends Component {

    constructor(props) {
        super(props);
        this.props.dispatch(fetchSession());

        this.state = {
            optionalDays: [],
            selectedTestId: null,
            scheduledTests: [],
            testEvents: [],
            filter: () => true,
            modalFormData: {
                type: null,
                props: null
            },
            blockerModalShow: false, testModalShow: false
        };
        this.customDayPropGetter = this.customDayPropGetter.bind(this)
        this.SidebarContent = this.SidebarContent.bind(this)
        this.closeModals = this.closeModals.bind(this)

    }


    closeModals() {
        this.setState({blockerModalShow: false, testModalShow: false})
        this.setState({modalFormData: {
                type: null,
                props: null
            }})
        this.props.dispatch(fetchSession())
    }

    fetch_delete(endPoint, id) {
        fetch(process.env.REACT_APP_API_URL + endPoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id})
        })
            .catch(console.error)
            .then(() => Sleep(300))
            .then(() => (this.props.dispatch(fetchSession())));
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
                    fetch(process.env.REACT_APP_API_URL + '/finddate?' +
                        'testid='+test_div_ids[selected].toString()
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
                <>
                    <div>
                    <span style={{margin: '15px'}}>
                        <FontAwesomeIcon icon={faSave} onClick={() => {
                            const name = prompt('בחר שם:')
                            if (name.length > 0){
                                axios.post(
                                    process.env.REACT_APP_API_URL + '/schedulerstatestore',
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
                            fetch(process.env.REACT_APP_API_URL + '/runscheduler')
                                .then(() => {
                                    Sleep(300);
                                    this.props.dispatch(fetchScheduledTests())
                                })
                                .catch(console.error)
                        }}/>
                    </span>
                        <span style={{margin: '15px'}}>
                        <FontAwesomeIcon icon={faPlus} onClick={() => this.showTestForm()}/>
                    </span>
                        <span style={{margin: '15px'}}>
                        <FontAwesomeIcon icon={faLock} onClick={() => this.showBlockerForm()}/>
                    </span>
                    </div>
                </>

            } style={style}>
                <ModalForm title="הוסף אילוץ"
                           show={this.state.modalFormData.type === "blocker"}
                           onHide={this.closeModals}>
                    <AddBlockers afterSend={this.closeModals} {...this.state.modalFormData.props}/>
                </ModalForm>
                <ModalForm title="הוסף מבחן"
                           show={this.state.modalFormData.type === "test"}
                           onHide={this.closeModals}>
                    <AddTests afterSend={this.closeModals} {...this.state.modalFormData.props}/>
                </ModalForm>


                <div>
                    <div>TODO: להווסיף פילטרים לפי כיתות ומקצועות</div>

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
                        <span>רמת קושי: {this.props.scheduleDifficulty}</span>
                        <ButtonToolbar>
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
                            <Button onClick={() => {
                                fetch(process.env.REACT_APP_API_URL + '/debug').then(r =>
                                    this.props.dispatch(fetchScheduledTests()))
                            }}>שפר שיבוצים</Button>
                            <Button onClick={() => {
                                this.props.history.push("/selectsession")
                            }}>בחר לוח שנה אחר</Button>
                        </ButtonToolbar>
                    </div>
                }>
                    {result.map(date => (
                        <div style={styles.content}>
                            {this.getBigCalendar(new Date(date))}
                        </div>
                    ))}
                </MaterialTitlePanel>
                {
                    this.props.testEvents.filter(event => event.id).map(event => (
                        <ContextMenu id={"test" + event.id.toString()} rtl>
                            <MenuItem onClick={() => this.showTestForm({
                                testToEdit: this.props.testsDict[event.id]
                            })}>
                                <div>ערוך</div>
                            </MenuItem>
                            {/*<MenuItem onClick={console.log}>*/}
                            {/*    נעל*/}
                            {/*</MenuItem>*/}
                            <MenuItem onClick={() => this.fetch_delete('/tests', event.id)}>
                                מחק
                            </MenuItem>
                            {/*<MenuItem divider />*/}
                        </ContextMenu>
                    ))}
                {
                    this.props.blockers.map(blocker => (
                        <ContextMenu id={"blocker" + blocker.id.toString()} rtl>
                            <MenuItem onClick={() => this.showBlockerForm({
                                blockerToEdit: this.props.blockersDict[blocker.id]
                            })}>
                                <div>ערוך</div>
                            </MenuItem>
                            <MenuItem onClick={() => this.fetch_delete('/blockers', blocker.id)}>
                                מחק
                            </MenuItem>
                            {/*<MenuItem divider />*/}
                        </ContextMenu>
                    ))
                }

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
                if (this.state.selectedTestId !== null){
                    const isAnOption = this.state.optionalDays.includes(parseDateString(slotInfo['start']));
                    if (isAnOption) {
                        this.props.dispatch(scheduleTest(this.state.selectedTestId, slotInfo.start))

                        this.setState({
                            selectedTestId: null,
                            optionalDays: []
                        })

                    }
                }
                else {
                    this.showBlockerForm({
                        wantedDates: {
                            start: formatDate(slotInfo.start),
                            end: formatDate(slotInfo.end)
                        }
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

    showTestForm(testFormProps = null) {
        this.setState({modalFormData: {
                type: 'test',
                props: testFormProps
            }})
    }

    showBlockerForm(blockerFormProps = null) {
        this.setState({modalFormData: {
                type: 'blocker',
                props: blockerFormProps
            }})
    }
}

const mapStateToProps = (state) => {
    let classesDict = state.classes.items.reduce((o, cur) => ({...o, [cur.id]: cur}), {});
    let testsDict = state.tests.items.reduce((o, cur) => ({...o, [cur.id]: cur}), {});
    let blockersDict = state.blockers.items.reduce((o, cur) => ({...o, [cur.id]: cur}), {});
    return ({
        session: state.session.items,
        subjects: state.subjects.items,
        classes: state.classes.items,
        blockers: state.blockers.items,
        tests: state.tests.items,
        classesDict,
        testsDict,
        blockersDict,
        scheduleDifficulty: state.schedule.difficulty,
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
                const id = scheduledTestInfo.id;
                const date = scheduledTestInfo.date;
                if (isEmpty(testsDict)){
                    return []
                }
                const testToSchedule = testsDict[id];
                return {
                    title: testToSchedule.name + ' (' + testToSchedule.participatingClasses.map(cls => {
                        return classesDict[cls] ? classesDict[cls].name : '';
                    }).join(', ') + ')',
                    start: new Date(date),
                    end: new Date(date),
                    type: 'test',
                    id: id,
                }
            })
    });
}

export default connect(mapStateToProps)(ScheduleCalendar);