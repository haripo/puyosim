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
    while (stack.get(i).get(position.col) !== 0) {
      i--;
    }
    return {
      row: i,
      col: position.col
    };
  }

  static getDropPositions(position: Position, direction: Position, stack: Stack) {
    const p1 = position;
    const p2 = this.addPosition(position, direction);

    if (this.isValidPosition(p1) && this.isValidPosition(p2)) {
      const drop1 = this.getDropPosition(p1, stack);
      const drop2 = this.getDropPosition(p2, stack);
      if (drop1.col === drop2.col && drop1.row === drop2.row) {
        if (direction.row < 0) {
          drop2.row -= 1;
        } else {
          drop1.row -= 1;
        }
      }
      return [drop1, drop2];
    }

    return null;
  }

  /**
   * Add two position, especially position and direction
   * @param p position or direction object
   * @param q position or direction object
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
}