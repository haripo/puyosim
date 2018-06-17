type Pair = number[];
type Rotation = 'top' | 'right' | 'bottom' | 'left';
type Move = { col: number, rotation: Rotation };
type Stack = number[][];

type HistoryRecord = {
  move: Move,
  pair: Pair,
  numHands: number,
  stack: Stack,
  score: number,
  chain: number,
  chainScore: number,
  prev: number | null,
  next: number[],
  defaultNext: number | null
}

type History = {
  version: number;
  records: Array<HistoryRecord>;
  currentIndex: number;
}

function isEqualMove(a: Move, b: Move) {
  return a.col === b.col && a.rotation === b.rotation;
}

export function createInitialHistoryRecord(stack: Stack): HistoryRecord {
  return {
    move: null,
    pair: null,
    numHands: 0,
    stack: stack,
    score: 0,
    chain: 0,
    chainScore: 0,
    prev: null,
    next: [],
    defaultNext: null
  };
}

export function createHistoryRecord(
  move: Move, pair: Pair, numHands: number, stack: Stack,
  chain: number, score: number, chainScore: number): HistoryRecord {
  return {
    move,
    pair,
    numHands,
    stack,
    score,
    chain,
    chainScore,
    prev: null,
    next: [],
    defaultNext: null
  };
}

export function appendHistoryRecord(
  history: History, record: HistoryRecord): History {

  const nextIndex = history.records.length;
  const lastState = history.records[history.currentIndex];

  // 同じ Record があったら新たに増やさない
  if (history.records.length > 0) {
    for (let nextIndex of lastState.next) {
      if (isEqualMove(history.records[nextIndex].move, record.move)) {
        lastState.defaultNext = nextIndex;
        history.currentIndex = nextIndex;
        return history;
      }
    }
  }

  // update next of previous record
  lastState.defaultNext = nextIndex;
  lastState.next.push(nextIndex);

  // update prev of current record
  record.prev = history.currentIndex;

  // append record
  history.records.push(record);
  history.currentIndex = nextIndex;
  return history;
}