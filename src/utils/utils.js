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
    var d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

export function daysBetween(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.floor(difference_ms/ONE_DAY);

}
