import _ from 'lodash';
import { limitInitialColors } from '../src/shared/models/queue';

describe('limitInitialColors', () => {
  test('do nothing', () => {
    let queue = _.fill(Array(32), 1);
    queue[1] = 1;
    queue[2] = 2;
    queue[3] = 3;
    limitInitialColors(queue, 3, 3);

    expect(queue.slice(0, 4)).toEqual([1, 1, 2, 3])
  });

  test('fix queue', () => {
    let queue = _.fill(Array(32), 1);
    queue[0] = 4;
    queue[1] = 1;
    queue[2] = 2;
    queue[3] = 3;
    limitInitialColors(queue, 3, 3);

    expect(queue.slice(0, 4)).toEqual([4, 1, 2, 1])
  });

  test('fix queue', () => {
    let queue = _.fill(Array(32), 1);
    queue[2] = 1;
    queue[3] = 2;
    queue[4] = 3;
    queue[5] = 4;
    limitInitialColors(queue, 3, 3);

    expect(queue.slice(0, 6)).toEqual([1, 1, 1, 2, 3, 1])
  });

  test('fix queue with fallback', () => {
    let queue = _.fill(Array(32), 4);
    queue[0] = 1;
    queue[1] = 1;
    queue[2] = 1;
    queue[3] = 2;
    queue[4] = 3;
    queue[5] = 4;
    limitInitialColors(queue, 3, 3);

    expect(queue.slice(0, 6)).toEqual([1, 1, 1, 2, 3, 1])
  });
});

