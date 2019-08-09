import axios from "axios";
import {Sleep, sortByName} from "../utils/utils";

export const REQUEST = 'REQUEST';
export const RECEIVE = 'RECEIVE';
export const SCHEDULE = 'SCHEDULE';
export const UNSCHEDULE = 'UNSCHEDULE';
export const RESET_SCHEDULE = 'RESET_SCHEDULE';
export const INIT_SESSION = 'INIT_SESSION';

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

    return function (sessionId) {
        return dispatch => {
            dispatch(request());
            return fetch(url)
                .then(response => response.json())
                .then(json => dispatch(receive(json)))
        }
    }

}


const fetchSubjects = FetchActionCreator('Subjects', 'http://localhost:5000/subjects',
    sortByName)
const fetchClasses = FetchActionCreator('Classes', 'http://localhost:5000/classes')
const fetchBlockers = FetchActionCreator('Blockers', 'http://localhost:5000/blockers')
const fetchTests = FetchActionCreator('Tests', 'http://localhost:5000/tests')
const fetchSessionInfo = FetchActionCreator('Session', 'http://localhost:5000/sessioninfo')


export const fetchScheduledTests = FetchActionCreator('Schedule', 'http://localhost:5000/currentscheduledtests')

export function fetchSession() {
    return dispatch => {
        dispatch({
            type: INIT_SESSION,
        })
        dispatch(fetchSessionInfo());
        dispatch(fetchSubjects());
        dispatch(fetchClasses());
        dispatch(fetchBlockers());
        dispatch(fetchTests());
        dispatch(fetchScheduledTests());
    }

}


export const scheduleTest = (testId, date) => {
    // return {
    //   type: SCHEDULE,
    //   testId,
    //   date
    // }scheduledTests
    return dispatch => {
        const msg = {
            testid: testId.toString(),
            date: date
        }
        return axios.post('http://localhost:5000/scheduletest', msg)
            .then(
                dispatch(
                    {
                        type: SCHEDULE,
                        id: testId,
                        date: date
                    }

                )
            )
            .then(() => {
                Sleep(1000);
                return dispatch(fetchScheduledTests())
            })
    }

}

export const unscheduleTest = (testId, date) => {
    return dispatch => {
        const msg = {
            testid: testId.toString(),
            date: date
        }
        return axios.post('http://localhost:5000/unscheduletest', msg)
            .then(
                dispatch(
                    {
                        type: UNSCHEDULE,
                        id: testId,
                        date: date
                    }

                )
            )
            .then(() => {
                Sleep(1000);
                return dispatch(fetchScheduledTests())
            })
    }
}


export const resetSchedule = () => {
    return dispatch => {
        const msg = {
        }
        return axios.post('http://localhost:5000/resetschedule', msg)
            .then(
                dispatch(
                    {
                        type: UNSCHEDULE,
                    }

                )
            )
            .then(() => {
                Sleep(1000);
                return dispatch(fetchScheduledTests())
            })
    }
}

