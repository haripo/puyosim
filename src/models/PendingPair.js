
import { Record } from 'immutable';

const initialState = {
  col: 2,
  rotation: 'bottom',
  first: null,
  second: null
};

const rotations = [
  'top',
  'right',
  'bottom',
  'left'
];

export default class PendingPair extends Record(initialState) {
  constructor(col, rotation, first, second) {
    super({
      col,
      rotation,
      first,
      second
    })
  }

  get firstCol() {
    return this.col;
  }

  get secondCol() {
    switch (this.rotation) {
      case 'left':
        return this.col - 1;
      case 'right':
        return this.col + 1;
      default:
        return this.col;
    }
  }

  resetPosition() {
    return this.set('col', 2).set('rotation', 'bottom')
  }

  rotateLeft() {
    return this.update('rotation', value => {
      return rotations[(rotations.findIndex(x => x === value) - 1) % rotations.length]
    })
  }

  rotateRight() {
    return this.update('rotation', value => {
      return rotations[(rotations.findIndex(x => x === value) + 1) % rotations.length]
    })
  }

  moveLeft() {
    return this.update('col', value => (0 < value ? value - 1 : value))
  }

  moveRight() {
    return this.update('col', value => (value < 5 ? value + 1 : value))
  }
}