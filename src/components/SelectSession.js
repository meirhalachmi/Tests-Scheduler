import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import {connect} from "react-redux";
import {fetchSession} from "../actions";
import {Link} from "react-router-dom";


class SessionCard extends Component<{}> {
    render() {
        const session = this.props.session;
        return <div>
            <Card style={{width: "30%"}}>
                <Card.Body>
                    <Card.Title>{session.info.name}</Card.Title>
                    {/*<Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>*/}
                    <Card.Text>
                        <strong>כיתות: </strong>
                        {session.classes.map(cls => cls.name).join(', ')}
                    </Card.Text>
                    <Card.Text>
                        <strong>מקצועות: </strong>
                        {session.subjects.map(cls => cls.name).join(', ')}
                    </Card.Text>
                    <Card.Text>
                        {/*<strong>מקצועות: </strong>*/}
                        מתחיל ב- {new Date(session.info.startDate).toLocaleDateString('he-IL')}
                        &nbsp;
                        ונגמר ב- {new Date(session.info.endDate).toLocaleDateString('he-IL')}
                    </Card.Text>
                    <Card.Text style={{color: 'red'}}>
                        להוסיף גם שעות ומרווח
                    </Card.Text>
                    <Card.Text >
                        <Link to='addblockers' onClick={() => this.props.dispatch(fetchSession(session.info.id))}>
                            בחר לוח מבחנים
                        </Link>
                    </Card.Text>
                    <Card.Text>
                        <Link to="#">
                            שכפל וערוך
                        </Link>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>;
    }
}

class SelectSession extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            sessions: []
        };
        fetch('http://localhost:5000/sessionslist')
            .then(res => res.json())
            // .then(console.log)
            .then(sessions => this.setState({sessions: sessions}))
        // .then(sessions => sessions.map(sess => ))
    }

    render() {
        return (
            this.state.sessions.map(sess => <SessionCard history={this.props.history} dispatch={this.props.dispatch} key={sess.info.id} session={sess}/>)

        )
    }
}

const mapStateToProps = (state) => ({
    // subjects : state.subjects.items
})

export default connect(mapStateToProps)(SelectSession);