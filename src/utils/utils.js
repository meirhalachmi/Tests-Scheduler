import {useFetch} from "react-hooks-fetch";
import React from "react";

export function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export function fillArray(value, len) {
    const arr = [];
    for (let i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}

export function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

const Err = ({ error }) => <span>Error:{error.message}</span>;

export const DisplayRemoteData = (props) => {
    let { error, data } = useFetch(props.url);
    if (error) return <Err error={error} />;
    if (!data) return null;
    if (props.preProcess){
        data = props.preProcess(data);
    }
    return data.map(props.parserFunction)
};
