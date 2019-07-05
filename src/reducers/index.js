import { combineReducers } from 'redux'
import {
    RECEIVE,
    REQUEST
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

export default combineReducers({
    subjects: ReducerCreator('Subjects'),
    classes : ReducerCreator('Classes'),
    blockers : ReducerCreator('Blockers')
})