import React, {Component} from "react";
import { connect } from 'react-redux'
import {HashRouter, Switch, Route} from "react-router-dom";
import './App.css'
import Subjects from "../Subjects/Subjects";
import ScheduleCalendar from "../ScheduleCalendar/ScheduleCalendar";
import PropTypes from "prop-types";
import SessionSetup from "../../SessionConfiguration/SetupSession";
import SelectSession from "../../SessionSelection/SelectSession";
class AsyncApp extends Component{
  componentDidMount(): void {
  }

  render() {
    return(
      <>
        <HashRouter basename={'/'}>
          <div style={{alignItems: ""}}>
            {/*<li><Link to="/">Home</Link></li>*/}
            {/*<li><Link to="/selectsession">selectsession</Link></li>*/}
            {/*/!*<nav>*!/*/}
            {/*/!*    <Navbar bg="light" variant="light">*!/*/}
            {/*/!*        <Navbar.Brand href="/selectsession">החלף לוח מבחנים</Navbar.Brand>*!/*/}
            {/*/!*        <Nav className="mr-auto">*!/*/}
            {/*/!*            <NavRouterLink to="/session">סשן</NavRouterLink>*!/*/}
            {/*/!*            <NavRouterLink to="/addtests">הגדרת מבחנים</NavRouterLink>*!/*/}
            {/*/!*            <NavRouterLink to="/addblockers">הגדרת אילוצים</NavRouterLink>*!/*/}
            {/*/!*            <NavRouterLink to="/calendar">שיבוצים</NavRouterLink>*!/*/}
            {/*/!*        </Nav>*!/*/}
            {/*/!*    </Navbar>*!/*/}
            {/*/!*</nav>*!/*/}
            {/*<hr />*/}
            <Switch>
              <Route exact path="/" component={SelectSession}/>
              {/*<Route path="/home" component={Home}/>*/}
              <Route path="/subjects" component={Subjects}/>
              <Route path="/calendar" component={ScheduleCalendar}/>
              {/*<Route path="/addtests" component={AddTests}/>*/}
              {/*<Route path="/addblockers" component={AddBlockers}/>*/}
              <Route path="/sessionsetup" component={SessionSetup}/>
              <Route path="/selectsession" component={SelectSession}/>
              {/*<Route path="/session" component={SessionHome}/>*/}
              <Route component={() => (<div>404 Not found </div>)} />
            </Switch>
          </div>
        </HashRouter>

      </>
    )
  }
}

AsyncApp.propTypes = {
  items: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { subjects, session } = state
  const { isFetching, items } = subjects
  return {
    session,
    items,
    isFetching,
  }
}


export default connect(mapStateToProps)(AsyncApp)