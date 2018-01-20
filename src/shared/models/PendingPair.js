import { Record } from 'immutable';
import { fieldCols } from '../utils/constants';

const defaultCol = 2;
const defaultRotation = 'top';

const recordType = {
  col: defaultCol,
  rotation: defaultRotation,
  first: null,
  second: null
};

const rotations = [
  'top',
  'right',
  'bottom',
  'left'
];

export default class PendingPair extends Record(recordType) {
  constructor(first, second) {
    super({ first, second });
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
    return this.set('col', defaultCol).set('rotation', defaultRotation);
  }

  rotate(direction) {
    const rotation = this.get('rotation');
    const index = rotations.findIndex(x => x === rotation);
    const newRotation = rotations[(index + rotations.length + direction) % rotations.length];

    return this
      .set('rotation', newRotation)
      .update('col', col => {
        if (col === 0 && newRotation === 'left') return 1;
        if (col === fieldCols - 1 && newRotation === 'right') return fieldCols - 2;
        return col;
      });
  }

  rotateLeft() {
    return this.rotate(-1);
  }

  rotateRight() {
    return this.rotate(1);
  }

  moveLeft() {
    const col = this.get('col');
    if (col === 0 || (col === 1 && this.get('rotation') === 'left')) {
      return this;
    }
    return this.update('col', value => value - 1);
  }

  moveRight() {
    const col = this.get('col');
    if (col === 5 || (col === 4 && this.get('rotation') === 'right')) {
      return this;
    }
    return this.update('col', value => value + 1);
  }
}