export const REQUEST_SUBJECTS = 'REQUEST_SUBJECTS';
export const RECEIVE_SUBJECTS = 'RECEIVE_SUBJECTS';

// function receiveSubjects(json) {
//   return {
//     type: RECEIVE_SUBJECTS,
//     subjects: json,
//     receivedAt: Date.now()
//   }
// }
//
// function requestSubjects() {
//   return {
//     type: REQUEST_SUBJECTS,
//   }
// }
//
// export function fetchSubjects() {
//   return dispatch => {
//     dispatch(requestSubjects());
//     return fetch(`http://localhost:5000/subjects`)
//         .then(response => response.json())
//         .then(json => dispatch(receiveSubjects(json)))
//   }
// }

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



