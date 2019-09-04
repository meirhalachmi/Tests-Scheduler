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


const fetchSubjects = FetchActionCreator('Subjects', process.env.REACT_APP_API_URL + '/subjects',
    sortByName)
const fetchClasses = FetchActionCreator('Classes', process.env.REACT_APP_API_URL + '/classes')
const fetchBlockers = FetchActionCreator('Blockers', process.env.REACT_APP_API_URL + '/blockers')
const fetchTests = FetchActionCreator('Tests', process.env.REACT_APP_API_URL + '/tests')
const fetchSessionInfo = FetchActionCreator('Session', process.env.REACT_APP_API_URL + '/sessioninfo')


export const fetchScheduledTests = FetchActionCreator('Schedule', process.env.REACT_APP_API_URL + '/currentscheduledtests')
export const fetchSavedSchedules = FetchActionCreator('ScheduleStore', process.env.REACT_APP_API_URL + '/schedulerstatestore')

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
        return axios.post(process.env.REACT_APP_API_URL + '/scheduletest', msg)
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
        return axios.post(process.env.REACT_APP_API_URL + '/unscheduletest', msg)
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
                return dispatch(fetchScheduledTests())
            })
    }
}


export const resetSchedule = () => {
    return dispatch => {
        const msg = {
        }
        return axios.post(process.env.REACT_APP_API_URL + '/resetschedule', msg)
            .then(
                dispatch(
                    {
                        type: UNSCHEDULE,
                    }

                )
            )
            .then(() => {
                // Sleep(1000);
                return dispatch(fetchScheduledTests())
            })
    }
}

