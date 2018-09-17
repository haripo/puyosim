import { deserializeQueue, serializeQueue } from "../src/shared/models/serializer";

describe('serializer', () => {
  describe('queue', () => {
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

