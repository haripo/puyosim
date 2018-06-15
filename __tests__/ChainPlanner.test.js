import _ from 'lodash';
import {
  createChainPlan,
  getDropPlan,
  getVanishPlan
} from '../src/shared/utils/ChainPlanner';

describe('getDropPlan', () => {
  test('generate drop plans', () => {
    const stack = [
      [0, 1, 0],
      [1, 2, 0],
      [3, 0, 4]
    ];

    const actual = getDropPlan(stack, 3, 3);
    const expected = [
      { row: 1, col: 1, color: 1, distance: 1 },
      { row: 2, col: 1, color: 2, distance: 1 }
    ];
    expect(actual.sort((a, b) => a.row - b.row)).toEqual(expected);
  });
});

describe('getVanishPlan', () => {
  test('generate vanish plans', () => {
    const stack = [
      [0, 1, 0, 1, 1],
      [1, 2, 0, 1, 1],
      [3, 3, 0, 1, 2],
      [3, 0, 3, 1, 2],
      [3, 3, 3, 0, 2],
    ];

    const actual = getVanishPlan(stack, 5, 5);
    expect(actual.length).toEqual(2);
    expect(_.find(actual, connection => connection.color === 3).puyos.length).toEqual(7);
    expect(_.find(actual, connection => connection.color === 1).puyos.length).toEqual(4);
  });
});

describe('createChainPlan', () => {
  test('generate chain plan', () => {
    // 19 chain
    const stack = [
      [1, 2, 0, 0, 2, 2],
      [1, 1, 1, 3, 2, 1],
      [3, 1, 2, 2, 3, 2],
      [1, 2, 3, 3, 2, 1],
      [2, 3, 2, 1, 3, 1],
      [3, 2, 1, 3, 2, 1],
      [2, 3, 2, 1, 3, 2],
      [2, 3, 2, 1, 3, 2],
      [2, 1, 1, 3, 2, 3],
      [1, 2, 3, 1, 3, 3],
      [3, 1, 2, 3, 1, 2],
      [3, 1, 2, 3, 1, 2],
      [3, 1, 2, 3, 1, 2],
    ];

    const actual = createChainPlan(stack, 13, 6);
    expect(actual.chain).toEqual(19);
    expect(actual.score).toEqual(175080);
  });
});