import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "./Subjects.css";
import styled from "styled-components";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

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
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

class Subjects extends Component {
    state = {
        lists: Array(getItems(10), getItems(5, 10)),
        titles: ['מקצועות ליבה  ', 'אשכול מגמות']
    };

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
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
            <SupTitle>{title} {index > 0 &&<FontAwesomeIcon icon={faTrashAlt} onClick={()=>{this.removeList(index)}}/>}</SupTitle>

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