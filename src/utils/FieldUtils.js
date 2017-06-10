import Immutable from 'immutable';
import { fieldCols, fieldRows } from './constants';

type Stack = Immutable.List<Immutable.List<Number>>;
type Position = { row: Number, col: Number };

export default class FieldUtils {

  /**
   * Create plain javascript pairQueue object
   * @param row row size
   * @param col col size
   * @returns {Array.<Array.<Number>>} pairQueue object
   */
  static createField(row: Number, col: Number) {
    return Array(row).fill(null).map(() => Array(col).fill(0));
  }

  /**
   * Returns puyo position considering gravity
   * @param position user input position
   * @param stack stack object
   * @returns {{row: number, col: Number}}
   */
  static getDropPosition(position: Position, stack: Stack): Position {
    let i = fieldRows - 1;
    while (stack.get(i) && stack.get(i).get(position.col) !== 0) {
      i--;
    }
    return {
      row: i,
      col: position.col
    };
  }

  static getHighlightPositions(position, rotation) {
    const result = [
      position,
      this.addPosition(position, rotation)
    ];
    if (this.isValidPosition(result[0]) && this.isValidPosition(result[1])) {
      return result;
    }
    return [];
  }

  /**
   * Add two position, especially position and rotation
   * @param p position or rotation object
   * @param q position or rotation object
   * @returns {{row: number, col: number}} position
   */
  static addPosition(p: Position, q: Position): Position {
    return {
      row: p.row + q.row,
      col: p.col + q.col
    };
  }

  /**
   * Check whether given position is valid
   * @param p position object
   * @returns {boolean} true if given position is valid
   */
  static isValidPosition(p: Position): boolean {
    return (0 <= p.row && p.row < fieldRows && 0 <= p.col && p.col < fieldCols);
  }

  static getConnections(stack) {
    let connectionIds = this.createField(fieldRows, fieldCols);
    let id = 0;

    const search = (r, c, puyo) => {
      if (0 <= r && r < fieldRows && 0 <= c && c < fieldCols &&
        puyo === stack.getIn([r, c]) && !connectionIds[r][c]) {
        connectionIds[r][c] = id;
        search(r - 1, c, puyo);
        search(r, c - 1, puyo);
        search(r + 1, c, puyo);
        search(r, c + 1, puyo);
      }
    };

    let result = [];

    for (let row = 0; row < fieldRows; row++) {
      for (let col = 0; col < fieldCols; col++) {
        if (!stack.getIn([row, col])) continue;
        if (connectionIds[row][col] === 0) {
          id++;
          search(row, col, stack.getIn([row, col]), id);

          result[id - 1] = {
            color: stack.getIn([row, col]),
            puyos: [{ row, col }]
          };
        } else {
          result[connectionIds[row][col] - 1].puyos.push({ row, col });
        }
      }
    }

    return result;
  }
}