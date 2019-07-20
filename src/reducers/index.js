import { combineReducers } from 'redux'
import {
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

function schedule (
    state = {
        scheduledTests: [],
    },
    action
)
{
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

        default:
            return state

    }
}

export default combineReducers({
    subjects: ReducerCreator('Subjects'),
    classes : ReducerCreator('Classes'),
    blockers : ReducerCreator('Blockers'),
    tests : ReducerCreator('Tests'),
    schedule
})