import axios from "axios";
import {sortByName} from "../utils/utils";

export const REQUEST = 'REQUEST';
export const RECEIVE = 'RECEIVE';
export const SCHEDULE = 'SCHEDULE';
export const UNSCHEDULE = 'UNSCHEDULE';

function FetchActionCreator(name, url, postprocessorFunction=(json)=>(json)) {

    function request() {
        return {
            type: REQUEST+ '_' + name.toUpperCase(),
        }
    }

    function receive(json) {
        return {
            type: RECEIVE + '_' + name.toUpperCase(),
            items: postprocessorFunction(json),
            receivedAt: Date.now()
        }
    }

    return function () {
        return dispatch => {
            dispatch(request());
            return fetch(url)
                .then(response => response.json())
                .then(json => dispatch(receive(json)))
        }
    }

}


export const fetchSubjects = FetchActionCreator('Subjects', 'http://localhost:5000/subjects',
    sortByName)
export const fetchClasses = FetchActionCreator('Classes', 'http://localhost:5000/classes')
export const fetchBlockers = FetchActionCreator('Blockers', 'http://localhost:5000/blockers')
export const fetchTests = FetchActionCreator('Tests', 'http://localhost:5000/tests')
export const fetchScheduledTests = FetchActionCreator('Schedule', 'http://localhost:5000/currenttcheduledtests')

export const scheduleTest = (id, date) => {
    // return {
    //   type: SCHEDULE,
    //   id,
    //   date
    // }
    return dispatch => {
        const msg = {
            testid: id.toString(),
            date: date
        }
        return axios.post('http://localhost:5000/scheduletest', msg)
            .then(
                dispatch(
                    {
                        type: SCHEDULE,
                        id: id,
                        date: date
                    }

                )
            )
    }

}

export const unscheduleTest = (id, date) => {
    // return {
    //   type: SCHEDULE,
    //   id,
    //   date
    // }
    return dispatch => {
        const msg = {
            testid: id.toString(),
            date: date
        }
        return axios.post('http://localhost:5000/unscheduletest', msg)
            .then(
                dispatch(
                    {
                        type: UNSCHEDULE,
                        id: id,
                        date: date
                    }

                )
            )
    }

}


