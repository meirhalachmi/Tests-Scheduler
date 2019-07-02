import React from "react";
import axios from 'axios/index';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {Sleep} from '../../utils/utils.js';
import { connect } from 'react-redux'


class AddSubject extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: [], text: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // this.getSubjects();
    }


    render() {
        console.log(this.props, this.state.items)
        return (
            <Container>
                <div>
                    <h1>נושאים</h1>
                    <ul>
                        {this.props.subjects.map(subject => {
                            return <li key={`movie-${subject.id}`}>{subject.name}</li>
                        })}
                    </ul>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            id="new-todo"
                            onChange={this.handleChange}
                            value={this.state.text}
                        />
                        <Button>
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
            .then(response => response.json())
            .then(data => {
                this.setState({ items: data })
            })
            .catch(function (error) {
                console.log(error);
            });
        this.setState(() => ({
            text: ''
        }));

        Sleep(300).then(
            () => this.getSubjects()
        );
        this.render();
    }

}

const mapStateToProps = (state) => ({
    subjects : state.subjects.items
})

export default connect(mapStateToProps)(AddSubject);