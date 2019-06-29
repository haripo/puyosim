import { createField, getSplitHeight, setPair } from './stack';
import { isEqualMove } from "./move";
import { createChainPlan } from "./chainPlanner";
import * as _ from 'lodash';
import { Move, Pair, Stack } from "../../types";

// TODO: refactoring constants
export const fieldRows = 13;
export const fieldCols = 6;


export type MoveHistoryRecord = {
  type: 'move',
  move: Move,
  pair: Pair,
  numHands: number,
  stack: Stack,
  score: number,
  chain: number,
  chainScore: number,
  numSplit: number,
  prev: number | null,
  next: number[],
  defaultNext: number | null
}

export type HeadHistoryRecord = {
  type: 'head'
  numHands: 0,
  stack: Stack,
  score: 0,
  chain: 0,
  chainScore: 0,
  numSplit: 0,
  prev: null,
  next: number[],
  defaultNext: number | null
}

export type EditHistoryRecord = {
  type: 'edit'
  numHands: number,
  stack: Stack,
  score: number,
  chain: number,
  chainScore: number,
  numSplit: number,
  prev: number | null,
  next: number[],
  defaultNext: number | null
}

export type HistoryRecord = MoveHistoryRecord | HeadHistoryRecord | EditHistoryRecord;

export type History = {
  version: number;
  records: Array<HistoryRecord>;
  currentIndex: number;
}

/**
 * 最小限のデータだけ保存する形式の履歴レコード。
 * URL にシリアライズする際に利用する。
 */
export type MinimumHistoryRecord = {
  type: 'move',
  move: Move,
  next: number[]
} | {
  type: 'edit'
  stack: string,
  next: number[]
}

export type MinimumHistory = {
  records: MinimumHistoryRecord[];
  currentIndex: number;
}

export function createInitialHistoryRecord(stack: Stack): HeadHistoryRecord {
  return {
    type: 'head',
    numHands: 0,
    stack,
    score: 0,
    chain: 0,
    chainScore: 0,
    numSplit: 0,
    prev: null,
    next: [],
    defaultNext: null
  };
}

export function createHistoryRecord(
  move: Move, pair: Pair, numHands: number, stack: Stack,
  chain: number, score: number, chainScore: number, numSplit: number): MoveHistoryRecord {
  return {
    type: 'move',
    move,
    pair,
    numHands,
    stack,
    score,
    chain,
    chainScore,
    numSplit,
    prev: null,
    next: [],
    defaultNext: null
  };
}

export function createEditHistoryRecord(
  numHands: number, stack: Stack,
  chain: number, score: number, chainScore: number, numSplit: number): EditHistoryRecord {
  return {
    type: 'edit',
    numHands,
    stack,
    score,
    chain,
    chainScore,
    numSplit,
    prev: null,
    next: [],
    defaultNext: null
  };
}

export function appendHistoryRecord(history: History, record: HistoryRecord): History {

  const nextIndex = history.records.length;
  const lastState = history.records[history.currentIndex];

  // 同じ Record があったら新たに増やさない
  if (history.records.length > 0) {
    for (let nextIndex of lastState.next) {
      const nextRecord = history.records[nextIndex];
      // TODO: isEqual は重いかも
      if (nextRecord.type !== 'head' && _.isEqual(nextRecord.stack, record.stack)) {
        lastState.defaultNext = nextIndex;
        history.currentIndex = nextIndex;
        return history;
      }
    }
  }

  // update next of previous record
  lastState.defaultNext = nextIndex;
  lastState.next.push(nextIndex);

  // update prev of current record
  record.prev = history.currentIndex;

  // append record
  history.records.push(record);
  history.currentIndex = nextIndex;
  return history;
}

/**
 * Extract records which are on the path to current index
 * @param history list of records
 * @param currentIndex current index
 */
