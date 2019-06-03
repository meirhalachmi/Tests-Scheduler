import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios/index';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import {Sleep} from '../../utils/utils.js';


class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: [], text: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getSubjects();
    }

    getSubjects() {
        const myRequest = new Request('http://localhost:5000/subjects');
        fetch(myRequest)
            .then(response => response.json())
            .then(data => {
                this.setState({ items: data })
            })
    }

    render() {
        return (
            <Container>
                <div>
                    <h1>נושאים</h1>
                    <ul>
                        {this.state.items.map(subject => {
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

function BasicExample() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/topics">Topics</Link>
                    </li>
                </ul>

                <hr />

                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/topics" component={Topics} />
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

export default MyComponent;
