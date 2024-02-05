import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { Divider, List, ListItem } from '@mui/material';
import React, { CSSProperties } from 'react';
import DragHandleIcon from '@mui/icons-material/DragHandle';

export interface SortableListProps {
  cards: { id: any; component: React.ReactElement }[];
  moveCards: (dragIndex: number, hoverIndex: number) => void;
}

interface CardProps {
  id: any;
  children: React.ReactElement[] | React.ReactElement;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const Card: React.FunctionComponent<CardProps> = ({ id, index, children }) => {
  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ): CSSProperties => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 2,
    margin: `0 0 2px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : undefined,

    // styles we need to apply on draggables
    ...draggableStyle,
  });
  return (
    <Draggable key={id} draggableId={id.toString()} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              ),
              display: 'flex',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '10px',
                paddingRight: '30px',
              }}
              {...provided.dragHandleProps}
            >
              <DragHandleIcon />
            </div>
            {children}
          </div>
        );
      }}
    </Draggable>
  );
};

export const SortableList: React.FunctionComponent<SortableListProps> = ({
  cards,
  moveCards,
}) => {
  const [previousPosition, setPreviousPosition] = React.useState<number | null>(
    null
  );
  const onDragEnd = () => {
    setPreviousPosition(null);
  };
  const onDragUpdate = (update: any) => {
    const newPosition = update.destination.index;
    moveCards(previousPosition ?? update.source.index, newPosition);
    setPreviousPosition(newPosition);
  };
  const renderCard = (card: React.ReactElement, id: number, index: number) => {
    return (
      <Card key={id} moveCard={moveCards} id={id} index={index}>
        <ListItem sx={{ width: '100%' }}>{card}</ListItem>
        <Divider variant="middle" component="li" />
      </Card>
    );
  };
  return (
    <div style={{ width: '100%' }}>
      <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => {
            return (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <List sx={{ width: '100%' }}>
                  {cards.map((card, index) =>
                    renderCard(card.component, card.id, index)
                  )}
                </List>
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
