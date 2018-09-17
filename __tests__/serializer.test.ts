import {
  deserializeHistoryRecords,
  deserializeQueue,
  serializeHistoryRecords,
  serializeQueue
} from "../src/shared/models/serializer";
import { createHistoryFromMinimumHistory } from "../src/shared/models/history";

describe('serializer', () => {
  describe('queue', () => {
    test('serialize history', () => {
      const history = createHistoryFromMinimumHistory({
          records: [
            { move: { rotation: 'top', col: 1 }, next: [1] },
            { move: { rotation: 'bottom', col: 1 }, next: [2] },
            { move: { rotation: 'left', col: 3 }, next: [3] },
            { move: { rotation: 'right', col: 3 }, next: [] }
          ],
          currentIndex: 0
        },
        [1, 2, 3, 4, 1, 2, 3, 4]);

      const result = serializeHistoryRecords(history.records);
      expect(result).toEqual('bhup9'); // 1, 7, 20, 15, terminal
    });

    test('deserialize history', () => {
      const expected = [
          { move: { rotation: 'top', col: 1 }, next: [1] },
          { move: { rotation: 'bottom', col: 1 }, next: [2] },
          { move: { rotation: 'left', col: 3 }, next: [3] },
          { move: { rotation: 'right', col: 3 }, next: [] }
      ];

      const result = deserializeHistoryRecords('bhup9');
      expect(result).toEqual(expected);
    });

    test('serialize history with jump', () => {
      const history = createHistoryFromMinimumHistory({
          records: [
            { move: { rotation: 'top', col: 1 }, next: [1] },
            { move: { rotation: 'bottom', col: 1 }, next: [2, 4] },
            { move: { rotation: 'left', col: 3 }, next: [3] },
            { move: { rotation: 'right', col: 3 }, next: [] },
            { move: { rotation: 'top', col: 3 }, next: [] },
            { move: { rotation: 'top', col: 4 }, next: [6] }, // derived from root
            { move: { rotation: 'top', col: 5 }, next: [] }
          ],
          currentIndex: 0
        },
        [1, 2]);

      const result = serializeHistoryRecords(history.records);
      expect(result).toEqual('bh8fup9d9ef9');
      // => 1, 7, jump1, 5, 20, 15, terminal, 3, terminal, 4, 5, terminal
      // jump 先の index は minimumHistory と history で 1 つずれることに注意
    });

    test('deserialize history with jump', () => {
      const history = [
        { move: { rotation: 'top', col: 1 }, next: [1] },
        { move: { rotation: 'bottom', col: 1 }, next: [2, 4] },
        { move: { rotation: 'left', col: 3 }, next: [3] },
        { move: { rotation: 'right', col: 3 }, next: [] },
        { move: { rotation: 'top', col: 3 }, next: [] },
        { move: { rotation: 'top', col: 4 }, next: [6] }, // derived from root
        { move: { rotation: 'top', col: 5 }, next: [] }
      ];

      const result = deserializeHistoryRecords('bh8fup9d9ef9');
      expect(result).toEqual(history);
    });

    test('serialize queue', () => {
      const queue = [1, 2, 3, 4, 1, 2, 3, 4, 5, 6];
      const result = serializeQueue(queue);
      expect(result).toEqual('jzjzP');
    });

    test('deserialize queue', () => {
      const queue = [1, 2, 3, 4, 1, 2, 3, 4, 5, 6];
      const result = deserializeQueue('jzjzP');
      expect(result).toEqual(queue);
    });
  });
});

