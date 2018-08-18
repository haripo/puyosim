import { createHistoryRecord, deserialize, serialize } from '../src/shared/models/history';
import { createInitialHistoryRecord } from "../src/shared/models/history";
import { fieldCols, fieldRows } from "../src/shared/utils/constants";
import { createField } from "../src/shared/models/stack";

describe('history', () => {
  test('serialize', () => {
    const stack = createField(fieldRows, fieldCols);
    const history = {
      version: 1,
      records: [createInitialHistoryRecord(stack)],
      currentIndex: 0
    };
    const result = deserialize(serialize(history));
    expect(result).toEqual(history);
  });
});

