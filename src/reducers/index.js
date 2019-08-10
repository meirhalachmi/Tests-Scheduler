import { combineReducers } from 'redux'
import {
    INIT_SESSION,
    RECEIVE,
    REQUEST,
    SCHEDULE,
    UNSCHEDULE
} from "../actions";

function ReducerCreator(name){
    return function (
        state = {
            isFetching: false,
            items: []
        },
        action
    ) {
        switch (action.type) {
            case REQUEST + '_' + name.toUpperCase():
                return Object.assign({}, state, {
                    isFetching: true,
                })
            case RECEIVE + '_' + name.toUpperCase():
                return Object.assign({}, state, {
                    isFetching: false,
                    items: action.items,
                    lastUpdated: action.receivedAt
                })
            default:
                return state
        }
    }

}

function schedulerState (
    state = {
        isFetching: false,
        scheduledTests: [],
        unscheduledTestsOptions: {},
        horizon: true
    },
    action
)
{
    // console.log(action);
    switch (action.type) {
        case SCHEDULE:
            return Object.assign({}, state, {
                scheduledTests: [
                    ...state.scheduledTests,
                    {id: action.id, date: action.date}
                ],
            })
        case UNSCHEDULE:
            return Object.assign({}, state, {
                scheduledTests: [
                    ...state.scheduledTests.filter(st => {
                        return (st.id !== action.id ||
                            st.date.toString() !== action.date.toString());
                    })
                ],
            })
        case REQUEST + '_SCHEDULE':
            return Object.assign({}, state, {
                isFetching: true,
            })
        case RECEIVE + '_SCHEDULE':
            return Object.assign({}, state, {
                isFetching: false,
                scheduledTests: action.items.scheduledTests.map(item => {
                    const date = new Date(item.date);
                    date.setHours(0,0,0,0)
                    return ({id: item.id, date: date});
                }),
                unscheduledTestsOptions: action.items.unscheduledTestsOptions,
                // lastUpdated: action.receivedAt
            })

        default:
            return state

    }
}

// function session(state = {id: null}, action) {
//     if (action.type === INIT_SESSION) {
//         console.log(action)
//         return Object.assign({}, state, {
//             id: action.sessionId,
//         })
//     } else {
//         return state;
//     }
// }

export default combineReducers({
    session: ReducerCreator('Session'),
    subjects: ReducerCreator('Subjects'),
    classes : ReducerCreator('Classes'),
    blockers : ReducerCreator('Blockers'),
    tests : ReducerCreator('Tests'),
    savedSchedules : ReducerCreator('ScheduleStore'),
    // scheduledTests : ReducerCreator('Scheduled_Tests'),
    schedule: schedulerState
})