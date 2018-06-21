import { fieldCols, fieldRows } from './constants';

type Position = { row: Number, col: Number };

export default class FieldUtils {
  /**
   * Create plain javascript pairQueue object
   * @param row row size
   * @param col col size
   * @returns {Array.<Array.<Number>>} pairQueue object
   */
  static createField(row: number, col: number): number[][] {
    return Array(row).fill(null).map(() => Array(col).fill(0));
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
