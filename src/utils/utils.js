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


function formatDateImpl(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return {month, day, year};
}

export function formatDateForForms(date) {
  let {month, day, year} = formatDateImpl(date);
  return [year, month, day].join("-");
}

export function formatDateForText(date, showYear=true) {
  let {month, day, year} = formatDateImpl(date);
  year = year % 2000; // This line won't work after year 3000
  if (showYear)
    return [day, month, year].join(".");
  else
    return [day, month].join(".");
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

/*!
 * Group items from an array together by some criteria or value.
 * (c) 2019 Tom Bremmer (https://tbremer.com/) and Chris Ferdinandi (https://gomakethings.com), MIT License,
 * @param  {Array}           arr      The array to group items from
 * @param  {String|Function} criteria The criteria to group by
 * @return {Object}                   The grouped object
 */
export function groupBy(arr, criteria) {
  return arr.reduce(function (obj, item) {

    // Check if the criteria is a function to run on the item or a property of it
    const key = typeof criteria === 'function' ? criteria(item) : item[criteria];

    // If the key doesn't exist yet, create it
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }

    // Push the value to the object
    obj[key].push(item);

    // Return the object to the next item in the loop
    return obj;

  }, {});
}

export function longestCommonStartingSubstring(arr1){
  let arr = arr1.concat().sort(),
    a1 = arr[0], a2 = arr[arr.length - 1], L = a1.length, i = 0;
  while(i< L && a1.charAt(i)=== a2.charAt(i)) i++;
  return a1.substring(0, i);
}