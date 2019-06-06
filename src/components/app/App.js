import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import './App.css'
import Subjects from "../Subjects/Subjects";
import AddSubjects from "../AddSubjects/AddSubjects";
import ScheduleCalendar from "../ScheduleCalendar/ScehduleCalendar";

function App() {
    return (
        <Router>
            <div style={{width: "90%"}}>
                <nav>
                    <Navbar bg="light" variant="light">
                        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link href="/addsubjects">מקצועות</Nav.Link>
                            <Nav.Link href="/subjects">אשכולות</Nav.Link>
                            <Nav.Link href="/calendar">לוח שנה</Nav.Link>
                        </Nav>
                    </Navbar>
                </nav>
                {/*<hr />*/}
                <Switch>
                    <Route path="/addsubjects" component={AddSubjects} />
                    <Route path="/subjects" component={Subjects} />
                    <Route path="/calendar" component={ScheduleCalendar} />
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div>
            <h2>Home</h2>
        </div>
    );
}

function About() {
    return (
        <div>
            <h2>About</h2>
        </div>
    );
}

function Topics({ match }) {
    return (
        <div>
            <h2>Topics</h2>
            <ul>
                <li>
                    <Link to={`${match.url}/rendering`}>Rendering with React</Link>
                </li>
                <li>
                    <Link to={`${match.url}/components`}>Components</Link>
                </li>
                <li>
                    <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
                </li>
            </ul>

            <Route path={`${match.path}/:topicId`} component={Topic} />
            <Route
                exact
                path={match.path}
                render={() => <h3>Please select a topic.</h3>}
            />
        </div>
    );
}

function Topic({ match }) {
    return (
        <div>
            <h3>{match.params.topicId}</h3>
        </div>
    );
}

export default App;
