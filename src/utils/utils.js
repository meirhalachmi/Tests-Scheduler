import {useFetch} from "react-hooks-fetch";
import React from "react";

export function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export function fillArray(value, length) {
    return Array.from({ length }, () => value);
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

export function sortByName(list) {
    return list.sort((a, b) => (a.name > b.name) ? 1 : -1);
}

export function isEmpty(obj) {
    for(const key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function formatDate(date) {
    console.log(date)
    var d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    console.log([year, month, day].join('-'))
    return [year, month, day].join('-');
}