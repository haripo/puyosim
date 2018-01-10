import FieldUtils from '../utils/FieldUtils';
import { Map } from "immutable";
import { fieldCols, fieldRows } from '../utils/constants';


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
  const queue = state.getIn(['queue', 0]);

  let secondRow = 1;
  if (pair.rotation === 'bottom') {
    secondRow = 2;
  } else if (pair.rotation === 'top') {
    secondRow = 0;
  }

  return [
    { row: 1, col: pair.firstCol, color: queue.get(0) },
    { row: secondRow, col: pair.secondCol, color: queue.get(1) }
  ];
}

export function getVanishingPuyos(state) {
  const vanishings = state.get('vanishingPuyos');

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

export function getStack(state) {
  const stack = state.get('stack');
  const droppings = state.get('droppingPuyos');

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

export function getDropPositions(state) {
  const pair = state.get('pendingPair');
  const stack = state.get('stack');
  const queueHead = state.get('queue').get(0);

  const getDropRow = (col) => {
    let i = fieldRows - 1;
    while (stack.get(i) && stack.getIn([i, col]) !== 0) {
      i--;
    }
    return i;
  };

  const drop1 = { row: getDropRow(pair.firstCol), col: pair.firstCol, color: queueHead.get(0) };
  const drop2 = { row: getDropRow(pair.secondCol), col: pair.secondCol, color: queueHead.get(1) };
  if (drop1.col === drop2.col && drop1.row === drop2.row) {
    if (pair.rotation === 'bottom') {
      drop1.row -= 1;
    } else {
      drop2.row -= 1;
    }
  }

  return [drop1, drop2].filter(d => FieldUtils.isValidPosition(d));
}
