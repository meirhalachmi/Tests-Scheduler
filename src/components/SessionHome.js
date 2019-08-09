import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import AddBlockers from "./AddBlockers";
import AddTests from "./AddTests";
import {fetchSession} from "../actions";
import ScheduleCalendar from "./ScheduleCalendar/ScheduleCalendar";
import {ModalForm} from "./ModalForm";

class SessionHome extends Component {
    constructor(props){
        super(props);
        console.warn('REMOVE HARD CODED ID');
        this.props.dispatch(fetchSession(3)); //FIXME


        this.state = {blockerModalShow: false, testModalShow: false}
        this.closeModals = this.closeModals.bind(this)
    }

    closeModals() {
        this.setState({blockerModalShow: false, testModalShow: false})
        this.props.dispatch(fetchSession(this.props.session.id))
    }


    render() {
        console.log(this.props)
        // if (this.props.session.length){
        //     console.log('hey')
        //     this.props.history.push('/selectsession')
        // }
        return (
            <div>
                <h1>{this.props.session.name}</h1>

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

                <div>
                    <Button variant="primary" onClick={() => this.setState({blockerModalShow: true})}>
                        הוסף אילוץ</Button>
                    <Button variant="primary" onClick={() => this.setState({testModalShow: true})}>
                        הוסף מבחן</Button>
                </div>
                {/*<h2>מבחנים</h2>*/}
                {/*<div style={{marginRight: '5px'}}>*/}
                {/*    {sortByName(this.props.tests).map(test => (*/}
                {/*        <div>*/}
                {/*            <h4>{test.name} </h4>*/}
                {/*            <ul style={{marginRight: '10px'}}>*/}
                {/*                <li><strong>כיתות: </strong>*/}
                {/*                    {test.participatingClasses.map(cls => {*/}
                {/*                        return this.props.classesDict[cls] ?*/}
                {/*                            this.props.classesDict[cls].name : '';*/}
                {/*                    }).join(', ')}*/}
                {/*                </li>*/}
                {/*            </ul>*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}

                {/*<h2>אילוצים</h2>*/}
                {/*<div style={{marginRight: '5px'}}>*/}
                {/*    {sortByName(this.props.blockers).map(blocker => (*/}
                {/*        <div>*/}
                {/*            <h4>{blocker.name} </h4>*/}
                {/*            <ul style={{marginRight: '10px'}}>*/}
                {/*                <li><strong>כיתות: </strong>*/}
                {/*                    {blocker.participatingClasses.map(cls => {*/}
                {/*                        return this.props.classesDict[cls] ?*/}
                {/*                            this.props.classesDict[cls].name : '';*/}
                {/*                    }).join(', ')}*/}
                {/*                </li>*/}

                {/*            </ul>*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}
                <ScheduleCalendar session={this.props.session}/>



            </div>
        )
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
    });
}




export default connect(mapStateToProps)(SessionHome)