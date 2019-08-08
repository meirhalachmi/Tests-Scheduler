import React from "react";
import {connect} from "react-redux";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {SessionCard} from "./Cards/SessionCard";


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
            <Container>
                <div>
                    <Button variant="primary" size="lg" active
                            onClick={()=>this.props.history.push("/sessionsetup")}
                    >
                        צור לוח מבחנים חדש
                    </Button>
                </div>
                <div>
                    או המשך עבודה על לוח קיים
                </div>
                <div>
                {this.state.sessions.map(sess => <SessionCard dispatch={this.props.dispatch} key={sess.info.id} session={sess}/>)}
                </div>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    // subjects : state.subjects.items
})

export default connect(mapStateToProps)(SelectSession);