import {
  deserializeHistoryRecords,
  deserializeQueue,
  serializeHistoryRecords,
  serializeQueue
} from "../src/shared/models/serializer";
import { createHistoryFromMinimumHistory, HistoryRecord, MinimumHistoryRecord } from "../src/shared/models/history";

describe('serializer', () => {
  describe('queue', () => {
    test('serialize history', () => {
      const history = createHistoryFromMinimumHistory([
          { type: 'move', move: { rotation: 'top', col: 1 }, next: [1] },
          { type: 'move', move: { rotation: 'bottom', col: 1 }, next: [2] },
          { type: 'move', move: { rotation: 'left', col: 3 }, next: [3] },
          { type: 'move', move: { rotation: 'right', col: 3 }, next: [] }
        ],
        [[1, 2], [3, 4], [1, 2], [3, 4]]);

      const result = serializeHistoryRecords(history);
      expect(result).toEqual('bhtp9'); // 1, 7, 19, 15, terminal
    });

    test('deserialize history', () => {
      const expected = [
          { type: 'move', move: { rotation: 'top', col: 1 }, next: [1] },
          { type: 'move', move: { rotation: 'bottom', col: 1 }, next: [2] },
          { type: 'move', move: { rotation: 'left', col: 3 }, next: [3] },
          { type: 'move', move: { rotation: 'right', col: 3 }, next: [] }
      ];

      const result = deserializeHistoryRecords('bhtp9');
      expect(result).toEqual(expected);
    });

    test('serialize history with jump', () => {
      const history = createHistoryFromMinimumHistory([
          { type: 'move', move: { rotation: 'top', col: 1 }, next: [1] },
          { type: 'move', move: { rotation: 'bottom', col: 1 }, next: [2, 4] },
          { type: 'move', move: { rotation: 'left', col: 3 }, next: [3] },
          { type: 'move', move: { rotation: 'right', col: 3 }, next: [] },
          { type: 'move', move: { rotation: 'top', col: 3 }, next: [] },
          { type: 'move', move: { rotation: 'top', col: 4 }, next: [6] }, // derived from root
          { type: 'move', move: { rotation: 'top', col: 5 }, next: [] }
        ],
        [[1, 2]]);

      const result = serializeHistoryRecords(history);
      expect(result).toEqual('bh8ftp9d9ef9');
      // => 1, 7, jump1, 5, 19, 15, terminal, 3, terminal, 4, 5, terminal
      // jump 先の index は minimumHistory と history で 1 つずれることに注意
    });

    test('deserialize history with jump', () => {
      const history = [
        { type: 'move', move: { rotation: 'top', col: 1 }, next: [1] },
        { type: 'move', move: { rotation: 'bottom', col: 1 }, next: [2, 4] },
        { type: 'move', move: { rotation: 'left', col: 3 }, next: [3] },
        { type: 'move', move: { rotation: 'right', col: 3 }, next: [] },
        { type: 'move', move: { rotation: 'top', col: 3 }, next: [] },
        { type: 'move', move: { rotation: 'top', col: 4 }, next: [6] }, // derived from root
        { type: 'move', move: { rotation: 'top', col: 5 }, next: [] }
      ];

      const result = deserializeHistoryRecords('bh8ftp9d9ef9');
      expect(result).toEqual(history);
    });

    test('serialize history with long jump', () => {
      const history = createHistoryFromMinimumHistory([
        { type: 'move', move: { rotation: 'top', col: 1 }, next: [61] },
        { type: 'move', move: { rotation: 'bottom', col: 1 }, next: [] },
      ], [[1, 1]]);

      const result = serializeHistoryRecords(history);
      expect(result).toEqual("b7bah9");
    });

    test('serialize history with long jump 2', () => {
      const history = createHistoryFromMinimumHistory([
        { type: 'move', move: { rotation: 'top', col: 1 }, next: [150] },
        { type: 'move', move: { rotation: 'bottom', col: 1 }, next: [] },
      ], [[1, 1]]);

      const result = serializeHistoryRecords(history);
      expect(result).toEqual("b7cBh9");
    });

    test('serialize history with long jump 3', () => {
      const history = createHistoryFromMinimumHistory([
        { type: 'move', move: { rotation: 'top', col: 1 }, next: [3844] },
        { type: 'move', move: { rotation: 'bottom', col: 1 }, next: [] },
      ], [[1, 1]]);

      const result = serializeHistoryRecords(history);
      expect(result).toEqual("b6babh9");
    });

    test('deserialize history with long jump', () => {
      const result = deserializeHistoryRecords("b7bah9");
      expect(result[0].next).toContain(61);
    });

    test('deserialize history with long jump', () => {
      const result = deserializeHistoryRecords("b7cBh9");
      expect(result[0].next).toContain(150);
    });

    test('deserialize history with long jump 2', () => {
      const result = deserializeHistoryRecords("b6babh9");
      expect(result[0].next).toContain(3844);
    });

    test('serialize queue', () => {
      const queue = [[1, 2], [3, 4], [1, 2], [3, 4], [5, 6]];
      const result = serializeQueue(queue);
      expect(result).toEqual('jzjzP');
    });

    test('deserialize queue', () => {
      const queue = [[1, 2], [3, 4], [1, 2], [3, 4], [5, 6]];
      const result = deserializeQueue('jzjzP');
      expect(result).toEqual(queue);
    });
  });
});

// abcde fghij
// klmno pqrst
// uvwxy zABCD
// EFGHI JKLMN
// OPQRS TUVWX
// YZ012 34567
// 89abc defgh
