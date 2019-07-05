import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "./ScheduleCalendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "react-sidebar";

import {connect} from "react-redux";
import MaterialTitlePanel from "./material_title_panel";

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
        padding: "16px",
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
class ScheduleCalendar extends Component {
    constructor(props) {
        super(props);

        let date = new Date()
        date.setHours(0,0,0,0)
        this.state = {
            daysToColor: [date.getTime()]
        };
        this.customDayPropGetter = this.customDayPropGetter.bind(this)
        this.SidebarContent = this.SidebarContent.bind(this)
    }


    SidebarContent = props => {
        const style = props.style
            ? { ...styles.sidebar, ...props.style }
            : styles.sidebar;

        const links = [];

        props.tests.map((test, ind) => {
            links.push(
                <a key={ind} href="#" style={styles.sidebarLink} onClick={(e) => {
                    let date = new Date(test.startDates[0]);
                    date.setHours(0,0,0,0);
                    this.setState({
                        daysToColor: [...this.state.daysToColor,
                        date.getTime()
                        ]
                    })
                }}>
                    {test.name}
                </a>
            )
        })

        return (
            <MaterialTitlePanel title="מבחנים" style={style}>
                <div style={styles.content}>
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
        if (this.state.daysToColor.includes(date.getTime())){
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
        const sidebar = <this.SidebarContent tests={this.props.blockers}/>;
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
                            localizer={localizer}
                            defaultDate={new Date()}
                            defaultView="month"
                            views={{month: true, agenda: true}}
                            events={this.props.events}
                            style={{ height: "100vh"}}
                            startAccessor="start"
                            endAccessor="end"
                            onSelectEvent={(event, e) => {console.log(event)}}
                            components={{
                                event: Event
                            }}
                            dayPropGetter={this.customDayPropGetter}


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
    events: state.blockers.items.map(blocker => {
        return {
            title: blocker.name,
            start: new Date(blocker.startDates[0]),
            end: new Date(blocker.endDates[0]),
            type: 'blocker'
        }
    })

})

export default connect(mapStateToProps)(ScheduleCalendar);
