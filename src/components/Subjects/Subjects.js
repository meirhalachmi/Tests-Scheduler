import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "./Subjects.css";
import styled from "styled-components";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios/index';
import {fillArray   } from "../../utils/utils";

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
    background: isDragging ? 'lightgreen' : 'grey',
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
        this.handleSubmit = this.handleSubmit.bind(this);
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
                    this.initialNoGroup = this.initialGroupedSubjects['no_group'];
                    this.initialGroups = this.initialGroupedSubjects['groups'];
                    // console.log(this.initialGroupedSubjects)
                    this.setState( {
                            lists: Array(this.groupToListItem(this.initialNoGroup)).concat(
                                this.initialGroups.map(group => this.groupToListItem(group))
                            ),
                            titles: ['מקצועות ליבה'].concat(fillArray('אשכול מגמות', this.initialGroups.length))
                        }
                    )
                }
            )
        })
    };

    groupToListItem = group => {
        return group.map((item) => ({id: item, content: this.subjects.get(item)}))
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
            const lists = [...this.state.lists]
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

    handleSubmit(e) {
        e.preventDefault();
        let newGroups = this.state.lists.map(gr => gr.map(v => v.id));
        let no_pars = newGroups.shift()
        let par_groups = newGroups.length === 0 ? [[]] : newGroups;
        let msg = {
            no_parallels: [no_pars],
            parallel_groups: [par_groups]
        };

        axios.post('http://localhost:5000/groupedSubjects', msg)
            .then(response => response.json())
            .catch(function (error) {
                console.log(error);
            });
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
                <Button onClick={this.handleSubmit}>
                    Send
                </Button>
            </div>
        );
    }
}

export default Subjects;