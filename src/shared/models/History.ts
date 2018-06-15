import { List, Record } from "immutable";

export const HistoryRecord = Record({
  stack: List(),
  numHands: 0,
  chain: 0,
  score: 0,
  chainScore: 0,

  move: null,
  pair: List(),

  prev: null,
  next: List(),
  defaultNext: null
});

/**
 * Creates history record
 * @param state
 * @param pair
 * @param move
 * @param prev
 * @returns {Immutable.Map<string, any>}
 */
export function makeHistoryRecord(state, pair, move, prev) {
  return new HistoryRecord({
    move: move,
    pair: pair,
    // move, pair は操作、それ以外のプロパティは操作の結果を表している。
    // 操作後の move, pair は初期値にリセットされるので、これらは state から取得できない。
    numHands: state.get('numHands'),
    stack: state.get('stack'),
    chain: state.get('chain'),
    score: state.get('score'),
    chainScore: state.get('chainScore'),
    prev: prev,
    next: List(),
    defaultNext: null
  });
}

/**
 * Appends history record to history tree
 * @param state
 * @param hand
 */
export function appendHistoryRecord(state, hand, move) {
  const prevIndex = state.get('historyIndex');

  { // 同じパスの場合
    const nextIndexes = state.getIn(['history', prevIndex, 'next']);
    for (let nextIndex of nextIndexes) {
      if (state.getIn(['history', nextIndex, 'move']).equals(move)) {
        return state
          .setIn(['history', prevIndex, 'defaultNext'], nextIndex)
          .set('historyIndex', nextIndex);
      }
    }
  }

  const nextIndex = state.get('history').size;
  const record = makeHistoryRecord(state, hand, move, prevIndex);

  return state
    .setIn(['history', prevIndex, 'defaultNext'], nextIndex)
    .updateIn(['history', prevIndex, 'next'], indexes => {
      if (!indexes) {
        return indexes;
      }
      return indexes.push(nextIndex);
    })
    .update('history', h => h.push(record))
    .set('historyIndex', nextIndex);
}

