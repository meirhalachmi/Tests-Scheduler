import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "./Subjects.css";
import styled from "styled-components";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {Sleep} from "../../utils/utils";

const ColumnContainer = styled.div`
  margin: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  // width: 50%;
  display: flex;
  flex-direction: column;
`;
const SupTitle = styled.div`
  padding: 10px;
`;

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.push(removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '#1d3d69',
    color: isDragging ? 'black' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

const getGroupedSubjectsRequest = new Request('http://localhost:5000/groupedSubjects');
const getSubjectsRequest = new Request('http://localhost:5000/subjects');


class Subjects extends Component {

    constructor(props: P, context: any) {
        super(props, context);
        this.state = {
            lists: [[]],
            titles: ['מקצועות ליבה']
        }
        fetch(getGroupedSubjectsRequest)
            .then(response => response.json())
            .then(data => {
                this.initialGroupedSubjects = data;
            }).then(() => {
            fetch(getSubjectsRequest)
                .then(response => response.json())
                .then(data => {
                    this.subjects = new Map(data.map(v => [v.id, v.name]));
                }).then(
                () => {
                    console.log(this.subjects.get(4))
                    this.initialNoGroup = this.initialGroupedSubjects['no_group'];
                    this.initialGroups = this.initialGroupedSubjects['groups'];
                    console.log(this.subjects)
                    console.log(this.groupToListItem(this.initialNoGroup))
                    console.log(Array(this.groupToListItem(this.initialNoGroup)))
                    console.log([getItems(5)])
                    // Sleep(1000);
                     this.setState( {
                            lists: Array(this.groupToListItem(this.initialNoGroup)),
                            // titles: ['מקצועות ליבה']
                            // lists: [getItems(5)]
                        }
                    )
                }
            )
        })
    };

    groupToListItem = group => {
        return group.map((item) => ({id: item.toString(), content: this.subjects.get(item)}))
    }


    addList = () => {
        const lists = this.state.lists.concat([[]]);
        const titles = this.state.titles.concat('אשכול מגמות');
        this.setState({
                lists: lists,
                titles: titles
            }
        );
        // this.render();
    };

    removeList = (id) => {
        const removedList = this.state.lists[id];
        const lists = Array.from(this.state.lists);
        const titles = Array.from(this.state.titles);

        lists.splice(id, 1);
        titles.splice(id, 1);

        lists[0] = lists[0].concat(removedList);

        this.setState({
                lists: lists,
                titles: titles
            }
        );
    }

    getList = id => this.state.lists[parseInt(id)];

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            // Do nothing
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            const lists = Array.from(this.state.lists)
            lists[source.droppableId] = result[source.droppableId]
            lists[destination.droppableId] = result[destination.droppableId]
            this.setState({
                lists: lists
            });
        }
    };

    // Normally you would want to split things out into separate components.
    getColumnContainer(index, title) {
        return <ColumnContainer key={index}>
            <SupTitle>{title} {index > 0 &&<span><FontAwesomeIcon icon={faTrashAlt} onClick={()=>{this.removeList(index)}}/></span>}</SupTitle>

            <Droppable droppableId={index.toString()}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}>
                        {this.state.lists[index].map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}>
                                        {item.content}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </ColumnContainer>;
    }

    render() {
        return (
            <div>
                <div id='root'>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        {this.state.titles.map(
                            (item, i, key) => this.getColumnContainer(i, this.state.titles[i])
                        )}

                    </DragDropContext>
                    <ColumnContainer><Button onClick={()=>{this.addList()}}>הוסף אשכול</Button></ColumnContainer>
                </div>
            </div>
        );
    }
}

export default Subjects;