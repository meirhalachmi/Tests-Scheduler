import React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

export const styles = {
  sidebar: {
    width: 300,
    // marginLeft: '15%',
    // paddingRight: '16px'
    // height: "100%"
  },
  sidebarLink: {
    display: "block",
    padding: "16px 0px",
    color: "#757575",
    textDecoration: "none"
  },
  divider: {
    margin: "8px 0",
    height: 1,
    backgroundColor: "#757575"
  },
  content: {
    padding: "16px",
    paddingTop: "30px",
    paddingBottom: "30px",
    // height: "70%",
    backgroundColor: "white",
    // marginLeft: '15%'
  }
};

export function Event({event}) {
  const color = event.type === 'blocker' ? 'red' : 'blue';
  return (
    <>
      <ContextMenuTrigger id={event.type + event.id.toString()}>
        <div style={{backgroundColor: color, fontSize: '15px'}}>
          <strong>{event.title}</strong>
          {event.desc && ':  ' + event.desc}
        </div>
      </ContextMenuTrigger>
    </>
  )
}

export function parseDateString(date) {
  let d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime()
}