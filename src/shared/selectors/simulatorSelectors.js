import FieldUtils from '../utils/FieldUtils';
import { Map, List } from 'immutable';
import { fieldCols, fieldRows } from '../utils/constants';
import _ from 'lodash';

export function wrapCache(f, ...args) {
  let argsCache = {};
  let resultCache = null;

  return state => {
    const isNotUpdated = _.every(args, arg => state.get(arg) === argsCache[arg]);

    if (isNotUpdated && resultCache !== null) {
      // use cache
      return resultCache;
    }

    for (let arg of args) {
      argsCache[arg] = state.get(arg);
    }

    resultCache = f(..._.values(_.pick(argsCache, args)), state);
    return resultCache;
  }
}

export function isActive(state) {
  return !(
    state.get('simulator').get('droppingPuyos').count() > 0 ||
    state.get('simulator').get('vanishingPuyos').count() > 0
  );
}

export function getGhost(state) {
  return getDropPositions(state);
}

export function getPendingPair(state) {
  const pair = state.get('pendingPair');
  const hand = getCurrentHand(state);

  let secondRow = 1;
  if (pair.rotation === 'bottom') {
    secondRow = 2;
  } else if (pair.rotation === 'top') {
    secondRow = 0;
  }

  return [
    { row: 1, col: pair.firstCol, color: hand.get(0) },
    { row: secondRow, col: pair.secondCol, color: hand.get(1) }
  ];
}

export const getVanishingPuyos = wrapCache(_getVanishingPuyos, 'vanishingPuyos');
function _getVanishingPuyos(vanishings) {

  let field = FieldUtils.createField(fieldRows, fieldCols);
  vanishings.forEach(puyo => {
    field[puyo.get('row')][puyo.get('col')] = puyo.get('color');
  });

  const hasConnection = (row, col, color) => {
    return FieldUtils.isValidPosition({ row, col }) &&
      field[row][col] === color;
  };

  return vanishings.map(puyo => {
    const color = puyo.get('color');
    const row = puyo.get('row');
    const col = puyo.get('col');
    const connections = {
      top: hasConnection(row - 1, col, color),
      bottom: hasConnection(row + 1, col, color),
      left: hasConnection(row, col - 1, color),
      right: hasConnection(row, col + 1, color)
    };

    return puyo.set('connections', Map(connections));
  });
}


export const getStack = wrapCache(_getStack, 'stack', 'droppingPuyos');
function _getStack(stack, droppings) {
  const isDropping = (row, col) => {
    return !!droppings.find(p => p.get('row') === row && p.get('col') === col);
  };

  const hasConnection = (row, col, color) => {
    return FieldUtils.isValidPosition({ row, col }) &&
      0 < row &&
      stack.getIn([row, col]) === color &&
      color !== 0 &&
      !isDropping(row, col);
  };

  return stack.map((cols, row) => {
    return cols.map((color, col) => {
      let connections = {
        top: hasConnection(row - 1, col, color),
        bottom: hasConnection(row + 1, col, color),
        left: hasConnection(row, col - 1, color),
        right: hasConnection(row, col + 1, color)
      };
      if (row === 0) connections = {}; // puyos on row = 0 have no connection
      return Map({
        row: row,
        col: col,
        color: color,
        connections: Map(connections),
        isDropping: isDropping(row, col)
      });
    });
  });
}

export const getCurrentHand = wrapCache(
  (queue, numHands) => queue.get(numHands % queue.size),
  'queue', 'numHands');

export const getNextHand = wrapCache(
  (queue, numHands) => queue.get((numHands + 1) % queue.size),
  'queue', 'numHands');

export const getDoubleNextHand = wrapCache(
  (queue, numHands) => queue.get((numHands + 2) % queue.size),
  'queue', 'numHands');

export const getDropPositions = wrapCache(_getDropPositions, 'pendingPair', 'stack', 'queue', 'numHands');

function _getDropPositions(pair, stack, queue, numHands, state) {
  const hand = getCurrentHand(state);

  const getDropRow = (col) => {
    let i = fieldRows - 1;
    while (stack.get(i) && stack.getIn([i, col]) !== 0) {
      i--;
    }
    return i;
  };

  const drop1 = { row: getDropRow(pair.firstCol), col: pair.firstCol, color: hand.get(0) };
  const drop2 = { row: getDropRow(pair.secondCol), col: pair.secondCol, color: hand.get(1) };
  if (drop1.col === drop2.col && drop1.row === drop2.row) {
    if (pair.rotation === 'bottom') {
      drop1.row -= 1;
    } else {
      drop2.row -= 1;
    }
  }

  return [drop1, drop2].filter(d => FieldUtils.isValidPosition(d));
}

export const getHistoryTreeLayout = wrapCache(_getHistoryTreeLayout, 'history', 'historyIndex');
function _getHistoryTreeLayout(history, historyIndex) {
  let nodes = List();
  let paths = List();
  let rightmostRow = 0;

  const calcLayout = (historyIndex, depth, parentRow) => {
    const record = history.get(historyIndex);
    if (!record) {
      return;
    }

    return record.next.map((nextIndex, index) => {
      if (index > 0) {
        rightmostRow += 1;
      }
      //const isCurrentPath = currentPath[historyIndex] === nextIndex;
      const isCurrentPath = true;
      if (historyIndex > 0) {
        paths = paths.push(Map({
          from: Map({ row: parentRow, col: depth - 1 }),
          to: Map({ row: rightmostRow, col: depth }),
          isCurrentPath
        }));
      }
      nodes = nodes.push(Map({
        row: rightmostRow,
        col: depth,
        move: history.getIn([nextIndex, 'move']),
        isCurrentNode: false,
      }));
      calcLayout(nextIndex, depth + 1, rightmostRow);
    });
  };

  calcLayout(0, 0, 0);

  return Map({
    nodes,
    paths
  });
}