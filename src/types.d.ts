export type Stack = number[][];
export type Color = 0 | 1 | 2 | 3 | 4 | 5;
export type Position = { row: number, col: number };
export type Pair = number[]; // use Color[]

export type PendingPairPuyo = {
  row: number,
  col: number,
  color: Color
}
export type PendingPair = PendingPairPuyo[];

export type PuyoConnection = {
  top: boolean,
  left: boolean,
  bottom: boolean,
  right: boolean
}

export type ShareUrls = {
  whole: string,
  current: string
}

export type PuyoForRendering = {
  row: number,
  col: number,
  color: Color,
  connections: PuyoConnection
  isDropping: boolean
}

export type StackForRendering = PuyoForRendering[][];
