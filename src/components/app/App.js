import React, {Component} from "react";
import { connect } from 'react-redux'
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import './App.css'
import Subjects from "../Subjects/Subjects";
import AddSubjects from "../AddSubjects";
import ScheduleCalendar from "../ScheduleCalendar/ScheduleCalendar";
import AddTests from "../AddTests";
import Home from "../Home/Home";
import {fetchTests, fetchBlockers, fetchClasses, fetchSubjects} from "../../actions";
import PropTypes from "prop-types";
import AddBlockers from "../AddBlockers";

class AsyncApp extends Component{
    componentDidMount(): void {
        const {dispatch} = this.props
        dispatch(fetchSubjects())
        dispatch(fetchClasses())
        dispatch(fetchBlockers())
        dispatch(fetchTests())
    }

    render() {
        return(
            <Container>
                <Router>
                    <div style={{alignItems: ""}}>
                        <nav>
                            <Navbar bg="light" variant="light">
                                <Navbar.Brand href="/home">Navbar</Navbar.Brand>
                                <Nav className="mr-auto">
                                    <Nav.Link href="/addsubjects">מקצועות</Nav.Link>
                                    <Nav.Link href="/subjects">אשכולות</Nav.Link>
                                    <Nav.Link href="/calendar">לוח שנה</Nav.Link>
                                    <Nav.Link href="/addtests">הגדרת מבחנים</Nav.Link>
                                    <Nav.Link href="/addblockers">הגדרת אילוצים</Nav.Link>
                                </Nav>
                            </Navbar>
                        </nav>
                        {/*<hr />*/}
                        <Switch>
                            <Route path="/home" component={Home}/>
                            <Route path="/addsubjects" component={AddSubjects}/>
                            <Route path="/subjects" component={Subjects}/>
                            <Route path="/calendar" component={ScheduleCalendar}/>
                            <Route path="/addtests" component={AddTests}/>
                            <Route path="/addblockers" component={AddBlockers}/>
                        </Switch>
                    </div>
                </Router>

            </Container>
        )
    }
}

AsyncApp.propTypes = {
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { subjects } = state
    const { isFetching, items } = subjects
    return {
        items,
        isFetching,
    }
}


export default connect(mapStateToProps)(AsyncApp)