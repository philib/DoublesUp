import update from 'immutability-helper';
import { Meta } from '@storybook/react';
import { SortableList } from '../app/SortableList/SortableList';
import { useCallback, useState } from 'react';
import React from 'react';

const meta = {
  title: 'Sortable List',
  component: SortableList,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SortableList>;

export default meta;

export const Default = () => {
  const initialCards = [
    {
      id: 1,
      text: 'Write a cool JS library',
    },
    {
      id: 2,
      text: 'Make it generic enough',
    },
    {
      id: 3,
      text: 'Write README',
    },
    {
      id: 4,
      text: 'Create some examples',
    },
    {
      id: 5,
      text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
    },
    {
      id: 6,
      text: '???',
    },
    {
      id: 7,
      text: 'PROFIT',
    },
  ];
  const [cards, setCards] = useState(initialCards);

  const moveCardWithUseCallback = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      moveCard(dragIndex, hoverIndex);
    },
    []
  );
  const moveCard = (dragIndex: number, hoverIndex: number) => {
    setCards((prevCards) => {
      const newCards = update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      });
      return newCards;
    });
  };
  const SomeCard: React.FunctionComponent<{ id: number; text: string }> = ({
    id,
    text,
  }) => {
    return <div style={{ margin: '1rem' }}>{text}</div>;
  };

  return (
    <SortableList
      cards={cards.map((card) => {
        return <SomeCard id={card.id} text={card.text} />;
      })}
      moveCards={moveCardWithUseCallback}
    />
  );
};
