import { Divider } from '@mui/material';
import type { Identifier, XYCoord } from 'dnd-core';
import React, { useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
  cards: React.ReactElement<{ id: number }>[];
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

const Card: React.FunctionComponent<CardProps> = ({
  id,
  index,
  moveCard,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      {children}
    </div>
  );
};

export const SortableList: React.FunctionComponent<SortableListProps> = ({
  cards,
  moveCards,
}) => {
  const renderCard = useCallback(
    (card: React.ReactElement<{ id: number }>, index: number) => {
      return (
        <Card
          key={card.props.id}
          moveCard={moveCards}
          id={card.props.id}
          index={index}
        >
          <>
            {card}
            <Divider />
          </>
        </Card>
      );
    },
    []
  );
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {cards.map((card, index) => renderCard(card, index))}
      </DndProvider>
    </>
  );
};