export function getCurrentPathRecords(
  history: HistoryRecord[],
  currentIndex: number): HistoryRecord[] {
  let result: HistoryRecord[] = [];

  // extract records
  let index: number | null = currentIndex;
  while (index) {
    const p = history[index];
    result.unshift(_.cloneDeep(p));
    index = p.prev;
  }

  result.unshift(createInitialHistoryRecord(createField(fieldRows, fieldCols)));

  // reindex next and prev
  for (let i = 0; i < result.length; i++) {
    result[i].prev = i > 0 ? i - 1 : null;
    result[i].next = [i + 1];
    result[i].defaultNext = i + 1;
  }

  result[result.length - 1].next = [];
  result[result.length - 1].defaultNext = null;

  return result;
}

export function createHistoryFromMinimumHistory(
  minimumHistoryRecords: MinimumHistoryRecord[],
  queue: number[][],
  defaultIndex: number | undefined = undefined): HistoryRecord[] {

  let stack = createField(fieldRows, fieldCols);
  let resultRecords: HistoryRecord[] = [
    createInitialHistoryRecord(stack)
  ];
  let backtrack: { [_: number]: number } = {};
  let index = 1;

  for (const record of minimumHistoryRecords) {
    for (const nextPosition of record.next) {
      backtrack[nextPosition + 1] = index;
    }

    if (!(index in backtrack)) {
      resultRecords[0].next.push(index);
      if (resultRecords[0].next.length === 1) {
        resultRecords[0].defaultNext = index;
      }
    }

    const prev = index in backtrack ? backtrack[index] : 0;

    switch (record.type) {
      case 'move': {
        const numHands = resultRecords[prev].numHands + 1;
        const pair = queue[(numHands - 1) % queue.length];
        const splitHeight = getSplitHeight(resultRecords[prev].stack, record.move);

        let currentStack = _.cloneDeep(resultRecords[prev].stack);
        createChainPlan(currentStack, fieldRows, fieldCols); // emulate chain
        currentStack = setPair(currentStack, record.move, pair);

        const originalStack = _.cloneDeep(currentStack);
        const chainResult = createChainPlan(currentStack, fieldRows, fieldCols);

        resultRecords.push({
          type: 'move',
          move: record.move,
          pair: pair,
          numHands: numHands,
          stack: originalStack, // 連鎖前の状態を保存する
          score: chainResult.score + resultRecords[prev].score,
          chain: chainResult.chain,
          chainScore: chainResult.score,
          next: record.next.map(n => n + 1),
          numSplit: resultRecords[prev].numSplit + (splitHeight ? 1 : 0),
          defaultNext: record.next.length > 0 ? record.next[0] + 1 : null,
          prev: prev
        });

        break;
      }
      case 'edit': {
        const numHands = resultRecords[prev].numHands;
        const pair = queue[(numHands - 1) % queue.length];
        const currentStack = _.chunk(record.stack.split('').map(v => parseInt(v)), fieldCols);
        const originalStack = _.cloneDeep(currentStack);
        const chainResult = createChainPlan(currentStack, fieldRows, fieldCols);

        resultRecords.push({
          type: 'edit',
          pair: pair,
          numHands: numHands,
          stack: originalStack,
          score: chainResult.score + resultRecords[prev].score,
          chain: chainResult.chain,
          chainScore: chainResult.score,
          next: record.next.map(n => n + 1),
          numSplit: resultRecords[prev].numSplit,
          defaultNext: record.next.length > 0 ? record.next[0] + 1 : null,
          prev: prev
        });
        break;
      }
    }

    index += 1;
  }

  if (defaultIndex !== undefined) {
    resultRecords = reindexDefaultNexts(resultRecords, defaultIndex);
  }

  return resultRecords;
}

/**
 * Update defaultNext path in the history
 *
 * 引数 historyIndex までの履歴経路をデフォルトにするように、HistoryRecord の defaultNext を更新します
 * @param history history object
 * @param historyIndex index
 * @return {HistoryRecord[]} updated history
 */
export function reindexDefaultNexts(history: HistoryRecord[], historyIndex: number | null) {
  let index: number | null = historyIndex;
  while (index !== null) {
    let next = index;
    index = history[index].prev;
    if (index === null) break;
    history[index].defaultNext = next;
  }
  return history;
}