import React, {Component} from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {isEmpty} from "../utils/utils";
import Modal from "react-bootstrap/Modal";
import AddBlockers from "./AddBlockers";
import AddTests from "./AddTests";
import {SessionCard} from "./Cards/SessionCard";
import {fetchSession} from "../actions";

class ModalForm extends Component<{ show: any, onHide: () => any }> {
    render() {
        return <Modal
            size="lg"
            show={this.props.show}
            onHide={this.props.onHide}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    {this.props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.props.body}
            </Modal.Body>
        </Modal>;
    }
}

class SessionHome extends Component {
    constructor(props){
        super(props);
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
            <Jumbotron>
                <h1>{this.props.session.name}</h1>

                <ModalForm title="הוסף אילוץ" body={<AddBlockers afterSend={this.closeModals}/>}
                           show={this.state.blockerModalShow}
                           onHide={this.closeModals}/>
                <ModalForm title="הוסף מבחן" body={<AddTests afterSend={this.closeModals}/>}
                           show={this.state.testModalShow}
                           onHide={this.closeModals}/>

                <p>
                    <Button variant="primary" onClick={() => this.setState({blockerModalShow: true})}>הוסף אילוץ</Button>
                    <Button variant="primary" onClick={() => this.setState({testModalShow: true})}>הוסף מבחן</Button>
                </p>
            </Jumbotron>
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