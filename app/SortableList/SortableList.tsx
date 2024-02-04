import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { Divider, List, ListItem } from '@mui/material';
import React, {
  CSSProperties,
  HTMLAttributes,
  ReactComponentElement,
  useCallback,
  useRef,
} from 'react';
const style = {
  cursor: 'move',
  //   padding: '0.5rem 1rem',
  //   marginBottom: '.5rem',
  //   backgroundColor: 'white',
};
const ItemTypes = {
  CARD: 'card',
};
export interface SortableListProps {
  cards: { id: any; component: React.ReactElement }[];
  moveCards: (dragIndex: number, hoverIndex: number) => void;
}

interface CardProps {
  id: any;
  children: React.ReactElement;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: number;
  type: string;
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
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
  });
  return (
    <Draggable key={id} draggableId={id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
};

export const SortableList: React.FunctionComponent<SortableListProps> = ({
  cards,
  moveCards,
}) => {
  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    moveCards(result.source.index, result.destination.index);
  };
  const renderCard = useCallback(
    (card: React.ReactElement, id: number, index: number) => {
      return (
        <Card key={id} moveCard={moveCards} id={id} index={index}>
          <>
            <ListItem sx={{ width: '100%' }}>{card}</ListItem>
            <Divider variant="middle" component="li" />
          </>
        </Card>
      );
    },
    []
  );
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{}}
            >
              <List sx={{ width: '100%' }}>
                {cards.map((card, index) =>
                  renderCard(card.component, card.id, index)
                )}
              </List>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
