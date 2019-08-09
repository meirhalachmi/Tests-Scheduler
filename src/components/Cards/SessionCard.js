import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import {fetchSession} from "../../actions";

export class SessionCard extends Component<{}> {
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
                    <Card.Text>
                        <Link to='session' onClick={() => this.props.dispatch(fetchSession(session.info.id))}>
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