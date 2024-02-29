import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { Card, CardContent, Divider, List, ListItem } from '@mui/material';
import React, { CSSProperties } from 'react';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { theme } from '../../theme';

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

const CardElement: React.FunctionComponent<CardProps> = ({
  id,
  index,
  children,
}) => {
  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ): CSSProperties => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 2,
    margin: `0 0 2px 0`,

    // change background colour if dragging
    background: isDragging ? theme.palette.primary.main : undefined,

    // styles we need to apply on draggables
    ...draggableStyle,
  });
  return (
    <Draggable key={id} draggableId={id.toString()} index={index}>
      {(provided, snapshot) => {
        return (
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              ),
            }}
          >
            <Card sx={{ width: '100%' }}>
              <CardContent sx={{ paddingBottom: '16px!important' }}>
                <div style={{ display: 'flex' }}>
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
              </CardContent>
            </Card>
          </ListItem>
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
      <CardElement key={id} moveCard={moveCards} id={id} index={index}>
        {card}
      </CardElement>
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
