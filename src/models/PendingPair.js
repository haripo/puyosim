
import { Record } from 'immutable';

const initialState = {
  col: 2,
  direction: null,
  first: null,
  second: null
};

export default class PendingPair extends Record(initialState) {
  constructor(col, direction, first, second) {
    super({
      col,
      direction,
      first,
      second
    })
  }

  get firstCol() {
    return this.col;
  }

  get secondCol() {
    switch (this.direction) {
      case 'left':
        return this.col - 1;
      case 'right':
        return this.col + 1;
      default:
        return this.col;
    }
  }

  resetPosition() {
    return this.set('col', 2).set('direction', 'bottom')
  }

  rotateLeft() {
  }

  rotateRight() {

  }

  moveLeft() {

  }

  moveRight() {

  }
}