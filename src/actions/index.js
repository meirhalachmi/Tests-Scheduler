export const REQUEST = 'REQUEST';
export const RECEIVE = 'RECEIVE';

function FetchActionCreator(name, url) {

  function receive(json) {
    return {
      type: RECEIVE + '_' + name.toUpperCase(),
      items: json,
      receivedAt: Date.now()
    }
  }

  function request() {
    return {
      type: REQUEST+ '_' + name.toUpperCase(),
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

export const fetchSubjects = FetchActionCreator('Subjects', 'http://localhost:5000/subjects')
export const fetchClasses = FetchActionCreator('Classes', 'http://localhost:5000/classes')
export const fetchBlockers = FetchActionCreator('Blockers', 'http://localhost:5000/blockers')




