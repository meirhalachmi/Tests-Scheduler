import axios from "axios";
import {Sleep, sortByName} from "../utils/utils";

export const REQUEST = 'REQUEST';
export const RECEIVE = 'RECEIVE';
export const SCHEDULE = 'SCHEDULE';
export const UNSCHEDULE = 'UNSCHEDULE';
export const RESET_SCHEDULE = 'RESET_SCHEDULE';
export const INIT_SESSION = 'INIT_SESSION';

function FetchActionCreator(name, url) {

    function request() {
        return {
            type: REQUEST+ '_' + name.toUpperCase(),
        }
    }

    function receive(json, postprocessorFunction) {
        return {
            type: RECEIVE + '_' + name.toUpperCase(),
            items: postprocessorFunction(json),
            receivedAt: Date.now()
        }
    }

    return function (paramsUrlAddition='', postprocessorFunction=(json)=>(json)) {
        return dispatch => {
            dispatch(request());
            return fetch(url + paramsUrlAddition)
                .then(response => response.json())
                .then(json => dispatch(receive(json, postprocessorFunction)))
        }
    }

}


const fetchSubjects = FetchActionCreator('Subjects', 'https://tests-scheduler-app.herokuapp.com/subjects',
    sortByName)
const fetchClasses = FetchActionCreator('Classes', 'https://tests-scheduler-app.herokuapp.com/classes')
const fetchBlockers = FetchActionCreator('Blockers', 'https://tests-scheduler-app.herokuapp.com/blockers')
const fetchTests = FetchActionCreator('Tests', 'https://tests-scheduler-app.herokuapp.com/tests')
const fetchSessionInfo = FetchActionCreator('Session', 'https://tests-scheduler-app.herokuapp.com/sessioninfo')


export const fetchScheduledTests = FetchActionCreator('Schedule', 'https://tests-scheduler-app.herokuapp.com/currentscheduledtests')
export const fetchSavedSchedules = FetchActionCreator('ScheduleStore', 'https://tests-scheduler-app.herokuapp.com/schedulerstatestore')

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
        dispatch(fetchSavedSchedules());

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
        return axios.post('https://tests-scheduler-app.herokuapp.com/scheduletest', msg)
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
        return axios.post('https://tests-scheduler-app.herokuapp.com/unscheduletest', msg)
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
        return axios.post('https://tests-scheduler-app.herokuapp.com/resetschedule', msg)
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

