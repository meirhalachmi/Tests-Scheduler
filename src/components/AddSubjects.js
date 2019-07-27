import React from "react";
import axios from 'axios/index';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux'
import {fetchSubjects} from "../actions";


class AddSubject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(fetchSubjects);
    }


    render() {
        return (
            <Container>
                <div>
                    <h1>נושאים</h1>
                    <ul>
                        {this.props.subjects.map(subject => {
                            return <li key={`movie-${subject.id}`}>{subject.name}</li>
                        })}
                    </ul>
                    <form>
                        <input
                            id="new-todo"
                            onChange={this.handleChange}
                            value={this.state.text}
                        />
                        <Button onClick={this.handleSubmit}>
                            הוסף נושא
                        </Button>
                    </form>
                </div>
            </Container>
        )
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.text.length) {
            return;
        }
        axios.post('http://localhost:5000/subjects', {
            name: this.state.text,
        })
            .catch(function (error) {
                console.error(error);
            });
        this.setState(() => ({
            text: ''
        }));


    }

}

const mapStateToProps = (state) => ({
    subjects : state.subjects.items
})

export default connect(mapStateToProps)(AddSubject);