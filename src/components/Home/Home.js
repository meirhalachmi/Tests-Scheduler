import React, {Component, Suspense} from "react";
import {DisplayRemoteData, sortByName} from "../../utils/utils";

class ApiList extends Component<{ parserFunction: (s?: any) => any }> {
    render() {
        return <div>
            <h1>{this.props.name}</h1>
            <ul>
                <Suspense fallback={<li></li>}>
                    <DisplayRemoteData
                        url={this.props.url}
                        preProcess={sortByName}
                        parserFunction={(s) => (
                            <div>
                                <li>{s.name}</li>

                                <ul>
                                    {Object.entries(s).map(i => (
                                        i[0] !== "name" && <li>{i[0]} : {i[1]}</li>
                                    ))}
                                </ul>
                            </div>
                        )}/>
                </Suspense>
            </ul>
        </div>;
    }
}

export default function Home() {
    return (
        <div>
            <ApiList name="סשנים" url={process.env.REACT_APP_API_URL + "/sessionslist"}/>
        </div>
    )
}