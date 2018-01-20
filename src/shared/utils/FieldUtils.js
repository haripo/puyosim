import Immutable from 'immutable';
import _ from 'lodash';
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

  static rearrangeInitialColor(queue, maxNumColor, numPairs) {
    let appeared = new Set();
    let removalPosition = []; // 交換すべきぷよ
    let exchangePosition = []; // 交換できるぷよ
    for (let i = 0; i < 16 * 2; i++) {
      if (appeared.size === maxNumColor) {
        if (i <= numPairs * 2 && !appeared.has(queue[i])) {
          removalPosition.push(i);
        }
        if (i > numPairs * 2 && appeared.has(queue[i])) {
          exchangePosition.push(i);
        }
      } else {
        appeared.add(queue[i]);
      }
    }

    const oldQueue = _.clone(queue);

    for (let i = 0; i < removalPosition.length; i++) {
      let target = Math.floor(Math.random() * (exchangePosition.length - 1));
      exchangePosition.splice(to, 1);

      let from = queue[removalPosition[i]];
      let to = queue[exchangePosition[target]];

      if (!to || to <= 0) {
        to = 1;
      }

      queue[removalPosition[i]] = to;
      queue[exchangePosition[target]] = from;
    }

    return queue;
  }

  /**
   * Create queue
   */
  static generateQueue(configs) {
    let queue = [];
    if (configs.colorBalance === '128') {
      for (let i = 0; i < 128 * 2; i++) {
        queue.push(Math.floor(Math.random() * 4) + 1);
      }
    } else {
      for (let i = 0; i < 8; i++) {
        let subQueue = [];
        for (let j = 0; j < 16 * 2; j++) {
          subQueue.push(j % 4 + 1);
        }
        queue = queue.concat(_.shuffle(subQueue));
      }
    }

    if (configs.initialColors === 'avoid4ColorsIn3Hands') {
      this.rearrangeInitialColor(queue, 3, 3);
    }

    if (configs.initialColors === 'avoid4ColorsIn2Hands') {
      this.rearrangeInitialColor(queue, 3, 2);
    }

    if (configs.initialAllClear === 'avoidIn2Hands') {
      if (queue[0] === queue[1] &&
        queue[0] === queue[2] &&
        queue[0] === queue[3]) {
        return this.generateQueue(configs);
        // TODO: avoid4ColorsIn3Hands の処理を抽象化すればこれもできそう
      }
    }

    return _.chunk(queue, 2);
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
      // note: puyos on row = 0 do not be connected nor vanished.
      if (1 <= r && r < fieldRows && 0 <= c && c < fieldCols &&
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
