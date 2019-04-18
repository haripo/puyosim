import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { HistoryRecord } from "../src/shared/models/history";
import { createField } from "../src/shared/models/stack";
import { fieldCols, fieldRows } from "../src/shared/utils/constants";
import SlimHistoryTree from "../src/shared/components/HistoryTree/SlimHistoryTree";

const simpleTree: HistoryRecord[] = [
  {
    move: null,
    pair: null,
    numHands: 1,
    stack: createField(fieldRows, fieldCols),
    score: 0,
    chain: 0,
    chainScore: 0,
    prev: null,
    next: [1, 2],
    defaultNext: 1,
    numSplit: 0
  },
  {
    move: { col: 2, rotation: 'top' },
    pair: [1, 2],
    numHands: 2,
    stack: createField(fieldRows, fieldCols),
    score: 0,
    chain: 0,
    chainScore: 0,
    prev: 0,
    next: [3],
    defaultNext: 3,
    numSplit: 0
  },
  {
    move: { col: 3, rotation: 'top' },
    pair: [1, 2],
    numHands: 2,
    stack: createField(fieldRows, fieldCols),
    score: 0,
    chain: 0,
    chainScore: 0,
    prev: 0,
    next: [],
    defaultNext: null,
    numSplit: 0
  },
  {
    move: { col: 4, rotation: 'top' },
    pair: [1, 2],
    numHands: 3,
    stack: createField(fieldRows, fieldCols),
    score: 0,
    chain: 0,
    chainScore: 0,
    prev: 2,
    next: [],
    defaultNext: null,
    numSplit: 0
  }
];

storiesOf('SlimHistoryTree', module)
  .add('with simple history', () => {
    return (
      <SlimHistoryTree
        history={ simpleTree }
        currentIndex={ 1 }
        onNodePressed={ action('node_pressed') }
      />
    );
  })
  .add('with history which has branch', () => {
    return (
      <SlimHistoryTree
        history={ simpleTree }
        currentIndex={ 0 }
        onNodePressed={ action('node_pressed') }
      />
    );
  });
